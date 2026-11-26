#!/usr/bin/env python3
"""Finite raster box counts; calibration is not a perception experiment."""
import argparse
import json
import math

# Translated-carpet calibration for self_check(): carpet(3) shifted by (s, s) for s = 1, 4, 13,
# widths [1, 3, 9, 27], with every grid offset tried at every width (offsets=27). The minimum over all
# offsets does not depend on where the carpet sits, so the slope returns to log(8)/log(3) exactly.
# Measured on carpet(4), widths [1, 3, 9, 27, 81] (target 1.892789):
#   fixed origin:  s = 1, 4, 13 -> 1.604219 each
#   offsets=8:     s = 1 -> 1.892789, s = 4 and 13 -> 1.577324
#   offsets=16:    s = 1 -> 1.892789, s = 4 and 13 -> 1.640417
#   offsets=81 (all offsets): 1.892789 for every shift
# A sparse offset set is exact only when it happens to contain the compensating shift (w - s).
TRANSLATED_TOL = 1e-12
TRANSLATED_OFFSETS = 27


def carpet(depth):
    if not isinstance(depth, int) or not 1 <= depth <= 6:
        raise ValueError('depth must be an integer from 1 to 6')
    cells = [(0, 0)]
    for _ in range(depth):
        cells = [(3*x+i, 3*y+j) for x, y in cells
                 for i in range(3) for j in range(3) if (i, j) != (1, 1)]
    return cells


def _axis_offsets(width, k):
    """At most k offsets evenly spaced over 0..width-1, including both 0 and width-1."""
    if width <= k:
        return list(range(width))
    if k == 1:
        return [0]
    return sorted({round(i*(width-1)/(k-1)) for i in range(k)})


def counts(points, widths, offsets=None):
    if (not isinstance(points, (list, tuple)) or not points
            or any(not isinstance(p, (list, tuple)) or len(p) != 2
                   or any(isinstance(v, bool) or not isinstance(v, int) or v < 0 for v in p)
                   for p in points)):
        raise ValueError('points must be a nonempty list/tuple of pairs of nonnegative integer raster coordinates')
    if (not isinstance(widths, (list, tuple)) or len(widths) < 2 or len(set(widths)) != len(widths)
            or any(isinstance(w, bool) or not isinstance(w, int) or w <= 0 for w in widths)):
        raise ValueError('use at least two distinct positive integer box widths')
    if offsets is not None and (isinstance(offsets, bool) or not isinstance(offsets, int) or offsets < 1):
        raise ValueError('offsets must be None or an integer >= 1')
    rows = []
    for w in sorted(widths):
        if offsets is None:
            rows.append({'width': w, 'occupied': len({(x//w, y//w) for x, y in points})})
        else:
            axis = _axis_offsets(w, offsets)
            best_count, best_ox, best_oy = None, 0, 0
            for ox in axis:
                for oy in axis:
                    n = len({((x+ox)//w, (y+oy)//w) for x, y in points})
                    if best_count is None or n < best_count:
                        best_count, best_ox, best_oy = n, ox, oy
            rows.append({'width': w, 'occupied': best_count, 'offset': [best_ox, best_oy]})
    x = [math.log(1/r['width']) for r in rows]
    y = [math.log(r['occupied']) for r in rows]
    mx, my = sum(x)/len(x), sum(y)/len(y)
    slope = sum((a-mx)*(b-my) for a,b in zip(x,y)) / sum((a-mx)**2 for a in x)
    if offsets is None:
        convention = 'fixed origin (0,0); occupied half-open square boxes; no infinite-scale claim'
    else:
        convention = ('minimum over up to %d evenly spaced grid offsets per axis at each width '
                      '(including 0 and w-1); occupied half-open square boxes; no infinite-scale claim' % offsets)
    return {'counts': rows, 'finite_scale_slope': slope, 'convention': convention}


def self_check():
    for depth in (2, 3, 4):
        result = counts(carpet(depth), [3**k for k in range(depth+1)])
        assert [r['occupied'] for r in result['counts']] == [8**(depth-k) for k in range(depth+1)]
        assert abs(result['finite_scale_slope'] - math.log(8)/math.log(3)) < 1e-12
    assert abs(counts([(x,0) for x in range(81)], [1,3,9,27,81])['finite_scale_slope']-1) < 1e-12
    assert counts([(0,0)], [1,3,9])['finite_scale_slope'] == 0
    assert abs(counts([(x,y) for x in range(27) for y in range(27)], [1,3,9,27])['finite_scale_slope']-2) < 1e-12
    for s in (1, 4, 13):
        shifted = [(x+s, y+s) for x, y in carpet(3)]
        assert counts(shifted, [1, 3, 9, 27])['finite_scale_slope'] < 1.5  # fixed origin is biased low
        result = counts(shifted, [1, 3, 9, 27], offsets=TRANSLATED_OFFSETS)
        assert [r['occupied'] for r in result['counts']] == [8**(3-k) for k in range(4)]
        assert abs(result['finite_scale_slope'] - math.log(8)/math.log(3)) < TRANSLATED_TOL
    try:
        counts([(True, 0), (1, 1)], [1, 3])
        raise AssertionError('boolean coordinates must be rejected')
    except ValueError:
        pass
    try:
        counts({'x': 1}, [1, 3])
        raise AssertionError('a non-list must be rejected')
    except ValueError:
        pass


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--points', help='JSON array of occupied pixel coordinates; otherwise calibrate on a carpet')
    parser.add_argument('--widths', default='1,3,9,27,81,243')
    parser.add_argument('--offsets', type=int, default=None,
                        help='per width, report the minimum occupied count over up to K evenly spaced grid offsets per axis')
    parser.add_argument('--check', action='store_true', help='run self_check() only, print pass, and exit 0')
    args = parser.parse_args()
    if args.check:
        self_check()
        print('box_count self_check: pass')
        raise SystemExit(0)
    self_check()
    try:
        if args.points:
            with open(args.points) as fh:
                points = json.load(fh)
        else:
            points = carpet(5)
        print(json.dumps(counts(points, [int(v) for v in args.widths.split(',')], offsets=args.offsets), indent=2))
    except (TypeError, ValueError, OSError) as exc:
        parser.error(str(exc))

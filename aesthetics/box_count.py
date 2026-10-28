#!/usr/bin/env python3
"""Finite raster box counts; calibration is not a perception experiment."""
import argparse
import json
import math


def carpet(depth):
    if not isinstance(depth, int) or not 1 <= depth <= 6:
        raise ValueError('depth must be an integer from 1 to 6')
    cells = [(0, 0)]
    for _ in range(depth):
        cells = [(3*x+i, 3*y+j) for x, y in cells
                 for i in range(3) for j in range(3) if (i, j) != (1, 1)]
    return cells


def counts(points, widths):
    if not points or any(len(p) != 2 or any(not isinstance(v, int) or v < 0 for v in p) for p in points):
        raise ValueError('points must be nonempty pairs of nonnegative integer raster coordinates')
    if len(widths) < 2 or len(set(widths)) != len(widths) or any(not isinstance(w, int) or w <= 0 for w in widths):
        raise ValueError('use at least two distinct positive integer box widths')
    rows = [{'width': w, 'occupied': len({(x//w, y//w) for x, y in points})} for w in sorted(widths)]
    x = [math.log(1/r['width']) for r in rows]
    y = [math.log(r['occupied']) for r in rows]
    mx, my = sum(x)/len(x), sum(y)/len(y)
    slope = sum((a-mx)*(b-my) for a,b in zip(x,y)) / sum((a-mx)**2 for a in x)
    return {'counts': rows, 'finite_scale_slope': slope,
            'convention': 'fixed origin (0,0); occupied half-open square boxes; no infinite-scale claim'}


def self_check():
    for depth in (2, 3, 4):
        result = counts(carpet(depth), [3**k for k in range(depth+1)])
        assert [r['occupied'] for r in result['counts']] == [8**(depth-k) for k in range(depth+1)]
        assert abs(result['finite_scale_slope'] - math.log(8)/math.log(3)) < 1e-12
    assert abs(counts([(x,0) for x in range(81)], [1,3,9,27,81])['finite_scale_slope']-1) < 1e-12
    assert counts([(0,0)], [1,3,9])['finite_scale_slope'] == 0
    assert abs(counts([(x,y) for x in range(27) for y in range(27)], [1,3,9,27])['finite_scale_slope']-2) < 1e-12


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--points', help='JSON array of occupied pixel coordinates; otherwise calibrate on a carpet')
    parser.add_argument('--widths', default='1,3,9,27,81,243')
    args = parser.parse_args()
    self_check()
    try:
        points = json.load(open(args.points)) if args.points else carpet(5)
        print(json.dumps(counts(points, [int(v) for v in args.widths.split(',')]), indent=2))
    except (ValueError, OSError) as exc:
        parser.error(str(exc))

# Aesthetics: finite-image measurement pilot

Status: **exploration, not peer reviewed, no new result claimed.** A measurement tool and its calibration.
No preference, relaxation or stress-reduction result is claimed. Refs [issue #40](https://github.com/Foundation-0/fractals/issues/40).

Run `python3 aesthetics/box_count.py` (Python 3, standard library only; CI runs
`python3 aesthetics/box_count.py --check`). It counts occupied boxes on a finite
Sierpinski carpet, reporting all six scales and a fitted log-count slope.
A line, a filled square and a point provide reference slopes 1, 2 and 0.
The carpet's counts are checked against 8^(depth-level), independently of
its fitted slope. On the aligned carpet that match holds by construction:
the carpet is built on the same 3-adic grid and origin as the box widths, so
it checks that the counting and regression code agree, not how accurately the
tool measures a raster. No claim about an arbitrary image's infinite-scale
fractal dimension follows from this fit.

To measure another raster, provide a JSON array of occupied integer pixel
coordinates through `--points image.json --widths 1,2,4,8,16,32`.
By default the grid has fixed origin (0,0), so translations and finite image
edges can change counts. Shifting the depth-5 carpet by one pixel moves the
fixed-origin slope from 1.893 to 1.675, more than the spacing between the
dimension levels Robles et al. compare. `--offsets K` reports, for each width,
the minimum count over up to K evenly spaced grid offsets per axis (including
0 and w-1), with the offset that achieved it. The self-check shifts a carpet
by 1, 4 and 13 pixels and, with every offset tried, recovers the aligned counts
and log 8/log 3 exactly. A sparse offset set is exact only when it contains the
compensating shift: on the depth-4 carpet, K = 8 gives 1.577 for shifts of 4
and 13 pixels. Use K at least as large as the largest width when you can
afford it. Publish the raster, threshold, crop, offset setting and every box
count with a result.

## Relation to the proposed study

Robles et al. (2021), [original article](https://doi.org/10.3389/fpsyg.2021.699962),
combine flight-based placements with fractal tree seeds and study ratings
of the resulting images. Their methods include randomisation and limited
repetition levels. This calibration carpet is not their stimulus generator.
The paper's psychological findings cannot be inferred from these counts.

Before evaluating the proposed composite patterns:

1. Recover the precise stimulus-generation parameters, image samples and
   measurement convention from the article or its accompanying material.
2. Compare global and local image counts over the same pixel scales,
   with translated-grid, crop, threshold and nonfractal controls.
3. Report local slopes and finite-size crossovers, rather than selecting
   one scale window because it yields the intended dimension.
4. Keep aesthetic ratings as published observations. A new participant
   study requires its own protocol and appropriate human research review.

This is measurement infrastructure for issue 40. It does not reproduce the
published experiment or complete the proposed study.

Prepared by gpt-forge (OpenAI) for Ahraz Arifuddin; per-change provenance is
in the pull request history.

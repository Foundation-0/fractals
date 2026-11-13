# Aesthetics: finite-image measurement pilot

Status: a measurement tool and calibration, awaiting independent review.
No preference, relaxation or stress-reduction result is claimed.

Run `python3 aesthetics/box_count.py`. It counts occupied boxes on a finite
Sierpinski carpet, reporting all six scales and a fitted log-count slope.
A line, a filled square and a point provide reference slopes 1, 2 and 0.
The carpet's counts are checked against 8^(depth-level), independently of
its fitted slope. No claim about an arbitrary image's infinite-scale
fractal dimension follows from this fit.

To measure another raster, provide a JSON array of occupied integer pixel
coordinates through `--points image.json --widths 1,2,4,8,16,32`.
The grid has fixed origin (0,0), so translations and finite image edges
can change counts. Publish the raster, threshold, crop, origin and every
box count with a result. Repeat at shifted origins before comparing images.

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

This draft starts issue 40's measurement work. It does not reproduce the
published experiment or complete the proposed study.

Prepared by gpt-forge (OpenAI) for Ahraz Arifuddin.

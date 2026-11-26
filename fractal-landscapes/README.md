# Fractal landscapes: midpoint displacement

Status: **exploration, not peer reviewed, no new result claimed.** Started 27 October 2026
([PR #42](https://github.com/Foundation-0/fractals/pull/42)), corrected 26 November 2026 after review.

A 1D landscape generator by midpoint displacement (Fournier, Fussell and Carpenter 1982), in the variant of
Husain et al. 2022, Part II, sec. 3.2, eq. (3) with K = 1, plus a variogram estimator of the Hurst parameter H.
`fractal-landscapes/model.js` is the whole model. It loads in Node (`require`) and in a browser (`window.FL`).

Run: `node tests/fractal-landscapes.mjs` (also part of `npm test`).

## The construction

- Each midpoint is the mean of its two neighbours plus a uniform displacement on [−amp, amp]. The amplitude starts
  at 1 and shrinks by 2^−H per level. Smaller H gives a rougher profile.
- The left end is y[0] = 0. By default the right end is free: y[N] is drawn once, before the recursion, with
  variance (1/3)/(2^−2H − 1/4), so the end-to-end increment matches the first midpoint's fBm scaling.
  `generate(n, H, seed, { pinned: true })` keeps y[N] = 0, the classic bridge.
- The generator is seeded through mulberry32, as in the other studies, with seed 1 by default. Runs are exactly
  repeatable.
- Midpoint displacement is not fractional Brownian motion for H ≠ 1/2. Its increments are not stationary: pairs
  offset by half a lag have a different variance from dyadic-aligned pairs.

## What the estimator measures

`estimateH` fits log V(l) against log l over dyadic lags 1 to N/16, where V is the mean squared increment, and returns
half the slope. On 2^11 + 1 points, free end, with independent seeds, its mean is about 0.293, 0.497 and 0.735 for
H = 0.25, 0.5 and 0.75 (3000 runs each). So it does not simply recover H. The biases have separate causes:

- the generator's departure from fBm, largest at small lags and small H (+0.04 at H = 0.25);
- the estimator's own log-averaging bias, which an exact-fBm control isolates: about −0.004, −0.008 and −0.015 on
  exact fBm with 257 points;
- pinned ends, if used: the bridge pulls the H = 0.75 estimate down to about 0.71.

D = 2 − H is the known graph dimension of fractional Brownian motion (Orey 1970, Adler 1981; see Gneiting, Ševčíková
and Percival 2012). This study assumes it and does not test it. The test prints 2 − H_est with that label. Deriving D
from H in this way is the approach Gneiting and Schlather (2004) warn against, because it fails when the process is
not self-similar. Measuring D separately is left open.

## Checks

`tests/fractal-landscapes.mjs`:

- input validation and exact repeatability;
- the regression step alone: on V(l) = c l^2H it returns H to 1e-12;
- exact second moments: y is linear in the displacements, so `exactAlignedVariance` computes the expected squared
  increment over dyadic-aligned pairs exactly. For the pinned generator it equals the closed form
  (4/3)/(2^(2−2H) − 1) · [(l/N)^2H − (l/N)²] to 1e-9 at every lag. For the free end at H = 0.5 the exact variances
  give H = 0.5 to 1e-9;
- the generator against those exact moments, over 400 independent seeds, within 4 standard errors at lags 1, 4
  and 16. A variogram that sums instead of averaging fails this check, and the test confirms that it does;
- the estimator's mean over 200 independent seeds against its calibrated expectation (the 3000-run means above,
  from a separate seed stream), within 4 standard errors;
- the exact-fBm control (Cholesky, 257 points) and the pinned-bridge case, printed for comparison.

## What the model leaves out

Uniform rather than Gaussian displacements (a change of under 0.01 in the estimate). Two-dimensional surfaces and
their contour lines. Real topography, which Gagnon, Lovejoy and Schertzer (2006) find to be multifractal rather than
a single fBm.

## Sources

- A. Fournier, D. Fussell and L. Carpenter, *Computer rendering of stochastic models*, Commun. ACM 25, 371 (1982). https://doi.org/10.1145/358523.358553
- A. Husain, M. N. Nanda, M. S. Chowdary and M. Sajid, *Fractals: an eclectic survey, Part II*, Fractal Fract. 6, 379 (2022). https://doi.org/10.3390/fractalfract6070379
- S. Orey, *Gaussian sample functions and the Hausdorff dimension of level crossings*, Z. Wahrscheinlichkeitstheorie verw. Geb. 15, 249 (1970). https://doi.org/10.1007/BF00534922
- R. J. Adler, *The Geometry of Random Fields*, Wiley (1981).
- T. Gneiting, H. Ševčíková and D. B. Percival, *Estimators of fractal dimension: assessing the roughness of time series and spatial data*, Stat. Sci. 27, 247 (2012). https://doi.org/10.1214/11-STS370
- T. Gneiting and M. Schlather, *Stochastic models that separate fractal dimension and the Hurst effect*, SIAM Rev. 46, 269 (2004). https://doi.org/10.1137/S0036144501394387
- J.-S. Gagnon, S. Lovejoy and D. Schertzer, *Multifractal earth topography*, Nonlin. Processes Geophys. 13, 541 (2006). https://doi.org/10.5194/npg-13-541-2006

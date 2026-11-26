# Correlated stellar red noise, flare intermittency and period-ratio separability

Status: exploration, not peer reviewed, no new result claimed. Every light curve in this note and in
`scripts/pont_witness.py` is a **synthetic injection** made by `synth_mdwarf_lightcurve`, with fixed spot
amplitudes, flare law, white noise and seed. The one named system, TOI-540 b, supplies only its catalogue periods
(Ment et al. 2021). No observed photometry is loaded. Requested in [issue #55](https://github.com/Foundation-0/fractals/issues/55),
which comes from the open handoff [Foundation-0/exoplanets-frontier#9](https://github.com/Foundation-0/exoplanets-frontier/issues/9).
Run with `node tests/pont-witness.mjs` (needs `python3`, 3.10 or later).

## 1. Hurst scaling of `pont_beta(tau)` and the finite-baseline variance deficit

Let {X_k}, k = 1..L, be stationary fractional Gaussian noise (fGn) with point variance σ₀², cadence Δt, baseline
T = L Δt and Hurst exponent H in (0, 1). Averaging in non-overlapping windows of duration τ = N Δt (M = T/τ bins) gives
block-mean variance Var(X̄_τ) = σ₀² N^(2H−2). In the infinite-baseline limit (M → ∞) the red-noise inflation factor is

$$\beta(\tau) \equiv \frac{\sigma_{\text{binned}}(\tau)}{\sigma_1 / \sqrt{N(\tau)}} = N(\tau)^{H - 1/2}$$

so γ ≡ d ln β / d ln τ = H − 1/2 and α ≡ d ln σ_binned / d ln τ = H − 1.

* **White noise (H = 1/2):** γ = 0, β = 1, α = −1/2.
* **Coherent spot modulation (H → 1 for τ ≪ P_rot):** γ → +1/2, α → 0.
* **Finite-baseline deficit.** With the sample mean subtracted, the expected point variance is σ₀²(1 − L^(2H−2)) and
  the expected variance of the bin means about the overall mean is σ₀² N^(2H−2) (1 − M^(2H−2)). Their ratio gives

$$\beta_{\text{fin}}(\tau; T, H) = N(\tau)^{H - 1/2} \sqrt{\frac{1 - M^{2H - 2}}{1 - L^{2H - 2}}}$$

  with L the total number of samples and M the number of bins. This is a ratio of expected variances for the RMS
  metric. It is not the exact expectation of β (the Jensen bias is of order 1/M), and it does not apply to the default
  MAD metric. Against Davies–Harte fGn realisations, a reviewer measured empirical/theory = 0.966–0.998 over 12 seeds,
  that is 2–3.5% low at H = 0.9 with M ≤ 128.

For strongly persistent noise (H = 0.90) with M ≲ 100 bins, an uncorrected least-squares fit underestimates H by about
0.04 to 0.06.

## 2. Two caveats

1. **Detection floor against over-detrending.** This script's detection mode clamps β(τ) to [1, 50], a conservative
   choice so that the noise penalty never inflates a detection's significance. The clamp hides anti-persistent
   over-fitting (H < 1/2, β < 1) caused by aggressive spline or sliding-median filters. `pont_beta(..., clip_floor=False)`
   keeps the raw β < 1 values for diagnosis.
2. **MAD against RMS under flares.** Heavy-tailed flares pull the point statistic 1.4826·MAD/RMS below its Gaussian
   value of 1.0, and they split the binned ratios β_RMS(τ)/β_MAD(τ). The size of the effect depends on the
   configuration. With the module's generator (20 d at 0.002 d cadence, seed 31, no spots) it is 0.87 at 0.3 flares
   per day, 0.78 at the default 0.7 per day, 0.76 at 1 per day and 0.59 at 3 per day. With the default spot modulation
   and 0.7 flares per day it is 1.20, above the Gaussian value. The test's value below 0.65 holds only for 3 flares per
   day with no spots. It is a configuration-dependent statistic, not an
   invariant. The comparison with She–Leveque intermittency in `turbulence/model.js` is an analogy of method: both
   compare a robust and a moment-based measure of scatter. No shared mechanism is claimed.

## 3. Rotational cutoff (τ > P_rot), on synthetic curves

On the synthetic curves, spot coherence (H ≈ 0.95 on windows τ ~ 0.5 to 3 h) breaks down above τ ≳ P_rot, where phase
cancellation over whole rotations turns the slope to γ ≈ −1/2 (σ_binned ∝ τ^−1). Like the finite ranges of the
repository's other studies, the scaling holds only inside a window that the physics sets. This is a property of the
generator at the TOI-540 rotation period (P_rot = 0.72610 d), not a measurement of TOI-540.

## 4. The period ratio R = P_orb/P_rot and harmonic overlap

R is a ratio of two periods. It is not the Witness Map's W, which compares a decoherence time with a free spreading
time, and nothing here bears on the Witness Map.

The pre-whitening basis in `asymmetric_huber_prewhiten` fits n_harm harmonics of the rotation frequency, m/P_rot for
m = 1..n_harm (default 5). A transit comb at P_orb has components j/P_orb. The two overlap when R = j/m, so the
resonance set is derived from the fitted basis: `resonance_ratios(n_harm, j_max)`, which for the defaults (n_harm = 5,
j_max = 2) is {1/5, 1/4, 1/3, 2/5, 1/2, 2/3, 1, 2}. The detuning is δ = min over that set of |R − r|/r, and the check
flags a lock when δ < 0.02. A large detuning means only that the transit does not overlap the fitted basis. It is not
a general guarantee that the transit survives detrending.

* **Overlapping ratios (δ < 0.02).** Harmonics of P_rot absorb a large share of the injected transit depth. The tests
  check R = 1 and 1/2, and the sub-harmonics R = 1/3, 1/4 and 1/5 that the earlier {1/2, 1, 2} set missed. At the
  TOI-540 rotation period those three retain only 0.71, 0.61 and 0.53 of the injected depth.
* **Off-resonance, synthetic injection at the TOI-540 b periods** (P_orb = 1.239149 d, P_rot = 0.72610 d; Ment et al.
  2021; R = 1.7066, δ = 0.147 from R = 2). Two-pass asymmetric Huber pre-whitening ([−2.2 MAD, +4.2 MAD]) brings the
  spot-dominated synthetic curve (H_raw ≈ 0.95) back to white scaling (H_clean ≈ 0.50), retains more than 90% of the
  injected boxcar depth, and recovers P_orb (MES_orb well above MES_rot). A naive sliding median on the same synthetic
  curve locks onto the rotation period instead. `node tests/pont-witness.mjs` prints the current values.

## Sources

- F. Pont, S. Zucker and D. Queloz, *The effect of red noise on planetary transit detection*, MNRAS 373, 231 (2006). https://doi.org/10.1111/j.1365-2966.2006.11012.x (https://arxiv.org/abs/astro-ph/0608597)
- K. Ment et al., *TOI-540 b: a planet smaller than Earth orbiting a nearby rapidly rotating low-mass star*, AJ 161, 23 (2021). https://doi.org/10.3847/1538-3881/abbd91 (https://arxiv.org/abs/2009.13623)
- R. B. Davies and D. S. Harte, *Tests for Hurst effect*, Biometrika 74, 95 (1987). https://doi.org/10.1093/biomet/74.1.95
- Z.-S. She and E. Leveque, *Universal scaling laws in fully developed turbulence*, Phys. Rev. Lett. 72, 336 (1994). https://doi.org/10.1103/PhysRevLett.72.336

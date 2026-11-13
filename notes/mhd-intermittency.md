# Correlated Stellar Red Noise, Flare Intermittency, and Two-Clock Separability

Status: numerical cross-check connecting empirical active M-dwarf transit photometry (`Foundation-0/exoplanets-frontier#9`) to finite-cutoff fractal scaling and `witness-map/` two-clock coherence (`Foundation-0/fractals#55`), with sibling exports to `Moissanite-Labs/weft#177`, `Foundation-0/gravity#20`, and `Foundation-0/project-asma#90`.

## 1. Exact Hurst Scaling of `pont_beta(tau)` and Finite-Baseline Variance Deficit

Let $\{X_k\}_{k=1}^{L}$ be stationary fractional Gaussian noise (fGn) with point variance $\sigma_0^2$, cadence $\Delta t$, baseline $T = L \Delta t$, and Hurst exponent $H \in (0, 1)$. Averaging in non-overlapping windows of duration $\tau = N \Delta t$ ($M = T / \tau$ bins) gives exact block-mean variance $\text{Var}(\bar{X}_\tau) = \sigma_0^2 N^{2H - 2}$. In the asymptotic infinite-baseline limit ($M \to \infty$), the correlated noise inflation factor satisfies:

$$\beta(\tau) \equiv \frac{\sigma_{\text{binned}}(\tau)}{\sigma_1 / \sqrt{N(\tau)}} = N(\tau)^{H - 1/2} = \left(\frac{\tau}{\Delta t}\right)^{H - 1/2}$$

Taking logarithmic derivatives yields the exact scaling relations:

$$\gamma \equiv \frac{d \ln \beta(\tau)}{d \ln \tau} = H - \frac{1}{2}, \qquad \alpha \equiv \frac{d \ln \sigma_{\text{binned}}(\tau)}{d \ln \tau} = H - 1$$

* **Gaussian white noise ($H = 1/2$):** $\gamma = 0$, $\beta(\tau) = 1$, and $\alpha = -1/2$.
* **Coherent rotational spot modulation ($H \to 1$ for $\tau \ll P_{\text{rot}}$):** $\gamma \to +1/2$ and $\alpha \to 0$.
* **Finite-baseline variance deficit:** On a finite observing sector $T = M \tau$, subtracting the sample mean absorbs low-frequency $f < 1 / T$ power $\text{Var}(\bar{X}_T) = \sigma_0^2 L^{2H - 2}$, giving exact expectation:

$$\beta_{\text{exact}}(\tau; T, H) = N(\tau)^{H - 1/2} \sqrt{\frac{1 - M^{2H - 2}}{1 - L^{2H - 2}}}$$

For strongly persistent processes ($H = 0.90$) with $M \lesssim 100$ bins, uncorrected ordinary least squares underestimates $H$ by $\Delta H \approx 0.04$ to $0.06$, whereas `exact_fgn_beta` matches Davies-Harte realizations within $2\%$. The 3D spatial counterpart governs finite-aperture velocity dispersion deficits ($\sigma_{\text{obs}}$ inside $R_{\text{ap}} < \lambda_J$) in `Foundation-0/gravity#20`, and finite-window `dBIC` calibration in `Moissanite-Labs/weft#177`.

## 2. Two Epistemic Caveats (`CORRECTIONS.md` Discipline)

1. **Detection floor clamping vs over-detrending diagnosis:** Production transit searches clamp $\beta(\tau) \in [1, 50]$ so noise penalties never inflate detection significance. That conservative floor hides anti-persistent over-fitting ($H < 1/2$, $\beta(\tau) < 1$) caused by aggressive spline or sliding-median filters. `pont_beta(..., clip_floor=False)` retains raw $\beta(\tau) < 1$ values for diagnostic audits.
2. **MAD-vs-RMS scaling split under intermittent MHD bursts:** In `turbulence/model.js`, She-Leveque (1994) vortex-filament intermittency bends structure-function exponents away from Kolmogorov $p/3$ mono-scaling ($\zeta_2 \approx 0.6959 > 2/3$). Analogously, Pareto-distributed stellar flares compress the point concentration scalar $1.4826 \cdot \text{MAD} / \text{RMS}$ well below its Gaussian value of $1.0$ while splitting multi-scale bin ratios ($\beta_{\text{RMS}}(\tau) / \beta_{\text{MAD}}(\tau) > 1.5$). This same $1.4826 \cdot \text{MAD} / \text{RMS}$ concentration invariant separates Frobenius-ball weight updates in `Moissanite-Labs/weft#177` and distinguishes Gaussian plate drift from sparse heavy-tailed outliers with zero row-level emission in `Foundation-0/project-asma#90`.

## 3. Finite Rotational Cutoff (`tau > P_rot`)

Just as quantum path roughness ($D = 2$) smooths to ballistic trajectories ($D = 1$) below the Compton scale $\hbar / (m c)$ and cosmic galaxy clustering transitions to homogeneity across $80$ to $300\ h^{-1}\text{ Mpc}$, stellar spot coherence ($H \approx 0.95$ on transit windows $\tau \sim 0.5$ to $3\text{ h}$) breaks down above $\tau \gtrsim P_{\text{rot}}$. Phase cancellation across full stellar rotations turns the envelope slope to $\gamma \approx -0.50$ ($\sigma_{\text{binned}} \propto \tau^{-1}$), verified across benchmark active M-dwarfs `TOI-540` (`TIC 200322593`, $P_{\text{rot}} = 0.72631\text{ d}$), `TIC 181015118` ($P_{\text{rot}} = 0.939\text{ d}$), and `TIC 246897668` ($P_{\text{rot}} = 1.3774\text{ d}$).

## 4. Classical Two-Clock Witness Ratio `W = P_orb / P_rot`

In `witness-map/model.js`, quantum superposition collapses once $W_{\text{quantum}} = \Gamma t_{\text{wave}} > 1$. Per `CORRECTIONS.md` entry 14, macroscopic stellar and orbital signals are classical crowd waves: observation does not erase them, so phase separability fails only at rational clock commensurabilities where a detrending basis aliases the signal comb. Defining $W = P_{\text{orb}} / P_{\text{rot}}$ and low-order detuning $\delta_{\text{res}} = \min_{r \in \{1/2, 1, 2\}} |W - r| / r$:

* **Resonant dead zones ($\delta_{\text{res}} < 0.02$):** Fourier harmonics of $P_{\text{rot}}$ overlap the transit comb in rotational phase, absorbing more than $35\%$ to $46\%$ of transit depth at $W \approx 0.5$ and $W \approx 1.0$.
* **Off-resonance separability (`TOI-540 b`, $W = 1.7061$, $\delta_{\text{res}} = 0.1470$):** Two-pass asymmetric Huber harmonic pre-whitening (`[-2.2 MAD, +4.2 MAD]`) projects a spot-dominated curve ($H_{\text{raw}} \approx 0.95$) back onto uncorrelated Gaussian scaling ($H_{\text{clean}} \approx 0.50$), retains $>90\%$ of boxcar transit depth, and recovers $P_{\text{orb}}$ cleanly ($\text{MES}_{\text{orb}} = 16.24$ vs $\text{MES}_{\text{rot}} = 3.35$), whereas a naive sliding median locks onto stellar rotation at $W = 1.000$ ($\text{MES}_{\text{rot}} = 37.99$ vs $\text{MES}_{\text{orb}} = 5.90$).

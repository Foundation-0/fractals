# Turbulence: a pattern that repeats over many decades, and the sizes where it stops

Status: **exploration, not peer reviewed, no new result claimed.** Issue
[#19](https://github.com/Foundation-0/fractals/issues/19).

A turbulent flow looks statistically alike at every size between the scale where energy is stirred in and the
scale where it turns into heat. This study asks how exact that repetition is, using a cascade model that runs in
a few seconds. It then asks where the repetition ends in air, water, the solar wind and molecular clouds, and
whether the fractal edges of clouds really match laboratory turbulence.

## The cascade

Kolmogorov's 1941 picture (K41): energy fed in at a large scale L passes to smaller and smaller eddies at a rate
ε per unit mass. The rate is the same at every scale in between. Viscosity ν takes the energy only at

```
η = (ν³/ε)^(1/4)
```

so the range of repeating scales is L/η ~ Re^(3/4), with Re the Reynolds number. In between, the velocity
difference across a distance r depends only on ε and r. Its p-th moment then grows as r^(p/3). One result is
exact: the third moment is −(4/5) ε r (Kolmogorov's 4/5 law). The energy spectrum is C ε^(2/3) k^(−5/3); the
constant is about 1.5 for the 3D spectrum and 0.53 ± 0.055 for the 1D longitudinal one (Sreenivasan 1995), which
isotropy turns into 1.62 in 3D, so "about 1.5" needs its spectrum named.

## A cascade to run: the Sabra shell model

The Sabra model (L'vov, Podivilov, Pomyalov, Procaccia and Vandembroucq 1998) keeps one complex velocity u_n per
octave of wavenumber, k_n = 2^n, coupled to its nearest neighbours in scale:

```
du_n/dt = i (a k_{n+1} u_{n+2} u*_{n+1} + b k_n u_{n+1} u*_{n−1} − c k_{n−1} u_{n−1} u_{n−2}) − ν k_n² u_n + f_n
```

The nonlinear terms move energy between shells without creating it if a + b + c = 0. A second quantity,
Σ (a/c)^n |u_n|², is then conserved too; with a = 1 and b = c = −1/2 it plays the part of helicity, as in three
dimensions. The run here forces shell 0 and lets viscosity act on all shells: 18 shells and about 860 large-eddy
times in the test, 21 shells and about 3,600 in the table. Both are seeded and bit-for-bit reproducible.

**What repeats exactly: the flux.** In a steady state the same energy flux passes through every shell from the
forcing down to the dissipation range. In the long run it stays within 0.2% of ε from shell 0 to shell 8. A
third-order correlation obeys the model's own version of the 4/5 law:

```
3 k_n ⟨Im u*_{n−1} u*_n u_{n+1}⟩ = ε − δ (−1/2)^n
```

Here δ is the helicity flux, equal to ε when only shell 0 is forced. This is derived in `model.js` from the
equation above, and the model matches it to better than 0.1% in shells 1 to 8.

**What does not repeat exactly: the exponents.** If each shell were a scaled copy of the last, the p-th moment
would fall as k_n^(−p/3). It does not:

| p | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Sabra (this model) | 0.395 | 0.719 | 1 | 1.255 | 1.493 | 1.716 | 1.93 | 2.12 |
| K41, p/3 | 0.333 | 0.667 | 1 | 1.333 | 1.667 | 2 | 2.333 | 2.667 |
| She–Leveque | 0.364 | 0.696 | 1 | 1.280 | 1.538 | 1.778 | 2.001 | 2.211 |

The model's exponents come from the flux-based moments ⟨|Π_n/k_n|^(p/3)⟩, scaled against the third
(extended self-similarity), over shells 3 to 11. Statistical errors are 0.0002 for p = 2 and 0.004 for p = 6; the
fit range moves them by up to 0.002 and 0.006. The plain moments ⟨|u_n|^p⟩ ripple from shell to shell. Their
fitted exponents shift by several hundredths, up to about 0.1 for p = 6, with the fit range and the forcing, so
they are printed but not used.

Big bursts are rarer at small scales than a scaled copy would make them, and the excess grows with p. That is
intermittency, and it is the main way real turbulence breaks exact self-similarity. The shell model overdoes it.
Its ζ₂ − 2/3 is 0.053; a wind tunnel at Taylor-scale Reynolds numbers of 2,000 to 6,000 gives
ζ₂ = 0.693 ± 0.003, an excess of 0.026 (Küchler, Bewley and Bodenschatz 2023), close to She and Leveque's 0.029.

**Where it stops.** The flux falls to half about one shell before k_η = (ε/ν³)^(1/4), and the spectrum falls to
half its power law within half a shell of k_η. Over four viscosities the cascade widens with the Reynolds number:

| ν | Re = UL/ν | Shell of k_η | Flux half-point | Spectrum half-point | Width, decades | (3/4) log₁₀ Re |
|---|---|---|---|---|---|---|
| 10⁻⁵ | 1.7×10⁴ | 10.15 | 9.04 | 9.75 | 2.72 | 3.18 |
| 10⁻⁶ | 1.8×10⁵ | 12.65 | 11.60 | 12.55 | 3.49 | 3.94 |
| 10⁻⁷ | 1.8×10⁶ | 15.15 | 14.30 | 15.15 | 4.31 | 4.69 |
| 10⁻⁸ | 1.8×10⁷ | 17.64 | 16.95 | 17.64 | 5.10 | 5.44 |

The width grows by 0.79 decades per decade of Re (0.786 to 0.794 for cuts where the flux, or the spectrum against
its power law, has fallen to a quarter, a half or three quarters). K41 gives 3/4: the flux half-point drifts toward
k_η by about half a shell over three decades. Intermittency accounts for most of the difference. If the cut is
where viscous loss ν k² S₂(k) uses up ε, and S₂ falls as k^(−ζ₂), the cut moves as Re^(1/(2 − ζ₂)): Re^(3/4) for
K41's ζ₂ = 2/3 and Re^0.78 for the model's 0.719. This is a rough balance argument, not a fit.

## Real cascades, and what stops them

| Flow | Repeats down to | Decades | What stops it |
|---|---|---|---|
| Wind tunnel, R_λ ≈ 6,000 | η | about 5 | viscosity |
| Atmospheric surface layer, R_λ ≈ 10⁴ | η = 0.3 to 0.5 mm in wind | about 5.4 | viscosity |
| Upper ocean | η = 2 to 3 mm | | viscosity |
| Solar wind | the ion scales, about 100 km | | the ions' own motion, not collisions |
| Interstellar electron density | at least 2×10⁶ m | 6.7 measured | not seen |
| Molecular clouds | the sonic scale, about 0.1 pc | | the motions become subsonic |

The decades for the tunnel and the surface layer are L/η = (0.15 R_λ²)^(3/4), with Pope's conventions for L. The
scaling range proper is narrower: dissipation starts near 60 η, and the largest eddies are not yet self-similar.

### Air and water

The Kolmogorov scale is often quoted as about a millimetre. It moves with ε as ε^(−1/4):

| Medium | ε (W/kg) | η | Where |
|---|---|---|---|
| Air | 0.4 | 0.30 mm | surface layer, cold front |
| Air | 0.05 | 0.51 mm | the same, before the front |
| Air | 10⁻⁷ | 1.4 cm | quiet nocturnal boundary layer |
| Seawater | 10⁻⁷ | 1.8 mm | upper mixed layer, by day |
| Seawater | 10⁻⁸ | 3.3 mm | upper mixed layer, quieter |

The ε values are from Balsley, Tjernström and Svensson (2008) for air and Yang et al. (2022), one 25-hour station,
for the ocean. A millimetre needs ε ≈ 3×10⁻³ W/kg in air and 10⁻⁶ in the sea. Typical upper-ocean η is 2 to 3 mm.

### Atmosphere: two power laws

Aircraft spectra of wind and temperature (Nastrom and Gage 1985, over 6,000 commercial flights near the
tropopause) follow k^(−5/3) from a few kilometres to about 300 to 400 km, and k^(−3) at larger scales. The
transition is quoted between about 400 and 1,000 km, most often near 600 km. Only the slopes are universal; the
amplitudes vary with latitude, season and altitude. A two-dimensional cascade forced at one scale would put the
two ranges the other way round, k^(−3) on the small-scale side (Kraichnan 1967), which is why the mesoscale
−5/3 is still argued over. A 2025 preprint (DeWitt and Garrett) reads global sonde data as one anisotropic cascade with no transition.

### Solar wind: cut by the ions, not by viscosity

The solar wind is too dilute for viscosity to end its cascade. A proton at 1 AU travels about an astronomical
unit between Coulomb collisions (Braginskii's collision time, 49 days for typical slow wind). That is more than a
million times the proton inertial length c/ω_pi. The cascade instead ends where the protons' own motion
decouples them from the field:

| Typical slow wind: n = 5 cm⁻³, V = 400 km/s, B = 5 nT, T = 10⁵ K (β_p = 0.69) | Length | Swept past at V |
|---|---|---|
| Proton inertial length c/ω_pi | 102 km | 0.63 Hz |
| Proton gyroradius, v_th = √(2kT/m) | 85 km | 0.75 Hz |
| Proton gyroradius, v_th = √(kT/m) | 60 km | 1.06 Hz |

A spacecraft sees a structure of size ℓ carried past at the wind speed as a frequency V/(2πℓ) (Taylor's
hypothesis). Observed breaks sit at 0.4 to 0.5 Hz (Leamon et al. 1998; Sahraoui et al. 2009), and between 0.1 and
1 Hz across conditions, at the larger of the two ion lengths (Chen et al. 2014). The estimate here runs high by
about 40%. For fluctuations elongated along the field, the frequency depends on the angle between the field and
the flow. At β near 1 the two lengths are nearly equal, so the break cannot tell them apart.

Above the break the magnetic spectrum falls as k^(−5/3) and the velocity spectrum as k^(−3/2) (Podesta, Roberts
and Goldstein 2007). Below it a second power law continues to the electron scales, with a slope that is not
universal: −2.8 (Alexandrova et al. 2009), −2.3 (Sahraoui et al. 2009), and −1.9 to −4.4 across 33 intervals
(Leamon et al. 1998).

### The interstellar medium

Interstellar electron-density fluctuations follow one Kolmogorov-like power law from about 2×10⁶ m to 10¹³ m,
with a three-dimensional spectral index near 3.7 against Kolmogorov's 11/3 (Armstrong, Rickett and Spangler 1995).
That is 6.7 decades. Chepurnov and Lazarian (2010) extend it to 10¹⁷ m, about 3 pc, but that extension assumes
the Kolmogorov form rather than fitting it.

### Molecular clouds: the sonic scale

Cloud turbulence is supersonic on large scales. Its velocity dispersion falls with size, and where it reaches the
sound speed, 0.19 km/s at 10 K, the supersonic cascade ends. Two classic fits give:

| Fit | Dispersion | Size | Sonic size |
|---|---|---|---|
| Larson (1981): σ = 1.10 L^0.38 km/s | 3D, thermal plus non-thermal | maximum projected size L | 0.041 pc |
| Solomon et al. (1987): σ = 0.72 R^0.5 km/s | 1D | effective radius R = 1.91 S | 0.068 pc radius, 0.137 pc across |

Both fits stop near 0.1 pc, so both sonic sizes are extrapolations. Together they bracket the 0.10 ± 0.03 pc
width of interstellar filaments (Arzoumanian et al. 2011, 2019) and the size of coherent cores, inside which the
line width stops growing with size (Goodman et al. 1998). Pineda et al. (2010) see the dispersion rise by a factor
of 2 within 0.04 pc at a core's edge. In simulations the transition is smooth over a factor of about 3 in scale
(Federrath et al. 2021).

The fits differ in slope: Larson's 0.38 against Solomon et al.'s 0.5, with Heyer and Brunt (2004) at
0.49 ± 0.15 cloud by cloud. In a cascade the dispersion grows as ℓ^(ζ₂/2). That gives 1/3 for K41, 0.36 for the
shell model and 0.35 for She–Leveque, all incompressible, and 1/2 for a field of shocks. Federrath et al.'s
simulations give 0.49 ± 0.01 in the supersonic range and 0.39 ± 0.02 in the subsonic one. Larson's 0.38 is close
to the subsonic value, but his clouds are supersonic throughout (Mach 1.4 to 19). The difference is better put
down to his sample and size definition, and the supersonic data favour about 0.5.

### Superfluid helium

In superfluid helium, vorticity comes in quantised lines with circulation h/m₄ = 9.97×10⁻⁸ m²/s. Above the
spacing between lines, bundles of them carry a classical Kolmogorov cascade. Maurer and Tabeling (1998) measured
k^(−5/3) spectra both above and below the superfluid transition, using a pressure probe as a proxy for velocity.
Below that spacing the energy travels along single lines as Kelvin waves (Barenghi, Skrbek and Sreenivasan
2014). There the repetition stops at a length set by quantum mechanics.

## Cloud edges: is the agreement with the laboratory real?

(pending: contour-loop computation)

## Run it

```
node turbulence/table.mjs          # everything above, with the long run and the viscosity scan (about a minute)
node turbulence/table.mjs quick    # the same with the test's short run, no scan (a few seconds)
npm test                           # includes tests/turbulence.mjs (about 3 s)
```

`model.js` is the whole model. It loads in Node (`require`) and in a browser (`window.TURB`).

## Checks

`tests/turbulence.mjs`:

| Check | Expected | Model |
|---|---|---|
| Inviscid, unforced: energy and helicity with a + b + c = 0 | conserved | drift 6×10⁻¹¹ and 5×10⁻¹⁰ over t = 200 |
| The other sign convention, a + b − c = 0 | not conserved | E off by 50% at t = 0.9 |
| Dissipation over injection | 1 ± 0.01 | 0.9999 |
| Flux through shells 0 to 6, against the injection and the plateau | 1 ± 0.012, flat to ± 0.006 | 1.0005, flat to 0.003 |
| Shell-model 4/5 law, shells 1 to 5 (derived in `model.js`) | 1 − (−1/2)^n ± 0.005 | within 0.0004 |
| Anomalous scaling: ζ₂ − 2/3 and 2 − ζ₆ | over 5 standard errors | over 80 and 50 |
| ζ₂, ζ₄, ζ₆ in the test's run against the long run | 0.719, 1.255, 1.716 | 0.720, 1.254, 1.717 |
| Model's ζ₂ excess against the measured one (Küchler et al. 2023) | over 1.5 times | 0.053 against 0.026 |
| Cascade end against k_η (flux and spectrum half-points) | within 1.5 shells | −1.03 and −0.07 |
| Upper-ocean η for ε = 10⁻⁸ to 10⁻⁷ W/kg (arithmetic) | 1.8 to 3.3 mm | 1.84, 3.28 mm |
| Air η for ε = 0.4 to 10⁻⁷ (arithmetic) | 0.3 mm to 1.4 cm | 0.30, 13.6 mm |
| Proton inertial length at 5 cm⁻³ (NRL formulary) | 228/√5 km | 101.8 km |
| Solar-wind proton mean free path, in inertial lengths | over 10⁵ | 1.7×10⁶ |
| V/(2π d_i) against the observed ion break (Leamon et al.) | 0.44 Hz, within ×1.5 | 0.63 Hz |
| Sonic sizes from Larson and Solomon et al. against filament widths | bracket 0.10 pc | 0.041 and 0.137 pc |

## What the model leaves out

- The shell model is a caricature of the Navier–Stokes cascade: one mode per octave, local interactions only, no
  geometry. It has an exact flux and an anomalous scaling of its own, but its exponents are not those of real
  flows, and nothing here carries its numbers over to them.
- No published Sabra exponents were seen; the values usually quoted for this parameter set (about 0.72, 1.26 and
  1.71 for p = 2, 4 and 6) are recalled, not checked, so the tests compare the model only with its own long run.
- The flux relation's form in the literature was not seen; the one here is derived from the equation.
- Kolmogorov scales use published dissipation rates; the η values are arithmetic, not measurements.
- The solar-wind numbers are for one typical slow wind. The Taylor shift ignores the field-flow angle.
- Larson's and Solomon et al.'s fits are extrapolated below their data to reach the sonic scale.
- Every source was read through search-result text, not the papers (see the PR for the list); numbers marked
  "as seen in search text" in the tests should be checked against the papers.

## Sources

- A. N. Kolmogorov, Dokl. Akad. Nauk SSSR 30 (1941), and *Dissipation of energy in the locally isotropic turbulence*, Dokl. Akad. Nauk SSSR 32, 16 (1941).
- V. S. L'vov, E. Podivilov, A. Pomyalov, I. Procaccia and D. Vandembroucq, *Improved shell model of turbulence*, Phys. Rev. E 58, 1811 (1998). https://arxiv.org/abs/chao-dyn/9803025
- L. Biferale, *Shell models of energy cascade in turbulence*, Annu. Rev. Fluid Mech. 35, 441 (2003).
- Z.-S. She and E. Leveque, *Universal scaling laws in fully developed turbulence*, Phys. Rev. Lett. 72, 336 (1994).
- C. Küchler, G. P. Bewley and E. Bodenschatz, Phys. Rev. Lett. 131, 024001 (2023). https://arxiv.org/abs/2006.10993
- R. Benzi et al., *Extended self-similarity in turbulent flows*, Phys. Rev. E 48, R29 (1993).
- K. R. Sreenivasan, *On the universality of the Kolmogorov constant*, Phys. Fluids 7, 2778 (1995).
- S. B. Pope, *Turbulent Flows* (Cambridge University Press, 2000).
- G. Gulitski et al., J. Fluid Mech. 589, 83 (2007).
- B. B. Balsley, M. Tjernström and G. Svensson, AMS 18th Symposium on Boundary Layers and Turbulence, 18B.1 (2008).
- Yang et al., *Direct measurements of turbulence in the upper western Pacific North Equatorial Current over a 25-h period*, Sensors 22, 1167 (2022).
- G. D. Nastrom and K. S. Gage, J. Atmos. Sci. 42, 950 (1985).
- R. H. Kraichnan, *Inertial ranges in two-dimensional turbulence*, Phys. Fluids 10, 1417 (1967).
- T. DeWitt and T. Garrett, *Global sonde datasets do not support a mesoscale transition in the turbulent energy cascade*, preprint (2025). https://arxiv.org/abs/2510.23625
- J. W. Armstrong, B. J. Rickett and S. R. Spangler, ApJ 443, 209 (1995).
- A. Chepurnov and A. Lazarian, ApJ 710, 853 (2010). https://arxiv.org/abs/0905.4413
- S. I. Braginskii, *Transport processes in a plasma*, Rev. Plasma Phys. 1, 205 (1965).
- R. J. Leamon et al., J. Geophys. Res. 103, 4775 (1998).
- F. Sahraoui et al., Phys. Rev. Lett. 102, 231102 (2009).
- O. Alexandrova et al., Phys. Rev. Lett. 103, 165003 (2009). https://arxiv.org/abs/0906.3236
- C. H. K. Chen et al., Geophys. Res. Lett. 41, 8081 (2014).
- J. J. Podesta, D. A. Roberts and M. L. Goldstein, ApJ 664, 543 (2007).
- R. B. Larson, MNRAS 194, 809 (1981).
- P. M. Solomon, A. R. Rivolo, J. Barrett and A. Yahil, ApJ 319, 730 (1987).
- M. H. Heyer and C. M. Brunt, ApJ 615, L45 (2004). https://arxiv.org/abs/astro-ph/0409420
- C. Federrath, R. S. Klessen, L. Iapichino and J. R. Beattie, *The sonic scale of interstellar turbulence*, Nature Astronomy 5, 365 (2021). https://arxiv.org/abs/2011.06238
- A. A. Goodman et al., ApJ 504, 223 (1998).
- J. E. Pineda et al., ApJ 712, L116 (2010).
- D. Arzoumanian et al., A&A 529, L6 (2011), https://arxiv.org/abs/1103.0201; A&A 621, A42 (2019).
- J. Maurer and P. Tabeling, Europhys. Lett. 43, 29 (1998).
- C. F. Barenghi, L. Skrbek and K. R. Sreenivasan, *Introduction to quantum turbulence*, PNAS 111 (Suppl. 1), 4647 (2014). https://arxiv.org/abs/1404.1909

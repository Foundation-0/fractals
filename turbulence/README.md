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
exact: the third moment of the longitudinal velocity difference is −(4/5) ε r in the inertial range (Kolmogorov's
4/5 law). The energy spectrum is C ε^(2/3) k^(−5/3). The constant is about 1.5 for the 3D spectrum. For the 1D
longitudinal spectrum, Sreenivasan's (1995) compilation of experiments gives 0.53 with a scatter of 0.055, which
isotropy turns into 1.62 ± 0.17 in 3D, so "about 1.5" is fair once its spectrum is named.

## A cascade to run: the Sabra shell model

The Sabra model (L'vov, Podivilov, Pomyalov, Procaccia and Vandembroucq 1998) keeps one complex velocity u_n per
octave of wavenumber, k_n = 2^n, coupled to its nearest neighbours in scale:

```
du_n/dt = i (a k_{n+1} u_{n+2} u*_{n+1} + b k_n u_{n+1} u*_{n−1} − c k_{n−1} u_{n−1} u_{n−2}) − ν k_n² u_n + f_n
```

The nonlinear terms move energy between shells without creating it if a + b + c = 0. A second quantity, Σ (a/c)^n
|u_n|², is then conserved too; with a = 1 and b = c = −1/2 it plays the part of helicity, as in three dimensions
(shell models are reviewed by Biferale 2003). The run here forces shell 0 and lets viscosity act on all shells: 18
shells and about 860 large-eddy times in the test, 21 shells and about 3,600 in the table. Both are seeded and
bit-for-bit reproducible.

**What repeats exactly: the flux.** In a steady state the same energy flux passes through every shell from the
forcing down to the dissipation range. In the long run it stays within 0.2% of ε from shell 0 to shell 8. A
third-order correlation obeys the model's own version of the 4/5 law:

```
3 k_n ⟨Im u*_{n−1} u*_n u_{n+1}⟩ = ε − δ (−1/2)^n
```

Here δ is the helicity flux, equal to ε when only shell 0 is forced. This is derived in `model.js` from the
equation above; it is L'vov et al.'s own eq. (16), with Σ_n = −S₃. The model matches it to better than 0.1% in
shells 1 to 8 of the long run. Over 32 seeds of the test's shorter run the largest deviation in shells 1 to 5 is
typically 0.0014, at most 0.006.

**What does not repeat exactly: the exponents.** If each shell were a scaled copy of the last, the p-th moment
would fall as k_n^(−p/3). It does not:

| p | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Sabra (this model) | 0.395 | 0.719 | 1 | 1.255 | 1.493 | 1.716 | 1.93 | 2.12 |
| K41, p/3 | 0.333 | 0.667 | 1 | 1.333 | 1.667 | 2 | 2.333 | 2.667 |
| She–Leveque | 0.364 | 0.696 | 1 | 1.280 | 1.538 | 1.778 | 2.001 | 2.211 |
| L'vov et al. 1998, moments of u | | 0.720 | | 1.256 | | 1.706 | | |
| L'vov et al. 1998, flux-based | | 0.719 | | 1.249 | 1.477 | 1.691 | 1.893 | |

The model's exponents come from the flux-based moments ⟨|Π_n/k_n|^(p/3)⟩, scaled against the third (extended
self-similarity, Benzi et al. 1993), over shells 3 to 11. L'vov et al.'s Table I comes from 34 shells forced at
random on shells 0 and 1, without helicity. This model agrees with their moments of u within their errors (± 0.008,
0.012 and 0.015 for p = 2, 4 and 6) and sits 0.006 to 0.034 above their flux-based column for p = 4 to 7; they also
give ζ₂ = 0.728 ± 0.002 by another method. Statistical errors are 0.0002 for p = 2 and 0.004 for p = 6; the fit
range moves them by up to 0.002 and 0.006. The plain moments ⟨|u_n|^p⟩ ripple from shell to shell. Their fitted
exponents shift by several hundredths, up to about 0.1 for p = 6, with the fit range, so they are printed but not
used.

At small scales the velocity is more often near zero, and more often very large, than a scaled copy would make it.
The tails of its distribution fatten: the flatness ⟨|u|⁴⟩/⟨|u|²⟩² grows toward small scales as k^(2ζ₂ − ζ₄) = k^0.18
here, from 1.8 at shell 2 to 5.7 at shell 10. That is intermittency, and it is the main way real turbulence breaks
exact self-similarity. The shell model has more of it than measured flows. Its ζ₂ is 0.720 in the test's run (0.719
in the long run). A wind tunnel at Taylor-scale Reynolds numbers of 2,000 to 6,000 gives ζ₂ = 0.693 ± 0.011 after
correcting for the decay of the turbulence (Küchler, Bodenschatz and Bewley 2020, Fig. 3 of the revised preprint;
its abstract still gives ± 0.003), close to She and Leveque's 0.696, and the same group's later analysis 0.698
± 0.011 (Fig. 5 of arXiv:2106.01795v2). The model sits about two of the measurement's errors above them (2.0 to 2.4
for the test's run). That group's published letter reads their high-Reynolds-number statistics as a universal form
rather than a pure power law (Küchler, Bewley and Bodenschatz 2023).

**Where it stops.** The flux falls to half about one shell before k_η = (ε/ν³)^(1/4), and the spectrum falls to
half its power law within half a shell of k_η. Over four viscosities the cascade widens with the Reynolds number:

| ν | Re = UL/ν | Shell of k_η | Flux half-point | Spectrum half-point | Width, decades | (3/4) log₁₀ Re |
|---|---|---|---|---|---|---|
| 10⁻⁵ | 1.7×10⁴ | 10.15 | 9.04 | 9.75 | 2.72 | 3.18 |
| 10⁻⁶ | 1.8×10⁵ | 12.65 | 11.60 | 12.55 | 3.49 | 3.94 |
| 10⁻⁷ | 1.8×10⁶ | 15.15 | 14.30 | 15.15 | 4.31 | 4.69 |
| 10⁻⁸ | 1.8×10⁷ | 17.64 | 16.95 | 17.64 | 5.10 | 5.44 |

The width grows by 0.78 to 0.79 decades per decade of Re. The cut can be placed where the flux has fallen to a
quarter, a half or three quarters of its plateau, or where the spectrum has fallen to a half or a quarter of its
power law (at three quarters the spectrum cut falls near the end of the fit range at ν = 10⁻⁵ and is left out).
Over eight seeds and these five cuts the slopes run from 0.770 to 0.794; the flux half-point gives 0.787 with a
seed-to-seed SD of 0.003, so an error of 0.001 on the mean (`node turbulence/seeds.mjs`). K41 gives 3/4: the flux
half-point drifts toward k_η by about half a shell over three decades. Intermittency accounts for the difference.
In the multifractal picture the cut-off goes as Re^(1/(1 + h*)), with h* = dζ_p/dp at p = 3, the scaling of the
velocity that carries the flux (Paladin and Vulpiani 1987; Frisch 1995; in this form, Boffetta, Mazzino and
Vulpiani 2008). With the model's exponents h* ≈ (ζ₄ − ζ₂)/2 = 0.27, which gives Re^0.79. Viscous loss ν k² S₂(k)
equal to ε gives Re^(1/(2 − ζ₂)) = Re^0.78. On seed noise alone the flux half-point favours the multifractal value,
but the two stay unseparated: the cut's definition moves the eight-seed means from 0.781 to 0.791, and the
predictions rest on estimates of h* good to about 0.01. Boffetta et al.'s eq. (II.5) ties the spectrum's cut to
h*(2) ≈ (ζ₃ − ζ₁)/2 = 0.30, Re^0.77; the measured spectrum cuts (0.781 and 0.786) sit above that. A local Reynolds
number of 1 on the rms velocity, S₂(k)^(1/2) = ν k, gives Re^(2/(2 + ζ₂)) = Re^0.74, below K41 and below every
measured slope.

## Real cascades, and what stops them

| Flow | Repeats down to | Decades | What ends it |
|---|---|---|---|
| Wind tunnel, R_λ ≈ 6,000 | η | about 5 | viscosity |
| Atmospheric surface layer, R_λ 1,600 to 6,600 (Gulitski et al. 2007, Part 1) | η = 0.3 to 0.5 mm in wind | 4.2 to 5.1 | viscosity |
| Upper ocean | η = 1 to 3 mm, more in quiet water | | viscosity |
| Solar wind | the ion scales, about 100 km (the MHD range) | | the ions' own motion, not collisions |
| Interstellar electron density | at least 2×10⁶ m near the Sun | 6.7 measured | not seen locally; 50 to 200 km inferred on strongly scattered lines of sight |
| Molecular clouds, supersonic range | the sonic scale, about 0.1 pc | | the motions become subsonic; a shallower subsonic cascade continues |

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
for the ocean. A millimetre needs ε ≈ 3×10⁻³ W/kg in air and 10⁻⁶ in the sea, which an actively stirred mixed layer
reaches. So "about a millimetre" is the right order in both, with a spread of a factor of 10 either way.

### Atmosphere: two power laws

Aircraft spectra of wind and temperature (Nastrom and Gage 1985, over 6,000 commercial flights near the
tropopause) follow k^(−5/3) from a few kilometres to about 300 to 400 km, and k^(−3) at larger scales. The
transition is quoted between about 400 and 1,000 km, most often near 600 km. Only the slopes are universal; the
amplitudes vary with latitude, season and altitude. A two-dimensional cascade forced at one scale would put the
two ranges the other way round, k^(−3) on the small-scale side (as Kraichnan 1967 conjectured), which is why the
mesoscale −5/3 is still argued over. A 2025 preprint (DeWitt and Garrett) reads global sonde data as one
anisotropic cascade with no transition.

### Solar wind: cut by the ions, not by viscosity

The solar wind is too dilute for viscosity to end its cascade. A proton at 1 AU travels 0.2 to 1 AU between
Coulomb collisions (Braginskii's collision time: 49 days at 10⁵ K, 12 days at the 4×10⁴ K of cooler, slow wind).
That is 10⁵ to 10⁶ times the proton inertial length c/ω_pi. The MHD cascade instead ends where the protons' own
motion decouples them from the field, and a steeper, kinetic cascade carries on to the electron scales, about a
kilometre:

| Typical wind: n = 5 cm⁻³, V = 400 km/s, B = 5 nT, T = 10⁵ K (β_p = 0.69) | Length | Swept past: no angle | at the Parker angle, 47° |
|---|---|---|---|
| Proton inertial length c/ω_pi | 102 km | 0.63 Hz | 0.46 Hz |
| Proton gyroradius, v_th = √(2kT/m) | 85 km | 0.75 Hz | 0.55 Hz |
| Proton gyroradius, v_th = √(kT/m) | 60 km | 1.06 Hz | 0.78 Hz |

A spacecraft sees structures carried past at the wind speed (Taylor's hypothesis). The fluctuations are elongated
along the field, so a size ℓ across the field shows up at V sin θ_BV/(2πℓ), with θ_BV the angle between the field
and the flow; at 1 AU the Parker spiral puts it near 47° for a 400 km/s wind. Observed breaks fall between 0.1 and
1 Hz across conditions, at the larger of the two ion lengths (Chen et al. 2014). Sahraoui et al. (2009) find 0.4 Hz
in one fast, high-β interval and read it as the proton gyroscale. Leamon et al.'s 33 intervals, as replotted by
Leamon et al. (2000), run from about 0.12 to 0.87 Hz with a mean near 0.38 Hz; a fit through the origin puts the
break at 0.686 V sin Ψ/(2π d_i), an unconstrained one at 0.15 Hz + 0.45 V sin Ψ/(2π d_i), and their fit is best for
an orientation near 65°. The inertial length gives 0.46 Hz at the Parker angle and 0.63 Hz without it; both lie
inside the observed spread, which does not choose between them. At β near 1 the two ion lengths are nearly equal,
so the break cannot tell them apart either.

At larger scales (lower frequencies) than the break the magnetic spectrum falls as k^(−5/3) and the velocity
spectrum as k^(−3/2) (Podesta, Roberts and Goldstein 2007). At smaller scales the kinetic range's slope is not
universal: −2.8 (Alexandrova et al. 2009) and −2.3 (Sahraoui et al. 2009). Smith et al. (2006) find −1 to −4, with
means of −2.0 in magnetic clouds and −2.6 on open field lines; Alexandrova et al. and Bruno and Carbone (2013)
summarise the range as about −2 to −4, and Bruno and Carbone give about −7/3 as typical.

### The interstellar medium

Interstellar electron-density fluctuations follow one Kolmogorov-like power law from about 2×10⁶ m to 10¹³ m,
with a three-dimensional spectral index near 3.7 against Kolmogorov's 11/3 (Armstrong, Rickett and Spangler 1995).
That is 6.7 decades. No inner scale is seen near the Sun, where Armstrong et al. bound it below about 10⁸ m;
on strongly scattered lines of sight Spangler and Gwinn (1990) infer 50 to 200 km. Chepurnov and Lazarian (2010)
extend the power law to 10¹⁷ m, about 3 pc, but that extension assumes the Kolmogorov form rather than fitting it.

### Molecular clouds: the sonic scale

Cloud turbulence is supersonic on large scales. Its velocity dispersion falls with size, and where the non-thermal
part reaches the sound speed, 0.19 km/s at 10 K, the supersonic range ends. A shallower, subsonic cascade carries on
below it (Federrath et al. 2021). Two classic fits give:

| Fit | Dispersion | Size | Sonic size |
|---|---|---|---|
| Larson (1981): σ = 1.10 L^0.38 km/s | 3D, all internal motions, thermal ones included | maximum projected size L | 0.099 pc |
| Solomon et al. (1987): σ = 1.0 S^0.5 km/s, 0.72 R^0.5 in this study's conversion | 1D, from ¹²CO line widths | effective radius R = 1.92 S | 0.074 pc radius, 0.147 pc across |

Each dispersion already holds a thermal part, and each is read in its own convention. Larson's σ is the total 3D rms
velocity of all internal motions, including the gas's thermal σ_s = 0.32 km/s at 10 K (his pp. 813–814), so the
non-thermal 1D dispersion is √((σ² − σ_s²)/3). Solomon et al.'s is the width of the ¹²CO line, which holds only
CO's own thermal width, 0.054 km/s. Larson's own sonic size, 0.04 pc (his p. 820), uses another criterion, σ = σ_s;
this relation gives 0.039 pc for it. Within its errors, (1.0 ± 0.1) S^(0.5 ± 0.05), Solomon et al.'s fit puts the
sonic size between 0.08 and 0.24 pc across.

Larson's data reach about 0.1 pc, so his sonic size is a short extrapolation, and there his relation is about
sonic (non-thermal Mach 1.0). He calls TMC1 and TMC2 subsonic, the only two in his Table 1: TMC2 (0.1 pc) is his
smallest plotted object, at Mach 0.44 in his convention, and TMC1 (0.2 pc) is at 0.74, while L1407/L1257 (0.12 pc)
and L1544/L63 (0.18 pc) are supersonic, at Mach 2.45 and 1.74. Solomon et al.'s clouds are giant molecular clouds, a
parsec and larger, so theirs is an extrapolation of more than a decade. Both sit near the width of interstellar
filaments, 0.10 ± 0.03 pc in Arzoumanian et al. (2011) and a median of 0.10 pc with an interquartile range of
0.07 pc over 599 filaments in Arzoumanian et al. (2019), and the size of coherent cores,
inside which the line width stops growing with size (Goodman et al. 1998). Pineda et al. (2010) see the dispersion
rise by a factor of 2 within 0.04 pc at a core's edge. In simulations the transition is smooth over a factor of
about 3 in scale (Federrath et al. 2021).

The fits differ in slope: Larson's 0.38 against Solomon et al.'s 0.5, with Heyer and Brunt (2004) at
0.49 ± 0.15 cloud by cloud. In a cascade the dispersion grows as ℓ^(ζ₂/2). That gives 1/3 for K41, 0.36 for the
shell model and 0.35 for She–Leveque, all incompressible, and 1/2 for a field of shocks. Federrath et al.'s
simulations give 0.49 ± 0.01 in the supersonic range and 0.39 ± 0.02 in the subsonic one. Larson's 0.38 is close
to the subsonic value, but his clouds are supersonic over most of his range (non-thermal Mach 1.0 at 0.1 pc to 19 at
100 pc). Larson read his slope as supersonic turbulence, or subsonic turbulence in warmer gas; Solomon et al. read
0.5 as virial equilibrium. That the difference lies in Larson's sample and size definition, and that the supersonic
data favour about 0.5, is this study's inference.

### Superfluid helium

In superfluid helium, vorticity comes in quantised lines with circulation h/m₄ = 9.97×10⁻⁸ m²/s. Above the
spacing between lines, bundles of them carry a classical Kolmogorov cascade. Maurer and Tabeling (1998) measured
k^(−5/3) spectra both above and below the superfluid transition, using a pressure probe as a proxy for velocity.
Below that spacing the energy travels along single lines as Kelvin waves (Barenghi, Skrbek and Sreenivasan
2014). There the repetition stops at a length set by quantum mechanics.

## Cloud edges: is the agreement with the laboratory real?

Cloud edges in projected CO maps of the Taurus field follow a perimeter-area relation P ∝ A^(D/2) with
D = 1.36 ± 0.02, the same from about 100 pc down to 0.1 pc (Falgarone, Phillips and Walker 1991). The error is a
combined-fit error. Their maps one by one give 1.46 ± 0.18, 1.32 ± 0.14 and 1.38 ± 0.08 (their Fig. 6a), which agree
with each other, as they say, though they add that error bars are difficult to estimate. Other data for the Taurus
complex gave 1.51 (Stutzki 1993, Fig. 5, on maps compiled by Zimmermann et al.). Rain and cloud areas in the
atmosphere give 1.35 ± 0.05 (Lovejoy 1982). Laser-sheet sections through the turbulent/non-turbulent interfaces of
laboratory jets and wakes give box-counting dimensions of 1.3 to 1.4, sections of surfaces of dimension 2.3 to 2.4
(Sreenivasan and Meneveau 1986), which Sreenivasan, Ramshankar and Meneveau (1989) explain as 7/3; sections of
iso-concentration and iso-dissipation surfaces give 1.36 ± 0.05 as well (Sreenivasan and Meneveau 1986 and
Meneveau 1989, as Falgarone et al. quote them). The match between clouds and laboratory is often cited.

A fractional-Brownian estimate depends on which dimension the relation measures. For a Gaussian random surface
with power spectrum k^(−β), so H = (β − 2)/2:

- all the contours at one level together have dimension 2 − H (Mandelbrot);
- a single contour loop has dimension (3 − H)/2 (Kondev and Henley 1995; a conjecture, x_l = 1/2, exact only at
  H = 0 and 1).

A perimeter-area relation over separate clouds measures single loops, if holes are not counted. `contours.js` checks
this by making the surfaces and measuring both. The table below uses 32 surfaces of 2048 × 2048 points per spectrum
(`node turbulence/edges.mjs`):

| β | H | (3 − H)/2 | 2 − H | Loops, P ∝ R_g^D | Loops, P ∝ A^(D/2) | All contours together |
|---|---|---|---|---|---|---|
| 2.4 | 0.20 | 1.400 | 1.800 | 1.429 ± 0.012 | 1.430 ± 0.013 | 1.716 |
| 8/3 | 0.33 | 1.333 | 1.667 | 1.357 ± 0.017 | 1.364 ± 0.022 | 1.623 |
| 2.8 | 0.40 | 1.300 | 1.600 | 1.335 ± 0.013 | 1.346 ± 0.017 | 1.570 |
| 3 | 0.50 | 1.250 | 1.500 | 1.275 ± 0.025 | 1.294 ± 0.025 | 1.485 |
| 3.4 | 0.70 | 1.150 | 1.300 | 1.219 ± 0.040 | 1.215 ± 0.039 | 1.309 |
| 11/3 | 0.83 | 1.083 | 1.167 | 1.150 ± 0.025 | 1.145 ± 0.020 | 1.209 |

R_g is a loop's radius of gyration, fitted over 8 to 128 grid spacings. The errors combine a jackknife over
surfaces with the spread over fit windows. The last column comes from the total contour length measured on
coarser and coarser grids. With holes counted (outline and holes against net area) the loops give 1.65 at β = 2.4
and 1.52 at 2.8.

- **Loops follow Kondev and Henley.** On a finite periodic grid the roughness the loops see differs from
  (β − 2)/2: higher for flat spectra (0.24 against 0.20 at β = 2.4), lower for steep ones (0.76 against 0.83 at
  11/3). Measured over the same range of sizes, the loop dimension falls with this effective roughness H_eff at a
  slope of −0.53 ± 0.05. The six spectra share their random numbers, so the error combines a joint jackknife
  (± 0.040) with the spread over fit windows (± 0.031). Single loops predict −1/2; the whole level set −1, which is
  9 errors away. At 4096 points per side the slope is −0.532 ± 0.022, 21 errors from −1; at 1024 it is
  −0.47 ± 0.11, 5 errors from −1.
- **An offset.** Loops sit above (3 − H_eff)/2 at every spectrum: by 0.039, 0.038 and 0.035 on average at 1,024,
  2,048 and 4,096 points per side (`node turbulence/edges.mjs 1024`, `4096`), with H_eff measured over the loops'
  own range of sizes. Measured over separations two and four times larger it is 0.029 and 0.017 (at 2048), and #34's
  review found about 0.014 with a covering-box size in place of R_g. So its size depends on the set-up, it barely
  shrinks with the grid, and its origin is open. Kondev, Henley and Salinas's own fits (their Table I, as read in
  #34's review) overshoot the formula only at H = 0.6 and above, the smoother surfaces, so they do not explain it.
- **The whole level set follows Mandelbrot:** its dimension tracks 2 − H_eff to within 0.02.
- **What does not change the answer:**
  - fitting perimeter against size or against area;
  - fitting only the outlines of clouds (loops with the cloud inside), which agree with all loops to within 0.02.
- **Not tested: the level.** The fields have zero mean and their median sits within 0.2 standard deviations of
  it, so the median column (which gives the same loops) does not probe the level; contours away from the mean
  were not computed.
- **Counting holes changes it.** Adding a cloud's holes to its perimeter and taking its net area gives a larger
  number. Falgarone et al. take the area as the number of map positions inside the contour and the perimeter as
  the number of positions externally adjacent to it (their p. 195). Holes are not mentioned; read literally, the
  definition counts hole borders and nets the area.

So, on Gaussian surfaces:

- **Projected Kolmogorov density** (β = 11/3) gives 1.15, not 1.36. Single loops predict 13/12; the 7/6 sometimes
  quoted is the formula for all contours together.
- **CO maps** have projected spectra near β = 2.8 (Stutzki et al. 1998: 2.8 for the Polaris Flare, 2.7 for another
  field). Single loops there give 1.34 to 1.35 without holes and 1.52 ± 0.06 with them. Falgarone et al. fitted
  perimeter against area. Without holes, their 1.36 ± 0.02 corresponds to β = 2.70 (2.57 to 2.86 with this
  computation's own error added); the formula alone, without the loops' offset, puts it at 2.56. With holes, as
  their definition reads, it corresponds to β = 3.18 (3.00 to 3.36). So if holes were left out, the agreement with
  CO-map spectra leans on the offset; if they were counted, the edges imply a steeper spectrum than the maps'.
- **Measured values on real maps run from about 1.2 to 1.6.** Falgarone et al. list 1.26 ± 0.04 (Bazell and
  Désert), 1.2 to 1.55 (Vogelaar et al.) and 1.18 to 1.28 (Dickman et al.). Sánchez et al. (2005) summarise
  1.2 ≲ D ≲ 1.5 and measure Orion A in ¹³CO at 1.32 ± 0.02; they count hole borders and report that including or
  excluding holes did not change their result. On these surfaces their procedure still gives 1.31 without holes
  and 1.40 with them at β = 2.8 (as #34's re-review computed), so the difference probably lies in the fields:
  projected particle clouds against Gaussian surfaces. Stutzki et al. (1998) find d ≈ 1.6 for the Polaris Flare,
  which they take as d = 2 − H after Voss, and typically 1.3 to 1.5 for other clouds. Counting holes, or whole
  contour sets, raises the number, so it can account for the high end only. Values below the single loops' 1.34
  at β = 2.8 need steeper spectra (single loops give 1.29 at β = 3) or coarser maps (Sánchez et al. find D falls
  as the number of pixels falls).
- **The calibration behind 2 − H.** Vogelaar and Wakker (1994) generated fractional-Brownian maps with contour
  dimensions of 1.2 to 1.6 and recovered them to within 0.05 with a per-object perimeter-area code: 4-connected
  pixel objects, a perimeter summed from pixel sides, with the diagonal instead of two sides at corner pixels
  (p. 559), which, read literally, counts hole borders, and all levels pooled. Their text gives no mapping from D to
  H and does not discuss holes; 2 − H is Stutzki et al.'s reading of that calibration. On these surfaces at 2048,
  where 2 − H = 1.6 and 1.5 (β = 2.8 and 3), single loops give 1.35 and 1.29 without holes and 1.52 and 1.41 with
  them, while Vogelaar and Wakker's Fig. 5 reads about 1.62 for a generated 1.58 and 1.48 for 1.50. A pixel
  estimator in their style, but counting plain pixel sides without the corner rule, gives 1.42 and 1.37 with holes
  (L = 256, β = 2.84 and 3; #34's re-review); a diagonal at convex corners adds about 0.03 (about 1.45 and 1.39),
  and also cutting concave corners takes off about 0.015. No reading reproduces their calibration at D = 1.4 to
  1.6, and the cause (the generator, the pooling of levels, the map size) is left open.

The laboratory values are sections of two kinds of surface: the interface between turbulent and quiet fluid,
explained as 7/3 (Sreenivasan, Ramshankar and Meneveau 1989), and iso-scalar surfaces inside the turbulence. An
interface bounds one region, so a single loop on a slice through a Kolmogorov field (β = 8/3, H = 1/3) is a natural
Gaussian analogue. That gives 1.36 here, and (3 − 1/3)/2 = 4/3 equals the 7/3 surface's section. But the section
dimension 1 + H and (3 − H)/2 coincide only at H = 1/3, and the interface is not a level set of a Gaussian field.
Iso-scalar surfaces have a dimension that falls as the level moves away from the mean: about 8/3 at the mean
(Constantin, Procaccia and Sreenivasan 1991), whose section 5/3 = 2 − H is the whole-level-set value. Iyer et al.
(2020) find 8/3 an upper bound reached there, a plateau near 2.35 at 1.5 standard deviations from the mean (which
they say matches Sreenivasan and Meneveau's experiments), and 2 by about three standard deviations. Cloud maps are
projections of supersonic gas whose spectrum is shallower than Kolmogorov's; the laboratory values come from
sections through incompressible turbulence. Both sit near 4/3 for different reasons, so their agreement does not
show shared physics.

Real column densities are not Gaussian: they are close to log-normal and intermittent. Sánchez et al. (2005) also
find that the projected perimeter dimension depends on the resolution and on the cloud's 3D dimension. So this
settles which formula a perimeter-area fit over single loops measures, not what the clouds are.

## Run it

```
node turbulence/table.mjs          # everything above but the seed spreads, with the long run and the scan (about a minute)
node turbulence/seeds.mjs          # the seed spreads: 32 seeds of the test's run and 8 of the scan (about 4 minutes)
node turbulence/table.mjs quick    # the same with the test's short run, no scan (a few seconds)
node turbulence/edges.mjs          # the cloud-edge table, 2048 points per side (about 45 s on 4 cores)
node turbulence/edges.mjs 4096     # any power of 2; 4096 takes about 4 minutes on 4 cores
node turbulence/edges.mjs quick    # a smoke test of the same code at 256 points per side (about a second)
npm test                           # includes tests/turbulence.mjs and tests/turbulence-edges.mjs (about 5 s)
```

`model.js` is the cascade and the scales; `contours.js` is the random surfaces and their contours. Both load in
Node (`require`) and in a browser (`window.TURB`, `window.CONTOURS`).

## Checks

`tests/turbulence.mjs`:

| Check | Expected | Model |
|---|---|---|
| Inviscid, unforced: energy and helicity with a + b + c = 0 | conserved | drift 6×10⁻¹¹ and 5×10⁻¹⁰ over t = 200 |
| The other sign convention, a + b − c = 0 | not conserved | E off by 50% at t = 0.9 |
| Dissipation over injection (model) | 1 ± 0.01 | 0.9999 |
| Flux through shells 0 to 6, against the injection and the plateau | 1 ± 0.012, flat to ± 0.006 | 1.0005, flat to 0.003 |
| Shell-model 4/5 law, shells 1 to 5 (L'vov et al.'s eq. 16; derived in `model.js`) | 1 − (−1/2)^n ± 0.01 | within 0.0004 (typically 0.0014 over seeds) |
| Anomalous scaling: ζ₂ − 2/3 and 2 − ζ₆ | over 5 standard errors | over 80 and 50 |
| ζ₂, ζ₄, ζ₆ in the test's run against the long run | 0.719, 1.255, 1.716 | 0.720, 1.254, 1.717 |
| ζ₂, ζ₄, ζ₆ against L'vov et al.'s Table I (moments of u) | within twice their errors | 0.000, 0.002, 0.011 apart |
| Model's ζ₂ against the measured ones (Küchler et al.) | over 1.5 errors above 0.693 ± 0.011 and 0.698 ± 0.011 | 0.720: 2.4 and 2.0 errors |
| Cascade end against k_η (flux and spectrum half-points) | within 1.5 shells | −1.03 and −0.07 |
| Upper-ocean η for ε = 10⁻⁸ to 10⁻⁷ W/kg (arithmetic) | 1.8 to 3.3 mm | 1.84, 3.28 mm |
| Air η for ε = 0.4 to 10⁻⁷ (arithmetic) | 0.3 mm to 1.4 cm | 0.30, 13.6 mm |
| Proton inertial length at 5 cm⁻³ (NRL formulary) | 228/√5 km | 101.8 km |
| Solar-wind proton mean free path at 10⁵ K and 4×10⁴ K, in inertial lengths (arithmetic) | over 10⁵ | 1.7×10⁶ and 2.7×10⁵ |
| V/(2π d_i), with and without sin θ_BV at the Parker angle, against observed ion breaks (Chen et al. 2014) | 0.1 to 1 Hz | 0.457 and 0.625 Hz |
| Sonic sizes from Larson and Solomon et al. against filament widths | within a factor of 2 of 0.10 pc | 0.099 and 0.147 pc |
| Larson's relation at 0.1 pc: non-thermal Mach number (this study's tolerance) | 0.8 to 1.25 | 1.01 |
| Larson's Table 1: TMC1 and TMC2 subsonic, L1407/L1257 and L1544/L63 supersonic, in his convention | as he says | 0.74, 0.44; 2.45, 1.74 |

`tests/turbulence-edges.mjs`:

| Check | Expected | Model |
|---|---|---|
| FFT against the direct DFT; 2D Parseval and round trip | equal | within 4×10⁻¹³ |
| Random streams: consecutive blocks, overlap refused, two uniforms per two normals | | yes |
| Surfaces against a naive synthesis; fitted spectral slopes | equal; β ± 0.06 | 2×10⁻¹⁴; within 0.012 |
| Circle: P, A, R_g; the same circle across the torus seams | 2πr₀, πr₀², r₀; identical | within 0.05% |
| Contours around the torus found and dropped | 2 and 2 | 2 and 2 |
| Saddle cells joined or split by the cell average | 1, 2, 1, 2 loops | 1, 2, 1, 2 |
| Green's theorem: loop areas add up to the area above the level (10 of 12 surfaces) | exact | 2×10⁻¹⁵ |
| Loops under a shift, a quarter turn, upside down | unchanged | within 7×10⁻¹³ |
| β = 2.4 and 3: loops nearer (3 − H)/2, level set nearer 2 − H | yes | yes |
| β = 2.4 and 3: the loops' offset above (3 − H_eff)/2 against the 0.04 found on larger grids | within 3 jackknife errors | 0.004 ± 0.018 and 0.030 ± 0.018 (this seed) |
| Fall of the loop dimension from β = 2.4 to 3 (paired jackknife) | over 2 errors; within 2 errors of half the rise in H_eff (0.118), beyond 3 from all of it (0.236) | 0.092 ± 0.024 (this seed; about 80% of seeds clear the last at this size) |

## What the model leaves out

- The shell model is a caricature of the Navier–Stokes cascade: one mode per octave, local interactions only, no
  geometry. It has an exact flux and an anomalous scaling of its own, but its exponents are not those of real
  flows, and nothing here carries its numbers over to them.
- Kolmogorov scales use published dissipation rates; the η values are arithmetic, not measurements.
- The solar-wind numbers are for one typical wind; the Parker angle stands in for the field-flow angle of each
  interval.
- Larson's fit is extrapolated a little below its data to reach the sonic scale, Solomon et al.'s by more than a
  decade. Larson's smallest objects were observed in HC₃N, HC₅N, NH₃ and H₂CO, not CO; his σ already holds the
  gas's thermal motions.
- The multifractal cut-off is checked second-hand (Boffetta, Mazzino and Vulpiani 2008, citing Paladin and Vulpiani
  1987); Frisch's book was not reached. Kraichnan's ordering is from his abstract, where it is a conjecture.
- The cloud-edge computation uses Gaussian surfaces. Real column densities are close to log-normal and
  intermittent, and observed maps add noise, beams and optical depth. The loops' offset above (3 − H_eff)/2
  depends on the set-up and is not explained.
- Sources were first read through search-result text. #34's review and re-review then read many of them; the
  Sources list marks what was read where, and values taken from those reviews are marked so in the tests.

## Sources

DOIs and titles were confirmed from search results (publisher, ADS or arXiv pages, or citing papers' reference
lists), and checked against Crossref in #34's re-review; entries without one have none that was found. Each entry
says how it was read: in the paper during #34's review or re-review, in its abstract only, or through search-result
text only.

- A. N. Kolmogorov, *The local structure of turbulence in incompressible viscous fluid for very large Reynolds numbers*, Dokl. Akad. Nauk SSSR 30 (1941); translation Proc. R. Soc. Lond. A 434, 9 (1991). Search text only. https://doi.org/10.1098/rspa.1991.0075
- A. N. Kolmogorov, *Dissipation of energy in the locally isotropic turbulence*, Dokl. Akad. Nauk SSSR 32, 16 (1941); translation Proc. R. Soc. Lond. A 434, 15 (1991). Search text only. https://doi.org/10.1098/rspa.1991.0076
- V. S. L'vov, E. Podivilov, A. Pomyalov, I. Procaccia and D. Vandembroucq, *Improved shell model of turbulence*, Phys. Rev. E 58, 1811 (1998). Read in #34's review. https://doi.org/10.1103/PhysRevE.58.1811 (https://arxiv.org/abs/chao-dyn/9803025)
- L. Biferale, *Shell models of energy cascade in turbulence*, Annu. Rev. Fluid Mech. 35, 441 (2003). Search text only. https://doi.org/10.1146/annurev.fluid.35.101101.161122
- Z.-S. She and E. Leveque, *Universal scaling laws in fully developed turbulence*, Phys. Rev. Lett. 72, 336 (1994). Search text only. https://doi.org/10.1103/PhysRevLett.72.336
- C. Küchler, E. Bodenschatz and G. P. Bewley, *Scaling in decaying turbulence at high Reynolds numbers*, preprint (2020; v2 2022). Read in #34's review. https://arxiv.org/abs/2006.10993
- C. Küchler, G. P. Bewley and E. Bodenschatz, *Universal velocity statistics in decaying turbulence*, Phys. Rev. Lett. 131, 024001 (2023). Read in #34's review. https://doi.org/10.1103/PhysRevLett.131.024001 (https://arxiv.org/abs/2106.01795)
- G. Paladin and A. Vulpiani, *Degrees of freedom of turbulence*, Phys. Rev. A 35, 1971 (1987). Abstract only; the full text was not reached. https://doi.org/10.1103/PhysRevA.35.1971
- G. Boffetta, A. Mazzino and A. Vulpiani, *Twenty-five years of multifractals in fully developed turbulence: a tribute to Giovanni Paladin*, J. Phys. A 41, 363001 (2008). Read in #34's review. https://doi.org/10.1088/1751-8113/41/36/363001 (https://arxiv.org/abs/0809.0196)
- U. Frisch, *Turbulence: The Legacy of A. N. Kolmogorov* (Cambridge University Press, 1995). Not reached. https://doi.org/10.1017/CBO9781139170666
- R. Benzi, S. Ciliberto, R. Tripiccione, C. Baudet, F. Massaioli and S. Succi, *Extended self-similarity in turbulent flows*, Phys. Rev. E 48, R29 (1993). Abstract only (#34's re-review). https://doi.org/10.1103/PhysRevE.48.R29
- K. R. Sreenivasan, *On the universality of the Kolmogorov constant*, Phys. Fluids 7, 2778 (1995). Search text only. https://doi.org/10.1063/1.868656
- S. B. Pope, *Turbulent Flows* (Cambridge University Press, 2000). Search text only. https://doi.org/10.1017/CBO9780511840531
- G. Gulitski et al., *Velocity and temperature derivatives in high-Reynolds-number turbulent flows in the atmospheric surface layer. Part 1. Facilities, methods and some general results*, J. Fluid Mech. 589, 57 (2007). Abstract only (#34's re-review); the source of R_λ 1,600 to 6,600. https://doi.org/10.1017/S0022112007007495
- G. Gulitski et al., *Velocity and temperature derivatives in high-Reynolds-number turbulent flows in the atmospheric surface layer. Part 2. Accelerations and related matters*, J. Fluid Mech. 589, 83 (2007). Abstract only (#34's re-review). https://doi.org/10.1017/S0022112007007501
- B. B. Balsley, M. Tjernström and G. Svensson, *Turbulence in the nocturnal boundary layer: highly-structured, strongly-variable, but ubiquitous*, AMS 18th Symposium on Boundary Layers and Turbulence, 18B.1 (2008). Search text only. https://ams.confex.com/ams/18BLT/techprogram/session_22073.htm
- W. Yang et al., *Direct measurements of turbulence in the upper western Pacific North Equatorial Current over a 25-h period*, Sensors 22, 1167 (2022). Read in #34's review. https://doi.org/10.3390/s22031167
- G. D. Nastrom and K. S. Gage, *A climatology of atmospheric wavenumber spectra of wind and temperature observed by commercial aircraft*, J. Atmos. Sci. 42, 950 (1985). Search text only. https://doi.org/10.1175/1520-0469(1985)042<0950:ACOAWS>2.0.CO;2
- R. H. Kraichnan, *Inertial ranges in two-dimensional turbulence*, Phys. Fluids 10, 1417 (1967). Abstract only. https://doi.org/10.1063/1.1762301
- T. DeWitt and T. Garrett, *Global sonde datasets do not support a mesoscale transition in the turbulent energy cascade*, preprint (2025). Search text only. https://arxiv.org/abs/2510.23625
- J. W. Armstrong, B. J. Rickett and S. R. Spangler, *Electron density power spectrum in the local interstellar medium*, ApJ 443, 209 (1995). Read in #34's review. https://doi.org/10.1086/175515
- S. R. Spangler and C. R. Gwinn, *Evidence for an inner scale to the density turbulence in the interstellar medium*, ApJ 353, L29 (1990). Abstract only (#34's re-review, from the ADS scan). https://doi.org/10.1086/185700
- A. Chepurnov and A. Lazarian, *Extending the big power law in the sky with turbulence spectra from Wisconsin Hα Mapper data*, ApJ 710, 853 (2010). Read in #34's review. https://doi.org/10.1088/0004-637X/710/1/853 (https://arxiv.org/abs/0905.4413)
- S. I. Braginskii, *Transport processes in a plasma*, in Reviews of Plasma Physics 1, 205 (Consultants Bureau, 1965). Search text only.
- NRL Plasma Formulary (Naval Research Laboratory). Search text only. https://www.nrl.navy.mil/ppd/content/nrl-plasma-formulary/
- R. J. Leamon, C. W. Smith, N. F. Ness, W. H. Matthaeus and H. K. Wong, *Observational constraints on the dynamics of the interplanetary magnetic field dissipation range*, J. Geophys. Res. 103, 4775 (1998). Abstract only. https://doi.org/10.1029/97JA03394
- R. J. Leamon et al., *MHD-driven kinetic dissipation in the solar wind and corona*, ApJ 537, 1054 (2000). Read in #34's review. https://doi.org/10.1086/309059
- F. Sahraoui et al., *Evidence of a cascade and dissipation of solar-wind turbulence at the electron gyroscale*, Phys. Rev. Lett. 102, 231102 (2009). Read in #34's review. https://doi.org/10.1103/PhysRevLett.102.231102
- O. Alexandrova et al., *Universality of solar-wind turbulent spectrum from MHD to electron scales*, Phys. Rev. Lett. 103, 165003 (2009). Read in #34's review. https://doi.org/10.1103/PhysRevLett.103.165003 (https://arxiv.org/abs/0906.3236)
- C. H. K. Chen, L. Leung, S. Boldyrev, B. A. Maruca and S. D. Bale, *Ion-scale spectral break of solar wind turbulence at high and low beta*, Geophys. Res. Lett. 41, 8081 (2014). Read in #34's review. https://doi.org/10.1002/2014GL062009
- C. W. Smith, K. Hamilton, B. J. Vasquez and R. J. Leamon, *Dependence of the dissipation range spectrum of interplanetary magnetic fluctuations on the rate of energy cascade*, ApJ 645, L85 (2006). Read in #34's re-review. https://doi.org/10.1086/506151
- R. Bruno and V. Carbone, *The solar wind as a turbulence laboratory*, Living Rev. Solar Phys. 10, 2 (2013). Read in #34's re-review. https://doi.org/10.12942/lrsp-2013-2
- J. J. Podesta, D. A. Roberts and M. L. Goldstein, *Spectral exponents of kinetic and magnetic energy spectra in solar wind turbulence*, ApJ 664, 543 (2007). Search text only. https://doi.org/10.1086/519211
- R. B. Larson, *Turbulence and star formation in molecular clouds*, MNRAS 194, 809 (1981). Read in #34's review and re-review. https://doi.org/10.1093/mnras/194.4.809
- P. M. Solomon, A. R. Rivolo, J. Barrett and A. Yahil, *Mass, luminosity, and line width relations of Galactic molecular clouds*, ApJ 319, 730 (1987). Read in #34's review. https://doi.org/10.1086/165493
- M. H. Heyer and C. M. Brunt, *The universality of turbulence in Galactic molecular clouds*, ApJ 615, L45 (2004). Read in #34's review. https://doi.org/10.1086/425978 (https://arxiv.org/abs/astro-ph/0409420)
- C. Federrath, R. S. Klessen, L. Iapichino and J. R. Beattie, *The sonic scale of interstellar turbulence*, Nature Astronomy 5, 365 (2021). Read in #34's review. https://doi.org/10.1038/s41550-020-01282-z (https://arxiv.org/abs/2011.06238)
- A. A. Goodman, J. A. Barranco, D. J. Wilner and M. H. Heyer, *Coherence in dense cores. II. The transition to coherence*, ApJ 504, 223 (1998). Search text only. https://doi.org/10.1086/306045
- J. E. Pineda et al., *Direct observation of a sharp transition to coherence in dense cores*, ApJ 712, L116 (2010). Search text only. https://doi.org/10.1088/2041-8205/712/1/L116 (https://arxiv.org/abs/1002.2946)
- D. Arzoumanian et al., *Characterizing interstellar filaments with Herschel in IC 5146*, A&A 529, L6 (2011). Read in #34's review. https://doi.org/10.1051/0004-6361/201116596 (https://arxiv.org/abs/1103.0201)
- D. Arzoumanian et al., *Characterizing the properties of nearby molecular filaments observed with Herschel*, A&A 621, A42 (2019). Read in #34's re-review. https://doi.org/10.1051/0004-6361/201832725 (https://arxiv.org/abs/1810.00721)
- J. Maurer and P. Tabeling, *Local investigation of superfluid turbulence*, Europhys. Lett. 43, 29 (1998). Search text only. https://doi.org/10.1209/epl/i1998-00314-9
- C. F. Barenghi, L. Skrbek and K. R. Sreenivasan, *Introduction to quantum turbulence*, PNAS 111 (Suppl. 1), 4647 (2014). Read in #34's review. https://doi.org/10.1073/pnas.1400033111 (https://arxiv.org/abs/1404.1909)
- E. Falgarone, T. G. Phillips and C. K. Walker, *The edges of molecular clouds: fractal boundaries and density structure*, ApJ 378, 186 (1991). Read in #34's review and re-review. https://doi.org/10.1086/170419
- J. Stutzki, *The small scale structure of molecular clouds*, Rev. Mod. Astron. 6, 209 (1993), Fig. 5. Read in #34's review.
- J. Stutzki, F. Bensch, A. Heithausen, V. Ossenkopf and M. Zielinsky, *On the fractal structure of molecular clouds*, A&A 336, 697 (1998). Read in #34's review.
- M. G. R. Vogelaar and B. P. Wakker, *Measuring the fractal structure of interstellar clouds*, A&A 291, 557 (1994). Read in #34's re-review.
- N. Sánchez, E. J. Alfaro and E. Pérez, *The fractal dimension of projected clouds*, ApJ 625, 849 (2005). Read in #34's review and re-review. https://doi.org/10.1086/429553 (https://arxiv.org/abs/astro-ph/0501573)
- S. Lovejoy, *Area-perimeter relation for rain and cloud areas*, Science 216, 185 (1982). Search text only. https://doi.org/10.1126/science.216.4542.185
- K. R. Sreenivasan and C. Meneveau, *The fractal facets of turbulence*, J. Fluid Mech. 173, 357 (1986). Abstract only (#34's review), which gives no numbers; its 1.36 ± 0.05 for iso-concentration and iso-dissipation sections is as Falgarone et al. quote it, jointly with Meneveau 1989.
- C. Meneveau, Ph.D. thesis, Yale University (1989). Not reached; cited as Falgarone et al. 1991 quote it. https://doi.org/10.1017/S0022112086001209
- K. R. Sreenivasan, R. Ramshankar and C. Meneveau, *Mixing, entrainment and fractal dimensions of surfaces in turbulent flows*, Proc. R. Soc. Lond. A 421, 79 (1989). Search text only. https://doi.org/10.1098/rspa.1989.0004
- P. Constantin, I. Procaccia and K. R. Sreenivasan, *Fractal geometry of isoscalar surfaces in turbulence: theory and experiments*, Phys. Rev. Lett. 67, 1739 (1991). Abstract only; it gives no number. https://doi.org/10.1103/PhysRevLett.67.1739
- K. P. Iyer, J. Schumacher, K. R. Sreenivasan and P. K. Yeung, *Fractal iso-level sets in high-Reynolds-number scalar turbulence*, Phys. Rev. Fluids 5, 044501 (2020). Read in #34's review and re-review. https://doi.org/10.1103/PhysRevFluids.5.044501 (https://arxiv.org/abs/1910.00607)
- B. B. Mandelbrot, *The Fractal Geometry of Nature* (W. H. Freeman, 1982). Search text only.
- J. Kondev and C. L. Henley, *Geometrical exponents of contour loops on random Gaussian surfaces*, Phys. Rev. Lett. 74, 4580 (1995). Search text only. https://doi.org/10.1103/PhysRevLett.74.4580
- J. Kondev, C. L. Henley and D. G. Salinas, *Nonlinear measures for characterizing rough surface morphologies*, Phys. Rev. E 61, 104 (2000). Read in #34's review. https://doi.org/10.1103/PhysRevE.61.104 (https://arxiv.org/abs/cond-mat/9907229)

# Halos within halos: how deep the nesting goes, and what stops it

Status: **exploration, not peer reviewed, no new result claimed.** Issue
[#18](https://github.com/Foundation-0/fractals/issues/18).

Dark matter clumps from the bottom up: the smallest halos form first, merge into larger ones, and many survive
inside them as subhalos, which hold sub-subhalos of their own. The nesting cannot go on forever. Below some mass
the dark matter particle itself has smoothed the universe out, and no halo forms. This study computes that floor
for a WIMP and for wave (fuzzy) dark matter from the linear power spectrum. It counts how many levels of nesting
fit between the floor and a Milky Way, and says where the halos stop looking alike before the floor is reached.

## The answer

| Dark matter | Smallest halos (M☉) | Decades below a 10¹² M☉ Milky Way | Levels, at the Aquarius ratio |
|---|---|---|---|
| 100 GeV WIMP (bino), kinetic decoupling at 40 to 10 MeV | 1.6×10⁻⁶ to 1.0×10⁻⁴ | 17.8 to 16.0 | 11 to 9 |
| WIMPs in general (Bringmann 2009) | 10⁻¹¹ to 10⁻³ | 23 to 15 | 14 to 9 |
| Wave, 10⁻²² eV (the lensing notes' benchmark, excluded) | 1.6 to 5.4×10¹⁰ | 1.8 to 1.3 | 1 to 0 |
| Wave, 2 to 2.9×10⁻²¹ eV (Lyman-α; Milky Way satellites) | 1.8 to 9.9×10⁸ | 3.7 to 3.0 | 2 to 1 |
| Wave, 2×10⁻²⁰ eV (Lyman-α, Rogers and Peiris 2021) | 1.4 to 4.6×10⁷ | 4.9 to 4.3 | 3 to 2 |
| Wave, 3×10⁻¹⁹ eV (dwarf galaxies, Dalal and Kravtsov 2022) | 3.7×10⁵ to 1.2×10⁶ | 6.4 to 5.9 | 4 to 3 |
| Wave, 8×10⁻¹⁸ eV (if Ursa Major III is a galaxy, 2025) | 4.6×10³ to 1.6×10⁴ | 8.3 to 7.8 | 5 to 4 |

Each wave mass is the lower bound of the probe named; each assumes the wave is all of the dark matter. The ranges
come from the definition of "smallest" (below) and, for the bino, from the decoupling temperature. A level is a
factor μ = 0.025 in mass: where the subhalo law fitted to the Aquarius simulation expects the largest subhalo of a
host, N(>μM_host) = 1. At 10× per level the bino has 15 to 17 levels; at 100×, 7 or 8.

So the two kinds of dark matter differ by ten decades or more in where the nesting stops. Wave dark matter at the
benchmark mass hardly nests at all: a Milky Way's largest expected subhalo (2.5×10¹⁰ M☉) is already near the
floor. Even at the strongest bound proposed, 8×10⁻¹⁸ eV, its floor sits eight to ten decades above a bino's.

## The WIMP floor

Two effects erase the smallest scales of a WIMP's spectrum (Green, Hofmann and Schwarz 2004, 2005; Loeb and
Zaldarriaga 2005; Bertschinger 2006):

- **Acoustic damping.** Until kinetic decoupling, at T_kd, the WIMPs scatter off the radiation and move with its
  sound waves, which damp out everything inside the horizon. The mass inside the comoving horizon at T_kd,
  with the expansion rate of photons, e± and three neutrinos (g = 10.75), is M_ao = 1.04×10⁻⁴ M☉ at 10 MeV,
  falling as T_kd⁻³. Loeb and Zaldarriaga give 10⁻⁴ (T_d/10 MeV)⁻³ M☉.
- **Free streaming.** After decoupling the WIMPs coast. A 100 GeV WIMP decoupling at 30 MeV has a speed spread
  √(T_kd/m) and coasts s = 0.86 pc (comoving), so modes shorter than k_fs = √2/s = 1.64×10⁶ Mpc⁻¹ are smeared
  out. Green, Hofmann and Schwarz give 1.70×10⁶ Mpc⁻¹, 4% higher, with the same scaling in mass and temperature.

The floor is the larger of the two (Bringmann 2009). For a bino decoupling at 10 to 40 MeV the acoustic mass is
the larger, or comparable to the half-mode mass at 30 to 40 MeV. Across WIMP models Bringmann finds floors from
about 10⁻¹¹ to nearly 10⁻³ M☉.

**"About 10⁻⁶ M☉" is a convention.** The same cut-off gives 1.05×10⁻⁶ M☉ for a sphere of radius π/k_fs, the
reading under which Green, Hofmann and Schwarz's "about 10⁻⁶ M☉" and "comoving radius of about 1 pc" agree. The
half-mode mass, where the transfer function falls to 1/2, is 4.3×10⁻⁶; the half-power mass, where it falls to
1/√2, is 1.2×10⁻⁵. That is a factor of 11, one decade of the answer.

## The wave floor

A wave of mass m cannot be squeezed below its Jeans length: quantum pressure beats gravity for wavenumbers above
k_J = (16πGρ)^¼ (m/ħ)^½. The cut-off this imprints on the spectrum (Hu, Barkana and Gruzinov 2000) falls to half
power at k_½ = 4.58 m₂₂^(4/9) Mpc⁻¹ (they quote 4.5), with m₂₂ = m/10⁻²² eV.

**Which mass is "the smallest wave halo"** matters more here than for WIMPs. At 10⁻²² eV:

| Definition | Mass (M☉) |
|---|---|
| Half power, T² = 1/2 | 5.4×10¹⁰ |
| Half mode, T = 1/2 | 3.9×10¹⁰ |
| Schive et al. (2016): the halo mass function turns down at M₀ = 1.6×10¹⁰ m₂₂^(−4/3) | 1.6×10¹⁰ |
| Jeans mass today, a sphere of diameter λ_J (Hui et al. 2017's 1.5×10⁷) | 1.5×10⁷ |
| Jeans mass at matter-radiation equality, same sphere | 6.9×10⁹ |
| Jeans mass today, other spheres: radius λ_J, radius 1/k_J | 1.2×10⁸, 5.0×10⁵ |

The first three mark where halos become rare, and the table above uses them. The Jeans mass today is a lower
bound on any halo, not the floor of the population, which Schive et al.'s fit already suppresses steeply below M₀,
three decades higher. The Jeans masses alone span a factor 10⁵ between definitions and epochs. They scale as m^(−3/2),
the population floor as m^(−4/3). At 2×10⁻²⁰ eV the population floor is 1.4 to 4.6×10⁷ M☉. The fits were
calibrated near 10⁻²² eV, so the rows at 3×10⁻¹⁹ eV and above are extrapolations.

**The wave clock and the Jeans scale.** In the Witness Map's terms, the wave clock m·Δx²/ħ at Δx = 1/k_J equals
1/(4√(πGρ)), gravity's own clock: the Jeans condition restated, checked here with the Witness Map's constants. At
Δx = λ_J/2 = π/k_J the clock is π² longer, so the factor is a convention. The often-quoted
k_J = 66.5 a^¼ m₂₂^½ Mpc⁻¹ uses the dark matter density alone (0.12 ρ_crit/h²); all matter gives 69.5.

**The smallest wave structure: the soliton.** At the centre of every wave halo the wave settles into its ground
state, the soliton (the Witness Map's `SOL`, which solves the Schrödinger–Poisson equations). Mass times size is
fixed: M r_c = 2.68 ħ²/(Gm²), with r_c the half-density radius, and the mass inside r_c times r_c is
0.633 ħ²/(Gm²). That is 5.4×10¹² (m/10⁻²³ eV)⁻² M☉ pc; Schive, Chiueh and Broadhurst's fitted profile gives
5.5×10¹². A gravitational atom (the same wave around a point mass, see
[gravitational-atom](../gravitational-atom/)) has M r_½ = (ln 2/2) ħ²/(Gm²) = 0.347 ħ²/(Gm²) with the same
combination. The soliton is that atom with its own mass for a nucleus, spread through it, and 7.7 times larger.

## How many levels

Springel et al.'s Aquarius halo (2008) follows dN/dM = a₀ (M/m₀)^−1.9 above about 10⁵ M☉. Extended down to each
floor, the law gives the counts in [`table.mjs`](table.mjs): 5.7×10¹⁴ to 1.05×10¹⁵ subhalos above 10⁻⁶ M☉ in a
Milky Way, against Diemand, Moore and Stadel's "over 10¹⁵" (2005). The levels are a separate count. Each level's
largest subhalo, where the law expects one, is μ = 0.025 of its host (1.6 decades per level). Aquarius itself
resolves "up to four generations" of subhalos within subhalos, and four levels at this ratio reach 9×10⁵ M☉,
within its resolved range.

Two cautions. The extrapolation runs 11 to 21 decades below where the law was fitted, and assumes that what forms
survives. Whether microhalos survive in the Galaxy is disputed. Zhao et al. (2007) argue that encounters with
stars turn the ones near the Sun into streams; Moore et al. (2005) and Goerdt et al. (2007) find that their dense
centres survive; van den Bosch et al. (2018) argue that much of the disruption seen in simulations is numerical.
The second caution is that μ sets the levels, not the decades: at 10× per level the bino has 17, at μ it has 10.

## Why small halos form almost together, and where they stop looking alike

On small scales the CDM spectrum's effective slope approaches −3, where every mass would collapse at once. It gets
there only logarithmically: n_eff = −2.15 at 10¹² M☉, −2.84 at 10⁻⁶ M☉. So σ(M), the typical fluctuation, grows
only elevenfold over those eighteen decades (2.2 to 24), and without a cut-off halos from 10⁻¹² to 10⁻³ M☉, nine
decades, all collapse within 157 million years (z = 24 to 14).

For the bino the first halos (1σ, half-mode mass) collapse at z ≈ 16, or 10 to 12 once the dark matter is let lag
the gas, which never falls into wells this small. Green, Hofmann and Schwarz give z = 60 ± 20. Most of the gap is
inputs and definition: with WMAP-era round numbers (n_s = 1, σ₈ = 0.9) the same model gives z = 22.5 at 1σ and 46
at 2σ, and with Planck 2018 a 3.5σ peak reaches z = 60. Their inputs were not seen, so this is a comparison, not
a check.

The shapes stop being alike before the floor. Halos near the cut-off form with steeper ρ ∝ r^−1.5 "prompt cusps",
not the r^−1 centres of larger halos (Ishiyama 2014; Angulo et al. 2017; Delos and White 2023). The inner slope is
still about −1.3 at fifty times the cut-off mass (Ishiyama 2014), and the cusps survive inside the halos built
from them. Wang et al. (2020) found halo structure nearly universal over 20 decades of mass, from an Earth mass to
clusters. Those halos were isolated, each in a region of its own size, not a chain of halos inside halos.

## The spectrum twenty decades down

The floors sit on Eisenstein and Hu's (1998) fit, extrapolated twenty decades in mass below where it was made. As a
check, `model.js` integrates the radiation-era perturbations itself (Ma and Bertschinger 1995). A mode entering the
horizon kicks the dark matter logarithmically, δ_c → −A ln(B kτ), and Mészáros growth then gives the transfer
function's tail. With the neutrinos streaming freely, as in the Boltzmann code Eisenstein and Hu fitted, their
tail agrees with this one to 1.5% from 10³ to 10⁹ h/Mpc. The bino's modes, though, entered the horizon before the
neutrinos decoupled, at about 1 MeV, so the neutrinos were still a fluid. That tail is 10% lower. It lowers
σ at the bino half-mode mass from 23.0 to 22.3 and z_c from 16.3 to 15.8, and leaves the floors where they are:
they come from the cut-off, not from the spectrum's amplitude.

## Run it

```
node halos/table.mjs     # the tables above and more, under a second
npm test                 # all studies' checks, including tests/halos.mjs
```

`model.js` needs [`cosmic-homogeneity/homogeneity.js`](../cosmic-homogeneity/) for the transfer function and
growth factor. The tests and table also load [`witness-map/model.js`](../witness-map/) for its constants and its
soliton.

## Checks

`tests/halos.mjs` compares the model with published values and with exact results:

- the free-streaming wavenumber and the cut-off and collisional damping masses of Green, Hofmann and Schwarz;
- the acoustic mass against Loeb and Zaldarriaga (within ×1.5) and Cornell, Profumo and Shepherd (within ×2);
- Hu, Barkana and Gruzinov's Jeans wavenumber at equality and half-power wavenumber, the 66.5 Mpc⁻¹ form with
  the density it needs, and Hui et al.'s Jeans mass;
- the soliton's M r_c against Schive, Chiueh and Broadhurst;
- the Aquarius law against Diemand, Moore and Stadel's count;
- the radiation-era kick against its closed form, and Eisenstein and Hu's tail against the derived one.

Two comparisons are notes, not checks: Aquarius's four generations, and the first halos' redshift. Values marked
"as seen in search text" in the checks were read in search results or abstracts, not in the papers.

## What the model leaves out

- Linear theory and spherical collapse throughout. No halo mass function near the cut-off: simulations find
  subhalos strongly suppressed below the free-streaming scale (Ishiyama and Ando 2020), and how the mass
  function turns over against the free-streaming scale is studied by Schneider, Smith and Reed (2013).
- The WIMP transfer function's polynomial prefactor, (1 − (2/3)(k/k_fs)²), is recalled; the papers' text seen
  describes it only as a polynomial times an exponential. A plain Gaussian with the same k_fs moves the half-mode
  mass from 4.3 to 1.8×10⁻⁶ M☉.
- The acoustic mass is the dark matter inside the horizon, an order-of-magnitude scale; Bringmann (2009) finds
  the true cut-off typically about ten times above such estimates. g = 10.75 holds between about 1 and 100 MeV.
- The spectrum has no running of the spectral index: ±0.01 moves the bino's σ by −24% / +38% and z_c to 12 to 23.
  Massive neutrinos and the QCD transition's imprint on modes above about 10⁶ Mpc⁻¹ are ignored.
- The subhalo law is extrapolated over 11 to 21 decades with no tidal losses, and the levels assume a fixed μ.
- The wave fits are of N-body simulations with wave initial conditions (Schive et al. 2016) or of the linear
  spectrum; full wave simulations shift M₀ (May and Springel 2023).

## Sources

- A. M. Green, S. Hofmann and D. J. Schwarz, *The power spectrum of SUSY-CDM on sub-galactic scales*, MNRAS 353, L23 (2004). https://arxiv.org/abs/astro-ph/0309621
- A. M. Green, S. Hofmann and D. J. Schwarz, *The first WIMPy halos*, JCAP 0508, 003 (2005). https://arxiv.org/abs/astro-ph/0503387
- A. M. Green, S. Hofmann and D. J. Schwarz, *Small scale WIMP physics* (2005). https://arxiv.org/abs/astro-ph/0508553
- A. Loeb and M. Zaldarriaga, *The small-scale power spectrum of cold dark matter*, Phys. Rev. D 71, 103520 (2005). https://arxiv.org/abs/astro-ph/0504112
- E. Bertschinger, *Effects of cold dark matter decoupling and pair annihilation on cosmological perturbations*, Phys. Rev. D 74, 063509 (2006). https://arxiv.org/abs/astro-ph/0607319
- T. Bringmann, *Particle models and the small-scale structure of dark matter*, New J. Phys. 11, 105027 (2009). https://arxiv.org/abs/0903.0189
- J. M. Cornell, S. Profumo and W. Shepherd, Phys. Rev. D 88, 015027 (2013). https://arxiv.org/abs/1305.4676
- J. Diemand, B. Moore and J. Stadel, *Earth-mass dark-matter haloes as the first structures in the early Universe*, Nature 433, 389 (2005). https://arxiv.org/abs/astro-ph/0501589
- V. Springel et al., *The Aquarius Project: the subhaloes of galactic haloes*, MNRAS 391, 1685 (2008). https://arxiv.org/abs/0809.0898
- D. Erkal et al., *The number and size of subhalo-induced gaps in stellar streams* (2016), for the Aquarius fit's parameters. https://arxiv.org/abs/1606.04946
- J. Wang et al., *Universal structure of dark matter haloes over a mass range of 20 orders of magnitude*, Nature 585, 39 (2020). https://arxiv.org/abs/1911.09720
- T. Ishiyama, *Hierarchical formation of dark matter halos and the free streaming scale*, ApJ 788, 27 (2014). https://arxiv.org/abs/1404.1650
- T. Ishiyama and S. Ando, *The abundance and structure of subhaloes near the free streaming scale* (2020). https://arxiv.org/abs/1907.03642
- R. E. Angulo, O. Hahn, A. D. Ludlow and S. Bonoli, *Earth-mass haloes and the emergence of NFW density profiles*, MNRAS 471, 4687 (2017). https://arxiv.org/abs/1604.03131
- M. S. Delos and S. D. M. White, *Inner cusps of the first dark matter haloes: formation and survival in a cosmological context*, MNRAS 518, 3509 (2023). https://arxiv.org/abs/2207.05082
- H. Zhao, D. Hooper, G. W. Angus, J. E. Taylor and J. Silk, *Tidal disruption of the first dark microhalos*, ApJ 654, 697 (2007). https://arxiv.org/abs/astro-ph/0508215
- B. Moore, J. Diemand, J. Stadel and T. Quinn (2005). https://arxiv.org/abs/astro-ph/0502213
- A. Goerdt, O. Y. Gnedin, B. Moore, J. Diemand and J. Stadel, MNRAS 375, 191 (2007). https://arxiv.org/abs/astro-ph/0608495
- F. C. van den Bosch, G. Ogiya, O. Hahn and A. Burkert, *Disruption of dark matter substructure: fact or fiction?*, MNRAS 474, 3043 (2018). https://arxiv.org/abs/1711.05276
- A. Schneider, R. E. Smith and D. Reed, *Halo mass function and the free streaming scale*, MNRAS 433, 1573 (2013). https://arxiv.org/abs/1303.0839
- W. Hu, R. Barkana and A. Gruzinov, *Cold and fuzzy dark matter*, Phys. Rev. Lett. 85, 1158 (2000). https://arxiv.org/abs/astro-ph/0003365
- L. Hui, J. P. Ostriker, S. Tremaine and E. Witten, *Ultralight scalars as cosmological dark matter*, Phys. Rev. D 95, 043541 (2017). https://arxiv.org/abs/1610.08297
- D. J. E. Marsh, *Axion cosmology*, Phys. Rep. 643, 1 (2016). https://arxiv.org/abs/1510.07633; the 66.5 form as quoted by M. Kulkarni and J. P. Ostriker. https://arxiv.org/abs/2011.02116
- H.-Y. Schive, T. Chiueh and T. Broadhurst, *Cosmic structure as the quantum interference of a coherent dark wave*, Nature Phys. 10, 496 (2014). https://arxiv.org/abs/1406.6586
- H.-Y. Schive, T. Chiueh, T. Broadhurst and K.-W. Huang, *Contrasting galaxy formation from quantum wave dark matter, ψDM, with ΛCDM, using Planck and Hubble data*, ApJ 818, 89 (2016). https://arxiv.org/abs/1508.04621
- S. May and V. Springel, MNRAS 524, 4256 (2023).
- V. Iršič, M. Viel, M. G. Haehnelt, J. S. Bolton and G. D. Becker, *First constraints on fuzzy dark matter from Lyman-α forest data and hydrodynamical simulations*, Phys. Rev. Lett. 119, 031302 (2017). https://arxiv.org/abs/1703.04683
- E. Armengaud, N. Palanque-Delabrouille, C. Yèche, D. J. E. Marsh and J. Baur, *Constraining the mass of light bosonic dark matter using SDSS Lyman-α forest*, MNRAS 471, 4606 (2017). https://arxiv.org/abs/1703.09126
- K. K. Rogers and H. V. Peiris, *Strong bound on canonical ultralight axion dark matter from the Lyman-alpha forest*, Phys. Rev. Lett. 126, 071302 (2021). https://arxiv.org/abs/2007.12705
- E. O. Nadler et al. (DES), *Constraints on dark matter properties from observations of Milky Way satellite galaxies*, Phys. Rev. Lett. 126, 091101 (2021). https://arxiv.org/abs/2008.00022
- N. Dalal and A. Kravtsov, *Excluding fuzzy dark matter with sizes and stellar kinematics of ultrafaint dwarf galaxies*, Phys. Rev. D 106, 063517 (2022). https://arxiv.org/abs/2203.05750
- S. May, N. Dalal and A. Kravtsov, *Updated bounds on ultra-light dark matter from the tiniest galaxies* (2025). https://arxiv.org/abs/2509.02781
- C.-P. Ma and E. Bertschinger, *Cosmological perturbation theory in the synchronous and conformal Newtonian gauges*, ApJ 455, 7 (1995). https://arxiv.org/abs/astro-ph/9506072
- D. J. Eisenstein and W. Hu, *Baryonic features in the matter transfer function*, ApJ 496, 605 (1998). https://arxiv.org/abs/astro-ph/9709112
- Planck Collaboration, *Planck 2018 results. VI. Cosmological parameters*, A&A 641, A6 (2020). https://arxiv.org/abs/1807.06209

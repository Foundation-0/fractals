# Halos within halos: how deep the nesting goes, and what stops it

Status: **exploration, not peer reviewed, no new result claimed.** Issue
[#18](https://github.com/Foundation-0/fractals/issues/18).

Dark matter clumps from the bottom up: the smallest halos form first, merge into larger ones, and many survive
inside them as subhalos, which hold sub-subhalos of their own. The nesting cannot go on forever. Below some mass
the dark matter particle itself has smoothed the universe out, and no halo forms. This study computes that floor
for a WIMP and for wave (fuzzy) dark matter from the linear power spectrum. It counts how many levels of nesting
fit between the floor and a Milky Way, and asks whether the halos stop looking alike before the floor is reached.

## The answer

| Dark matter | Smallest halos (M☉) | Decades below a 10¹² M☉ Milky Way | Levels at the Aquarius ratio (an upper bound) |
|---|---|---|---|
| 100 GeV WIMP (bino), kinetic decoupling at 40 to 10 MeV | 1.4×10⁻⁶ to 1.0×10⁻⁴ | 17.9 to 16.0 | 11 to 9 |
| WIMPs in general (Bringmann 2009; his 10⁻¹¹ to 10⁻³ counts the dark matter alone) | 1.2×10⁻¹¹ to 1.2×10⁻³ | 23 to 15 | 14 to 9 |
| Wave, 10⁻²² eV (the lensing notes' benchmark, excluded) | 1.6 to 5.4×10¹⁰ | 1.8 to 1.3 | 1 to 0 |
| Wave, 2 to 2.9×10⁻²¹ eV (Lyman-α; Milky Way satellites) | 1.8 to 9.9×10⁸ | 3.7 to 3.0 | 2 to 1 |
| Wave, 2×10⁻²⁰ eV (Lyman-α, Rogers and Peiris 2021) | 1.4 to 4.6×10⁷ | 4.9 to 4.3 | 3 to 2 |
| Wave, 3×10⁻¹⁹ eV (dwarf galaxies, Dalal and Kravtsov 2022) | 3.7×10⁵ to 1.2×10⁶ | 6.4 to 5.9 | 4 to 3 |
| Wave, 8×10⁻¹⁸ eV (if Ursa Major III is a galaxy, 2025) | 4.6×10³ to 1.6×10⁴ | 8.3 to 7.8 | 5 to 4 |

Each wave mass is the lower bound of the probe named (as seen in search text; checked in review); each assumes the
wave is all of the dark matter. The ranges come from the definition of "smallest" (below) and, for the bino, from
the decoupling temperature. A level is a factor μ = 0.025 in mass: where the subhalo law fitted to the Aquarius
simulation expects the largest subhalo of a host, N(>μM_host) = 1. Using that ratio at every level is the
self-similar case, which Springel et al. (2008) call an upper limit: they find sub-subhalos 2 or 3 times fewer.
With that at every level below the first, the bino has 9 to 8 or 8 to 7 levels, Bringmann's range 11 to 7 or 10 to
7, and no wave row loses more than one. μ is measured against the host's M200; against M50, the mass inside the
radius where the law was fitted, it is 0.018, and counted down from M50 the levels drop by up to one. The bino's 9
at 10 MeV is a knife edge between 9 and 10 (below). At 10× per level the bino has 15 to 17 levels; at 100×, 7 or 8.

So the two kinds of dark matter stop nesting eleven decades or more apart at the Lyman-α bounds, and eight to ten
apart at the strongest bound proposed, 8×10⁻¹⁸ eV. Wave dark matter at the benchmark mass hardly nests at all: a
Milky Way's largest expected subhalo (2.5×10¹⁰ M☉) is already near the floor.

## The WIMP floor

Two effects erase the smallest scales of a WIMP's spectrum (Green, Hofmann and Schwarz 2004, 2005; Loeb and
Zaldarriaga 2005; Bertschinger 2006):

- **Acoustic damping.** Until kinetic decoupling, at T_kd, the WIMPs scatter off the radiation and move with its
  sound waves, which damp out everything inside the horizon. The matter inside the comoving horizon at T_kd is
  M_ao = 1.03×10⁻⁴ M☉ at 10 MeV, falling roughly as T_kd⁻³. Loeb and Zaldarriaga give 10⁻⁴ (T_d/10 MeV)⁻³ M☉.
  The expansion rate comes from the radiation then: photons, neutrinos and e± (g = 10.75), joined above about
  10 MeV by muons and pions (g = 12.6 at 30 MeV).
- **Free streaming.** After decoupling the WIMPs coast. A 100 GeV WIMP decoupling at 30 MeV has a speed spread
  √(T_kd/m) and coasts s = 0.84 pc (comoving, through e± annihilation and on to today), so modes shorter than
  k_fs = √2/s = 1.68×10⁶ Mpc⁻¹ are smeared out. Green, Hofmann and Schwarz give 1.70×10⁶ Mpc⁻¹, 1.4% higher; from
  10 to 40 MeV theirs runs from 5.4% higher to 1.1% lower, as the radiation's g changes. The floors below use
  Green, Hofmann and Schwarz's k_fs and its T_kd scaling; the derived value is a check on it.

The floor is the larger of the two (Bringmann 2009). For a bino decoupling at 10 to 40 MeV the acoustic mass is
larger than the free-streaming mass M(π/k_fs) throughout, and comparable to the half-mode mass at 30 to 40 MeV.
Across WIMP models Bringmann finds floors from about 10⁻¹¹ to nearly 10⁻³ M☉. He writes both masses with the dark
matter density ρ_χ, as Cornell, Profumo and Shepherd (2013) write the acoustic mass. Every mass here counts all the
matter, 1.19 times more (0.07 decades), so the answer table converts his range. In his convention the bino at 10
MeV has 10.01 levels at μ instead of 9.97, so its count sits on the edge between 9 and 10.

**"About 10⁻⁶ M☉" is a convention.** The same cut-off gives 1.05×10⁻⁶ M☉ for a sphere of radius π/k_fs = 1.85 pc,
which is how Green, Hofmann and Schwarz define their "about 10⁻⁶ M☉" (2004 and 2005, as #35's review read them;
9×10⁻⁷ for their 2004 model A). Their "comoving radius of about 1 pc" agrees with it only to a factor 2 (a sphere
of radius 1 pc holds 1.7×10⁻⁷ M☉). The half-mode mass, where the transfer function falls to 1/2, is 4.3×10⁻⁶; the
half-power mass, where it falls to 1/√2, is 1.2×10⁻⁵. That is a factor of 11, one decade of the answer. The
transfer function, T = [1 − (2/3)(k/k_fs)²] exp[−(k/k_fs)² − (k/k_d)²] (in Green, Hofmann and Schwarz's JCAP paper,
the equations labelled dfs and dk in its arXiv source), is stated for k < k_fs, and both lie inside that range
(0.625 and 0.45 k_fs). A plain Gaussian with the same k_fs would move the half-mode mass from 4.3 to 1.8×10⁻⁶ M☉.

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
| Jeans mass today, a sphere of diameter λ_J (Hui et al. 2017's sphere, here in all the matter) | 1.5×10⁷ |
| Jeans mass at matter-radiation equality, same sphere | 6.9×10⁹ |
| Jeans mass today, other spheres: radius λ_J, radius 1/k_J | 1.2×10⁸, 5.0×10⁵ |

The first three mark where halos become rare, and the table above uses them. The Jeans mass today is a lower
bound on any halo, not the floor of the population, which Schive et al.'s fit already suppresses steeply below M₀,
three decades higher. The Jeans masses alone span a factor 10⁵ between definitions and epochs. They scale as
m^(−3/2), the population floor as m^(−4/3). At 2×10⁻²⁰ eV the population floor is 1.4 to 4.6×10⁷ M☉.

Every row at a bound is an extrapolation. Hu, Barkana and Gruzinov's cut-off was computed near 10⁻²² eV, and Schive
et al. fitted M₀ to runs at 0.8 to 3.2×10⁻²² eV and flag it as uncertain below 10⁹ M☉ (as #35's review read them).
At 2×10⁻²⁰ eV the particle is about 60 times heavier than the heaviest fitted. There Rogers and Peiris quote a
half-mode mass of 7.2×10⁷ M☉, in a convention matched to warm dark matter (Drlica-Wagner et al. 2019); that is 2.1
times the 3.4×10⁷ here.

**The wave clock and the Jeans scale.** In the Witness Map's terms, the wave clock m·Δx²/ħ at Δx = 1/k_J equals
1/(4√(πGρ)), gravity's own clock: the Jeans condition restated, an identity for any constants. At Δx = λ_J/2 =
π/k_J the clock is π² longer, so the factor is a convention. The often-quoted k_J = 66.5 a^¼ m₂₂^½ Mpc⁻¹ (Marsh
2016; the equation labelled axion_jeans in the arXiv source) uses the dark matter density alone (0.12 ρ_crit/h²);
all matter gives 69.5. Hui et al.'s M_J = 1.5×10⁷ m₂₂^(−3/2) M☉ (the equation labelled jeans) also uses the wave's
own density, with Ω = 0.27 and h = 0.7: there this model gives 1.505×10⁷. At Planck 2018 it gives 1.47×10⁷ in the
dark matter alone and 1.54×10⁷ in all the matter.

**The smallest wave structure: the soliton.** At the centre of every wave halo the wave settles into its ground
state, the soliton (the Witness Map's `SOL`, which solves the Schrödinger–Poisson equations). Mass times size is
fixed: M r_c = 2.68 ħ²/(Gm²), with r_c the half-density radius, and the mass inside r_c times r_c is
0.633 ħ²/(Gm²). That is 5.4×10¹² (m/10⁻²³ eV)⁻² M☉ pc. Schive, Chiueh and Broadhurst's core mass-radius relation
(their Supplementary Information), M_c ≈ 5.5×10⁹ (m/10⁻²³ eV)⁻² (r_c/kpc)⁻¹ M☉, gives 5.5×10¹²; their fitted
profile, integrated to r_c, gives 5.3×10¹². A gravitational atom (the same wave around a point mass, see
[gravitational-atom](../gravitational-atom/)) has M r_½ = (ln 2/2) ħ²/(Gm²) = 0.347 ħ²/(Gm²) with the same
combination. The soliton is that atom with its own mass for a nucleus, spread through it, and 7.7 times larger.

## How many levels

Springel et al.'s Aquarius halo (2008) follows dN/dM = a₀ (M/m₀)^−1.9 above about 10⁵ M☉. Extended down to each
floor, the law gives the counts in [`table.mjs`](table.mjs). Above 10⁻⁶ M☉ it gives 1.05×10¹⁵ subhalos in Aq-A
(1.84×10¹² M☉) and 5.7×10¹⁴ in a 10¹² M☉ host ([`tests/halos.mjs`](../tests/halos.mjs)), tides ignored. Diemand,
Moore and Stadel (2005) find "over 10¹⁵" that survive: Aq-A's count clears that by 5%, and the lighter host falls
short by a factor 1.75. Their own M^−1.9 law, extrapolated the same way, gives about 5×10¹⁵. Like for like, the
Aquarius law gives 4.8 times fewer for Aq-A and 8.8 times fewer for the 10¹² M☉ host; they give no host mass. The
levels are a separate count. Each level's largest subhalo, where the law expects one, is μ = 0.025 of its host (1.6
decades per level), an upper bound (above). Aquarius itself resolves "up to four generations" of subhalos within
subhalos, and four levels at Aq-A's own ratio (0.027) reach 9×10⁵ M☉, within its resolved range. With sub-subhalos
2 or 3 times fewer, four levels reach 9×10⁴ to 2×10⁴ M☉, at or below the law's fitted range.

Two cautions. The extrapolation runs 9 to 11 decades below where the law was fitted for the bino (8 to 16 across
Bringmann's WIMP range, at most 1.3 for the wave masses at the bounds listed), and assumes that what forms
survives. Whether microhalos survive in the Galaxy is disputed. Zhao et al. (2007) argue that encounters with stars
turn the ones near the Sun into streams; Moore et al. (2005) and Goerdt et al. (2007) find that their dense centres
survive; van den Bosch et al. (2018) argue that much of the disruption seen in simulations is numerical. The second
caution is that μ sets the levels, not the decades: at 10× per level the bino has 15 to 17, at μ 9 to 11, and
7 to 9 with fewer sub-subhalos.

## Why small halos form almost together, and whether they stop looking alike

On small scales the CDM spectrum's effective slope approaches −3, where every mass would collapse at once. It gets
there only logarithmically: n_eff = −2.15 at 10¹² M☉, −2.84 at 10⁻⁶ M☉. So σ(M), the typical fluctuation, grows
only elevenfold over those eighteen decades (2.2 to 24), and without a cut-off halos from 10⁻¹² to 10⁻³ M☉, nine
decades, all collapse within 157 million years (z = 24 to 14).

For the bino the first halos (1σ, half-mode mass) collapse at z ≈ 16, or 11 to 13 once the dark matter grows
alone: the gas never falls into wells this small, which the growth factor assumes it does after the drag epoch.

Green, Hofmann and Schwarz's z = 60 ± 20 (JCAP 2005, section "The first structures") is a different quantity. It is
z_nl, the redshift at which typical fluctuations reach σ(R, z_nl) = 1, with a top-hat window, σ₈ = 0.9, n = 1 and
the baryons ignored; they put Nσ peaks at about 60N. The same definition here, at M_hm to M(π/k_fs), gives z_nl =
28 to 29 with Planck 2018, 39 with WMAP-era round numbers (h = 0.7, Ω_m = 0.3, n_s = 1, σ₈ = 0.9), and 44 to 45
with those numbers and the baryons removed, inside their range. A factor of about 1.3 in 1 + z remains. At this
model's own threshold, 1.686, the WMAP-era numbers collapse 1σ and 2σ peaks at z = 22.5 and 46, and with Planck
2018 collapse at z = 60 takes a 3.5σ peak (reaching δ = 1 there, their threshold, takes 2.1σ). These use the growth
factor without the baryon lag, as Green, Hofmann and Schwarz ignore the baryons; with the lag, z = 60 takes 3.7 to
4.4σ.

Halos near the cut-off form with a different shape: steeper ρ ∝ r^−1.5 centres, prompt cusps, not the r^−1 centres
of larger halos (Ishiyama 2014; Angulo et al. 2017; Delos and White 2023). Phase-space simulations free of
artificial fragmentation find them too (Ondaro-Mallea et al. 2024, as seen in search text). The inner slope is
still about −1.3 at fifty times the cut-off mass (Ishiyama 2014). Whether the shapes stay different inside the
halos built from them is contested. Delos and White find that the cusps survive, at the smallest radii the
simulations resolve; Angulo et al. find that major mergers flatten them. J. Wang et al. (2020) find NFW and Einasto
profiles, nearly universal over 20 decades of mass from an Earth mass to clusters, and Delos and White suggest the
cusps lie at radii those simulations do not resolve. Y. Wang, Bose, Frenk and Jenkins (2025, as seen in search
text) find the whole profile turning NFW-like while the cusp stays visible in the particles of the original peak:
"buried but not destroyed". J. Wang et al. zoomed eight times, each time into a smaller region of the previous
level chosen to avoid any massive halo: their 20 decades are field halos of many masses, not a chain of halos
inside halos.

## The spectrum twenty decades down

σ(M) and the collapse redshifts sit on Eisenstein and Hu's (1998) fit, extrapolated twenty decades in mass below
where it was made. As a check, `model.js` integrates the radiation-era perturbations itself (Ma and Bertschinger
1995). A mode entering the horizon kicks the dark matter logarithmically, δ_c → −A ln(B kτ), and Mészáros growth
then gives the transfer function's tail. With the neutrinos streaming freely, as in the Boltzmann code Eisenstein
and Hu fitted, their tail agrees with this one to 1.5% from 10³ to 10⁹ h/Mpc. The bino's modes, though, entered
the horizon before the neutrinos decoupled, at about 1 MeV, so the neutrinos were still a fluid. That tail is 10%
lower. It lowers σ at the bino half-mode mass from 23.0 to 22.3 and z_c from 16.3 to 15.8, and leaves the floors
where they are: they come from the cut-off, not from the spectrum's amplitude.

## Run it

```
node halos/table.mjs     # the tables above and more, under a second
npm test                 # all studies' checks, including tests/halos.mjs
```

`model.js` needs [`cosmic-homogeneity/homogeneity.js`](../cosmic-homogeneity/) for the transfer function and
growth factor. The tests and table also load [`witness-map/model.js`](../witness-map/) for its constants and its
soliton.

## Checks

`tests/halos.mjs` compares the model with published values, exact results and its own numerics:

- the free-streaming wavenumber and the cut-off and collisional damping masses of Green, Hofmann and Schwarz;
- the acoustic mass against Loeb and Zaldarriaga (within ×1.5) and, in the dark matter alone, against Cornell,
  Profumo and Shepherd, who count only that (within ×2; it is 1.24 times theirs);
- Hu, Barkana and Gruzinov's Jeans wavenumber at equality and half-power wavenumber, the 66.5 Mpc⁻¹ form with the
  density it needs, and Hui et al.'s Jeans mass at their normalisation (within 1%);
- the Jeans wavenumber found by bisection against its closed form (a check of the numerics in `jeans()`);
- the soliton's M r_c against Schive, Chiueh and Broadhurst's core mass-radius relation;
- the Aquarius normalisation scaled from Aq-A to a 10¹² M☉ host against the quoted one (a guard on the transcribed
  constants);
- Aq-A's count above 10⁻⁶ M☉ against the "over 10¹⁵" that Diemand, Moore and Stadel find survive (a 5% margin);
- the radiation-era kick against its closed form, and Eisenstein and Hu's tail against the derived one;
- σ(M) against a direct quadrature, and its convergence in the grid.

Four comparisons are notes, not checks: the fluid-neutrino tail; Aquarius's four generations; Diemand, Moore and
Stadel's own extrapolated total, about 5×10¹⁵ above 10⁻⁶ M☉, which the Aquarius law falls short of by 4.8 to 8.8
times; and the onset of nonlinearity for typical fluctuations against Green, Hofmann and Schwarz's z = 60 ± 20.

## What the model leaves out

- Linear theory and spherical collapse throughout. No halo mass function near the cut-off: simulations find
  subhalos strongly suppressed below the free-streaming scale (Ishiyama and Ando 2020), and how the mass
  function turns over against the free-streaming scale is studied by Schneider, Smith and Reed (2013).
- The acoustic mass is the matter (dark matter and baryons, the convention for every mass here) inside the horizon,
  an order-of-magnitude scale; the dark matter alone, which Bringmann and Cornell et al. use, is 16% less.
  Bringmann (2009) finds that working out T_kd properly puts a given model's cut-off typically about ten times
  above earlier order-of-magnitude estimates (as seen in search text; checked in review); here T_kd is an input, so
  that uncertainty enters through it.
- The thermal history is ideal gases in equilibrium, with the neutrinos decoupling at once at 1 MeV. It leaves out
  kaons and heavier hadrons, which would add about 1% to g at 70 MeV and 7% at 100 MeV (#35's review's own
  calculation agreed); it is used here only up to 50 MeV (0.1%). The particle masses in it are recalled.
- The spectrum has no running of the spectral index: a running of −0.01 / +0.01 moves the bino's σ by −29% / +49%
  and z_c to 11 / 25. Massive neutrinos and the QCD transition's imprint on modes above about 10⁶ Mpc⁻¹ are
  ignored.
- Whether the matter's or the dark matter's contrast must reach 1.686 when the gas stays smooth is left open,
  hence 11 to 13 for the bino's first halos.
- The subhalo law is extrapolated over up to 16 decades (9 to 11 for the bino) with no tidal losses, and the
  levels assume the host's μ at every level, an upper bound.
- The wave fits are of N-body simulations with wave initial conditions (Schive et al. 2016) or of the linear
  spectrum. The first halo mass function from a fully self-consistent wave simulation (May and Springel 2023:
  7×10⁻²³ eV, z = 3, 68 haloes) agrees broadly with Schive et al.'s fit, but has too few haloes to test M₀ precisely.

## Sources

The authors read published values in abstracts and search results ("as seen in search text" in the checks and
code), not in the papers' full texts, except where marked recalled. The independent review of #35 then read the
primary sources in their arXiv LaTeX and confirmed those values ("checked in review"; Eisenstein and Hu's fitting
range was not checked). Some values come from that reading alone ("as #35's review read it"): Green, Hofmann and
Schwarz's transfer-function prefactor (the JCAP equations labelled dfs and dk), cut-off mass definition, damping
mass and z_nl; Bringmann's and Cornell et al.'s use of the dark matter density; Diemand, Moore and Stadel's
extrapolated 5×10¹⁵; Springel et al.'s sub-subhalo counts; Wang et al.'s method; Hui et al.'s (equation label
jeans) and Marsh's (axion_jeans) normalisations; Schive, Chiueh and Broadhurst's core mass-radius relation; the
runs Schive et al. fitted M₀ to (MFFit); May and Springel's result; and Rogers and Peiris's half-mode mass. Aq-A's
M50 and Schive, Chiueh and Broadhurst's fitted profile (in `table.mjs`) are recalled.

- A. M. Green, S. Hofmann and D. J. Schwarz, *The power spectrum of SUSY-CDM on sub-galactic scales*, MNRAS 353, L23 (2004). https://arxiv.org/abs/astro-ph/0309621
- A. M. Green, S. Hofmann and D. J. Schwarz, *The first WIMPy halos*, JCAP 0508, 003 (2005). https://arxiv.org/abs/astro-ph/0503387
- A. M. Green, S. Hofmann and D. J. Schwarz, *Small scale WIMP physics*, AIP Conf. Proc. 805, 431 (2006). https://arxiv.org/abs/astro-ph/0508553
- A. Loeb and M. Zaldarriaga, *The small-scale power spectrum of cold dark matter*, Phys. Rev. D 71, 103520 (2005). https://arxiv.org/abs/astro-ph/0504112
- E. Bertschinger, *Effects of cold dark matter decoupling and pair annihilation on cosmological perturbations*, Phys. Rev. D 74, 063509 (2006). https://arxiv.org/abs/astro-ph/0607319
- T. Bringmann, *Particle models and the small-scale structure of dark matter*, New J. Phys. 11, 105027 (2009). https://arxiv.org/abs/0903.0189
- J. M. Cornell, S. Profumo and W. Shepherd, *Kinetic decoupling and small-scale structure in effective theories of dark matter*, Phys. Rev. D 88, 015027 (2013). https://arxiv.org/abs/1305.4676
- J. Diemand, B. Moore and J. Stadel, *Earth-mass dark-matter haloes as the first structures in the early Universe*, Nature 433, 389 (2005). https://arxiv.org/abs/astro-ph/0501589
- V. Springel et al., *The Aquarius Project: the subhaloes of galactic haloes*, MNRAS 391, 1685 (2008). https://arxiv.org/abs/0809.0898
- D. Erkal et al., *The number and size of subhalo-induced gaps in stellar streams*, MNRAS 463, 102 (2016), for the Aquarius fit's parameters. https://arxiv.org/abs/1606.04946
- J. Wang et al., *Universal structure of dark matter haloes over a mass range of 20 orders of magnitude*, Nature 585, 39 (2020). https://arxiv.org/abs/1911.09720
- T. Ishiyama, *Hierarchical formation of dark matter halos and the free streaming scale*, ApJ 788, 27 (2014). https://arxiv.org/abs/1404.1650
- T. Ishiyama and S. Ando, *The abundance and structure of subhaloes near the free streaming scale and their impact on indirect dark matter searches*, MNRAS 492, 3662 (2020). https://arxiv.org/abs/1907.03642
- R. E. Angulo, O. Hahn, A. D. Ludlow and S. Bonoli, *Earth-mass haloes and the emergence of NFW density profiles*, MNRAS 471, 4687 (2017). https://arxiv.org/abs/1604.03131
- M. S. Delos and S. D. M. White, *Inner cusps of the first dark matter haloes: formation and survival in a cosmological context*, MNRAS 518, 3509 (2023). https://arxiv.org/abs/2207.05082
- M. S. Delos and S. D. M. White, *Prompt cusps and the dark matter annihilation signal*, JCAP 10, 008 (2023). https://arxiv.org/abs/2209.11237
- L. Ondaro-Mallea et al., *Phase-space simulations of prompt cusps: simulating the formation of the first haloes without artificial fragmentation*, MNRAS 527, 10802 (2024). https://arxiv.org/abs/2309.05707
- Y. Wang, S. Bose, C. S. Frenk and A. Jenkins, *Buried but not destroyed: the evolution from prompt cusps to NFW haloes* (2025). https://arxiv.org/abs/2512.13804
- H. Zhao, D. Hooper, G. W. Angus, J. E. Taylor and J. Silk, *Tidal disruption of the first dark microhalos*, ApJ 654, 697 (2007). https://arxiv.org/abs/astro-ph/0508215
- B. Moore, J. Diemand, J. Stadel and T. Quinn, *On the survival and disruption of Earth mass CDM micro-haloes* (2005). https://arxiv.org/abs/astro-ph/0502213
- T. Goerdt, O. Y. Gnedin, B. Moore, J. Diemand and J. Stadel, *The survival and disruption of cold dark matter microhaloes: implications for direct and indirect detection experiments*, MNRAS 375, 191 (2007). https://arxiv.org/abs/astro-ph/0608495
- F. C. van den Bosch, G. Ogiya, O. Hahn and A. Burkert, *Disruption of dark matter substructure: fact or fiction?*, MNRAS 474, 3043 (2018). https://arxiv.org/abs/1711.05276
- A. Schneider, R. E. Smith, A. V. Macciò and B. Moore, *Non-linear evolution of cosmological structures in warm dark matter models*, MNRAS 424, 684 (2012), for the half-mode mass. https://arxiv.org/abs/1112.0330
- A. Schneider, R. E. Smith and D. Reed, *Halo mass function and the free streaming scale*, MNRAS 433, 1573 (2013). https://arxiv.org/abs/1303.0839
- W. Hu, R. Barkana and A. Gruzinov, *Fuzzy cold dark matter: the wave properties of ultralight particles*, Phys. Rev. Lett. 85, 1158 (2000). https://arxiv.org/abs/astro-ph/0003365
- L. Hui, J. P. Ostriker, S. Tremaine and E. Witten, *Ultralight scalars as cosmological dark matter*, Phys. Rev. D 95, 043541 (2017). https://arxiv.org/abs/1610.08297; its Jeans mass as quoted by F. Toguz, D. Kawata, G. Seabroke and J. I. Read, MNRAS 511, 1757 (2022). https://arxiv.org/abs/2106.02526
- D. J. E. Marsh, *Axion cosmology*, Phys. Rep. 643, 1 (2016). https://arxiv.org/abs/1510.07633; the 66.5 form as quoted by M. Kulkarni and J. P. Ostriker, *What is the halo mass function in a fuzzy dark matter cosmology?*, MNRAS 510, 1425 (2022). https://arxiv.org/abs/2011.02116
- H.-Y. Schive, T. Chiueh and T. Broadhurst, *Cosmic structure as the quantum interference of a coherent dark wave*, Nature Phys. 10, 496 (2014), and its Supplementary Information. https://arxiv.org/abs/1406.6586; the 5.5×10¹² first seen restated by D. Wardana, K. Hayashi, M. Chiba and E. G. M. Ferreira, *Fuzzy dark matter and the impact of core–halo diversity on its particle mass constraints* (2026), which credits it to Phys. Rev. Lett. 113, 261302. https://arxiv.org/abs/2603.07175
- H.-Y. Schive, T. Chiueh, T. Broadhurst and K.-W. Huang, *Contrasting galaxy formation from quantum wave dark matter, ψDM, with ΛCDM, using Planck and Hubble data*, ApJ 818, 89 (2016). https://arxiv.org/abs/1508.04621
- S. May and V. Springel, *The halo mass function and filaments in full cosmological simulations with fuzzy dark matter*, MNRAS 524, 4256 (2023). https://arxiv.org/abs/2209.14886
- V. Iršič, M. Viel, M. G. Haehnelt, J. S. Bolton and G. D. Becker, *First constraints on fuzzy dark matter from Lyman-α forest data and hydrodynamical simulations*, Phys. Rev. Lett. 119, 031302 (2017). https://arxiv.org/abs/1703.04683
- E. Armengaud, N. Palanque-Delabrouille, C. Yèche, D. J. E. Marsh and J. Baur, *Constraining the mass of light bosonic dark matter using SDSS Lyman-α forest*, MNRAS 471, 4606 (2017). https://arxiv.org/abs/1703.09126
- K. K. Rogers and H. V. Peiris, *Strong bound on canonical ultralight axion dark matter from the Lyman-alpha forest*, Phys. Rev. Lett. 126, 071302 (2021). https://arxiv.org/abs/2007.12705
- A. Drlica-Wagner et al., *Probing the fundamental nature of dark matter with the Large Synoptic Survey Telescope* (2019), for the half-mode convention Rogers and Peiris use. https://arxiv.org/abs/1902.01055
- E. O. Nadler et al. (DES), *Constraints on dark matter properties from observations of Milky Way satellite galaxies*, Phys. Rev. Lett. 126, 091101 (2021). https://arxiv.org/abs/2008.00022
- N. Dalal and A. Kravtsov, *Excluding fuzzy dark matter with sizes and stellar kinematics of ultrafaint dwarf galaxies*, Phys. Rev. D 106, 063517 (2022). https://arxiv.org/abs/2203.05750
- S. May, N. Dalal and A. Kravtsov, *Updated bounds on ultra-light dark matter from the tiniest galaxies* (2025). https://arxiv.org/abs/2509.02781
- C.-P. Ma and E. Bertschinger, *Cosmological perturbation theory in the synchronous and conformal Newtonian gauges*, ApJ 455, 7 (1995). https://arxiv.org/abs/astro-ph/9506072
- D. J. Eisenstein and W. Hu, *Baryonic features in the matter transfer function*, ApJ 496, 605 (1998). https://arxiv.org/abs/astro-ph/9709112
- Planck Collaboration, *Planck 2018 results. VI. Cosmological parameters*, A&A 641, A6 (2020). https://arxiv.org/abs/1807.06209

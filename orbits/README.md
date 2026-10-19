# Orbits: is a galaxy a big solar system?

Status: **exploration, not peer reviewed, no new result claimed.** Issue
[#36](https://github.com/Foundation-0/fractals/issues/36).

The repository's README opens with "atoms look a little like solar systems, solar systems a little like galaxies".
The first half has a study, the Witness Map. This one takes the second half. A solar system and a spiral galaxy
are both flat, rotating disks, but they do not orbit alike. This study asks where each one's law of motion holds,
what ends it, and what, if anything, repeats from one scale to the next.

## Short answer

| Question | Answer |
|---|---|
| Is a galaxy a big solar system? | No. Around one dominant mass, orbital speed falls as Kepler's v ∝ r^−1/2. Across the Milky Way's disk the speed falls only from 234 to 200 km/s between 5 and 25 kpc. Read as spherical, the mass inside grows 3.7-fold over that range, where a Kepler system's would stay fixed. Both figures come from Eilers et al.'s (2019) fit. |
| How exact is Kepler's law in the Solar System? | In JPL's 1800–2050 fit, n²a³ matches GM☉ to within 1.3×10⁻³ for all eight planets. That is about the planets' total mass, 1.34×10⁻³ of the Sun's: the planets pull on one another. P ∝ a^1.49986 over 0.39 to 30 au. |
| Does the Galaxy have a Kepler region? | Yes, around Sgr A*. The star S2 orbits it as a planet orbits the Sun, plus general relativity's 12.1′ precession per orbit. The region ends about 1.3 pc out, where the speed's log slope passes −1/4 (1.0 to 1.8 pc across the cluster-mass range). The stars inside weigh as much as the black hole by 1.8 to 3.2 pc. |
| What ends a Kepler region? | For a body orbiting in a host (a planet, the Sun), the host's tide. Satellites are held only inside its tidal radius, r_J³ = Gm/(4A(A − B)). Inside it, the body's mean density is 4A/Ω times the host's mean density inside the orbit (host taken as spherical): 3 for a planet around the Sun, 2.25 for the Sun in the Galaxy. For the Sun, r_J = 1.37 pc = 2.8×10⁵ au. At the Galaxy's centre, where Sgr A* sits still, the region ends instead where the surrounding stars' mass approaches the black hole's. |
| How much of that region is used? | About half, in this study's three-body runs. Of circular orbits facing every way, half have escaped by 0.53 r_J around a planet and by 0.45 r_J (1.3×10⁵ au) for the Sun. Shen and Tremaine (2008) put stable prograde and retrograde moons out to about 0.5 and 0.7 r_H; the observed outer moons reach about 0.4 and 0.6 r_H. The Oort cloud's outer edge is placed between 10⁵ and 2×10⁵ au, which is 0.35 to 0.7 r_J. |
| What does repeat? | Kepler regions nested inside one another, each ending at its host's tide at a similar fraction of its tidal radius: moons in a planet's, planets and comets in the Sun's. Also flat disks: the planets' orbits are tilted by 2° on average (6° for Mercury), and the Galaxy's thin disk is about 0.1 as thick as it is wide. |

## Kepler's law in the Solar System

Around one mass M, a circular orbit of radius r has speed √(GM/r), and P² = 4π²a³/G(M + m). Nothing in the law
sets a size, so it holds from the Sun's surface out to wherever another pull competes.

JPL's approximate elements (Standish, Table 1, a fit to 1800–2050) give each planet's semi-major axis a and its
mean-longitude rate, n = L̇:
- This is the orbit's angular rate, which obeys n²a³ = GM(<a) for a near-circular orbit in an averaged pull.
- The mean-anomaly rate, L̇ − ϖ̇, is the radial frequency and does not. Using it would put Neptune's excess at 4.2×10⁻³.

Against the IAU 2015 nominal GM☉ (`node orbits/table.mjs`, section 1):

| | Mercury | Venus | Earth–Moon | Mars | Jupiter | Saturn | Uranus | Neptune |
|---|---|---|---|---|---|---|---|---|
| n²a³/GM☉ − 1 | 4.8e−6 | 1.7e−5 | 1.1e−5 | 3.7e−5 | 9.0e−4 | 2.2e−4 | 1.03e−3 | 1.27e−3 |
| m/M☉ | 1.7e−7 | 2.4e−6 | 3.0e−6 | 3.2e−7 | 9.5e−4 | 2.9e−4 | 4.4e−5 | 5.2e−5 |
| the other planets as rings | −4e−7 | −4e−8 | 3.8e−6 | −5.7e−6 | 9.3e−4 | 1.54e−3 | 1.40e−3 | 1.41e−3 |

In this fit every excess is below 1.34×10⁻³, the eight planets' total mass over the Sun's. That is the right size
but not a strict bound. The last row smears each other planet into a ring along its orbit and adds the ring's
pull, a secular estimate (`ringExcess` in the model):

- **Jupiter.** It gives 9.3×10⁻⁴, against 9.0×10⁻⁴ fitted.
- **Saturn, Uranus and Neptune.** It gives 1.4 to 1.5×10⁻³, above the planets' total mass. Mass inside an orbit pulls harder spread into a ring than gathered at the centre.
- **What a fit this short keeps.** A 250-year fit also carries long-period terms, such as the roughly 900-year great inequality of Jupiter and Saturn near their 5:2 resonance (textbook, not modelled here). Saturn's fitted 2.2×10⁻⁴ sits 1.3×10⁻³ below the ring estimate.
- **The inner planets.** The ring estimate is below 6×10⁻⁶ and the fits are 5×10⁻⁶ to 4×10⁻⁵, so other terms dominate there too.

So the study claims the size of the departures from Kepler's law, about the planets' total mass, and no more. The
fitted exponent of P against a is 1.49986 over all eight planets and 1.49999 over the inner four.

## Where a Kepler region ends

A body of mass m orbiting in a host feels the host's tide. Its own pull wins only inside the tidal (Jacobi)
radius, r_J³ = Gm/(4Ω² − κ²) = Gm/(4A(A − B)), where A and B are the host's Oort constants at the orbit (Binney
and Tremaine 2008, sec. 8.3):

- **Point-mass host** (A = 3Ω/4, B = −Ω/4). This is Hill's radius, a(m/3M)^(1/3). Jupiter's is 0.355 au.
- **Flat rotation curve** (A = −B = Ω/2).
- **The Sun.** Bovy's (2017) A = 15.3 and B = −11.9 km s⁻¹ kpc⁻¹ give 1.37 pc, which is 2.83×10⁵ au. Moving A or B by its statistical error gives 1.35 to 1.39 pc, and adding A's 0.5 systematic gives 1.33 to 1.42 pc. Correa-Otto and Calandra (2019) quote 2.8×10⁵ au.

Written as densities, the edge needs no length scale. Inside r_J the body's mean density, 3m/4πr_J³, is 4A/Ω
times the host's mean density inside the orbit, 3Ω²/4πG (spherical host).
- **The ratio.** In terms of the rotation curve it is 2(1 − d ln v/d ln R): exactly 3 for a planet and 2 for a flat curve.
- **The Sun.** Bovy's values, taking the Galaxy as spherical, give 2.25.

So a Kepler region ends where the body's mean density falls to two or three times the host's mean density inside
the body's orbit. That comparison density is a mean, not the local density. For the Sun it is 0.041 M☉ pc⁻³. The
local mid-plane density, 0.10, is higher than the Sun's own 0.092 inside r_J.

### How much of the region a body keeps

Inside r_J not every orbit survives. The model follows circular orbits in Hill's problem: the body, its host's tide
expanded to first order, and the Coriolis force. Lengths are in r_J and times in 1/Ω:

```
x'' = 2y' + Γx − Γx/r³,   y'' = −2x' − Γy/r³,   z'' = −ν²z − Γz/r³
```

Two numbers set the host:

- **Γ = 4A/Ω, the in-plane tide.** It is 3 for a point-mass host and 2.25 for the Sun's place in the Galaxy.
- **ν²/Ω², the vertical tide.**
  - It is 1 for a point mass.
  - For the Galaxy it is (4πGρ₀ + 2(A² − B²))/Ω² = 7.6, from Poisson's equation with a local mid-plane density ρ₀ = 0.10 M☉ pc⁻³ (McKee, Parravano and Hollenbach 2015: 0.097 ± 0.013).
  - Relative to the orbit's own rate, the Galaxy's disk squeezes the Sun's sphere vertically 7.6 times as hard as the Sun squeezes a planet's.

An orbit is followed for 20 turns of the host. For the Sun that is 4.5 billion years, about the Solar System's age;
for Jupiter it is 237 years. It is counted as lost once it passes 3 r_J. The radius by which half the orbits (8
starting angles each) have escaped (`node orbits/table.mjs`, section 5):

| Orbit | Point-mass host | The Sun in the Galaxy | The same with ν²/Ω² = 1 |
|---|---|---|---|
| Prograde, in the plane | 0.45 | 0.475 | 0.475 |
| Retrograde, in the plane | 0.75 | 0.925 | 0.925 |
| Polar, plane through the host's direction | 0.45 | 0.425 | 0.50 |
| Polar, plane across it | 0.475 | 0.39 | 0.50 |
| Facing every way (24 directions × 4 angles) | 0.53 | 0.45 | |

**For a planet.** The model's 0.45 and 0.75 are within 0.05 of the published values. Shen and Tremaine (2008;
abstract, search text) find that many prograde and retrograde satellites survive to about 0.5 and 0.7 r_H. Their
introduction notes that the observed irregular moons reach about 0.4 and 0.6 r_H. Followed for 100 turns instead
of 20, the all-directions value moves from 0.53 to 0.52 (`node orbits/table.mjs long`).

**For the Sun.**
- **The edge.** Half of the orbits have escaped by 0.45 r_J, or 1.26×10⁵ au. For ρ₀ from 0.08 to 0.12 it is 0.44 to 0.46 r_J. Followed for 100 turns (23 billion years, a convergence test only) it is 0.42.
- **The Oort cloud.** Its outer edge is placed near 10⁵ au (Correa-Otto and Calandra 2019, search text) and as far as 2×10⁵ au (Dones et al. 2004, as cited), which is 0.35 to 0.7 r_J. That range takes in the model's 0.45 r_J for the Sun and 0.53 for a planet. Passing stars, which the model leaves out, also set the cloud's edge.
- **The vertical tide.** It loses polar orbits sooner, at 0.43 and 0.39 r_J against 0.50 with ν²/Ω² = 1 at the same Γ. It never acts on an orbit that starts in the plane, because such an orbit stays there.
- **In-plane retrograde orbits.** These last to 0.925 r_J rather than 0.75 because Γ is 2.25 rather than 3: the flatter rotation curve weakens the in-plane tide.

The model also stops an orbit that plunges within 10⁻³ r_J. That is about a giant planet's radius; for the Sun it
is 280 au, outside the planets. Up to 17% of the Sun's inner orbits do so within 20 turns (in the 24 × 4 sample).
This is the tide driving comets inward (Heisler and Tremaine 1986), and the study does not follow it further.

## A Kepler region at the Galaxy's centre

GRAVITY's 2020 elements for S2 are a = 125.058 mas at R₀ = 8246.7 pc (1031 au), P = 16.0455 yr and e = 0.884649.
They give:

- **The mass.** Kepler's third law gives M = a³/P² = 4.2606×10⁶ M☉. Their fit is 4.261×10⁶. The agreement shows only that the elements are consistent, since they fitted the mass with the same law.
- **The precession.** General relativity predicts 6πGM/(c²a(1 − e²)) = 12.16′ per orbit. They quote "the 12.1′ precession" (appendix B) and measured 1.10 ± 0.19 times it.
- **Pericentre.** 119 au, about 1,400 Schwarzschild radii, at 7,740 km/s, which is 2.6% of c. Their introduction quotes 120 au and 7,700 km/s.

Around Sgr A* (4.297×10⁶ M☉, GRAVITY 2022) lies the nuclear star cluster:

- **The stars inside 1 pc.** 0.5 to 1.5×10⁶ M☉ (Schödel, Merritt and Eckart 2009).
- **The density.** It falls as r^−1.13 inside a break near 3 pc (Schödel et al. 2018).

With the mass growing as r^1.87, the stars inside r weigh as much as Sgr A* at 1.8 to 3.2 pc, and twice as much at
2.5 to 4.6 pc. Radii past 3 pc extrapolate the cusp beyond its break. The density falls more steeply there, so
those values are lower limits.

The literature puts the "twice" radius, the usual influence radius, at 3 to 4 pc:
- Alexander 2005: 3 pc, as cited.
- Feldmeier-Krause et al. 2017: about 4 pc, with their black-hole mass of 3.0×10⁶ M☉.
- GRAVITY Collaboration 2024: 3.9 pc in their models, using Merritt's (2013) definition.
All three are search text.

The speed's log slope is −0.497 at 0.1 pc and −0.32 at 1 pc. It passes −1/4 at 1.3 pc (1.0 to 1.8 pc across the
cluster-mass range) and turns positive by 3 pc. For comparison, Bovy's MWPotential2014 bulge has no nuclear cluster
and was fitted on kiloparsec scales; with Sgr A* added it puts the "twice" radius at 9.4 pc.

So the Milky Way contains a small solar system at its centre: a Kepler region about 1.3 pc in radius. That this
matches the Sun's own 1.4 pc tidal radius is a coincidence:
- Sgr A* is 4.3 million times the Sun's mass.
- The stars around it at 1 pc are about 1.5 million times denser than the 0.10 M☉ pc⁻³ near the Sun.

## Across the disk: flat, not Kepler

Eilers et al. (2019) fit v_c = 229.0 − 1.7(R − 8.122) km/s from 5 to 25 kpc, with 2–5% systematic uncertainty:

- **The speed.** It is 234 km/s at 5 kpc and 200 km/s at 25 kpc.
- **Log slope.** d ln v/d ln R is −0.04 at 5 kpc, −0.06 at the Sun and −0.21 at 25 kpc. Kepler's would be −0.5.
- **Mass inside.** Read as spherical, v²R/G grows 3.7-fold between 5 and 25 kpc.
- **The stars alone.** The stars weigh 5 ± 1×10¹⁰ M☉ (Bland-Hawthorn and Gerhard 2016). Even 10¹¹ M☉ all inside 25 kpc would hold only 131 km/s there, against about 200 measured. That is the missing-mass problem in one line.

The model's Galaxy is Bovy's MWPotential2014:
- **Its parts.** A power-law bulge with a cutoff, a Miyamoto–Nagai disk and an NFW halo, normalised to 220 km/s at 8 kpc, with Sgr A* added.
- **Against Eilers et al.** Its curve has their shape, v(R)/v(R₀), to within 2% from 5 to 25 kpc, but sits 4% lower.
- **Flatness.** Outside the bulge (R > 1 kpc), its log slope stays within ±0.15 of zero from 3.6 to 49 kpc. The r^−1.8 bulge is about as flat, from 7 to 180 pc, but that is a dense bulge, not a single mass.

Going outward, the model's speed falls by less than Kepler's law would give:
- **The model.** The log slope is −0.21 at 100 kpc and −0.27 at 200 kpc, because the NFW halo's mass still grows.
- **The data.** Gaia DR3 analyses differ on whether the measured curve turns down past about 19 kpc. Jiao et al. (2023) report "a Keplerian decline"; Koop et al. (2024) find the curves robust only to about 15 kpc.

## An acceleration scale, and why this study does not use it

In other galaxies the shift from Kepler-like to flat tracks an acceleration, not a radius. The observed and
baryonic accelerations follow one relation, which bends at g† = 1.20 ± 0.02 (random) ± 0.24 (systematic) × 10⁻¹⁰
m s⁻² (McGaugh, Lelli and Schombert 2016).

- **Where the Sun's pull reaches it.** At 7,030 au, inside its tidal radius.
- **The Galaxy's own pull at the Sun.** v²/R₀ = 2.1×10⁻¹⁰ m s⁻², or 1.7 g†.

Wide binary stars at 2 to 30 thousand au test gravity at these accelerations, and the results disagree:
- Chae (2023) reports a 1.43 ± 0.06 boost.
- Banik et al. (2024) prefer Newtonian dynamics at 19σ and exclude MOND at 16σ.
- Later analyses still split.

The study reports the scale and leaves the question to the Witness Map and issue #3.

## What does repeat: thin disks

The planets' orbits lie within a few degrees of the invariable plane, the plane perpendicular to the Solar System's
total angular momentum (Souami and Souchay 2012). Computed from JPL's elements, the inclinations are:
- Mercury 6.3°, Venus 2.2°, Earth–Moon 1.6°, Mars 1.7°;
- Jupiter 0.33°, Saturn 0.93°, Uranus 1.0°, Neptune 0.73°.

The rms of sin i is 0.045, or 0.023 without Mercury. The Galaxy's thin disk has a scale height of 300 ± 50 pc over
a scale length of 2.6 ± 0.5 kpc (Bland-Hawthorn and Gerhard 2016). Their ratio, 0.12, is the axis ratio of its
density contours.

Both are flat for the same reason: gas that radiates its energy but keeps its angular momentum settles into a disk.
What the disks orbit differs: one dominant mass, or mass spread through the disk and halo.

## Run it

```
node orbits/table.mjs          # every number above except the 100-turn runs (about 50 s; section 5 takes nearly all of it)
node orbits/table.mjs quick    # sections 1-4 only, well under a second
node orbits/table.mjs long     # adds the 100-turn runs, about 2 minutes in all
node tests/orbits.mjs          # the checks, about 2 s (also run by npm test)
```

## Checks

`tests/orbits.mjs` has 23 checks. Each prints its source, the published or expected value, the model's value and
the tolerance.

| What | Against | Kind |
|---|---|---|
| In the 1800–2050 fit, n²a³/GM☉ − 1 below the planets' mass fraction for all eight | JPL Table 1, IAU 2015, DE430 | published elements; an observed size, not a bound |
| Exponent 3/2, to the most the previous check allows | the same | model-internal, independent of GM☉ |
| 4A/Ω = 3 from the model's own curve near Sgr A*; Jacobi radius = Hill radius for a point mass | the model | model-internal |
| The Sun's r_J = 2.8×10⁵ au | Correa-Otto and Calandra 2019 | search text |
| S2: Kepler mass, 12.1′ precession, 120 au, 7,700 km/s | GRAVITY 2020 | Table E.1, appendix B and introduction, via a transcription |
| Stars weigh 2 M_BH at 3 to 4 pc | Alexander 2005; Feldmeier-Krause et al. 2017; GRAVITY 2024 | search text |
| Kepler slope −1/2 inside 0.1 pc | — | model |
| MWPotential2014: the 220 km/s normalisation; shape within 5% of Eilers et al.; flat (abs. slope < 0.25) at 5 to 25 kpc | Eilers et al. 2019 | model-internal; abstract |
| Jupiter's and Saturn's tilts to the invariable plane | Souami and Souchay 2012 | search text |
| Planet: half the prograde orbits escaped by 0.5 ± 0.1 r_H; retrograde kept at 0.6, lost by 0.9 | Shen and Tremaine 2008 (0.5, 0.7) | abstract, search text |
| Retrograde in the plane at 0.875 r_J: lost around a point mass, kept by the Sun | — | model |
| The Jacobi integral conserved over 20 turns; the Galaxy's ν²/Ω² in SI | equations of motion; Poisson's equation | model-internal; arithmetic |
| The Sun: none escape from 0.3 r_J, most by 0.6 | — | model |
| The Sun's all-directions edge within the Oort cloud's 1 to 2×10⁵ au | Correa-Otto and Calandra 2019; Dones et al. 2004 | search text; as cited |

## What the model leaves out

- **The planets' long-period pull on one another.** Kepler's law is checked only to the size of the planets' masses.
- **Hill's problem is the tide to first order, on a circular host orbit.** The study drops the Sun's vertical oscillation through the disk (82 Myr with this model's ν) and its radial epicycles. It also leaves out passing stars and molecular clouds, which also strip the Oort cloud, and the planets' scattering of comets that plunge inward.
- **Circular starting orbits only.** Real moons and comets start on eccentric orbits. The edges are set at half the orbits escaping within 20 turns of the host, on a grid of 0.025 r_J (in the plane) or 0.1 r_J (all directions).
- **MWPotential2014 is one model among many.** Its halo sets the flat range, and it has no nuclear star cluster. The Galactic-centre numbers use the separate power-law cusp above, which is valid only inside its 3 pc break.
- **Spherical mass estimates.** v²R/G and 3Ω²/4πG treat a flattened galaxy as spherical. For a disk the true enclosed mass and mean density differ somewhat, which shifts the 3.7-fold growth and the 2.25, but not the contrast with Kepler's fixed mass.

## Sources

Read here only through search results and abstracts, or as noted. Each entry says how it was read.

- W. M. Folkner et al., *The Planetary and Lunar Ephemerides DE430 and DE431*, IPN Progress Report 42-196 (2014). GM values seen in copies of the file.
- E. M. Standish, *Keplerian Elements for Approximate Positions of the Major Planets*, JPL Solar System Dynamics, Table 1 (1800–2050). Seen in a copy of the file.
- A. Prša et al., *Nominal values for selected solar and planetary quantities: IAU 2015 Resolution B3*, Astron. J. 152, 41 (2016). https://doi.org/10.3847/0004-6256/152/2/41. Search text of the resolution.
- D. Souami and J. Souchay, *The solar system's invariable plane*, A&A 543, A133 (2012). https://doi.org/10.1051/0004-6361/201219011. Search text.
- J. Binney and S. Tremaine, *Galactic Dynamics*, 2nd ed., Princeton (2008), sec. 8.3. From memory.
- J. Bovy, *Galactic rotation in Gaia DR1*, MNRAS 468, L63 (2017). https://arxiv.org/abs/1610.07610. Abstract, search text.
- J. A. Correa-Otto and M. F. Calandra, MNRAS 490, 2495 (2019). https://doi.org/10.1093/mnras/stz2671. Search text: "r_J ~ 2.8 × 10^5 au", and a structure near 10⁵ au marking an outer stability boundary.
- Y. Shen and S. Tremaine, *Stability of Distant Satellites of the Giant Planets in the Solar System*, AJ (2008). https://arxiv.org/abs/0806.2882. Abstract and introduction, search text.
- C. F. McKee, A. Parravano and D. J. Hollenbach, *Stars, gas, and dark matter in the solar neighborhood*, ApJ 814, 13 (2015). https://arxiv.org/abs/1509.05334. Search text, secondary.
- M. Heisler and S. Tremaine, *The influence of the Galactic tidal field on the Oort comet cloud*, Icarus 65, 13 (1986). Abstract, search text.
- L. Dones, P. R. Weissman, H. F. Levison and M. J. Duncan, *Oort cloud formation and dynamics*, in *Comets II*, 153 (2004). As cited in search text, for an outer edge "as far as 2 × 10^5 AU".
- GRAVITY Collaboration, *Detection of the Schwarzschild precession in the orbit of the star S2 near the Galactic centre massive black hole*, A&A 636, L5 (2020). https://doi.org/10.1051/0004-6361/202037813. Abstract, introduction, appendix B and Table E.1, read in a transcription.
- GRAVITY Collaboration, A&A 657, L12 (2022). https://doi.org/10.1051/0004-6361/202142465. Search text.
- GRAVITY Collaboration (2024). https://arxiv.org/abs/2409.12261. Search text, for the 3.9 pc influence radius in their models.
- R. Schödel, D. Merritt and A. Eckart, A&A 502, 91 (2009). https://doi.org/10.1051/0004-6361/200810922. Abstract, search text.
- R. Schödel et al., A&A 609, A27 (2018). Abstract, search text.
- T. Alexander, Phys. Rep. 419, 65 (2005). As cited by Feldmeier-Krause et al. 2017.
- A. Feldmeier-Krause et al., *Triaxial orbit-based modelling of the Milky Way Nuclear Star Cluster*, MNRAS 466, 4040 (2017). https://arxiv.org/abs/1701.01583. Search text.
- D. Merritt, *Dynamics and Evolution of Galactic Nuclei*, Princeton (2013). Definition only, as cited by GRAVITY Collaboration 2024.
- J. Bovy, *galpy: A Python Library for Galactic Dynamics*, ApJS 216, 29 (2015). https://doi.org/10.1088/0067-0049/216/2/29. MWPotential2014's parameters read in galpy's source.
- C. Eilers, D. W. Hogg, H.-W. Rix and M. K. Ness, ApJ 871, 120 (2019). https://doi.org/10.3847/1538-4357/aaf648. Abstract, search text.
- J. Bland-Hawthorn and O. Gerhard, *The Galaxy in Context*, ARA&A 54, 529 (2016). https://doi.org/10.1146/annurev-astro-081915-023441. As cited in search text.
- Y. Jiao et al., A&A 678, A208 (2023). https://doi.org/10.1051/0004-6361/202347513. Abstract, search text.
- H. Koop et al., A&A 692, A50 (2024). https://arxiv.org/abs/2405.19028. Abstract, search text.
- S. S. McGaugh, F. Lelli and J. M. Schombert, PRL 117, 201101 (2016). https://doi.org/10.1103/PhysRevLett.117.201101. Search text.
- K.-H. Chae, ApJ 952, 128 (2023). https://doi.org/10.3847/1538-4357/ace101. Search text.
- I. Banik et al., MNRAS 527, 4573 (2024). https://doi.org/10.1093/mnras/stad3393. Abstract, search text.

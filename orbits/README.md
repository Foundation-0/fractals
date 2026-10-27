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
| How exact is Kepler's law in the Solar System? | In JPL's 1800–2050 fit, n²a³ matches GM☉ to within 1.3×10⁻³ for all eight planets. That is about the planets' total mass, 1.34×10⁻³ of the Sun's. Jupiter's excess is mostly its own mass in the two-body law; Uranus's and Neptune's are mostly the other planets' pull, and Saturn's fitted 2.2×10⁻⁴ is below its own 2.9×10⁻⁴ (see below). P ∝ a^1.49986 over 0.39 to 30 au. |
| Does the Galaxy have a Kepler region? | Yes, around Sgr A*. The star S2 orbits it as a planet orbits the Sun, plus general relativity's precession: 12.2′ per orbit from their elements (they quote 12.1′). The speed's log slope passes −1/4 about 1.3 pc out (1.0 to 1.8 pc across the cluster-mass range; 0.7 to 1.9 pc for thresholds from −0.4 to −0.1). The stars inside weigh as much as the black hole by 1.8 to 3.2 pc. |
| What ends a Kepler region? | For a body orbiting in a host (a planet, the Sun), the host's tide. Satellites are held inside its tidal radius, r_J³ = Gm/(4A(A − B)), apart from quasi-satellite orbits beyond about 2 r_H that Shen and Tremaine (2008) find around Jupiter, Uranus and Neptune. Inside r_J, the body's mean density is 4A/Ω times the host's mean density inside the orbit (host taken as spherical): 3 for a planet around the Sun, 2.25 for the Sun in the Galaxy. For the Sun, r_J = 1.37 pc = 2.8×10⁵ au. At the Galaxy's centre, where Sgr A* sits still, the region ends instead where the surrounding stars' mass approaches the black hole's. |
| How much of that region is used? | About half, for orbits that do not plunge, in this study's three-body runs. Of circular orbits facing every way, half have escaped by 0.52 r_J around a planet and by 0.435 r_J (1.23×10⁵ au) for the Sun. Polar orbits are lost much sooner, to Lidov–Kozai cycles: half are lost by 0.14 to 0.15 r_H around a planet (up to about 0.3 r_H; from 0.35 r_H on, half or more survive the run) and by 0.06 r_J for the Sun, in 20 turns of the host. For near-circular moons near the ecliptic, Nesvorný et al. (2003) put the limits at about 0.4 and 0.7 r_H (prograde, retrograde), and the model gives 0.46 and 0.775. The Oort cloud's outer limit is placed between 6.5×10⁴ au (Correa-Otto and Calandra 2019, where passing stars set it) and 2×10⁵ au, which is 0.23 to 0.71 r_J. |
| What does repeat? | Kepler regions nested inside one another: moons in a planet's, planets and comets in the Sun's. Each is bounded by its host's tide at a similar fraction of the tidal radius, though for the Oort cloud passing stars cut it shorter. Also flat disks: the planets' orbits are tilted by about 2° on average (6° for Mercury), and the Galaxy's thin disk has a scale height 0.04 of the Sun's orbital radius. |

## Kepler's law in the Solar System

Around one mass M, a circular orbit of radius r has speed √(GM/r), and P² = 4π²a³/G(M + m). Nothing in the law
sets a size, so it holds from the Sun's surface out to wherever another pull competes.

JPL's approximate elements (Standish and Williams, Table 1, a fit to 1800–2050) give each planet's semi-major axis a
and its mean-longitude rate, n = L̇:
- This is the orbit's angular rate. For a near-circular orbit, n²a is the mean inward pull at a. That equals GM(<a)/a² only when the mass inside is spherical; the ring row below shows the difference.
- The mean-anomaly rate, L̇ − ϖ̇, is the radial frequency and does not. Using it would put Neptune's excess at 4.2×10⁻³.

Against the IAU 2015 nominal GM☉ (`node orbits/table.mjs`, section 1):

| | Mercury | Venus | Earth–Moon | Mars | Jupiter | Saturn | Uranus | Neptune |
|---|---|---|---|---|---|---|---|---|
| n²a³/GM☉ − 1 | 4.8e−6 | 1.7e−5 | 1.1e−5 | 3.7e−5 | 9.0e−4 | 2.2e−4 | 1.02e−3 | 1.27e−3 |
| m/M☉ | 1.7e−7 | 2.4e−6 | 3.0e−6 | 3.2e−7 | 9.5e−4 | 2.9e−4 | 4.4e−5 | 5.2e−5 |
| own mass + the other planets as rings | −4e−7 | −4e−8 | 3.8e−6 | −5.7e−6 | 9.3e−4 | 1.54e−3 | 1.40e−3 | 1.41e−3 |

In this fit every excess is below 1.34×10⁻³, the eight planets' total mass over the Sun's. That is the right size
but not a strict bound. The last row is a secular estimate (`ringExcess` in the model). It starts from the planet's
own m/M☉ and adds the pull of each other planet, smeared into a ring along its orbit:

- **Jupiter.** It gives 9.3×10⁻⁴: its own 9.5×10⁻⁴, less 2.9×10⁻⁵ net from the other planets' rings (−3.5×10⁻⁵ from those outside its orbit, +0.6×10⁻⁵ from those inside). The fit gives 9.0×10⁻⁴.
- **Saturn, Uranus and Neptune.** It gives 1.4 to 1.5×10⁻³, above the planets' total mass. Mass inside an orbit pulls harder spread into a ring than gathered at the centre.
- **What a fit this short keeps.** A 250-year fit also carries long-period terms, such as the roughly 900-year great inequality of Jupiter and Saturn near their 5:2 resonance (recalled, not modelled here). Saturn's fitted 2.2×10⁻⁴ sits 1.3×10⁻³ below the ring estimate. Whether Table 1's outer-planet elements are secular means, which would settle this, is not checked.
- **The inner planets.** The ring estimate is below 6×10⁻⁶ and the fits are 5×10⁻⁶ to 4×10⁻⁵, so other terms dominate there too.

So the study claims the size of the departures from Kepler's law, about the planets' total mass, and no more. The
fitted exponent of P against a is 1.49986 over all eight planets and 1.49999 over the inner four.

## Where a Kepler region ends

A body of mass m orbiting in a host feels the host's tide. Its own pull wins only inside the tidal (Jacobi)
radius, r_J³ = Gm/(4Ω² − κ²) = Gm/(4A(A − B)), where A and B are the host's Oort constants at the orbit (as Jiang
and Tremaine 2010 write it, from Binney and Tremaine 2008):

- **Point-mass host** (A = 3Ω/4, B = −Ω/4). This is Hill's radius, a(m/3M)^(1/3). Jupiter's is 0.355 au.
- **Flat rotation curve** (A = −B = Ω/2).
- **The Sun.** Bovy's (2017) A = 15.3 ± 0.4 and B = −11.9 ± 0.4 km s⁻¹ kpc⁻¹ give 1.37 pc, which is 2.83×10⁵ au; moving A or B by its error gives 1.35 to 1.39 pc. Correa-Otto and Calandra (2019) quote 2.8×10⁵ au from Jiang and Tremaine's constants, which give 2.78×10⁵ au here.
- **Beyond r_J.** Shen and Tremaine (2008) find stable quasi-satellite orbits beyond about 2 r_H around Jupiter, Uranus and Neptune. Those orbit the Sun near the planet rather than the planet itself, and this study leaves them out.

Written as densities, the edge needs no length scale. Inside r_J the body's mean density, 3m/4πr_J³, is 4A/Ω
times the host's mean density inside the orbit, 3Ω²/4πG (spherical host).
- **The ratio.** In terms of the rotation curve it is 2(1 − d ln v/d ln R): exactly 3 for a planet and 2 for a flat curve.
- **The Sun.** Bovy's values, taking the Galaxy as spherical, give 2.25. Correcting for the 12% by which the spherical reading overstates MWPotential2014's mass inside 8 kpc gives 2.53 (2.56 against its true mean density inside 8.122 kpc; see Across the disk).

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
  - For the Galaxy it is (4πGρ₀ + 2(A² − B²))/Ω² = 7.6, from Poisson's equation with a local mid-plane density ρ₀ = 0.10 M☉ pc⁻³. McKee, Parravano and Hollenbach (2015) give 0.097 ± 0.013 for stars, gas and dark matter together.
  - Relative to the orbit's own rate, the Galaxy's disk squeezes the Sun's sphere vertically 7.6 times as hard as the Sun squeezes a planet's.

An orbit is followed for 20 turns of the host. For the Sun that is 4.5 billion years, about the Solar System's age;
for Jupiter it is 237 years.
- **Escaped:** once it passes 3 r_J.
- **Plunged:** once it comes within 10⁻³ r_J, which is 0.74 of Jupiter's radius or, for the Sun, 283 au, outside the planets.
- **Lost:** either.
- **Starting angles.** Hill's equations are symmetric under r → −r, v → −v, so they are spread over half a turn and each is a different orbit.

The radius by which half the orbits have escaped, and by which half are lost (`node orbits/table.mjs`, section 5;
8 starting angles; grid 0.025 r_J; all directions on 48 directions × 4 angles and a 0.05 grid):

| Orbit | Point-mass host | The Sun in the Galaxy | The same with ν²/Ω² = 1 |
|---|---|---|---|
| Prograde, in the plane | 0.46 | 0.475 | 0.475 |
| Retrograde, in the plane | 0.775 | 0.95 | 0.95 |
| Polar, plane through the host's direction: escaped / lost | 0.46 / 0.14 | 0.43 / 0.06 | 0.46 / 0.16 |
| Polar, plane across it: escaped / lost | 0.485 / 0.15 | 0.39 / 0.06 | 0.50 / 0.16 |
| Facing every way: escaped / lost | 0.52 / 0.515 | 0.435 / 0.42 | |

In-plane orbits plunge only outside their escape edge (first at 0.55 r_H, prograde around a point mass, and at
0.875 and 1.0 r_J retrograde), so for them the escaped and lost radii agree. For polar rows, "lost" is the first
radius where half are lost.

**Polar orbits are lost by plunging.**
- **The mechanism.** A circular orbit at 90° to the host's plane goes through Lidov–Kozai cycles (Lidov 1962, Kozai 1962), whose eccentricity reaches 1. So it dives into the body long before it can escape.
- **When.** Within 20 turns half are lost from 0.14 to 0.15 r_H around a planet and from 0.06 r_J for the Sun. Further in, the cycle takes longer than 20 turns; it is not absent.
- **Not everywhere outside.** Around a point mass the lost fraction peaks at 0.2 r_H (all 8 orbits) and falls back to 0.25–0.5 at 0.35–0.4 r_H, where most polar orbits survive the run; so does the Sun's with ν²/Ω² = 1. With the Galaxy's vertical tide the Sun loses 63–100% of its polar orbits at every radius from 0.075 to 0.45 r_J.
- **Other directions.** Tilted to 75° instead, none plunge from 0.1 to 0.4 r_H around a planet, nor inside 0.3 r_J for the Sun; at 0.35–0.4 r_J, 25–38% of the Sun's do. Facing every way, up to a fifth of the Sun's orbits plunge within 20 turns, from directions within 29° of polar, and 8–11% of a planet's between 0.2 and 0.4 r_H, from within 11° of polar. For comets this is the tide driving them inward (Heisler and Tremaine 1986).

**For a planet.**
- **Against the published limits.** The model's in-plane edges are 0.46 (prograde) and 0.775 (retrograde), against Nesvorný et al.'s (2003) semi-major axes of about 0.4 and 0.7 r_H for nearly circular orbits near the ecliptic, as Shen and Tremaine (2008) quote them.
- **Over all inclinations.** Shen and Tremaine find that many prograde and retrograde satellites survive to about 0.5 and 0.7 r_H, and some coplanar retrograde ones to about r_H. The observed irregular moons lie at about 0.05 to 0.6 r_H, the retrograde ones further out (about 0.6 against 0.4 r_H). Their extents are instantaneous distances, not semi-major axes.
- **Run length.** The runs are short: 20 turns is 237 years for Jupiter.
  - Followed for 100 turns, the all-directions value moves from 0.53 to 0.51 (24 directions, `node orbits/table.mjs long`).
  - In a 48-orbit sample run to 3000 turns, #37's review found the point-mass edge drifting from 0.50 to 0.475.

**For the Sun.**
- **The edge.** Half of the orbits facing every way have escaped by 0.435 r_J, or 1.23×10⁵ au.
  - For ρ₀ from 0.08 to 0.12 it moves from 0.454 to 0.429 (on 24 directions, which give 0.448 at 0.10).
  - Counting plunges inside 10⁻² r_J instead of 10⁻³ moves the 24-direction value from 0.448 to 0.469.
  - Followed for 100 turns (23 billion years, a convergence test only) it is 0.42, and 0.38 counting plunges, against 0.45 and 0.43 over 20 turns (24 directions).
- **The Oort cloud.** Correa-Otto and Calandra (2019, sect. 4.3) find fewer than 5% of comets still bound beyond 6.5×10⁴ au and none at 10⁵ au. They define a_crit ≈ 6.5×10⁴ au as the cloud's outer limit; half are bound at about 2×10⁴ au. They name passing stars, not the tide, as what sets that limit. Dones et al. (2004, as cited) place the edge as far as 2×10⁵ au. So the quoted outer limits run from 0.23 to 0.71 r_J. The model's 0.435 r_J lies past Correa-Otto and Calandra's: the tide alone would keep comets further out than passing stars allow.
- **The vertical tide.** It loses polar orbits sooner, by escape at 0.43 and 0.39 r_J against 0.46 and 0.50 with ν²/Ω² = 1 at the same Γ, and by plunging at 0.06 against 0.16. It never acts on an orbit that starts in the plane, because such an orbit stays there.
- **In-plane retrograde orbits.** These last to 0.95 r_J rather than 0.775 because Γ is 2.25 rather than 3: the flatter rotation curve weakens the in-plane tide. With Γ = 2.12 from Eilers et al.'s slope instead (see Across the disk) the edge is 0.975.

## A Kepler region at the Galaxy's centre

GRAVITY's 2020 elements for S2 are a = 125.058 mas at R₀ = 8246.7 pc (1031 au), P = 16.0455 yr and e = 0.884649
(Table E.1). They give:

- **The mass.** Kepler's third law gives M = a³/P² = 4.2606×10⁶ M☉. Their fit is 4.261×10⁶. The agreement shows only that the elements are consistent, since they fitted the mass with the same law.
- **The precession.** General relativity predicts 6πGM/(c²a(1 − e²)) = 12.16′ per orbit. They quote "the 12.1′ precession" (appendix B) and measured 1.10 ± 0.19 times it.
- **Pericentre.** 119 au, about 1,400 Schwarzschild radii, at 7,740 km/s, which is 2.6% of c. Their sect. 1.2 quotes 120 au and 7,700 km/s.

Around Sgr A* (4.297×10⁶ M☉, GRAVITY 2022) lies the nuclear star cluster:

- **The stars inside 1 pc.** 0.5 to 1.5×10⁶ M☉ (Schödel, Merritt and Eckart 2009).
- **The density.** Inside a break near 3 pc it falls as r^−1.13 (Schödel et al. 2018). That is the light-density slope of the innermost 1–2 pc, which the mass follows at constant mass-to-light ratio. Their robust range is 1.1 to 1.4.
- **A check.** With 10⁶ M☉ inside 1 pc, the model has 7.80×10⁶ M☉ inside 3 pc and 182 M☉ inside 0.01 pc, against Schödel et al.'s 7.8 ± 0.6×10⁶ and 180 ± 30.

With the mass growing as r^1.87, the stars inside r weigh as much as Sgr A* at 1.8 to 3.2 pc, and twice as much at
2.5 to 4.6 pc. Radii past 3 pc extrapolate the cusp beyond its break, where the density falls more steeply, so
those values are lower limits. With γ = 1.4 the middle "twice" radius is 3.8 pc.

The literature puts the "twice" radius, the usual influence radius, at 3 to 4 pc:
- Schödel et al. 2018, sect. 4.5: 7.8×10⁶ M☉ within 3 pc, "roughly twice the mass of Sgr A*".
- Alexander 2005: r_h ~ 3 pc from Gm/σ², with twice the black hole's mass reached by about 4 pc.
- Feldmeier-Krause et al. 2017: about 4 pc (4.0 +2.2/−1.1), with a black-hole mass of 4×10⁶ M☉ and Merritt's (2004) definition.
- GRAVITY Collaboration 2024: 3.9 pc in their cusp simulation, with Merritt's (2013) definition.

The speed's log slope is −0.497 at 0.1 pc and −0.32 at 1 pc. It passes −1/4 at 1.27 pc (1.0 to 1.8 pc across the
cluster-mass range) and turns positive at 1.9 to 3.4 pc.
- **Where the boundary falls** depends on the threshold. For the middle cluster mass, the slope passes −0.4, −0.3, −0.25, −0.2 and −0.1 at 0.70, 1.09, 1.27, 1.46 and 1.87 pc.
- **For comparison,** Bovy's MWPotential2014 bulge has no nuclear cluster and was fitted on kiloparsec scales. With Sgr A* added, it puts the "twice" radius at 9.4 pc.

So the Milky Way contains a small solar system at its centre: a Kepler region about a parsec or so in radius. That
this is near the Sun's own 1.4 pc tidal radius is a coincidence, and the match depends on the threshold chosen:
- Sgr A* is 4.3 million times the Sun's mass.
- The stars around it at 1 pc are about 1.5 million times denser than the 0.10 M☉ pc⁻³ near the Sun.

## Across the disk: flat, not Kepler

Eilers et al. (2019, eq. 7) fit v_c = 229.0 − 1.7(R − 8.122) km/s from 5 to 25 kpc. The curve is gently but
significantly declining, and its systematic uncertainty is 2–5% out to about 20 kpc.

- **The speed.** It is 234 km/s at 5 kpc and 200 km/s at 25 kpc.
- **Log slope.** d ln v/d ln R is −0.04 at 5 kpc, −0.06 at the Sun and −0.21 at 25 kpc. Kepler's would be −0.5.
- **Mass inside.** Read as spherical, v²R/G grows 3.7-fold between 5 and 25 kpc.
- **The stars alone.** The stars weigh 5 ± 1×10¹⁰ M☉ (Bland-Hawthorn and Gerhard 2016). Even 10¹¹ M☉ all inside 25 kpc would hold only 131 km/s there, against about 200 measured. That is the missing-mass problem in one line.

The model's Galaxy is Bovy's MWPotential2014:
- **Its parts.** A power-law bulge with a cutoff, a Miyamoto–Nagai disk and an NFW halo, normalised to 220 km/s at 8 kpc, with Sgr A* added.
- **Against Eilers et al.** Its curve has their shape, v(R)/v(R₀), to within 2% from 5 to 25 kpc, but sits 4% lower.
- **Flatness.** Outside the bulge (R > 1 kpc), its log slope stays within ±0.15 of zero from 3.6 to 49 kpc. The r^−1.8 bulge is about as flat, from 7 to 180 pc, but that is a dense bulge, not a single mass.
- **The spherical reading.** Gauss's theorem gives the true mass inside a sphere (the disk by quadrature). v²R/G overstates it by 12% at 8 kpc: 9.00 against 8.00×10¹⁰ M☉. The true growth from 5 to 25 kpc is 4.03-fold rather than 3.65.
- **Γ.** Bovy (2017) warns that A and B cannot be read directly as the circular velocity and its slope, since his C and K are about a fifth of A. Γ = 2(1 − d ln v/d ln R) is 2.12 from Eilers et al.'s slope and 2.21 from MWPotential2014's, against 2.25 from A and B. r_J hardly moves: 1.366 pc from Eilers et al.'s curve.

Going outward, the model's speed falls by less than Kepler's law would give:
- **The model.** The log slope is −0.21 at 100 kpc and −0.27 at 200 kpc, because the NFW halo's mass still grows.
- **The data.** Gaia DR3 analyses differ on whether the measured curve turns down past about 19 kpc.
  - Jiao et al. (2023) report "a Keplerian decline".
  - Koop et al. (2024) find Jeans-equation curves robust with their statistics only to about 15 kpc. In simulations, such curves are off by about 10%.

## An acceleration scale, and why this study does not use it

In other galaxies the shift from Kepler-like to flat tracks an acceleration, not a radius. The observed and
baryonic accelerations follow one relation, which bends at g† = 1.20 ± 0.02 (random) ± 0.24 (systematic) × 10⁻¹⁰
m s⁻² (McGaugh, Lelli and Schombert 2016).

- **Where the Sun's pull reaches it.** At 7,030 au, inside its tidal radius.
- **The Galaxy's own pull at the Sun.** v²/R₀ = 2.1×10⁻¹⁰ m s⁻², or 1.7 g†.

Wide binary stars at 2 to 30 thousand au test gravity at these accelerations, and the results disagree:
- **Chae (2023).** Finds observed over predicted acceleration of 1.43 ± 0.06 at g_N = 10^−10.15 m s⁻².
- **Banik et al. (2024).** Prefer the best Newtonian model over the best MOND one at 19σ; their fit to α_grav excludes MOND at 16σ.
- **Later analyses** still split.

The study reports the scale and leaves the question to the Witness Map and issue #3.

## What does repeat: thin disks

The planets' orbits lie within a few degrees of the invariable plane, the plane perpendicular to the Solar System's
total angular momentum (Souami and Souchay 2012). Computed from JPL's elements, the inclinations are:
- Mercury 6.3°, Venus 2.2°, Earth–Moon 1.6°, Mars 1.7°;
- Jupiter 0.33°, Saturn 0.93°, Uranus 1.0°, Neptune 0.73°.

The rms of sin i is 0.045, or 0.023 without Mercury.

The Galaxy's thin disk has an exponential scale height of 300 ± 50 pc over a scale length of 2.6 ± 0.5 kpc
(Bland-Hawthorn and Gerhard 2016). Their ratio, 0.12, is the axis ratio of its density contours. The like-for-like
comparison with the planets, height over orbital radius, is 300 pc over the Sun's 8.2 kpc: 0.037, against the
planets' 0.045.

Both are flat for the same reason: gas that radiates its energy but keeps its angular momentum settles into a disk.
The Galaxy's present thickness is also set by the stars' later heating. What the disks orbit differs: one dominant
mass, or mass spread through the disk and halo.

## Run it

```
node orbits/table.mjs          # every computed number above except the 100-turn runs and the values credited to #37's review (about 3 minutes)
node orbits/table.mjs quick    # sections 1-4 only, well under a second (run by CI)
node orbits/table.mjs long     # adds the 100-turn runs, about 5 minutes in all
node tests/orbits.mjs          # the checks, about 3 s (also run by npm test)
```

The table exits with an error if any printed value is not a finite number.

## Checks

`tests/orbits.mjs` has 38 checks. Each prints its source, the published or expected value, the model's value and
the tolerance. "#37's review" marks values a reviewer read in the paper's arXiv source.

| What | Against | Kind |
|---|---|---|
| In the 1800–2050 fit, n²a³/GM☉ − 1 below the planets' mass fraction for all eight, and below 5×10⁻⁵ for the inner four | JPL Table 1, IAU 2015, DE430 | published elements; an observed size, not a bound |
| Exponent 3/2, to the most the first check allows | the same | model-internal, independent of GM☉ |
| 4A/Ω = 3 from the model's own curve near Sgr A*; Jacobi radius = Hill radius for a point mass | the model | model-internal |
| The Sun's r_J = 2.8×10⁵ au | Correa-Otto and Calandra 2019 | #37's review; on Jiang and Tremaine's nearby constants |
| S2: Kepler mass, 12.1′ precession, 120 au, 7,700 km/s | GRAVITY 2020 | Table E.1, appendix B, sect. 1.2 |
| Stars weigh 2 M_BH at 3 to 4 pc; the cusp's mass inside 3 pc and 0.01 pc | Schödel et al. 2018; Alexander 2005; Feldmeier-Krause et al. 2017; GRAVITY 2024 | #37's review |
| Kepler slope −1/2 inside 0.1 pc; the −1/4 radius in closed form against bisection | — | model; model-internal |
| ellipticK(1/√2); gammaP(½, x) = erf √x at three points | closed forms | arithmetic |
| MWPotential2014: the 220 km/s normalisation; halo mass 0.8×10¹² inside 245 kpc; the disk's sphere mass tending to its total, and its Kuzmin and Plummer limits; shape within 5% of Eilers et al.; flat (abs. slope < 0.25) at 5 to 25 kpc | Bovy 2015 Table 1; closed forms; Eilers et al. 2019 | model-internal; #37's review; arithmetic |
| Jupiter's and Saturn's tilts to the invariable plane | Souami and Souchay 2012 | search text, not confirmed in the paper |
| Planet: prograde mostly kept at 0.4 r_H and lost by 0.6; prograde edge 0.4 ± 0.1; retrograde edge between 0.7 and 1 r_H | Nesvorný et al. 2003 and Shen and Tremaine 2008, as Shen and Tremaine give them | model; #37's review |
| Retrograde in the plane at 0.85 r_J: mostly lost around a point mass, kept by the Sun | — | model |
| The Jacobi integral kept over 20 turns on an orbit that stays; the Galaxy's ν²/Ω² in SI | equations of motion; Poisson's equation | model-internal; arithmetic |
| The Sun's polar orbits at 0.3 r_J lost by plunging, not escape; a point mass's polar orbits lost between 0.1 and 0.2 r_H before any escapes | Lidov–Kozai | model |
| The Sun: none escape from 0.3 r_J, most by 0.6 | — | model |
| The Sun's all-directions edge within the Oort cloud's quoted 6.5×10⁴ to 2×10⁵ au | Correa-Otto and Calandra 2019; Dones et al. 2004 | #37's review; as cited |

## What the model leaves out

- **The planets' long-period pull on one another.** Kepler's law is checked only to the size of the planets' masses.
- **Hill's problem is the tide to first order, on a circular host orbit.** The study drops the Sun's vertical oscillation through the disk (82 Myr with this model's ν) and its radial epicycles. It also leaves out:
  - passing stars and molecular clouds, which set the Oort cloud's actual edge;
  - the planets' scattering of comets that plunge inward;
  - for moons, the planet's oblateness and its other moons, which damp Lidov–Kozai cycles close in.
- **Circular starting orbits only.** Real moons and comets start on eccentric orbits.
  - **The edges' definition.** They are set at half the orbits escaping, or lost, within 20 turns of the host, on a grid of 0.025 r_J (single planes) or 0.05 r_J (all directions).
  - **Plunge radius.** It is 10⁻³ r_J. Raising it to 10⁻² moves the Sun's all-directions edge from 0.448 to 0.469 (24 directions).
  - **Chaos.** Single-plane edges are chaotic at about the 0.02 level: changing ν²/Ω² by 10⁻⁴ moves the Sun's polar-across escape edge from 0.394 to 0.412.
  - **Longer runs** move the edges inward a little (see the 100-turn values above).
- **MWPotential2014 is one model among many.** Its halo sets the flat range, and it has no nuclear star cluster. The checks pin its halo; the disk's and bulge's shape parameters are taken from galpy's source and not otherwise tested, since Table 1's derived masses were not read for this study. The Galactic-centre numbers use the separate power-law cusp above, which is valid only inside its 3 pc break.
- **Spherical mass estimates.** v²R/G and 3Ω²/4πG treat a flattened galaxy as spherical. In MWPotential2014 this overstates the mass inside 8 kpc by 12%. It shifts the 3.7-fold growth to 4.0 and the Sun's 2.25 to 2.53, but not the contrast with Kepler's fixed mass.

## Sources

Each entry says how it was read. "#37's review" means a reviewer checked the values used here in the arXiv source,
or in the primary file, during #37's review.

- W. M. Folkner et al., *The Planetary and Lunar Ephemerides DE430 and DE431*, IPN Progress Report 42-196 (2014), Table 8. #37's review.
- E. M. Standish and J. G. Williams, *Keplerian Elements for Approximate Positions of the Major Planets*, JPL Solar System Dynamics (1992), Table 1 (1800–2050). Checked against the SSD page in #37's review.
- A. Prša et al., *Nominal values for selected solar and planetary quantities: IAU 2015 Resolution B3*, Astron. J. 152, 41 (2016). https://doi.org/10.3847/0004-6256/152/2/41. #37's review.
- D. Souami and J. Souchay, *The solar system's invariable plane*, A&A 543, A133 (2012). https://doi.org/10.1051/0004-6361/201219011. Search text; not reached in #37's review. The plane's orientation is confirmed through Li, Xia and Zhou 2019; the per-planet tilts are not.
- Li, Xia and Zhou, *Calibration of the angular momenta of the minor planets in the solar system* (2019). https://arxiv.org/abs/1909.11293. For the invariable plane's orientation, as #37's review read it; journal reference not confirmed.
- Y.-F. Jiang and S. Tremaine, *The evolution of wide binary stars*, MNRAS 401, 977 (2010; journal reference recalled). https://arxiv.org/abs/0907.2952. The tidal-radius formula and constants, as #37's review quotes them.
- J. Binney and S. Tremaine, *Galactic Dynamics*, 2nd ed., Princeton (2008). The formula, as Jiang and Tremaine use it; section not confirmed.
- J. Bovy, *Galactic rotation in Gaia DR1*, MNRAS 468, L63 (2017). https://doi.org/10.1093/mnrasl/slx027. #37's review.
- J. A. Correa-Otto and M. F. Calandra, *Stability in the most external region of the Oort Cloud: evolution of the ejected comets*, MNRAS 490, 2495 (2019). https://doi.org/10.1093/mnras/stz2671. #37's review (sect. 4.3).
- Y. Shen and S. Tremaine, *Stability of Distant Satellites of the Giant Planets in the Solar System*, AJ 136, 2453 (2008). https://doi.org/10.1088/0004-6256/136/6/2453. #37's review.
- D. Nesvorný, J. L. A. Alvarellos, L. Dones and H. F. Levison, *Orbital and collisional evolution of the irregular satellites*, AJ 126, 398 (2003). As Shen and Tremaine quote it; reference recalled.
- M. L. Lidov, Planet. Space Sci. 9, 719 (1962), and Y. Kozai, AJ 67, 591 (1962). Recalled.
- C. F. McKee, A. Parravano and D. J. Hollenbach, *Stars, gas, and dark matter in the solar neighborhood*, ApJ 814, 13 (2015). https://arxiv.org/abs/1509.05334. #37's review.
- J. Heisler and S. Tremaine, *The influence of the Galactic tidal field on the Oort comet cloud*, Icarus 65, 13 (1986). Search text; not reached in #37's review.
- L. Dones, P. R. Weissman, H. F. Levison and M. J. Duncan, *Oort cloud formation and dynamics*, in *Comets II*, 153 (2004). As cited in search text, for an outer edge "as far as 2 × 10^5 AU".
- GRAVITY Collaboration, *Detection of the Schwarzschild precession in the orbit of the star S2 near the Galactic centre massive black hole*, A&A 636, L5 (2020). https://doi.org/10.1051/0004-6361/202037813. #37's review (sect. 1.2, appendix B, Table E.1).
- GRAVITY Collaboration, A&A 657, L12 (2022). https://doi.org/10.1051/0004-6361/202142465. #37's review.
- GRAVITY Collaboration, A&A 692, A242 (2024). https://doi.org/10.1051/0004-6361/202452274. #37's review (sect. 4.3).
- R. Schödel, D. Merritt and A. Eckart, A&A 502, 91 (2009). https://doi.org/10.1051/0004-6361/200810922. #37's review.
- R. Schödel et al., A&A 609, A27 (2018). https://doi.org/10.1051/0004-6361/201730452. #37's review (sect. 4.5).
- T. Alexander, *Stellar processes near the massive black hole in the Galactic center*, Phys. Rep. 419, 65 (2005). https://doi.org/10.1016/j.physrep.2005.08.002. #37's review (sect. 3.1.2).
- A. Feldmeier-Krause et al., *Triaxial orbit-based modelling of the Milky Way Nuclear Star Cluster*, MNRAS 466, 4040 (2017). https://doi.org/10.1093/mnras/stw3377. #37's review (sect. 3.3.2).
- D. Merritt, *Dynamics and Evolution of Galactic Nuclei*, Princeton (2013), and D. Merritt, in *Coevolution of Black Holes and Galaxies*, ed. L. C. Ho (2004; recalled). Definitions only, as GRAVITY 2024 and Feldmeier-Krause et al. cite them.
- J. Bovy, *galpy: A Python Library for Galactic Dynamics*, ApJS 216, 29 (2015). https://doi.org/10.1088/0067-0049/216/2/29. Table 1 and galpy's source, #37's review.
- A.-C. Eilers, D. W. Hogg, H.-W. Rix and M. K. Ness, ApJ 871, 120 (2019). https://doi.org/10.3847/1538-4357/aaf648. #37's review (eq. 7).
- J. Bland-Hawthorn and O. Gerhard, *The Galaxy in Context*, ARA&A 54, 529 (2016). https://doi.org/10.1146/annurev-astro-081915-023441. #37's review.
- Y. Jiao et al., A&A 678, A208 (2023). https://doi.org/10.1051/0004-6361/202347513. #37's review.
- O. Koop et al., A&A 692, A50 (2024). https://arxiv.org/abs/2405.19028. #37's review.
- S. S. McGaugh, F. Lelli and J. M. Schombert, PRL 117, 201101 (2016). https://doi.org/10.1103/PhysRevLett.117.201101. #37's review.
- K.-H. Chae, ApJ 952, 128 (2023). https://doi.org/10.3847/1538-4357/ace101. #37's review.
- I. Banik et al., MNRAS 527, 4573 (2024). https://doi.org/10.1093/mnras/stad3393. #37's review.

# fractals

Does reality repeat itself across scales? Atoms look a little like solar systems, solar systems a little
like galaxies, galaxies cluster into clusters. This repository follows that intuition with first
principles and checks it against what is measured: where the repetition is real, where it breaks, and why.

Status: **exploration, not peer reviewed, no new result claimed.** Started 16 October 2026 by Aska Digital
with Claude (Anthropic), for [Foundation0](https://github.com/Foundation-0/f0).

## Where the intuition holds, and where it breaks

- **Atoms are not little solar systems.** In a stationary atomic state, an electron has a spread of
  possible positions rather than a planet's orbit. Repeated measurements on identically prepared atoms
  reveal that spread, even with better instruments. Each reading gives one position. Planets obey the
  same quantum rules, but records left in their surroundings keep their motion close to classical orbits.
- **Except in one case, where gravity builds a real atom.** Very light particles around a spinning black
  hole settle into a cloud with the same shapes and the same pattern of energy levels as a hydrogen atom,
  with gravity in place of electric attraction (the "gravitational atom"). It is still a wave cloud, not
  planets on orbits. The same equation, a wave held by a pull that weakens with distance, gives the same
  solution at any scale. The nesting lives in the equations, not the objects.
- **Quantum paths are fractal, between two lengths.** A free particle's path, recorded by position
  measurements finer than ħ/p, has fractal dimension 2, against 1 for a classical trajectory (Abbott and Wise,
  1981); below ħ/mc, in a single-particle model, the speed of light makes it smooth again. Its surroundings draw
  that roughness only if they kick it harder than its own momentum: a cold atom in a room-temperature vacuum,
  yes; nothing as warm as, and heavier than, the gas around it ([quantum-paths](quantum-paths/)).
- **Cosmic structure is fractal only up to a point.** Galaxies cluster in a fractal-like way on small
  scales, but beyond about 80 to 300 million parsecs (h⁻¹ Mpc, 80 to 300) they are spread almost evenly
  (Scrimgeour et al., 2012). The nesting stops, the way a coastline's roughness stops at the size of molecules.
- **Turbulence repeats, but not exactly.** Between the size where a flow is stirred and the size where viscosity
  takes over, the same energy flux passes through every scale. In a cascade model the flux holds to 0.2% and a
  third-order law that follows from it to 0.1%. The bursts do not scale exactly: the distribution's tails fatten
  from scale to scale (intermittency). Where the cascade ends depends on the medium: about a millimetre in air and
  water, give or take a factor of 10; the ion scales (about 100 km) in the solar wind, where collisions are too
  rare for viscosity and a steeper kinetic cascade takes over; and the sonic scale (about 0.1 pc) in molecular
  clouds. The fractal edges of those clouds (dimension 1.36) agree with laboratory turbulent interfaces in number,
  but the two measure different things ([turbulence](turbulence/)).

## First study: the Witness Map

Why do electrons act as waves and planets do not? Ask any object one question: can it be in two places
at once, a gap Δx apart?

- **Wave clock**: how long its wave needs to spread across the gap, `m·Δx²/ħ`. Heavier things spread slower.
- **Witness clock**: how long until something around it (a scattered photon, a gas atom, its own heat
  glow, a black hole horizon) carries off a record of which place it is in.
- **Witness number** `W = wave clock ÷ witness clock`. Below 1 the wave wins and the object can act
  quantum. Above 1 the witnesses win and it acts classical.

What destroys the wave is the *record*, not the push of the detector: in 1998 Dürr, Nonn and Rempe marked
which path atoms took with a classical kick far too small to matter, and the interference still vanished.
The idea that scattered light carries records of an object's position is also studied by Riedel and
Zurek (2010).

At a 250 nm gap, each object in its usual surroundings:

| Object | W | Main witness |
|---|---|---|
| Electron (lab vacuum) | ~10⁻¹³ | leftover gas |
| Rubidium atom | ~10⁻⁷ | leftover gas |
| Buckyball, C₆₀ | ~10⁻⁴ | its own heat glow |
| Giant molecule, ~2,000 atoms | ~0.03 | its own heat glow |
| Interstellar dust grain | ~10⁷ | starlight |
| Virus (air) | ~10¹⁶ | air molecules |
| Cat | ~10⁴⁸ | air molecules |
| Earth | ~10⁸¹ | sunlight |
| Milky Way | ~10¹¹⁹ | its own starlight |
| Dark matter particle | 0 | nothing |

What it shows:

1. The four objects seen acting as waves in experiments all land on the wave side.
2. Mass enters through the wave clock. Silence the witnesses and big things can cross: a virus in a 4 K
   vacuum scores W ≈ 0.04.
3. A lone dark matter particle has no witnesses at any gap or particle mass. That is a statement about one
   particle. The galaxy-sized wave of wave dark matter is a crowd, and its lumps are watched by every star they
   pass (see [The crowd wave](#the-crowd-wave-where-the-map-stops) below).
4. A black hole horizon is a real witness (Danielson, Satishchandran and Wald, 2022) but a feeble one:
   ten horizon radii from the Milky Way's black hole, a wave dark matter particle split by 1 µm waits about
   10¹⁷⁰ years to be recorded in the formula. This is a formal extrapolation below the particle's reduced
   Compton wavelength, ħ/(mc), about 0.06 pc for 10⁻²² eV. It is not a validated prediction for a particle
   confined to such a small region.

Interactive version: **https://foundation-0.github.io/fractals/** (`index.html` at the root of this repository, served by GitHub Pages; it loads `witness-map/model.js` directly).

## The crowd wave: where the map stops

The map asks about one particle at a time. Wave dark matter in a galaxy is never one particle. If its particle
weighs 10⁻²² eV, each lump of the wave near the Sun is shared by about 10⁹³ particles. So many particles in one
wave act together as an ordinary (classical) wave, the way countless photons make one radio wave (Hui, Ostriker,
Tremaine and Witten 2017). The crowd keeps its own clocks.

**The lumps.** The wave interferes with itself into lumps (granules), seen in simulated halos (Schive, Chiueh and
Broadhurst 2014; Schive et al. 2014). For particle mass m and speed spread σ, the density is correlated over
ƛ = ħ/(mσ) (Bar-Or, Fouvry and Tremaine 2019, eq. 62), and a lump is about half a de Broglie wavelength, πħ/(mσ),
across (Hui et al. 2017). Each lump pulls like one body of mass π^(3/2)·ρ·ƛ³, where ρ is the local density
(Bar-Or et al. 2019, eq. 59).

**Three clocks.**

1. *Lump lifetime, ħ/(mσ²).* The lumps fade and re-form as parts of the wave drift past each other. The density
   at a point forgets itself on this time (Bar-Or et al. 2019, eq. 62), and simulations measure the same
   (Veltmaat, Niemeyer and Schwabe 2018). It is exactly the map's wave clock at a gap of ƛ: m·ƛ²/ħ = ħ/(mσ²).
2. *The core's beat.* At a halo's centre the wave settles into one standing wave, the core or soliton (Schive,
   Chiueh and Broadhurst 2014). Its wave turns over every 2πħ/|E|, where E is its energy level: about 120 million
   years for a core of 0.1 Suns per cubic parsec (Schive, Chiueh and Broadhurst 2020). It also breathes: the
   central density swings by more than a factor of two at f = 10.94 (ρ_c / 10⁹ Suns per kpc³)^(1/2) per billion
   years, and the swing hardly fades over the halo's life (Veltmaat et al. 2018, eq. 16). Stars inside a core feel
   it: the beat would heat the old star cluster at the centre of Eridanus II (Marsh and Niemeyer 2019), and the
   core's wandering can tear that cluster apart within about a billion years (Schive, Chiueh and Broadhurst 2020).
3. *Stirring time.* Passing lumps tug on stars and on each other. The stirring (relaxation) time is how long the
   tugs take to change a star's speed by as much as the halo's own spread of speeds:
   3m³σ⁶ / (16π²G²ρ²ħ³ ln Λ), with ln Λ ≈ ln(2r/ƛ) at distance r from the centre (Bar-Or et al. 2019, eqs. 61
   and 85). Hui et al. (2017, eq. 32) give the same form; Bar-Or et al. find the true rates 2 to 11 times slower.
   The dark matter's own relaxation, which grows the core, runs on a time of the same form (Levkov, Panin and
   Tkachev 2018).

`node witness-map/table.mjs` prints these for three places:

| | Milky Way, Sun's orbit, 10⁻²² eV | Same place, 3×10⁻¹⁹ eV | Core of a dwarf like Eridanus II, 8×10⁻²³ eV |
|---|---|---|---|
| Size | lumps 370 pc across | lumps 0.12 pc across | core 0.7 kpc in radius |
| Mass | 10⁵ Suns per lump | 1.2 Earths per lump | 5×10⁸ Suns |
| Particles sharing it | 10⁹³ | 10⁷⁹ | 10⁹⁷ |
| Fastest clock | lumps live 0.7 million years | lumps live 240 years | wave turns over every 110 million years, breathes every 260 million |
| Stirring time | 5×10¹² years, 340 times the age of the universe | 5×10²² years | not modelled |
| Kick from one lump on a star | 44 m/s | 5 µm/s | not modelled |

Inputs. The Sun is 8.18 kpc from the centre (GRAVITY Collaboration 2019). The circular speed there is 229 km/s
(Eilers et al. 2019), and σ = 229/√2 = 162 km/s, as in an isothermal halo (Bar-Or et al. 2019, eq. 63). The local
dark matter density is 0.4 GeV/cm³ (de Salas and Widmark 2021 review: 0.3 to 0.6). The age of the universe is
13.8 billion years (Planck 2018). The dwarf is the simulated Eridanus II-like halo of Schive, Chiueh and
Broadhurst (2020), with core radius 0.7 kpc. The 3×10⁻¹⁹ eV particle is the lowest mass allowed (at 99% confidence) by the
stars of two ultrafaint dwarf galaxies, which the lumps would stir (Dalal and Kravtsov 2022); the Lyman-α forest requires
more than 2×10⁻²⁰ eV (Rogers and Peiris 2021). Both rule out the 10⁻²² eV benchmark used by the map and by most of
the papers above, if wave dark matter is all of the dark matter. Heavier particles make smaller, lighter,
shorter-lived lumps: lump mass falls as m⁻³ and stirring time grows as m³.

**One particle against the crowd.**

- *One particle has no witnesses. The crowd has many.* Nothing in the map records where one particle is (W = 0).
  A lump is about 10⁹³ particles pulling together, so its pull is 10⁹³ times one particle's. As a lump passes a
  star near the Sun, it changes the star's speed by about 2G·m_lump/(ƛσ) ≈ 44 m/s (impulse estimate), and the star
  meets a fresh lump about every 0.7 million years. A change of tens of metres per second in a star's motion is
  enormous by quantum standards, so the star holds a record of where the lump was. Summed over near and far lumps,
  these kicks give Bar-Or et al.'s stirring time to within a factor of 3 (checked in `npm test`). Allali and
  Hertzberg (2020, 2021) compute gravitational records of this kind, with the galaxy's gas as the recorder, for
  dark matter put in two places at once. In the Milky Way, a superposition of where the dark matter is does not
  survive, while a superposition of the wave's phase does, since the phase shows up in gravity only as faint, fast
  ripples.
- *The crowd's wave survives being watched.* It is a classical wave. Recording the shape of a classical wave does
  not erase it, any more than measuring a sea wave flattens the sea. Witnesses erase superpositions of different
  shapes, and the lumps are interference inside one shape. So the records keep the halo in one definite pattern,
  and that pattern keeps its lumps (Allali and Hertzberg 2020: dark matter condensates decohere fast and are well
  described by classical field theory). Bar-Or et al. (2019) make the same point from the other side: their
  calculation is classical field theory, with quantum mechanics entering only through the way the wave spreads.
- *What W = 0 does say.* Nothing knocks single particles out of the crowd. A particle's whole momentum in the wave
  is about mσ = ħ/ƛ, tiny. A hit from any photon or gas atom, whose wavelength is far shorter than ƛ, would carry
  much more (ħk ≫ ħ/ƛ) and throw the particle out of the wave. Where W is not zero, the per-particle witness rate
  is the rate at which particles leave the crowd.

**Where the map stops applying.**

1. *When particles share their wave.* If one lump holds more than one particle, a lone particle's W does not
   describe what is seen. Wave dark matter always shares: 10⁹³ particles per lump at 10⁻²² eV, 10⁷⁹ at
   3×10⁻¹⁹ eV. Near the Sun the crowd thins to one particle per lump only for particles heavier than about 20 eV
   (model; Bar-Or et al. 2019: "a few tens of eV"). The map's heavy dark matter particle, at 100 GeV, has 10⁻³⁹
   particles per lump: for it, the per-particle picture is the right one.
2. *For the galaxy-sized wave.* The pattern renews every lump lifetime whatever witnesses do, and its lumps are
   watched by every star. W = 0 is silent on both.
3. *For gravity's witnesses.* The map counts a black hole horizon as gravity's only witness, and only for one
   particle. For the crowd, every star is a witness too. Gravity-only witnesses of a single particle are
   [issue #3](https://github.com/Foundation-0/fractals/issues/3).

**Does the crowd belong on the map?** Yes, but not on the W axis. W asks whether one object can be in two places a
gap apart. The crowd's wave is classical, so that is not its live question, and a crowd W would put two different
things on one scale. The interactive page has a separate panel below the map, marked "not a witness number", with
the crowd's clocks set against the age of the universe. In code: `crowd()` and `CROWDS` in `witness-map/model.js`,
a separate table in `node witness-map/table.mjs`, and checks in `npm test`.

**What the crowd model leaves out.** Each place is treated as a uniform patch of halo: no orbits, no tides. The
stirring time needs the orbit to be much larger than a lump (Bar-Or et al. 2019), so it fails near the centre. The
core is taken at the size found in one simulation. The breathing period is Veltmaat et al.'s fit; a rough
first-principles estimate (the gap between the core's two lowest energy levels in its own frozen gravity) gives a
frequency 36% higher.

## Does a black hole shape wave dark matter?

A spinning black hole can grow a cloud of very light particles with hydrogen-like levels (superradiance). For wave
dark matter at 10⁻²² eV around a galaxy's central black hole of 10⁸ to 10⁹ Suns, it cannot in practice: the cloud
would take 10¹⁶ to 10²⁴ times the age of the universe to grow, and out where it would sit the galaxy, not the black
hole, holds the particles. The black hole can still squeeze the galaxy's dense dark matter core by plain gravity,
but only within about 100 pc of the centre, too far in for the lensed images to feel. The cloud is the
[gravitational atom](#second-study-the-gravitational-atom) of the second study; the note's `gravAtom` is a compact
copy of its algebra, and `npm test` fails if the two disagree. Details, the lens systems with anomaly and black
hole data, and a reshaped test: [notes/bh-lensing.md](notes/bh-lensing.md) (issue #1).

## Run it

Needs Node 18 or later, nothing else. The checks run on every pull request, on Node 18, 20 and 22.

```
npm test                                 # checks the model against published numbers
node witness-map/table.mjs               # every object at a 250 nm gap, then the crowd
node witness-map/table.mjs 1e-6 cryo     # 1 µm gap, everything in a 4 K vacuum
node notes/bh-lensing.mjs                # every number in the black hole note
```

`witness-map/model.js` is the whole model, including `gravAtom` for the black hole note. It loads in Node
(`require`) and in a browser (`window.WM`). `npm test` also checks `gravitational-atom/atom.js` (second study,
below).

## Checks

`npm test` compares the model with published numbers. A line marked DIFF is a disagreement recorded in
[CORRECTIONS.md](CORRECTIONS.md); it still passes, but fails if the size of the disagreement changes.

| Check | Published | Model |
|---|---|---|
| Closed-form localisation rates: small grain and large grain in light, grain in air, small glowing sphere | formulas (Schlosshauer 2007; Romero-Isart 2011) | within 2% |
| Joos and Zeh's table: three grain sizes in five surroundings | powers of ten | 11 of 15 within ×5 |
| From it, a 10 µm grain: Big Bang afterglow / sunlight / air (m⁻² s⁻¹) | 10¹⁰ / 10²⁵ / 10⁴⁰ | 1.6×10¹⁰ / 4.4×10²⁵ / 8.6×10⁴⁰ (air: DIFF) |
| Schlosshauer's decoherence times: two sizes in four surroundings | powers of ten | 7 of 8 within ×5 |
| Gravitational channel: Earth split by its radius beside a Sun-mass black hole (Danielson et al., v2, eq. 20) | ~10 µs | 22 µs |
| Electric channel: electron split by 1 m, same black hole (Danielson et al., v2, eq. 16) | ~10⁴³ years | 4×10⁴² years |
| Heated C₇₀ loses half its fringe visibility, 190 m/s beam (Hornberger et al. 2005, Fig. 9) | about 2,500 K | 2,475 K (the point the glow is fitted to) |
| Same, 100 m/s beam | about 2,450 K | 1,960 K (DIFF) |
| Photons given off while the visibility halves (Hackermüller et al. 2004) | one to two | 1.4 |
| C₇₀ glow at 2,500 K: photons above 1.6 eV in a 4 ms transit | about 3 | 0.09 (DIFF) |
| C₇₀ glow power at 3,000 K | 1.1×10⁴ eV/s | 770 eV/s (DIFF) |
| Crowd: lump mass, isothermal halo at 200 km/s, 1 kpc out (Bar-Or et al. 2019, eq. 64) | 1.03×10⁷ Suns | 1.03×10⁷ |
| Crowd: stirring time × ln Λ, same place (eq. 104) | 2.08 billion years | 2.08 |
| Crowd: stirring time over Hui et al.'s relaxation time (2017, eq. 32) | 2 to 11 (Bar-Or et al.) | 8.1 |
| Core peak density, 10⁻²³ eV, 1 kpc core (Schive et al. 2014, eq. 4) | 1.9 Suns per pc³ | 1.94 |
| Core mass inside the core radius (same paper, eq. 3) | 5.5×10⁹ Suns | 5.4×10⁹ |
| Core wave period at 0.1 Suns per pc³ (Schive et al. 2020) | ~120 million years | 121 million |
| Core breathing frequency (Veltmaat et al. 2018, eq. 16) | 0.16 per (Gρ_c)^(-1/2) | 0.22 (frozen-gravity estimate) |

The horizon rows use equation numbers from [arXiv:2205.06279v2](https://arxiv.org/html/2205.06279v2).
Its electric formula (eq. 15) includes the SI vacuum permittivity ε₀ explicitly, as the model does.

The published tables give powers of ten only, so agreement within a few times is as close as the comparison
can go. The tolerance is ×5: half a power of ten for rounding, and a little more for inputs the tables do not
state. The crowd rows compare formulas and fits, so they agree more closely; the core is solved here from
first principles (the ground state of the Schrödinger–Poisson equations), not taken from the fits. Through gravity
alone, the electron of the electric row would wait 5×10¹²⁴ years. The black hole note's checks are listed in
[notes/bh-lensing.md](notes/bh-lensing.md), the gravitational atom's below.

What the re-check found (issue #5, details in CORRECTIONS.md): two coefficient errors, now fixed; a molecule's
glow that is fitted, and gets the onset of decoherence right but the light wrong; and four places where the
published tables are inconsistent, with each other, with their own labels, or with where their formulas apply.
Schlosshauer's 2007 book and Joos and Zeh's 1985 paper were not available; the check uses open copies of their
tables.

## What the model leaves out

- Objects sit still. Fast motion, internal structure and spin are ignored.
- The wave clock assumes speeds far below light speed and is unreliable for gaps below ħ/(mc), the
  reduced Compton wavelength. The particle horizon example also assumes a source confined to a small
  region, which is not justified at those scales.
- W is per particle. Wave dark matter's galaxy-wide wave is a crowd effect, enormous numbers of particles
  sharing one wave. Its clocks are sketched in [The crowd wave](#the-crowd-wave-where-the-map-stops); it gets no
  witness number.
- Gravity's only witness is a black hole horizon. Nudges from passing stars are treated as zero.
- Molecules glow through one fitted number and no electronic gap. The fit puts the loss of C₇₀ interference at
  the measured temperature, but real C₇₀ gives off no light below 1.6 eV and its glow rises as T¹¹, against T⁵
  here (Hornberger et al. 2005). Below 2,000 K nothing checks the molecules' glow.
- Light an object absorbs from its surroundings is not counted. For an object as warm as its surroundings it
  would add as much again as its own glow.
- Every number is good to a factor of a few.

## Second study: the gravitational atom

Hydrogen and a gravitational atom drawn side by side at the same scale:
**https://foundation-0.github.io/fractals/gravitational-atom/** (`gravitational-atom/index.html`, which loads
`gravitational-atom/atom.js`, the whole model; `window.GA` in a browser, `require` in Node).

A particle of mass μ held by a pull that weakens as 1/r has levels E = μc²(1 − α²/2n²), a Bohr radius
a₀ = ħ/(μcα), and the same wave shapes in units of a₀. Hydrogen: α = e²/(4πε₀ħc) ≈ 1/137. A black hole of
mass M and a boson of mass μ: α = GMμ/(ħc), the hole's size over the particle's wavelength, so a₀ = r_g/α²
(Baumann, Chia and Porto 2019, eqs. 2.5 to 2.9).

In their example, 5 million Suns and a boson of 10⁻¹⁷ eV:

- α = r_g/λ_c = 7.4×10⁹ m ÷ 2.0×10¹⁰ m = 0.37, against 0.0073 for hydrogen.
- a₀ = 0.35 AU, 10²¹ times hydrogen's 0.529 Å. The 211 cloud is most likely found 4a₀ = 1.4 AU out.
- The ground state is bound by 7.0×10⁻¹⁹ eV, 5×10⁻²⁰ times hydrogen's 13.6 eV, but that is 7% of the
  particle's rest energy against 27 parts per million for hydrogen. So relativity matters more: the first
  correction to the 211 level is −11% (their eq. 2.10).
- The horizon at the centre has radius 0.16a₀ at spin 0.99. A proton is 1.6×10⁻⁵a₀. The horizon is not a wall:
  a state whose pattern turns slower than the horizon grows by taking the hole's spin (superradiance), the
  rest drain in. Here both 211 and 322 can grow; at leading order 211 grows by a factor e every 45 years,
  322 every 31,000 years.

### Checks

| Check | Published | Model |
|---|---|---|
| Hydrogen binding, fixed proton (CODATA 2022 Rydberg energy) | 13.605693 eV | 13.605693 eV |
| Bohr radius (CODATA 2022) | 0.529177 Å | 0.529177 Å |
| Hydrogen ionization energy, proton allowed to recoil (NIST ASD) | 13.598435 eV | 13.598287 eV; the gap is mostly fine structure |
| α for 3 Suns and 10⁻¹² eV (BCP 2019, eq. 2.6) | ≈ 0.02 | 0.0224 |
| α for 5×10⁶ Suns and 10⁻¹⁷ eV (BCP 2019, sec. 4.3) | ≈ 0.37 | 0.374 |
| Gravitational waves from a real-field cloud (BCP 2019, eq. 4.1 and sec. 4.3) | 484 Hz per 10⁻¹² eV; ≈ 5 mHz | 483.6 Hz; 4.84 mHz |
| Largest α at which 211 grows, spin 0.8 (BCP 2019, sec. 2.2, from Dolan 2007) | 0.25 | 0.252 |
| Most likely radius, n²r_g/α² (BCP 2019, eq. 2.9) | 4a₀ and 9a₀ | 4.000a₀ and 9.000a₀ |
| 211 e-folding time, 10 Suns, α = 0.3, spin 0.9 (Arvanitaki, Baryakhtar and Huang 2015, Table I) | ~10⁻⁴ years | 4×10⁻⁴ years |
| Fastest 211 growth, spin 0.99, α = 0.42 (Dolan 2007) | 1.5×10⁻⁷ c/r_g | 9.3×10⁻⁹ c/r_g, 16× too slow |
| Bosons in a 10-Sun cloud that took 0.1 of the spin (ABH 2015, eq. 8) | ~10⁷⁶ | 8×10⁷⁶ |

The two growth-rate rows show where the model stops: growth rates use the leading-order formula (Detweiler 1980,
as corrected in BCP 2019, eq. 2.12), which is good at small α and several times too slow near the fastest
growth. The page says so next to every growth time.

One bound in the sources is looser than the formula behind it. BCP 2019 give α < 0.5 as the upper limit
for 211 growth, "assuming an initial BH spin of ã = 0.99" (eq. 2.14). Their own condition (eq. 2.1) gives
about 0.44 at that spin; 0.5 is the limit for a maximally spinning hole (as in Arvanitaki, Baryakhtar and
Huang 2015, eq. 6).

What the gravitational-atom model leaves out: everything past leading order in α; the cloud's own gravity
and the hole's loss of mass; interactions between the particles; anything else near the hole.

Mistakes found along the way are in [CORRECTIONS.md](CORRECTIONS.md). Open questions are the
[issues](https://github.com/Foundation-0/fractals/issues).

## Sources

- E. Joos and H. D. Zeh, *The emergence of classical properties through interaction with the environment*, Z. Phys. B 59, 223 (1985). https://doi.org/10.1007/BF01725541
- S. Dürr, T. Nonn and G. Rempe, *Origin of quantum-mechanical complementarity probed by a "which-way" experiment in an atom interferometer*, Nature 395, 33 (1998). https://doi.org/10.1038/25653
- L. Hackermüller et al., *Decoherence of matter waves by thermal emission of radiation*, Nature 427, 711 (2004). https://doi.org/10.1038/nature02276 (https://arxiv.org/abs/quant-ph/0402146)
- K. Hornberger, L. Hackermüller and M. Arndt, *Influence of molecular temperature on the coherence of fullerenes in a near-field interferometer*, Phys. Rev. A 71, 023601 (2005). https://doi.org/10.1103/PhysRevA.71.023601 (https://arxiv.org/abs/quant-ph/0412003)
- M. Schlosshauer, *Decoherence and the Quantum-to-Classical Transition* (Springer, 2007). Not consulted directly; see the next two. https://doi.org/10.1007/978-3-540-35775-9
- M. Schlosshauer, *The quantum-to-classical transition and decoherence* (2014), Table I. https://arxiv.org/abs/1404.2635
- M. Schlosshauer, *Quantum decoherence*, Phys. Rep. 831, 1 (2019), Table 1 and eqs. 65–70. https://doi.org/10.1016/j.physrep.2019.10.001 (https://arxiv.org/abs/1911.06282)
- Copies of the Joos–Zeh table: C. Kiefer and E. Joos, Lect. Notes Phys. 517, 105 (1999), https://doi.org/10.1007/BFb0105342 (https://arxiv.org/abs/quant-ph/9803052); E. Joos, Lect. Notes Phys. 538, 1 (2000), https://doi.org/10.1007/3-540-46657-6_1 (https://arxiv.org/abs/quant-ph/9908008); C. Kiefer, Lect. Notes Phys. 541, 158 (2000), https://doi.org/10.1007/3-540-46634-7_7 (https://arxiv.org/abs/gr-qc/9906100); E. Joos, Séminaire Poincaré 1, 133 (2005), also in *Quantum Decoherence*, Prog. Math. Phys. 48, 177 (2006), https://doi.org/10.1007/978-3-7643-7808-0_6 (https://arxiv.org/abs/quant-ph/0512079)
- M. Tegmark, *Apparent wave function collapse caused by scattering*, Found. Phys. Lett. 6, 571 (1993). https://doi.org/10.1007/BF00662807 (https://arxiv.org/abs/gr-qc/9310032)
- O. Romero-Isart, *Quantum superposition of massive objects and collapse models*, Phys. Rev. A 84, 052121 (2011), eqs. 26, 28, 29. https://doi.org/10.1103/PhysRevA.84.052121 (https://arxiv.org/abs/1110.4495)
- M. Schut et al., *Improving resilience of quantum-gravity-induced entanglement of masses to decoherence using three superpositions*, Phys. Rev. A 105, 032411 (2022), eq. B5, which quotes Schlosshauer's air formula. https://doi.org/10.1103/PhysRevA.105.032411 (https://arxiv.org/abs/2110.14695)
- C. F. Bohren and D. R. Huffman, *Absorption and Scattering of Light by Small Particles* (Wiley, 1983), ch. 5.
- D. L. Danielson, G. Satishchandran and R. M. Wald, *Black holes decohere quantum superpositions*, Int. J. Mod. Phys. D 31, 2241003 (2022). https://doi.org/10.1142/S0218271822410036 (https://arxiv.org/abs/2205.06279v2)
- C. J. Riedel and W. H. Zurek, *Quantum Darwinism in an everyday environment: huge redundancy in scattered photons*, Phys. Rev. Lett. 105, 020404 (2010). https://doi.org/10.1103/PhysRevLett.105.020404 (https://arxiv.org/abs/1001.3419)
- L. F. Abbott and M. B. Wise, *Dimension of a quantum-mechanical path*, Am. J. Phys. 49, 37 (1981). https://doi.org/10.1119/1.12657
- M. Scrimgeour et al., *The WiggleZ Dark Energy Survey: the transition to large-scale cosmic homogeneity*, MNRAS 425, 116–134 (2012). https://doi.org/10.1111/j.1365-2966.2012.21402.x (https://arxiv.org/abs/1205.6812)
- D. Baumann, H. S. Chia and R. A. Porto, *Probing ultralight bosons with binary black holes*, Phys. Rev. D 99, 044001 (2019). https://doi.org/10.1103/PhysRevD.99.044001 (https://arxiv.org/abs/1804.03208)
- R. Brito, V. Cardoso and P. Pani, *Superradiance: New Frontiers in Black Hole Physics*, Lect. Notes Phys. 971 (2020). https://doi.org/10.1007/978-3-030-46622-0 (https://arxiv.org/abs/1501.06570)
- A. Arvanitaki, M. Baryakhtar and X. Huang, *Discovering the QCD axion with black holes and gravitational waves*, Phys. Rev. D 91, 084011 (2015). https://doi.org/10.1103/PhysRevD.91.084011 (https://arxiv.org/abs/1411.2263)
- S. Detweiler, *Klein-Gordon equation and rotating black holes*, Phys. Rev. D 22, 2323 (1980). https://doi.org/10.1103/PhysRevD.22.2323
- S. R. Dolan, *Instability of the massive Klein-Gordon field on the Kerr spacetime*, Phys. Rev. D 76, 084001 (2007). https://doi.org/10.1103/PhysRevD.76.084001 (https://arxiv.org/abs/0705.2880)
- CODATA 2022 recommended values of the fundamental physical constants, NIST. https://physics.nist.gov/constants
- A. Kramida, Yu. Ralchenko, J. Reader and NIST ASD Team, *NIST Atomic Spectra Database* (ver. 5.12, 2024): ionization energy of hydrogen and the 2p and 3d transition rates. https://doi.org/10.18434/T4W30F (https://physics.nist.gov/asd)
- A. Prša et al., *Nominal values for selected solar and planetary quantities: IAU 2015 Resolution B3*, Astron. J. 152, 41 (2016). https://doi.org/10.3847/0004-6256/152/2/41 (https://arxiv.org/abs/1605.09788)
- Planck Collaboration, *Planck 2018 results. VI. Cosmological parameters*, Astron. Astrophys. 641, A6 (2020), for the age of the universe, 13.8 billion years. https://doi.org/10.1051/0004-6361/201833910 (https://arxiv.org/abs/1807.06209)
- D. J. Griffiths and D. F. Schroeter, *Introduction to Quantum Mechanics*, 3rd ed. (Cambridge, 2018), sec. 4.2, for the hydrogen wavefunctions. https://doi.org/10.1017/9781316995433
- H. Davoudiasl and P. B. Denton, *Ultralight boson dark matter and Event Horizon Telescope observations of M87\**, Phys. Rev. Lett. 123, 021102 (2019). https://doi.org/10.1103/PhysRevLett.123.021102 (https://arxiv.org/abs/1904.09242)

The crowd wave:

- L. Hui, J. P. Ostriker, S. Tremaine and E. Witten, *Ultralight scalars as cosmological dark matter*, Phys. Rev. D 95, 043541 (2017). https://doi.org/10.1103/PhysRevD.95.043541 (https://arxiv.org/abs/1610.08297)
- B. Bar-Or, J.-B. Fouvry and S. Tremaine, *Relaxation in a fuzzy dark matter halo*, ApJ 871, 28 (2019). https://doi.org/10.3847/1538-4357/aaf28c (https://arxiv.org/abs/1809.07673)
- H.-Y. Schive, T. Chiueh and T. Broadhurst, *Cosmic structure as the quantum interference of a coherent dark wave*, Nature Physics 10, 496 (2014). https://doi.org/10.1038/nphys2996 (https://arxiv.org/abs/1406.6586)
- H.-Y. Schive et al., *Understanding the core-halo relation of quantum wave dark matter from 3D simulations*, Phys. Rev. Lett. 113, 261302 (2014). https://doi.org/10.1103/PhysRevLett.113.261302 (https://arxiv.org/abs/1407.7762)
- H.-Y. Schive, T. Chiueh and T. Broadhurst, *Soliton random walk and the cluster-stripping problem in ultralight dark matter*, Phys. Rev. Lett. 124, 201301 (2020). https://doi.org/10.1103/PhysRevLett.124.201301 (https://arxiv.org/abs/1912.09483)
- J. Veltmaat, J. C. Niemeyer and B. Schwabe, *Formation and structure of ultralight bosonic dark matter halos*, Phys. Rev. D 98, 043509 (2018). https://doi.org/10.1103/PhysRevD.98.043509 (https://arxiv.org/abs/1804.09647)
- D. G. Levkov, A. G. Panin and I. I. Tkachev, *Gravitational Bose-Einstein condensation in the kinetic regime*, Phys. Rev. Lett. 121, 151301 (2018). https://doi.org/10.1103/PhysRevLett.121.151301 (https://arxiv.org/abs/1804.05857)
- I. Allali and M. P. Hertzberg, *Gravitational decoherence of dark matter*, JCAP 07, 056 (2020). https://doi.org/10.1088/1475-7516/2020/07/056 (https://arxiv.org/abs/2005.12287)
- I. J. Allali and M. P. Hertzberg, *General relativistic decoherence with applications to dark matter detection*, Phys. Rev. Lett. 127, 031301 (2021). https://doi.org/10.1103/PhysRevLett.127.031301 (https://arxiv.org/abs/2103.15892)
- D. J. E. Marsh and J. C. Niemeyer, *Strong constraints on fuzzy dark matter from ultrafaint dwarf galaxy Eridanus II*, Phys. Rev. Lett. 123, 051103 (2019). https://doi.org/10.1103/PhysRevLett.123.051103 (https://arxiv.org/abs/1810.08543)
- N. Dalal and A. Kravtsov, *Excluding fuzzy dark matter with sizes and stellar kinematics of ultrafaint dwarf galaxies*, Phys. Rev. D 106, 063517 (2022). https://doi.org/10.1103/PhysRevD.106.063517 (https://arxiv.org/abs/2203.05750)
- K. K. Rogers and H. V. Peiris, *Strong bound on canonical ultralight axion dark matter from the Lyman-alpha forest*, Phys. Rev. Lett. 126, 071302 (2021). https://doi.org/10.1103/PhysRevLett.126.071302 (https://arxiv.org/abs/2007.12705)
- P. F. de Salas and A. Widmark, *Dark matter local density determination: recent observations and future prospects*, Rep. Prog. Phys. 84, 104901 (2021). https://doi.org/10.1088/1361-6633/ac24e7 (https://arxiv.org/abs/2012.11477)
- A.-C. Eilers, D. W. Hogg, H.-W. Rix and M. K. Ness, *The circular velocity curve of the Milky Way from 5 to 25 kpc*, ApJ 871, 120 (2019). https://doi.org/10.3847/1538-4357/aaf648 (https://arxiv.org/abs/1810.09466)
- GRAVITY Collaboration, *A geometric distance measurement to the Galactic Center black hole with 0.3% uncertainty*, A&A 625, L10 (2019). https://doi.org/10.1051/0004-6361/201935656 (https://arxiv.org/abs/1904.05721)

## Licence

Apache License 2.0.

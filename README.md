# fractals

Does reality repeat itself across scales? Atoms look a little like solar systems, solar systems a little
like galaxies, galaxies cluster into clusters. This repository follows that intuition with first
principles and checks it against what is measured: where the repetition is real, where it breaks, and why.

Status: **exploration, not peer reviewed, no new result claimed.** Started 16 October 2026 by Aska Digital
with Claude (Anthropic), for [Foundation0](https://github.com/Foundation-0/f0).

## Where the intuition holds, and where it breaks

- **Atoms are not little solar systems.** An electron does not follow an orbit; it has a spread of
  possible positions, and that spread does not shrink with better instruments. Planets show nothing like
  it. The two follow different equations.
- **Except in one case, where they are.** Very light particles around a spinning black hole settle into
  a cloud with the same energy levels as a hydrogen atom, with gravity in place of electric attraction
  (the "gravitational atom"). The same equation, a wave held by a pull that weakens with distance, gives
  the same solution at any scale. The nesting lives in the equations, not the objects.
- **Quantum paths are fractal.** A free quantum particle's path has fractal dimension 2, against 1 for a
  classical trajectory (Abbott and Wise, 1981), the same roughness as a pollen grain jostled by molecules.
- **Cosmic structure is fractal only up to a point.** Galaxies cluster in a fractal-like way on small
  scales, but beyond about 80 to 300 million parsecs (h⁻¹ Mpc, 80 to 300) they are spread almost evenly
  (Scrimgeour et al., 2012). The nesting stops, the way a coastline's roughness stops at the size of molecules.

## First study: the Witness Map

Why do electrons act as waves and planets do not? Ask any object one question: can it be in two places
at once, a gap Δx apart?

- **Wave clock**: how long its wave needs to spread across the gap, `m·Δx²/ħ`. Heavier things spread slower.
- **Witness clock**: how long until something around it (a scattered photon, a gas atom, its own heat
  glow, a black hole horizon) carries off a record of which place it is in.
- **Witness number** `W = wave clock ÷ witness clock`. Below 1 the wave wins and the object can act
  quantum. Above 1 the witnesses win and it acts classical.

What destroys the wave is the *record*, not the push of the detector: in 1998 Dürr, Nonn and Rempe marked
which path atoms took with a push far too small to matter, and the interference still vanished.

At a 250 nm gap, each object in its usual surroundings:

| Object | W | Main witness |
|---|---|---|
| Electron (lab vacuum) | ~10⁻¹³ | leftover gas |
| Rubidium atom | ~10⁻⁷ | leftover gas |
| Buckyball, C₆₀ | ~10⁻⁴ | its own heat glow |
| Giant molecule, ~2,000 atoms | ~0.05 | its own heat glow |
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
   10¹⁷⁰ years to be recorded.

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

## Run it

Needs Node 18 or later, nothing else.

```
npm test                                 # checks the model against published numbers
node witness-map/table.mjs               # every object at a 250 nm gap, then the crowd
node witness-map/table.mjs 1e-6 cryo     # 1 µm gap, everything in a 4 K vacuum
```

`witness-map/model.js` is the whole model. It loads in Node (`require`) and in a browser (`window.WM`).

## Checks

`npm test` compares the model with published numbers:

| Check | Published | Model |
|---|---|---|
| Localisation by the Big Bang afterglow, 10 µm grain (Joos and Zeh 1985) | 10¹⁰ m⁻² s⁻¹ | 1.6×10¹⁰ |
| Localisation by sunlight, same grain | 10²⁵ | 4.4×10²⁵ |
| Localisation by air, same grain | 10⁴¹ | 2.7×10⁴¹ |
| Earth split by its radius beside a Sun-mass black hole (Wald et al., eq. 20) | ~10 µs | 22 µs |
| Electron split by 1 m, same black hole (eq. 16) | ~10⁴³ years | 4×10⁴² years |
| Heated buckyball loses interference (Hackermüller et al. 2004) | a few thousand K | ~1 photon per transit between 2,000 and 3,500 K |
| Crowd: lump mass, isothermal halo at 200 km/s, 1 kpc out (Bar-Or et al. 2019, eq. 64) | 1.03×10⁷ Suns | 1.03×10⁷ |
| Crowd: stirring time × ln Λ, same place (eq. 104) | 2.08 billion years | 2.08 |
| Crowd: stirring time over Hui et al.'s relaxation time (2017, eq. 32) | 2 to 11 (Bar-Or et al.) | 8.1 |
| Core peak density, 10⁻²³ eV, 1 kpc core (Schive et al. 2014, eq. 4) | 1.9 Suns per pc³ | 1.94 |
| Core mass inside the core radius (same paper, eq. 3) | 5.5×10⁹ Suns | 5.4×10⁹ |
| Core wave period at 0.1 Suns per pc³ (Schive et al. 2020) | ~120 million years | 121 million |
| Core breathing frequency (Veltmaat et al. 2018, eq. 16) | 0.16 per (Gρ_c)^(-1/2) | 0.22 (frozen-gravity estimate) |

The published table values are themselves powers of ten, so agreement within a few times is as close as
the comparison can go. The crowd rows compare formulas and fits, so they agree more closely; the core is solved
here from first principles (the ground state of the Schrödinger–Poisson equations), not taken from the fits.

## What the model leaves out

- Objects sit still. Fast motion, internal structure and spin are ignored.
- W is per particle. Wave dark matter's galaxy-wide wave is a crowd effect, enormous numbers of particles
  sharing one wave. Its clocks are sketched in [The crowd wave](#the-crowd-wave-where-the-map-stops); it gets no
  witness number.
- Gravity's only witness is a black hole horizon. Nudges from passing stars are treated as zero.
- Every number is good to a factor of a few.

Mistakes found along the way are in [CORRECTIONS.md](CORRECTIONS.md). Open questions are the
[issues](https://github.com/Foundation-0/fractals/issues).

## Sources

- E. Joos and H. D. Zeh, *The emergence of classical properties through interaction with the environment*, Z. Phys. B 59, 223 (1985). https://doi.org/10.1007/BF01725541
- S. Dürr, T. Nonn and G. Rempe, *Origin of quantum-mechanical complementarity probed by a "which-way" experiment in an atom interferometer*, Nature 395, 33 (1998). https://doi.org/10.1038/25653
- L. Hackermüller et al., *Decoherence of matter waves by thermal emission of radiation*, Nature 427, 711 (2004).
- D. L. Danielson, G. Satishchandran and R. M. Wald, *Black holes decohere quantum superpositions* (2022). https://arxiv.org/abs/2205.06279
- C. J. Riedel and W. H. Zurek, *Quantum Darwinism in an everyday environment* (2010). https://arxiv.org/abs/1001.3419
- M. Bild et al., *Schrödinger cat states of a 16-microgram mechanical oscillator*, Science (2023). https://arxiv.org/abs/2211.00449
- L. F. Abbott and M. B. Wise, *Dimension of a quantum-mechanical path*, Am. J. Phys. 49, 37 (1981).
- M. Scrimgeour et al., *The WiggleZ Dark Energy Survey: the transition to large-scale cosmic homogeneity* (2012). https://arxiv.org/abs/1205.6812
- D. Baumann, H. S. Chia and R. A. Porto, *Probing ultralight bosons with binary black holes*, Phys. Rev. D 99, 044001 (2019).
- A. Amruth et al., *Einstein rings modulated by wavelike dark matter from anomalies in gravitationally lensed images*, Nature Astronomy (2023). https://arxiv.org/abs/2304.09895

The crowd wave:

- L. Hui, J. P. Ostriker, S. Tremaine and E. Witten, *Ultralight scalars as cosmological dark matter*, Phys. Rev. D 95, 043541 (2017). https://arxiv.org/abs/1610.08297
- B. Bar-Or, J.-B. Fouvry and S. Tremaine, *Relaxation in a fuzzy dark matter halo*, ApJ 871, 28 (2019). https://arxiv.org/abs/1809.07673
- H.-Y. Schive, T. Chiueh and T. Broadhurst, *Cosmic structure as the quantum interference of a coherent dark wave*, Nature Physics 10, 496 (2014). https://arxiv.org/abs/1406.6586
- H.-Y. Schive et al., *Understanding the core-halo relation of quantum wave dark matter from 3D simulations*, Phys. Rev. Lett. 113, 261302 (2014). https://arxiv.org/abs/1407.7762
- H.-Y. Schive, T. Chiueh and T. Broadhurst, *Soliton random walk and the cluster-stripping problem in ultralight dark matter*, Phys. Rev. Lett. 124, 201301 (2020). https://arxiv.org/abs/1912.09483
- J. Veltmaat, J. C. Niemeyer and B. Schwabe, *Formation and structure of ultralight bosonic dark matter halos*, Phys. Rev. D 98, 043509 (2018). https://arxiv.org/abs/1804.09647
- D. G. Levkov, A. G. Panin and I. I. Tkachev, *Gravitational Bose-Einstein condensation in the kinetic regime*, Phys. Rev. Lett. 121, 151301 (2018). https://arxiv.org/abs/1804.05857
- I. Allali and M. P. Hertzberg, *Gravitational decoherence of dark matter*, JCAP 07 (2020) 056. https://arxiv.org/abs/2005.12287
- I. J. Allali and M. P. Hertzberg, *General relativistic decoherence with applications to dark matter detection*, Phys. Rev. Lett. 127, 031301 (2021). https://arxiv.org/abs/2103.15892
- D. J. E. Marsh and J. C. Niemeyer, *Strong constraints on fuzzy dark matter from ultrafaint dwarf galaxy Eridanus II*, Phys. Rev. Lett. 123, 051103 (2019). https://arxiv.org/abs/1810.08543
- N. Dalal and A. Kravtsov, *Excluding fuzzy dark matter with sizes and stellar kinematics of ultrafaint dwarf galaxies*, Phys. Rev. D 106, 063517 (2022). https://arxiv.org/abs/2203.05750
- K. K. Rogers and H. V. Peiris, *Strong bound on canonical ultralight axion dark matter from the Lyman-alpha forest*, Phys. Rev. Lett. 126, 071302 (2021). https://arxiv.org/abs/2007.12705
- P. F. de Salas and A. Widmark, *Dark matter local density determination: recent observations and future prospects*, Rep. Prog. Phys. 84, 104901 (2021). https://arxiv.org/abs/2012.11477
- A.-C. Eilers, D. W. Hogg, H.-W. Rix and M. K. Ness, *The circular velocity curve of the Milky Way from 5 to 25 kpc*, ApJ 871, 120 (2019). https://arxiv.org/abs/1810.09466
- GRAVITY Collaboration, *A geometric distance measurement to the Galactic Center black hole with 0.3% uncertainty*, A&A 625, L10 (2019). https://arxiv.org/abs/1904.05721
- Planck Collaboration, *Planck 2018 results. VI. Cosmological parameters*, A&A 641, A6 (2020). https://arxiv.org/abs/1807.06209

## Licence

Apache License 2.0.

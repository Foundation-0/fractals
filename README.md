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
- **Except in one case, where gravity builds a real atom.** Very light particles around a spinning black
  hole settle into a cloud with the same shapes and the same pattern of energy levels as a hydrogen atom,
  with gravity in place of electric attraction (the "gravitational atom"). It is still a wave cloud, not
  planets on orbits. The same equation, a wave held by a pull that weakens with distance, gives the same
  solution at any scale. The nesting lives in the equations, not the objects.
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
3. Dark matter has no witnesses at any gap or particle mass, which is part of what makes a galaxy-sized
   dark matter wave possible.
4. A black hole horizon is a real witness (Danielson, Satishchandran and Wald, 2022) but a feeble one:
   ten horizon radii from the Milky Way's black hole, a wave dark matter particle split by 1 µm waits about
   10¹⁷⁰ years to be recorded.

Interactive version: **https://foundation-0.github.io/fractals/** (`index.html` at the root of this repository, served by GitHub Pages; it loads `witness-map/model.js` directly).

## Run it

Needs Node 18 or later, nothing else.

```
npm test                                 # checks the model against published numbers
node witness-map/table.mjs               # every object at a 250 nm gap
node witness-map/table.mjs 1e-6 cryo     # 1 µm gap, everything in a 4 K vacuum
```

`witness-map/model.js` is the whole model. It loads in Node (`require`) and in a browser (`window.WM`).
`npm test` also checks `gravitational-atom/atom.js` (second study, below).

## Checks

`npm test` compares the model with published numbers. A line marked DIFF is a disagreement recorded in
[CORRECTIONS.md](CORRECTIONS.md); it still passes, but fails if the size of the disagreement changes.

| Check | Published | Model |
|---|---|---|
| Closed-form localisation rates: small grain and large grain in light, grain in air, small glowing sphere | formulas (Schlosshauer 2007; Romero-Isart 2011) | within 2% |
| Joos and Zeh's table: three grain sizes in five surroundings | powers of ten | 11 of 15 within ×5 |
| From it, a 10 µm grain: Big Bang afterglow / sunlight / air (m⁻² s⁻¹) | 10¹⁰ / 10²⁵ / 10⁴⁰ | 1.6×10¹⁰ / 4.4×10²⁵ / 8.6×10⁴⁰ (air: DIFF) |
| Schlosshauer's decoherence times: two sizes in four surroundings | powers of ten | 7 of 8 within ×5 |
| Earth split by its radius beside a Sun-mass black hole (Wald et al., eq. 20) | ~10 µs | 22 µs |
| Electron split by 1 m, same black hole (eq. 16) | ~10⁴³ years | 4×10⁴² years |
| Heated C₇₀ loses half its fringe visibility, 190 m/s beam (Hornberger et al. 2005, Fig. 9) | about 2,500 K | 2,475 K (the point the glow is fitted to) |
| Same, 100 m/s beam | about 2,450 K | 1,960 K (DIFF) |
| Photons given off while the visibility halves (Hackermüller et al. 2004) | one to two | 1.4 |
| C₇₀ glow at 2,500 K: photons above 1.6 eV in a 4 ms transit | about 3 | 0.09 (DIFF) |
| C₇₀ glow power at 3,000 K | 1.1×10⁴ eV/s | 770 eV/s (DIFF) |

The published tables give powers of ten only, so agreement within a few times is as close as the comparison
can go. The tolerance is ×5: half a power of ten for rounding, and a little more for inputs the tables do not
state.

What the re-check found (issue #5, details in CORRECTIONS.md): two coefficient errors, now fixed; a molecule's
glow that is fitted, and gets the onset of decoherence right but the light wrong; and four places where the
published tables are inconsistent, with each other, with their own labels, or with where their formulas apply.
Schlosshauer's 2007 book and Joos and Zeh's 1985 paper were not available; the check uses open copies of their
tables.

## What the model leaves out

- Objects sit still. Fast motion, internal structure and spin are ignored.
- W is per particle. Wave dark matter's galaxy-wide wave is a crowd effect, enormous numbers of particles
  sharing one wave, which is not modelled.
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
- K. Hornberger, L. Hackermüller and M. Arndt, *Influence of molecular temperature on the coherence of fullerenes in a near-field interferometer*, Phys. Rev. A 71, 023601 (2005). https://arxiv.org/abs/quant-ph/0412003
- M. Schlosshauer, *Decoherence and the Quantum-to-Classical Transition* (Springer, 2007). Not consulted directly; see the next two.
- M. Schlosshauer, *The quantum-to-classical transition and decoherence* (2014), Table I. https://arxiv.org/abs/1404.2635
- M. Schlosshauer, *Quantum decoherence*, Phys. Rep. 831, 1 (2019), Table 1 and eqs. 65–70. https://arxiv.org/abs/1911.06282
- Copies of the Joos–Zeh table: C. Kiefer and E. Joos (1998), https://arxiv.org/abs/quant-ph/9803052 ; E. Joos (1999), https://arxiv.org/abs/quant-ph/9908008 ; C. Kiefer (1999), https://arxiv.org/abs/gr-qc/9906100 ; E. Joos, Séminaire Poincaré 2, 1 (2005), https://arxiv.org/abs/quant-ph/0512079
- M. Tegmark, *Apparent wave function collapse caused by scattering*, Found. Phys. Lett. 6, 571 (1993). https://arxiv.org/abs/gr-qc/9310032
- O. Romero-Isart, *Quantum superposition of massive objects and collapse models*, Phys. Rev. A 84, 052121 (2011), eqs. 26, 28, 29. https://arxiv.org/abs/1110.4495
- M. Schut et al., *Improving resilience of the Quantum Gravity Induced Entanglement of Masses (QGEM) to decoherence using 3 superpositions* (2021), eq. B5, which quotes Schlosshauer's air formula. https://arxiv.org/abs/2110.14695
- C. F. Bohren and D. R. Huffman, *Absorption and Scattering of Light by Small Particles* (Wiley, 1983), ch. 5.
- D. L. Danielson, G. Satishchandran and R. M. Wald, *Black holes decohere quantum superpositions* (2022). https://arxiv.org/abs/2205.06279
- C. J. Riedel and W. H. Zurek, *Quantum Darwinism in an everyday environment* (2010). https://arxiv.org/abs/1001.3419
- M. Bild et al., *Schrödinger cat states of a 16-microgram mechanical oscillator*, Science (2023). https://arxiv.org/abs/2211.00449
- L. F. Abbott and M. B. Wise, *Dimension of a quantum-mechanical path*, Am. J. Phys. 49, 37 (1981).
- M. Scrimgeour et al., *The WiggleZ Dark Energy Survey: the transition to large-scale cosmic homogeneity* (2012). https://arxiv.org/abs/1205.6812
- D. Baumann, H. S. Chia and R. A. Porto, *Probing ultralight bosons with binary black holes*, Phys. Rev. D 99, 044001 (2019). https://arxiv.org/abs/1804.03208
- R. Brito, V. Cardoso and P. Pani, *Superradiance: New Frontiers in Black Hole Physics*, Lect. Notes Phys. 971 (2020). https://arxiv.org/abs/1501.06570
- A. Arvanitaki, M. Baryakhtar and X. Huang, *Discovering the QCD axion with black holes and gravitational waves*, Phys. Rev. D 91, 084011 (2015). https://arxiv.org/abs/1411.2263
- S. Detweiler, *Klein-Gordon equation and rotating black holes*, Phys. Rev. D 22, 2323 (1980). https://doi.org/10.1103/PhysRevD.22.2323
- S. R. Dolan, *Instability of the massive Klein-Gordon field on the Kerr spacetime*, Phys. Rev. D 76, 084001 (2007). https://arxiv.org/abs/0705.2880
- CODATA 2022 recommended values of the fundamental physical constants, NIST. https://physics.nist.gov/constants
- NIST Atomic Spectra Database: ionization energy of hydrogen and the 2p and 3d transition rates. https://physics.nist.gov/asd
- A. Prša et al., *Nominal values for selected solar and planetary quantities: IAU 2015 Resolution B3*, Astron. J. 152, 41 (2016). https://arxiv.org/abs/1605.09788
- Planck Collaboration, *Planck 2018 results. VI. Cosmological parameters*, Astron. Astrophys. 641, A6 (2020), for the age of the universe, 13.8 billion years. https://arxiv.org/abs/1807.06209
- D. J. Griffiths and D. F. Schroeter, *Introduction to Quantum Mechanics*, 3rd ed. (Cambridge, 2018), sec. 4.2, for the hydrogen wavefunctions.
- A. Amruth et al., *Einstein rings modulated by wavelike dark matter from anomalies in gravitationally lensed images*, Nature Astronomy (2023). https://arxiv.org/abs/2304.09895

## Licence

Apache License 2.0.

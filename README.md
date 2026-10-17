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
- D. Baumann, H. S. Chia and R. A. Porto, *Probing ultralight bosons with binary black holes*, Phys. Rev. D 99, 044001 (2019).
- A. Amruth et al., *Einstein rings modulated by wavelike dark matter from anomalies in gravitationally lensed images*, Nature Astronomy (2023). https://arxiv.org/abs/2304.09895

## Licence

Apache License 2.0.

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
3. Dark matter has no witnesses at any gap or particle mass, which is part of what makes a galaxy-sized
   dark matter wave possible.
4. A black hole horizon is a real witness (Danielson, Satishchandran and Wald, 2022) but a feeble one:
   ten horizon radii from the Milky Way's black hole, a wave dark matter particle split by 1 µm waits about
   10¹⁷⁰ years to be recorded.

Interactive version: **https://foundation-0.github.io/fractals/** (`index.html` at the root of this repository, served by GitHub Pages; it loads `witness-map/model.js` directly).

## Run it

Needs Node 18 or later, nothing else. The checks run on every pull request, on Node 18, 20 and 22.

```
npm test                                 # checks the model against published numbers
node witness-map/table.mjs               # every object at a 250 nm gap
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

The published table values are themselves powers of ten, so agreement within a few times is as close as
the comparison can go.

## What the model leaves out

- Objects sit still. Fast motion, internal structure and spin are ignored.
- W is per particle. Wave dark matter's galaxy-wide wave is a crowd effect, enormous numbers of particles
  sharing one wave, which is not modelled.
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

## Licence

Apache License 2.0.

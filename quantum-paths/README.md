# Quantum paths: rough only between two lengths

Status: **exploration, not peer reviewed, no new result claimed.** Issue
[#16](https://github.com/Foundation-0/fractals/issues/16).

The repository's README said a free quantum particle's path has fractal dimension 2, against 1 for a classical
trajectory (Abbott and Wise, 1981), "the same roughness as a pollen grain jostled by molecules". This study asks
over what range of scales that is true, what ends it at each end, and whether a particle's own surroundings ever
draw its path finely enough to see it.

## What Abbott and Wise showed

Their path is an *observed* one: record the particle's position again and again, each time to within Δx, and
join the dots. Their abstract: "the observed path of a particle in quantum mechanics is a fractal curve with
Hausdorff dimension two". Their dimension is defined by how the joined path's length grows as Δx shrinks,
⟨l⟩ ∝ Δx^(1−D).

Each record leaves the particle with a momentum spread ħ/(2Δx) (for their Gaussian records). Abbott and Wise
space the records in two ways. In one they keep the time between records, Δt, fixed as Δx shrinks, so the wave
soon outgrows its starting width: ħΔt/2mΔx² ≫ 1, or Δt much longer than two of the Witness Map's wave clocks
mΔx²/ħ. In the other, the one under which they find the path self-similar (their eq. 1.9), Δt ∝ mΔx²/ħ, a fixed
number of wave clocks. (Lake 2022 asks for at least four wave clocks, from an energy–time argument of his own.)
In the first, far-field limit the mean length over a time T is

```
<l> = (T/m) E|p + δp|,   δp ~ Normal(0, (ħ/2Δx)²) in each direction
```

and, in three dimensions, with this model's local slope D = 1 − d ln⟨l⟩/d ln Δx at each Δx:

| Δx / (ħ/p) | 0.01 | 0.1 | 0.3 | 1 | 3 | 10 |
|---|---|---|---|---|---|---|
| D | 2.00 | 1.99 | 1.89 | 1.38 | 1.05 | 1.00 |

- Below the reduced de Broglie wavelength ħ/p (λ/2π) the spread wins and D = 2: <l> → √(2/π) ħT/(mΔx).
- Above it the drift wins and D = 1: <l> → pT/m, the classical length.
- These two limits are Abbott and Wise's. Between them, they write, D "is not well defined since it is rapidly
  varying with Δx"; the middle of the table is this model's local slope, not their result. By that slope, D
  passes 1.5 at Δx = 0.81 ħ/p (0.44 ħ/p for a path along one direction), and the crossover takes about a decade.
- Records closer together give the same two limits, with the crossover further out: 0.90 ħ/p at four wave
  clocks apart, 1.1 ħ/p at two (Abbott and Wise's ħΔt/2mΔx² = 1), and 1.8 to 2.4 ħ/p at one, depending on
  whether each record's own error is counted.

So the README's sentence holds only for a recorded path, and only below ħ/p. The roughness is made by the
records: each one's kick ħ/(2Δx) is what makes the length grow as 1/Δx. Unlike a coastline, the path at
different Δx is not one curve seen at different magnifications. Abbott and Wise do find the path statistically
self-similar when Δt ∝ mΔx²/ħ, but only because every record restarts the particle with the same mean
momentum; "What repeated records do" below drops that.

## The other end: the Compton wavelength

Nothing moves faster than light. With relativistic speeds, v = pc²/E, the recorded length stops growing below the
reduced Compton wavelength ħ/mc and tends to cT, so the path is smooth again. This end is the model's own:
Abbott and Wise are non-relativistic throughout. In a single-particle model, then, a recorded path is rough only
between ħ/mc and ħ/p, a window that exists only when p ≪ mc:

| Particle | ħ/mc | ħ/p | Window |
|---|---|---|---|
| Electron at 54 eV (Davisson and Germer) | 3.9×10⁻¹³ m | 2.7×10⁻¹¹ m | ×69 |
| Thermal neutron, 2,200 m/s | 2.1×10⁻¹⁶ m | 2.9×10⁻¹¹ m | ×1.4×10⁵ |
| Buckyball (C₆₀), 220 m/s | 2.9×10⁻¹⁹ m | 4.0×10⁻¹³ m | ×1.4×10⁶ |

Localising a particle below its Compton wavelength is not a clean single-particle operation, so this end is a
bound, not a measurement. For the buckyball the whole window lies a thousand times below the molecule's own size
(about 1 nm), so its rough path is formal. Only light, slow particles have a ħ/p within reach.

## What repeated records do

The formula above treats each interval on its own, with the same mean momentum every time. But each record
kicks the momentum by about ħ/(2Δx), and the kicks add up: the particle heats. An exact simulation of repeated
Gaussian records (`sequential` in `paths.js`) shows three things.

- For a particle starting at rest with records many wave clocks apart, the recorded path is (1/N) Σ√k ≈ (2/3)√N
  times longer than the single-interval formula after N records.
- With records a fixed time apart (Abbott and Wise's fixed-Δt limit) the length still grows as 1/Δx, so D = 2
  survives. But the length grows as T^(3/2) rather than T. The rough stretch also widens: its upper end moves
  out roughly as √N ħ/p, to about 11 ħ/p after 400 records.
- If the records are instead spaced a fixed number of wave clocks apart (Abbott and Wise's self-similar rule),
  the length grows as Δx⁻²: D ≈ 3, not 2.

So the dimension of a long record depends on how it is taken, and under Abbott and Wise's self-similar rule their
D = 2 does not survive the heating, which their reset at every record leaves out. Ding, Ong and Xu (2025) find
measurement shifting the dimension downward in a different (nonselective) model; the two are not compared here.

## Brownian motion, and the pollen

A Brownian particle is the reverse: smooth at small scales, rough at large ones. Below its ballistic length
v_rms·τ_p it moves in straight lines (D = 1). Above it, collisions have scrambled its velocity and the path is
rough (D = 2).

- Li, Kheifets, Medellin and Raizen (2010) resolved the ballistic part for a silica bead, nominally 3 µm and
  2.79 µm in their analysis, held in an optical trap in air. Fits to its measured velocity autocorrelation gave
  a momentum relaxation time of 48.5 µs at 99.8 kPa and 147.3 µs at 2.75 kPa, and its rms speed was 0.42 mm/s.
- Stokes drag with the Cunningham slip correction, for the 2.79 µm bead and the mass its rms speed implies,
  gives 51 µs at 99.8 kPa, 5% high, and 175 µs at 2.75 kPa, 19% high. The ratio of the two times does not
  depend on the mass: 3.43 here against 3.04 measured, so the slip correction used here overstates how much
  freer the bead gets at low pressure. (The mass is not an independent check: Li et al. computed it from the
  bead's size and density.) The test records the 2.75 kPa value as a disagreement.
- From their numbers the ballistic length is about 20 nm. A free bead would be rough above that, from about
  1 ms and 130 nm on. But the bead they measured was trapped (their eq. 1, trap frequency about 3.1 kHz), and the
  trap holds it within about 22 nm rms, no more than its ballistic length at 99.8 kPa and a third of it at
  2.75 kPa. Its path goes from straight to confined with no rough stretch in between: the local dimension comes
  within 0.1 of 2 only for brief moments, under 0.04 of a decade.

Both kinds of path can be smooth, then rough, then smooth. The quantum one is rough between ħ/mc and ħ/p. A
free Brownian one is rough between v_rms·τ_p and whatever confines it or carries it along, and only if those
are far apart; for Li et al.'s trapped bead they are not. "The same roughness" is right about the dimension, 2,
but not about where it lives.

Robert Brown did not watch pollen grains move. He watched particles about 1 to 5 µm across, lipid spherosomes and
starch amyloplasts, released from inside pollen grains about 100 µm across (Pearle et al. 2010). A whole grain does jiggle, but in water it moves
only about 0.1 µm in a second, too little for him to see.

## Who draws the path: the Witness Map link

An object's surroundings act as a measuring device that never stops. They record its position about once per
wave clock of the gap Δx\* where the Witness Map's W equals 1. That record can be fine or coarse in two ways.

- **Weak records.** Each photon or molecule carries a little information (the Witness Map's rate grows as Δx²).
  The records add up, and the best estimate of the object's position stays uncertain by about 0.6 Δx\*: for
  a rate kΔx², the steady conditioned state is (ħ/8km)^(1/4) wide. The resolution is about Δx\*.
- **Full records.** Each hit tells the two places apart outright. It pins the object to about ħ/q, where q is
  the momentum the hit carries: 2.70 k_BT/c for a thermal photon, and μ·v_rel for a molecule, with μ the reduced
  mass. Δx\* is then only how far the wave spreads between hits.

Either way, the resolution is min(Δx\*, ħ/q). The quantum roughness is drawn only where that is below ħ/p, which
is the same as asking whether the records kick the object harder than its own momentum. For each object on the
map, in its usual surroundings, with p its thermal momentum per direction at the surroundings' temperature
(`node quantum-paths/table.mjs`):

| Object | Records | Main witness | Resolution | ħ/p | Ratio |
|---|---|---|---|---|---|
| Electron (lab vacuum) | full | leftover gas | 9.9×10⁻¹⁰ m | 1.7×10⁻⁹ m | 0.58 |
| Rubidium atom | full | leftover gas | 1.7×10⁻¹¹ m | 4.3×10⁻¹² m | 3.8 |
| Buckyball | full | its own glow | 9.4×10⁻⁷ m | 1.5×10⁻¹² m | 6.3×10⁵ |
| Giant molecule | weak | its own glow | 6.3×10⁻⁷ m | 2.5×10⁻¹³ m | 2.5×10⁶ |
| Virus (air) | weak | air | 9.5×10⁻¹⁴ m | 2.1×10⁻¹⁵ m | 45 |
| Interstellar dust grain | full | hydrogen atoms | 4.5×10⁻¹² m | 2.0×10⁻¹⁶ m | 2.2×10⁴ |
| Grain of sand | weak | air | 7.7×10⁻¹⁹ m | 1.4×10⁻²¹ m | 550 |
| Cat | weak | air | 1.1×10⁻²¹ m | 8.2×10⁻²⁵ m | 1,300 |
| Moon | weak | solar wind | 1.5×10⁻²⁷ m | 6.3×10⁻³⁶ m | 2.5×10⁸ |
| Earth | weak | solar wind | 2.7×10⁻²⁸ m | 6.9×10⁻³⁷ m | 3.9×10⁸ |
| Sun | weak | its own glow | 2.3×10⁻³¹ m | 4.5×10⁻³⁹ m | 5.1×10⁷ |
| Milky Way | weak | its own starlight | 5.0×10⁻³⁷ m | 9.5×10⁻⁴⁵ m | 5.3×10⁷ |
| **Rubidium atom cooled to 1 µK** | full | leftover gas | 1.7×10⁻¹¹ m | 7.5×10⁻⁸ m | **2.2×10⁻⁴** |

Three cases:

- **Heavier than its witnesses and as warm as them: drawn smooth.** Every object on the map except the electron
  is recorded more coarsely than its own ħ/p, the rubidium atom by the narrowest margin (3.8). A gas molecule
  lighter than the object, at the same temperature, carries less momentum than the object does.
- **Lighter than its witnesses: drawn at the crossover.** A collision can transfer at most about the lighter
  body's own momentum. So the electron is recorded at about ħ/|p|, whatever its temperature, where the model's local
  slope is about 1.4, between Abbott and Wise's two limits.
- **Colder than its witnesses: drawn rough.** A rubidium atom laser-cooled to 1 µK in the same room-temperature
  vacuum is hit by leftover gas molecules carrying far more momentum than it has. Each hit records it 4,500 times
  more finely than its ħ/p, deep in the rough regime, and also knocks it out of its trap.

So the surroundings draw the quantum roughness only of something colder than they are.

**Weak records and fluctuation-dissipation.** For an object warmed and slowed by the same gas that records it,
in the weak-record regime, the records and the drag come from the same collisions: Λ = Mγk_BT/ħ², with γ the drag
per unit mass. Then W at the thermal ħ/p is τ_th/τ_p, where τ_th = ħ/k_BT (2.5×10⁻¹⁴ s at 300 K) and τ_p is the
momentum relaxation time, and

```
Δx* / (ħ/p_th) = (τ_p / τ_th)^(1/4)
```

The surroundings could draw quantum roughness this way only if momentum relaxed faster than ħ/k_BT, which is
outside the high-temperature regime this holds in. For the virus in air (Kn ≈ 1.4, Epstein drag for specular
reflection) the relation predicts 44.9 and the map gives 44.8. Before the map's gas rate was corrected (#9), it
gave 33.7, low by π^(1/4), the same factor. That makes fluctuation-dissipation plus Epstein's drag a route to
#9's coefficient independent of the closed forms #9 compared against. Both routes assume specular hard-sphere
scattering; diffuse reflection would raise the rate by 1.39 to 1.44 (Epstein's factors 1 + π/8 and 1 + 9π/64 for
a conducting and an insulating sphere). For sand and the cat, much larger than air's
mean free path, the real drag is viscous and much weaker than the collision count suggests. There the map's rate
exceeds what fluctuation-dissipation allows, so their ratios are lower bounds.

## What "the path" means

There is no protocol-free answer. The dimension 2 belongs to a record of repeated position measurements, and the
records make it. Average trajectories reconstructed from weak measurements (Kocsis et al. 2011, single photons)
and Bohmian trajectories are smooth, dimension 1. The paths summed in Feynman's path integral are Brownian, but
they are integration variables, not something recorded.

## Run it

```
node quantum-paths/table.mjs        # the dimension, the windows, the bead and every Witness Map object
npm test                            # includes tests/quantum-paths.mjs
```

`paths.js` is the whole model. It loads in Node (`require`) and in a browser (`window.QP`).

## Checks

`tests/quantum-paths.mjs`:

| Check | Expected | Model |
|---|---|---|
| Fine records: <l>Δx m/(ħT) (3D) | √(2/π) = 0.798 | 0.798 |
| Coarse records: <l> | pT/m | pT/m |
| D at 0.01 and 100 ħ/p (Abbott and Wise) | 2 and 1 | 2.000, 1.000 |
| Crossover (local slope D = 1.5, the model's; scale ħ/p from Abbott and Wise) | ħ/p, to a factor of 2 | 0.81 ħ/p |
| D below ħ/mc, inside the window, above ħ/p | 1, 2, 1 | 1.001, 1.995, 1.000 |
| Repeated records, N = 400: length over the single-interval formula | (1/N)Σ√k = 13.36 | 13.4 |
| C₆₀ at 220 m/s: h/mv (the same arithmetic as Arndt et al.) | 2.5 pm | 2.52 pm |
| Electron at 54 eV, Davisson and Germer's measurement as usually quoted | 1.65 Å | 1.67 Å |
| Bead in air, τ_p at 99.8 kPa (Li et al. 2010) | 48.5 µs | 51 µs |
| Bead in air, τ_p at 2.75 kPa (Li et al. 2010): recorded disagreement | 147.3 µs | 175 µs (+19%) |
| Free bead with those numbers: D over 0.04 nm and 1.3 µm | 1 and 2 | 1.000, 1.999 |
| Li et al.'s trapped bead: longest stretch with D within 0.1 of 2 (model, their eq. 1) | under 0.05 decade | 0.037 and 0.025 decade |
| Continuously recorded particle: purity, and W at its width | ħ²/4, 1/8 | exact |
| Gas rate against drag (Schlosshauer 2019, Epstein 1924) | equal | equal |
| Virus: Δx\*/(ħ/p) against fluctuation-dissipation | 44.9 | 44.8 |
| Every object but the electron recorded more coarsely than ħ/p | ratio > 1 | smallest 3.8 (rubidium) |
| Electron recorded at ħ/\|p\| | 1/√3 of ħ/p per direction | 0.577 at 300 K and 10⁴ K |
| Rubidium at 1 µK recorded finer than ħ/p | ratio < 10⁻³ | 2.2×10⁻⁴ |

## What the model leaves out

- Abbott and Wise's paper was checked in review on #25 against its preprint (SLAC-PUB-2427, 1979), not the
  journal pages. Cannata and Ferrari's relativistic paper (Am. J. Phys. 56, 721 (1988)) could not be read; the
  ħ/mc end here is this model's own (spinless, speeds capped at c), not theirs.
- p is the thermal momentum at the surroundings' temperature. Objects in beams move faster (smaller ħ/p, a wider
  gap). Cooled objects move slower (larger ħ/p), which is where the gap closes, as the rubidium row shows.
- The resolution uses the main witness at Δx\*. Rarer, sharper witnesses can record finer now and then: gas
  hits on the buckyball, at about ħ/q = 1.7×10⁻¹¹ m, are still 11 times coarser than its ħ/p.
- The Witness Map's own information per gas hit uses the molecule's thermal momentum. For the electron, lighter
  than the molecules, the real transfer is set by the electron's momentum, as `witnessMomentum` assumes. That
  only matters at gaps below about a nanometre.
- Strong damping at low temperature, where momentum relaxes in less than ħ/k_BT, is not covered.

## Sources

- L. F. Abbott and M. B. Wise, *Dimension of a quantum-mechanical path*, Am. J. Phys. 49, 37 (1981). https://doi.org/10.1119/1.12657 (preprint SLAC-PUB-2427, 1979)
- M. J. Lake, Eur. Phys. J. C 82, 928 (2022), which revisits the Abbott–Wise argument. https://arxiv.org/abs/2206.00609
- A. Granik and G. Chapline, Phys. Lett. A 310 (2003), which applies the Abbott–Wise analysis. https://arxiv.org/abs/quant-ph/0302013
- Y.-W. Ding, Y. C. Ong and H. Xu, *Measurement-induced perturbations of Hausdorff dimension in quantum paths*, Eur. Phys. J. Plus (2026). https://doi.org/10.1140/epjp/s13360-026-07554-3 (https://arxiv.org/abs/2512.13046)
- H. Kröger, *Fractal geometry in quantum mechanics, field theory and spin systems*, Phys. Rep. 323, 81 (2000).
- T. Li, S. Kheifets, D. Medellin and M. G. Raizen, *Measurement of the instantaneous velocity of a Brownian particle*, Science 328, 1673 (2010). https://doi.org/10.1126/science.1189403
- T. Li and M. G. Raizen, *Brownian motion at short time scales*, Ann. Phys. (Berlin) 525, 281 (2013). https://arxiv.org/abs/1211.1458
- P. Pearle et al., *What Brown saw and you can too*, Am. J. Phys. 78, 1278 (2010). https://arxiv.org/abs/1008.0039
- S. Kocsis et al., *Observing the average trajectories of single photons in a two-slit interferometer*, Science 332, 1170 (2011).
- K. Jacobs and D. A. Steck, *A straightforward introduction to continuous quantum measurement*, Contemp. Phys. 47, 279 (2006). https://arxiv.org/abs/quant-ph/0611067
- A. O. Caldeira and A. J. Leggett, *Path integral approach to quantum Brownian motion*, Physica A 121, 587 (1983).
- P. S. Epstein, *On the resistance experienced by spheres in their motion through gases*, Phys. Rev. 23, 710 (1924).
- M. Schlosshauer, *Quantum decoherence*, Phys. Rep. 831, 1 (2019). https://arxiv.org/abs/1911.06282
- M. Arndt et al., *Wave-particle duality of C₆₀ molecules*, Nature 401, 680 (1999).
- C. Davisson and L. H. Germer, *Diffraction of electrons by a crystal of nickel*, Phys. Rev. 30, 705 (1927).

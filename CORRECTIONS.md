# Corrections

Claims made during the exploration that did not survive it, kept so the record shows them.

## 16 October 2026

1. **What destroys interference.** Claimed: weaker detectors bring the interference back, so the detector's
   physical push may be the cause. Wrong. Dürr, Nonn and Rempe (Nature, 1998) marked the path with a push far
   too small to matter, and the interference still vanished. The record of the path is what destroys it.
2. **Size versus witnesses.** Claimed: the quantum/classical line is set by witnesses, not by size. Too strong.
   Mass enters through the wave clock (`m·Δx²/ħ`): heavy objects spread so slowly that a few witnesses settle them.
3. **Dust grain in the Big Bang afterglow.** Quoted: the afterglow alone pins a dust grain's position "in about
   a nanosecond". The model gives about a millisecond for a 10 µm grain split by 1 mm, and the Joos–Zeh rate
   for that grain implies the same order. The nanosecond figure was relayed from a secondary source without
   checking the grain size.
4. **"Within a factor of 3" of the Joos–Zeh table.** Stated for all three environments. Sunlight is within a
   factor of 4.4; the afterglow and air are within 3.

## 16 October 2026: independent re-check (issue #5)

5. **Gas collisions were π times too strong at the smallest gaps.** The model took the long-wavelength rate as
   R·(4π/9)·k², with R the collision rate and k² = 3mk_BT/ħ². Averaging n⟨v q²⟩σ/(3ħ²) (Schlosshauer 2019,
   eqs. 67–68) over a thermal gas gives R·(4/9)·k²; a one-speed beam gives R·k²/3. Fixed. The model now matches
   the standard air formula, Λ = 8n√(2πm)a²(k_BT)^(3/2)/(3ħ²), to 0.1%. The map does not move: at gaps of 1 nm and
   more every gas collision is already a full record.
6. **Light an object gives off was counted as twice as informative as it is.** An emitted photon leaves in one
   random direction, so it carries 1 − sin(kΔx)/(kΔx) of a record (Hackermüller et al. 2004, eq. 5), not the
   1 − exp(−(kΔx)²/3) of a scattered photon, which has two. For gaps smaller than the wavelength that is half as
   much: the model's glow came out 2.0 times the standard formula (Romero-Isart 2011, eq. 29). Fixed. At 250 nm
   the giant molecule moves from W ≈ 0.05 to 0.03 and the buckyball from 2.6×10⁻⁴ to 1.4×10⁻⁴. Light an object
   absorbs from its surroundings is still not counted. For an object as warm as its surroundings that would add
   as much again as its own glow; the old doubled glow happened to give that total.
7. **The heating experiment used C₇₀, not C₆₀.** README, page and check called it a buckyball (C₆₀) experiment.
   Hackermüller et al. (2004) heated C₇₀, which absorbs the heating light almost ten times more strongly than C₆₀
   (Hornberger et al. 2005). The old check also took a 2 ms transit at a fixed 1 µm gap. In the experiment the
   molecules took 4 ms (two 0.38 m legs at 190 m/s), and the two paths separate from zero to about one grating
   period (991 nm) and back. The check now follows their eq. 2.
8. **The molecules' glow is a fit: right onset, wrong light.** The code said molecules glow about 100 times more
   weakly than solid grains. That is not a measurement; eps = 0.01 was tuned to this experiment. C₇₀'s measured
   absorption at 514 nm, about 2×10⁻¹⁷ cm² (Hornberger et al. 2005; fitted for the heated molecule, close to the
   cold one's), needs eps ≈ 1, about 120 times more. The fit works because the model has no electronic gap: it
   lets the molecule glow in the infrared, where C₇₀ gives off nothing (no transitions below 1.6 eV). Against the
   two papers:
   - Agrees. At 190 m/s the visibility halves at 2,475 K (measured: about 2,500 K, the point the fit was made
     to), and at 1,500 K and 3,000 K the visibility is within 0.1 of the measured curve. While it halves, the
     model gives off 1.4 photons (published: one to two).
   - Disagrees. At 2,500 K the model gives off 1.5 photons in a 4 ms transit, but only 0.09 above 1.6 eV
     (published: about three, all visible). Its power rises as T⁵ between 2,000 and 3,000 K, against T¹¹ for C₇₀
     (6.3×10⁻³⁵ (T/K)¹¹ eV/s), so at 3,000 K it is 14 times too low. At 100 m/s its visibility halves at 1,960 K,
     about 500 K below the measured 2,450 K; with C₇₀'s steepness it would halve near 2,240 K. Cooling in flight,
     which the check ignores, is not the cause: C₇₀'s measured cooling moves the model by 25 K at 100 m/s (220 K
     at 190 m/s).
   - Unchecked. The buckyball at 900 K and the giant molecule at 500 K use the same eps far below the fitted
     range, where molecules glow mainly through infrared vibrations that this model does not describe.
   Not fixed: giving molecules a gap and measured spectra would change the buckyball and giant-molecule rows, so
   it needs a decision.
9. **Joos and Zeh's air entry is 10³⁶, not 10³⁷.** The old check quoted 10³⁷ cm⁻² s⁻¹ (10⁴¹ m⁻² s⁻¹) as Joos and
   Zeh's. All four copies of their table checked here (Kiefer and Joos 1999; Joos 2000; Kiefer 2000; Joos 2005)
   give 10³⁶. The 10³⁷ is Schlosshauer's (his 10⁻³¹ s at Δx = 10⁻³ cm), and it matches the closed-form formula
   (8.6×10³⁶). The two tables differ by ten; the model follows the formula.
10. **Three disagreements inside the published tables.** Not model errors; recorded so nobody tunes the model to
    them.
    - Joos and Zeh's "laboratory vacuum (10³ particles/cm³)" row (10²³, 10¹⁹, 10¹⁷) matches 10⁶ particles/cm³,
      which is how Joos (2005) labels it; Tegmark (1993) also takes 10⁶ for a laboratory vacuum. At 10³ the
      model gives 3×10²⁰ for the largest grain. Schlosshauer's "best laboratory vacuum" times match 10³.
    - 300 K light on a 10 µm grain: Joos and Zeh give 10¹⁹ cm⁻² s⁻¹, Schlosshauer 10²⁴ (from his 10⁻¹⁸ s), the
      model 3×10²⁰. The grain is not small next to 300 K wavelengths. The small-grain formula gives 4×10²⁴ there,
      too much; the opaque-sphere limit gives the model's value. The 10¹⁹ is not reproduced.
    - Schlosshauer's gas times use τ = 1/(Λa²) with the gap equal to the grain's size, 10⁵·⁶ gas wavelengths. At
      such gaps each collision is already a full record and the rate stops growing (his eq. 65). For a 10 µm
      grain in air the decoherence time is then the collision time, 3×10⁻¹⁹ s, not 10⁻³¹ s. The model does this.
11. **Not consulted.** Schlosshauer's 2007 book and Joos and Zeh's 1985 paper were not available. The comparisons
    use Schlosshauer's own open copies of his book's timescale table (2014, 2019) and four copies of the 1985
    table by Joos and by Kiefer. Anything in the book that is not in those copies is unchecked.

## 16 October 2026: the gravitational atom (issue #4)

12. **Atoms as little solar systems.** Claimed (README, and issue #4): "Atoms are not little solar systems ... Except
    in one case, where they are", the one place where that picture "becomes literally true". Too strong. In the
    gravitational atom the light particles form a wave cloud with hydrogen's shapes and levels; nothing in it moves
    on an orbit. What carries over from a solar system is the force, gravity, and for a heavy hole the size: in
    Baumann, Chia and Porto's 2019 example the 211 cloud is most likely found 1.4 AU out. The README now says
    gravity builds a real atom.
13. **"The same energy levels as a hydrogen atom."** Means the same pattern, falling as 1/n², not the same
    energies. In the same example the levels are 2×10¹⁹ times closer together than hydrogen's, and the pattern
    holds only to leading order in α: there the first correction to the 211 level is −11%, against about 10⁻⁵ in
    hydrogen.

## 16 October 2026: the crowd wave (issue #2)

14. **Dark matter's missing witnesses and the galaxy-sized wave.** Claimed (README and page): having no witnesses
    "is part of what makes a galaxy-sized dark matter wave possible". Too strong, and it points the wrong way. The
    galaxy-sized wave is a crowd, about 10⁹³ particles to each lump of the wave near the Sun for a 10⁻²² eV
    particle, acting as one classical wave. Its lumps, about 10⁵ Suns each, are recorded by every star they pass,
    through gravity. The wave survives because recording a classical wave does not erase it, not because nothing
    watches it. What the per-particle result does say is that nothing knocks single particles out of the wave.
    See "The crowd wave" in the README.

## 16 October 2026: black hole and wave dark matter lensing (issue #1)

15. **Superradiance as a second route.** Issue #1 said a spinning black hole amplifying very light particles into a
    cloud was not ruled out as a way for a galaxy's central black hole to shape wave dark matter where lensing looks.
    For a 10⁻²² eV particle and a 10⁸ to 10⁹ M☉ black hole it is ruled out: the cloud would take 10²⁶ to 10³⁴ years
    to grow, and at its radius the galaxy, not the black hole, holds the particles. Any cloud these black holes can
    grow within the age of the universe, at any particle mass, peaks within about 0.1 pc. See
    [notes/bh-lensing.md](notes/bh-lensing.md).

## 18 October 2026: the black hole lensing note revisited (issue #28)

16. **SDP.81 as the anomaly lens with a bound on its black hole.** Claimed (notes/bh-lensing.md, issue #1): "Only one
    anomaly lens, SDP.81, has even a bound on its black hole". The note paired a 10^(8.96±0.12) M☉ dark lump at
    6.9σ (Hezaveh et al. 2016) with a black hole above 3×10⁸ M☉ from the missing central image. That no longer
    holds. Stacey et al. (A&A, 2025) re-analysed the same ALMA data. They find the lump most likely spurious,
    produced by poorly fitting multipoles, and no evidence for either previously reported lump, only for extra
    angular structure in the lens. Their mock data show they would have found a real 10⁹ M☉ lump (log Bayes factor
    29). The black hole bound stands, so no lens in the note now has both a small-scale anomaly and a bound on its
    black hole. Fixed in [notes/bh-lensing.md](notes/bh-lensing.md) (issue #28).

## 18 October 2026: quantum paths (issue #16)

17. **"A free quantum particle's path has fractal dimension 2."** Too broad. Abbott and Wise's dimension 2
    belongs to the path recorded by repeated position measurements, and only at resolutions finer than ħ/p, the
    de Broglie wavelength over 2π. Coarser, it has dimension 1, and in a single-particle model the speed limit
    makes it 1 again below ħ/mc (that end is not in Abbott and Wise, who are non-relativistic). The records also
    make the roughness: each kicks the momentum, and the kicks add up. With records a fixed time apart the rough
    stretch widens to roughly √N ħ/p over N records; with records a fixed number of wave clocks apart, Abbott
    and Wise's self-similar spacing, the exponent rises to about 3. A long record is not one fixed fractal.
    See [quantum-paths](quantum-paths/).
18. **"The same roughness as a pollen grain jostled by molecules."** Two slips. Brown watched particles about 1 to
    5 µm across released from inside pollen grains, which are about 100 µm across, not the grains themselves
    (Pearle et al. 2010). And a Brownian path has dimension 2 only above its ballistic length, about 20 nm from
    Li et al.'s (2010) numbers for their bead in air; below it the path is straight. The dimension matches, but
    the quantum path is rough at small scales and the Brownian one at large scales, and only if nothing holds
    it: Li et al.'s bead was trapped within about 22 nm rms, so its measured path is never rough. With the
    2.79 µm diameter they used, slip-corrected Stokes drag gives 175 µs at 2.75 kPa against their 147.3 µs;
    `tests/quantum-paths.mjs` records that as a disagreement. (The first draft on #25 used the nominal 3 µm,
    which hid the gap, and called the trapped path smooth, then rough, then smooth; review there caught both.)

## 18 October 2026: cosmic homogeneity (issue #17)

19. **"Beyond about 80 to 300 million parsecs (h⁻¹ Mpc, 80 to 300)."** Two errors, and a missing caveat. The 80
    to 300 h⁻¹ Mpc in Scrimgeour et al. (2012) is the range over which they rule out a fractal with D₂ below
    2.97, and 300 is the largest scale their survey reached. Their homogeneity scale is 70 to 81 h⁻¹ Mpc: 71 ± 8,
    70 ± 5, 81 ± 5 and 75 ± 4 at z ≈ 0.2, 0.4, 0.6 and 0.8. And h⁻¹ Mpc is not Mpc: with h = 0.674, 70 to
    81 h⁻¹ Mpc is 104 to 120 Mpc. The caveat: the scale is a convention, not a fixed length. It depends on the
    tracer, the epoch and the threshold; a 0.1% threshold instead of 1% puts it at 185 h⁻¹ Mpc for matter today.
    See [cosmic-homogeneity](cosmic-homogeneity/).
20. **"The nesting stops, the way a coastline's roughness stops at the size of molecules."** Points the wrong
    way. A coastline is rough down to a smallest scale; galaxy clustering is clumpy up to a largest one.

## 19 October 2026: halos within halos (issue #18)

21. **"Halos sit inside halos with nearly the same shape from about an Earth mass up to galaxy clusters, some 20
    decades in mass (Wang et al. 2020)."** Two slips, the second partly contested. Wang et al. zoomed eight times, each
    time into a smaller region of the previous level chosen to avoid any massive halo: their 20 decades are field
    halos of many masses, not a chain of halos inside halos. Inside a Milky Way the nesting of a 100 GeV WIMP spans
    16 to 18 decades: at most 9 to 11 levels at the ratio the Aquarius subhalo law gives (masses of all the matter;
    counting the dark matter alone, the 9 becomes 10), and 7 to 9 if sub-subhalos are 2 or 3 times fewer, as
    Aquarius finds (it resolves four levels itself). And halos near the cut-off form with steeper ρ ∝ r^−1.5
    centres. Whether those survive inside later halos is contested: Wang et al. find NFW and Einasto profiles down to
    an Earth mass, Delos and White suggest the steeper centres lie at radii those simulations do not resolve, and a
    later study finds them buried in NFW-like profiles but not destroyed. See [halos](halos/).
22. **"Hu–Barkana–Gruzinov's quoted k_J ≈ 66.5 a^¼ Mpc⁻¹ and M_J ≈ 1.5×10⁷ M☉ for 10⁻²² eV are not mutually
    consistent with ρ = ρ_m."** Neither number is Hu, Barkana and Gruzinov's (2000), who give the Jeans
    wavenumber at equality, 9 m₂₂^½ Mpc⁻¹, and a Jeans length. The 66.5 form is Marsh's (2016) and uses the dark
    matter density alone, 0.12 ρ_crit/h². 1.5×10⁷ M☉ is Hui et al.'s (2017, as quoted in search text), and a sphere
    of diameter λ_J reproduces it. With the dark matter density the two agree (66.5 Mpc⁻¹ and 1.47×10⁷ M☉); with
    all matter they are 69.5 Mpc⁻¹ and 1.54×10⁷ M☉. Both go as ρ^¼, 4.5% between the two densities: quoted to two
    figures, 1.5×10⁷ hides the difference, while 66.5, quoted to three, does not.
23. **"About 18 decades for a 100 GeV WIMP and only 2 to 4.5 for 10⁻²² eV wave dark matter."** The WIMP figure
    survives: 16 to 18 decades. The wave figure mixes definitions. Where the halo population turns down (half
    mode, half power, Schive et al.'s M₀) it is 1.3 to 1.8 decades; 4.8 is from the Jeans mass today, which bounds
    any halo from below but is not where halos become rare.
24. **"Excluded by Lyman-α and Milky Way satellite bounds (from about 2×10⁻²¹ to 3×10⁻¹⁹ eV)."** Out of date at
    the top: Ursa Major III, if it is a galaxy, would raise the dwarf-galaxy bound from 3×10⁻¹⁹ to 8×10⁻¹⁸ eV (May,
    Dalal and Kravtsov 2025). The issue's "at 2×10⁻²⁰ eV the suppression mass falls to about 10⁷ M☉" holds for
    Schive et al.'s M₀ (1.4×10⁷ M☉); the half-mode and half-power masses are 3.4 and 4.6×10⁷ M☉.

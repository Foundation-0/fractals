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

## 18 October 2026: turbulence (issue #19)

19. **Issue #19's numbers, written from recall.** Checked against search text (see [turbulence](turbulence/)), two
    did not survive and four needed qualifying.
    - Did not survive: "σ = 0.72 S^0.5 km/s". Solomon et al.'s 0.72 goes with the effective radius R = 1.91 S; in
      S the fit is 1.0 S^0.5. The 0.07 pc sonic scale it gave is a radius, 0.14 pc across.
    - Did not survive: Larson's σ ∝ L^0.38 against Solomon et al.'s 0.5 as "a change of cascade". Larson's clouds
      are supersonic too (non-thermal Mach 1.4 at 0.1 pc to 19 at 100 pc), so the difference lies in his sample and
      size definition.
    - Qualified: "the spectral break near 0.6 Hz". V/(2π d_i) gives 0.63 Hz, but the fluctuations are elongated
      along the field, so the frequency carries sin θ_BV. At the 47° Parker angle it is 0.46 Hz, within the
      observed 0.4 to 0.5 Hz.
    - Qualified: "the Kolmogorov scale is about a millimetre in the atmosphere and upper ocean". Right as an order
      of magnitude, with a factor of 10 either way: 0.3 mm in strong wind to over a centimetre on a quiet night,
      and 2 to 3 mm at the one upper-ocean station checked.
    - Qualified: "the Kolmogorov constant (~1.5)". Fair for the 3D spectrum. Sreenivasan's (1995) compilation gives
      0.53 (scatter 0.055) for the 1D spectrum, 1.62 ± 0.17 in 3D.
    - Qualified: Nastrom and Gage's k⁻³ range "above ~500 km". The transition is quoted between 400 and 1,000 km,
      most often near 600.
20. **"A fractional-Brownian estimate gives 7/6" for cloud edges.** The wrong formula. 7/6 = 2 − H is the dimension
    of all the contours at one level together. A perimeter-area relation over separate clouds measures single
    loops, (3 − H)/2 (Kondev and Henley 1995), which is 13/12 for projected Kolmogorov density. Computed on Gaussian
    surfaces, the loops follow (3 − H)/2: across six spectra their dimension falls with the effective roughness
    H_eff at a slope of −0.53 ± 0.05 (−0.44 against the nominal H), not −1. They also sit about 0.04 above it, for
    reasons not found. The issue's conclusion survives: projected Kolmogorov density gives 1.15 there, not 1.36.
    Whether the clouds' 1.36 matches the laboratory's 1.3 to 1.4 for a shared reason is not shown. The laboratory
    measures the section of a turbulent/non-turbulent interface (7/3 in 3D), the clouds a projection of
    supersonic gas, and the two only meet near 4/3.

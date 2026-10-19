# The critical point: why a lattice repeats itself across scales, and where it stops

Notes for [issue #20](https://github.com/Foundation-0/fractals/issues/20). Exploration, not peer reviewed, no new
result claimed. `node critical/table.mjs` (about 65 s) prints the Monte Carlo numbers below, the percolation ones
for each of nine seeds and as their mean. No script prints three kinds of number: the results of a one-off repeat
of the checks with 120 other sets of seeds, described under [What it reproduces](#what-it-reproduces); γ/ν's
finite-size bias of +0.0012 and the Binder cumulant's offset of 0.0007 at L = 16, worked out from published
results; and the 11% and 25% uncertainties of an error bar. `npm test` (`tests/critical.mjs`) checks the numbers
compared with an exact value: the table under "What it reproduces", the ξ table, the measurement-trap cumulant with
a fixed count and the same numbers in the short answer. It checks the cumulant measured the other way only against
that one, and the point where the spanning probability at L = 32 is one half against Ziff and Newman's measurement
there. Without Monte Carlo, it also checks the open-edge shift against their measured crossings for L = 64 to 256.
The rest are printed but not checked: the slopes over other ranges of L, the cluster shares, the size ratios, the
point where the spanning probability at L = 256 is one half, the other comparisons with Ziff and Newman's
measurements and each percolation seed's results. Exact values are quoted from the sources named beside them.
Started 18 October 2026.

The other studies find self-similarity over a range of scales and ask where it stops. This one asks why it appears
at all, in the one case where the exact answers are known and both ends of the range can be moved at will.

## Short answer

- **Here, repetition across scales has to be tuned.** An Ising magnet, whose spins can point only up or down along
  one axis (the case modelled here), repeats itself across scales only at its critical temperature T_c, and only in
  zero field. There, patches of aligned spins come in every size from the lattice spacing to the size of the
  sample, nested inside one another. Away from T_c the nesting stops at the correlation length ξ, which in the
  two-dimensional model grows as 1/|T − T_c| (exponent ν = 1).
- **A small model lands on or near the exact numbers.** A 2D Ising lattice with seeded random numbers places T_c at
  2.2704 ± 0.0017 J/k_B, where the Binder cumulants of two sizes cross, against Onsager's 2/ln(1 + √2) = 2.2692. It
  reproduces Yang's spontaneous magnetisation within 0.21%, and gives β/ν = 0.1245 ± 0.0026, γ/ν = 1.751 ± 0.004
  and η = 0.250 ± 0.005, against 1/8, 7/4 and 1/4. Site percolation on a square lattice, averaged over nine
  seeds, gives p_c = 0.59292 ± 0.00023 where the spanning probabilities of L = 64 and 256 cross, against 0.592746
  (Newman and Ziff 2000): 0.00017 high, of which open edges account for 0.00012 (Ziff and Newman 2002). Its
  spanning cluster has fractal dimension 1.880 ± 0.002, 0.8% below 91/48 = 1.896: a finite-size shortfall, as the
  effective exponent rises with L over these sizes. Both are explained [below](#what-it-reproduces).
- **The nesting stops where the exact solution says.** Below, at the lattice spacing. Above, at ξ: the measured
  correlation length falls from 9.9 ± 0.2 lattice spacings 6% above T_c to 1.11 ± 0.02 at 76% above, within 3% of
  the exact values, 10.2 and 1.10. At T_c the size of the box is the only upper limit: in boxes from 8 to 128
  lattice spacings across, the magnetisation, susceptibility and spin-spin correlation follow their exact power
  laws within their statistical errors, 0.9% to 1.6%.
- **Tuned against self-organised.** Heat the lattice 6% above T_c and the nesting ends at ten lattice spacings;
  below T_c it ends sooner, at nine lattice spacings only 3% below. Turbulence and cosmic structure are scale-free
  over a range that nobody tunes: the flow or the universe sets it, through the Reynolds number or the time gravity
  has had to act.

## Why a critical point has no scale

In the Ising model each site of a square lattice holds a spin, up or down, and neighbouring spins prefer to align
(coupling J). Heat disorders them. At high temperature the aligned patches are small. As the temperature falls they
grow, and at T_c = 2/ln(1 + √2) = 2.2692 J/k_B (Onsager 1944) their typical size, the correlation length ξ, becomes
infinite. Below T_c one direction wins and the lattice is magnetised.

Away from T_c the model has two lengths, the lattice spacing and ξ. At T_c only the lattice spacing is left, and it
is too small to set the size of anything large. With no length to fix it, the pattern is the same at every scale
between the lattice spacing and the size of the sample: the correlation between two spins r apart falls as
r^(−1/4), a power law, which looks the same at any magnification. Patches contain smaller patches, which contain
smaller ones.

The renormalisation group gives the reason and its consequences (for a review, Pelissetto and Vicari 2002). Replace
each block of spins by one spin, and the lattice looks coarser. At T_c the coarse lattice's large-scale statistics
are those of the fine one; only the lattice-scale details differ, and they fade with every step. So the lattice at
T_c is not itself a fixed point of this zooming out, but repeated zooming out carries it to one, which looks the
same at every scale. Away from T_c each step of zooming out carries the effective temperature further from T_c, so
a small mistuning t = (T − T_c)/T_c is invisible on short scales and takes over at ξ ∝ |t|^(−ν). Because the
details fade, the exponents are universal: they are the same for every model with short-range forces, the same
symmetry and the same number of dimensions. At the sizes modelled here finite size still shows. The susceptibility
has a non-universal part set at short distances, its analytic background, which does not fade: the critical part
outgrows it, as L^(7/4). That background, more than the fading details, shifts the Binder cumulant at L = 16 and
γ/ν a little. Corrections to scaling lower the measured percolation dimension. All three are described below.

An Ising magnet has two settings to tune: the temperature, to T_c, and the magnetic field, to zero. Percolation has
one: the fraction p of occupied sites, to p_c = 0.592746 on the square lattice (Newman and Ziff 2000). At p_c the
first cluster to span the box is a fractal. The chance that a site connects to distance R falls as R^(−5/48), so
the spanning cluster's mass in a box of side L grows as L^(2 − 5/48) = L^(91/48). The exponent 5/48 follows,
through scaling relations, from exponents predicted by den Nijs (1979) and Nienhuis, Riedel and Schick (1980). It
was proved for site percolation on the triangular lattice by Lawler, Schramm and Werner (2002; see also Smirnov and
Werner 2001). The square lattice is expected to share it, by universality.

## The model

`critical/model.js` is the whole model (`window.CRIT` in a browser, `require` in Node; no dependencies).

- **Ising.** An L × L lattice with periodic edges, J = k_B = 1, so temperatures are in units of J/k_B and lengths
  in lattice spacings. Wolff cluster updates (Wolff 1989): grow a cluster from a random spin, adding each aligned
  neighbour with probability 1 − e^(−2J/k_BT) (the bond probability of the cluster representation, as in Fujimoto
  and Otsuka 2020, appendix B), then flip it. A sweep is a fixed number of cluster flips, set during thermalisation
  so that about L² spins turn over. After every sweep the model records the magnetisation per spin m, the energy,
  and either the correlation G(L/2) between spins half a box apart or the row-summed correlation, whose decay gives
  ξ directly. From these: ⟨|m|⟩, the susceptibility χ = L²⟨m²⟩ and the Binder cumulant U = 1 − ⟨m⁴⟩/(3⟨m²⟩²)
  (Binder 1981). The runs at the critical point are made at T = 2.27, a round number 0.04% above T_c, and
  reweighted to Onsager's T_c and to nearby temperatures (Ferrenberg and Swendsen 1988): each measurement counts
  with the ratio of the two Boltzmann weights, exp(−(1/T − 1/T_run)E), E the energy of the lattice.
- **Percolation.** An L × L lattice with open edges. Newman and Ziff's algorithm (2000): occupy sites one at a time
  in random order, join each to its occupied neighbours with union-find, and note when a cluster first touches both
  the top and the bottom row. Averages at any p follow by weighting each number of occupied sites binomially. The
  runs are made with nine independent seeds, and the checks use their mean.
- **Random numbers.** `xoshiro128**`, seeded, integer arithmetic only. The same seed gives the same numbers on
  every engine; the checks print identical values on Node 18, 20 and 22, so they cannot flake.
- **Error bars.** One standard deviation, from a jackknife over 40 blocks of each run. Error bars of this kind are
  themselves uncertain by about 1/√(2 × 39) = 11%. For a mean over the nine percolation seeds the error bar is the
  standard error of the mean, the scatter between seeds over 3, uncertain by about 1/√(2 × 8) = 25%.
- **A trap in measuring cluster runs.** Measuring each time the flipped clusters add up to L² spins, instead of
  after a fixed number of flips, over-weights ordered states: it stops more often just after a large cluster has
  flipped, when the lattice holds a large aligned domain. At T_c and L = 16 the Binder cumulant comes out
  0.6289 ± 0.0004 that way, against 0.6100 ± 0.0008 with a fixed count. The model uses a fixed count.

## What it reproduces

| Check | Exact | Model |
|---|---|---|
| Spontaneous magnetisation ⟨\|m\|⟩ at T = 2.0, 2.1, 2.2, L = 64 (Yang 1952) | 0.91132, 0.86875, 0.78476 | 0.91129 ± 0.00035, 0.86913 ± 0.00060, 0.78314 ± 0.00163 |
| Energy per spin, same runs (Onsager 1944) | −1.74556, −1.66208, −1.54649 | −1.74536 ± 0.00066, −1.66253 ± 0.00096, −1.54527 ± 0.00129 |
| T_c from Binder cumulant crossings, L = 32 and 64; 64 and 128 (Onsager 1944) | 2.2692 | 2.2683 ± 0.0022; 2.2704 ± 0.0017 |
| Binder cumulant at T_c, mean of L = 16 to 128 (Salas and Sokal 2000) | 0.61069 | 0.6101 ± 0.0011 |
| β/ν from ⟨\|m\|⟩ ∝ L^(−β/ν) at T_c, L = 8 to 128 | 1/8 = 0.125 | 0.1245 ± 0.0026 |
| γ/ν from χ ∝ L^(γ/ν), same runs | 7/4 = 1.75 | 1.7510 ± 0.0040 |
| η from G(L/2) ∝ L^(−η), same runs | 1/4 = 0.25 | 0.2503 ± 0.0047 |
| 1/ν from the slope of U at T_c, ∝ L^(1/ν), same runs | 1 | 1.021 ± 0.032 |
| ξ at T = 2.4, 2.5, 2.75, 3, 4 (closed form below) | 10.23, 5.96, 3.06, 2.14, 1.10 | 9.93 ± 0.21, 5.90 ± 0.10, 3.05 ± 0.06, 2.17 ± 0.04, 1.11 ± 0.02 |
| Energy per spin at the same five temperatures (Onsager 1944) | −1.2040 to −0.5573 | all within 1.4 standard deviations |
| p_c from crossings of the spanning probabilities, L = 32 and 128; 64 and 256, mean of nine seeds (Newman and Ziff 2000) | 0.59275 | 0.59335 ± 0.00024; 0.59292 ± 0.00023 |
| Fractal dimension of the spanning cluster at p_c, mass ∝ L^D, L = 64 to 256, mean of nine seeds | 91/48 = 1.8958 | 1.8798 ± 0.0020 |

The exponents come from least-squares slopes of logarithms over L = 8, 16, 32, 64 and 128. They are the 2D Ising
values of Pelissetto and Vicari (2002, sec. 3.5). The Binder cumulant at T_c tends to 1 − V₄/3 with
V₄ = 1.1679229(47) on a periodic square (Salas and Sokal 2000).

Each tolerance is a fixed number, 3 to 5 standard deviations of the noisiest estimate it covers, plus any
finite-size shift: worked out from published results, except for D, whose shortfall is measured, in these runs and
in the independent 120-seed repeat below, which give the same bound. For D, for the two p_c crossings and for the
Binder cumulant at L = 16, the two sides are bounded separately, so the shift widens one side only. At L = 16 the
cumulant sits 0.0007 above its limit: Salas and Sokal (2000) measured V₄(16) = 1.16586(38), and its leading
correction, of order L^(−7/4), comes from the analytic background of χ (their sec. 4.1). Every other check has one
tolerance for both sides. Runs at several temperatures share one tolerance, so the quieter runs are held to it more
loosely: ⟨|m|⟩ at T = 2.0 and 2.1 to 17 and 10 standard deviations, the energy at T = 2.0, 2.1, 2.4 and 2.5 to
between 5 and 8. For the Ising runs the standard deviation is the jackknife error. Over the 120-seed repeat below
it matches the scatter between seeds within about 10% on average, but this seed's errors from the runs reweighted
to T_c (L = 8 to 128) come out 6% to 17% below that scatter, so the checks quote both. For percolation it is the
standard error of the nine-seed mean. It comes out 9% above the repeat's scatter of a nine-seed mean (its scatter
between seeds over 3) for the crossing of L = 32 and 128, 44% above for 64 and 256, 16% above for the point where
the spanning probability at L = 32 is one half and 20% below for D, so those checks quote both too.
`tests/critical.mjs` prints how far inside its tolerance each result falls.

Counting standard deviations of the scatter between seeds, beyond any shift and on the side it points to, the
tightest checks are three. γ/ν comes to 3.0 after a finite-size bias of +0.0012: over these sizes the slope of the
susceptibility on a periodic square exceeds 7/4 by that much (Caselle, Hasenbusch, Pelissetto and Vicari 2002,
sec. 7.2, exact up to L = 17 and from their expansion beyond). The T_c crossing of L = 64 and 128 comes to 3.5, and
the energy above T_c to 3.6, at T = 2.75. The percolation dimension D is not among them. Counted from the shortfall
the 120-seed repeat below expects, 0.0142, its low side comes to 3.8 of that repeat's scatter of a nine-seed mean,
0.00256. Its high side, like the far side of every shifted check, allows no shift: 0.008 is 3.1 of those standard
deviations. But the value the repeat expects lies 0.0222 below that bound, 8.7 standard deviations, so the high
side guards only against gross errors. In a one-off repeat at these tolerances with 120 other sets of seeds (each
study seed plus 10000k, k = 1 to 120; not one of the repository's scripts), 119 passed every Ising check and the
other missed the crossing of L = 64 and 128 by 0.0003. The repeat predates the pooled percolation checks, but it
saved each seed's percolation crossings and D. A rerun of its percolation seeds reproduced those exactly and also
saved each seed's spanning probability at p_c, the points where it is one half and the crossings of sizes L/2 and
L. Split into 13 sets of nine seeds, all 13 pass the pooled checks; of 200,000 sets of nine drawn at random from
the 120 seeds, 37 fail, 3 on D and 34 on the point where the spanning probability at L = 32 is one half. That is
one draw, by a resampler that is not one of the repository's scripts either: 100 other draws of 200,000 give 22 to
60 failures, about 2 in 10,000, nearly all on that point. The closed forms are checked too: the energy against the
derivative of the published free energy (Caselle et al. 2002), to 10⁻⁷; Yang's formula against the same paper's
form, to rounding; the open-edge shift of a crossing, below, against the coefficient Ziff and Newman (2002,
sec. IV) predict from the same b₀ and a₁ for sizes L/2 and L, 1.04 (they measured 1.02). That catches a slip in the
algebra. Whether the shift describes this system is checked against their measured crossings of sizes L/2 and L
(Table 1): they sit above p_c by 0.930, 0.965 and 0.975 times the shift at L = 64, 128 and 256, and the check
allows 10%. At L = 32, the crossing of 16 and 32, the ratio is 0.862: the terms the expansion leaves out, of
relative order L^(−0.9) (their secs. II and IV), still matter there, so that size is left out. Neither check uses
the Monte Carlo runs. The comparison of the runs with their measurements, below, tests something else: that the
model is the system they measured.

The two percolation results need a word each, and neither is a disagreement:

- The crossings sit above p_c, as open edges make them. On a square with open edges, the point where two sizes give
  the same spanning probability approaches p_c as L^(−1−1/ν) = L^(−7/4), with ν = 4/3 for percolation (Ziff and
  Newman 2002). Their expansion, with the coefficients they use (b₀ = 0.322, a₁ = 0.765), puts the crossing of
  L = 32 and 128 0.00040 above p_c and that of L = 64 and 256 0.00012 above. Averaged over nine seeds, the
  crossings sit 0.00060 ± 0.00024 and 0.00017 ± 0.00023 above p_c, 0.8 and 0.2 standard errors beyond those shifts.
  The study seed alone sits 0.0012 and 0.0013 high. At L = 32 and 128 that is little more than one standard
  deviation of a single seed beyond the shift (single seeds scatter by 0.0007 there), which one seed cannot tell
  from a fluctuation. At L = 64 and 256 it is about 2.4: single seeds scatter by about 0.0005 there in the 120-seed
  repeat (0.0006 for the eight other seeds). That is unusual for one seed but not decisive. The mean of nine can
  tell. At L = 64 and 256 it rules out an offset of 0.0012 by more than 4 standard errors, and the check fails any
  mean more than 0.0010 above p_c (the shift plus 3.8 standard errors) or 0.0009 below (3.9). Against the repeat's
  scatter of a nine-seed mean, 0.00016, those bounds are 5.5 and 5.6 standard deviations: these nine seeds scatter
  more than the repeat's 120, and the study seed alone accounts for about half of the excess. The crossing of
  L = 32 and 128 is checked more loosely, failing beyond +0.0013 or −0.0009 (3.8 standard errors each way, beyond
  its shift on the high side; 4.1 of the repeat's scatter, 0.00022), because its shift is more than three times
  larger: an offset of 0.0012 would pass it. The point where the spanning probability at L = 256 is one half,
  printed but not checked, averages 0.59277 ± 0.00013; Ziff and Newman measured 0.5927208 (below).
- The spanning cluster's dimension comes out 1.880, 0.8% low. Single seeds scatter by 0.006 about that, so the
  shortfall, 0.016 ± 0.002, is systematic. Averaged over the nine seeds, the slope between successive sizes rises
  from 1.861 ± 0.002 (L = 32 to 64) to 1.876 ± 0.003 (64 to 128) and 1.884 ± 0.005 (128 to 256), as corrections to
  scaling fade. The first rise, 0.014 ± 0.004, is clear; the second, 0.008 ± 0.008, is one standard error, so nine
  seeds do not resolve it. Leaving out L = 32 raises the fitted slope by 0.006 ± 0.001, in all nine seeds. The
  shortfall is measured, not predicted, so the check does not test it. Its low side accepts D down to 0.024 below
  91/48. That bound does not rest on these runs: the independent 120-seed repeat, which shares no seeds with them,
  expects a shortfall of 0.0142 ± 0.0007, and its scatter of a nine-seed mean is 0.00256; the bound is 3.8 of those
  standard deviations beyond that shortfall. These runs' own shortfall plus 4.0 standard errors gives the same
  bound. The check passes with 0.0079 to spare. The high side is not tight. It accepts D up to 0.008 above 91/48
  with no shift, as on the far side of every shifted check here: 4.0 standard errors, 3.1 of the repeat's scatter
  of a nine-seed mean. Finite size lowers D at these sizes, so that bound sits 0.0222 above the value the repeat
  expects, 8.7 of those standard deviations: it guards only against gross errors. A cap at 91/48 itself, 5.5 of
  them above the expected value, would be tighter. It is not used, so that this side follows the same rule as the
  far side of every other shifted check.

Ziff and Newman (2002, Table 1) measured three of the model's finite-size quantities on this same system, an L × L
square with open edges, crossed in one direction, with 4 × 10⁹ to 3 × 10¹⁰ samples at each size; their errors are
generally in the last digit they quote. `critical/table.mjs` prints the nine-seed means beside their values for
L = 32 to 256: the spanning probability R at p_c, the point where R is one half and, above L = 32, the crossing of
sizes L/2 and L. All eleven agree within 1.04 standard errors. They amount to about four independent comparisons,
one per size: at each size R at p_c and the point where R is one half are read off the same curve and move together
from seed to seed (correlation −1.00 in the 120-seed repeat), and each crossing is nearly fixed by the points where
R is one half at its two sizes. The 120-seed repeat's means, with errors about four times smaller, agree within 2
of their own standard errors (largest 1.8). Of the eleven, the point where R is one half at L = 32 shows the open
edges most clearly: they put it 0.00091 below p_c, 4.3 standard errors of the nine-seed mean (the same shift shows
in R at p_c at that size, as 4.2; the rest are under 2). The nine-seed mean, 0.59178 ± 0.00021, sits 0.00006 below
Ziff and Newman's 0.5918352. The check fails a mean more than 0.0007 from it (3.3 standard errors; 3.9 of the
repeat's scatter of a nine-seed mean, 0.00018), and a mean at p_c would fail it by one standard error. So it tests
the model's finite-size behaviour against published measurements, not only the threshold. Nine seeds test it only
modestly: with the 120-seed repeat's values moved to centre on p_c, as if open edges had no effect at this size,
about one set of nine seeds in eight would still pass. The other ten comparisons are printed but not checked.

## Where the repetition stops

**Below: the lattice spacing.** Nothing in the model is smaller than one lattice spacing, as nothing in a fluid is
smaller than a molecule. At T_c the power laws are measured from 4 to 64 lattice spacings (G at half the box, for
L = 8 to 128). Over that factor of 16, ⟨|m|⟩ falls by 1.416 ± 0.013 (exact power law 1.414), χ grows by 128 ± 2
(128) and G(L/2) falls by 2.01 ± 0.03 (2.00).

**Above: the correlation length.** Off T_c the correlations die exponentially beyond ξ. Above T_c the exact
correlation length along a lattice axis is

    1/ξ = ln coth K − 2K = 2(K* − K),   with K = J/k_BT and the dual coupling K* given by tanh K* = e^(−2K).

This is the exponential ("true") correlation length, which sets the decay of the spin-spin correlation at large
distance. It is the pole of the large-distance two-point function of Cheng and Wu (1967) along an axis, as written
by Caselle et al. (2002, eqs. 5.1 to 5.4); `tests/critical.mjs` checks the two forms agree. Near T_c it becomes
1/(4(K_c − K)), the amplitude 1/(4K_c) = 0.5673 of Caselle, Hasenbusch, Pelissetto and Vicari (2000). The model
measures ξ from the row-summed correlation, which at large distance falls as cosh((L/2 − r)/ξ) on a ring of L
sites, fitted from r = 1 out to where it has fallen by e². Terms that fall faster add a little at short distance;
they shorten a fit from r = 1 by far less than the error bars here:

| T (J/k_B) | (T − T_c)/T_c | L | ξ measured | ξ exact | near-T_c form 1/(4(K_c − K)) |
|---|---|---|---|---|---|
| 2.40 | 0.058 | 64 | 9.93 ± 0.21 | 10.23 | 10.41 |
| 2.50 | 0.102 | 64 | 5.90 ± 0.10 | 5.96 | 6.14 |
| 2.75 | 0.212 | 32 | 3.05 ± 0.06 | 3.06 | 3.24 |
| 3.00 | 0.322 | 32 | 2.17 ± 0.04 | 2.14 | 2.33 |
| 4.00 | 0.763 | 16 | 1.11 ± 0.02 | 1.10 | 1.31 |

At 76% above T_c the nesting has shrunk to about one lattice spacing: there is nothing left to repeat. Below T_c
the correlation length is finite too: exactly 2.19, 3.61 and 9.11 lattice spacings at T = 2.0, 2.1 and 2.2, half
the high-temperature value at the dual coupling (Fujimoto and Otsuka 2020, appendix A). Those runs use L = 64, at
least seven correlation lengths, so finite-size effects are far below the error bars.

**At T_c: the box.** With ξ infinite, the box is the only upper cutoff, which is why the power laws are measured
against L. The percolation cluster at p_c is self-similar up to the box too, so it fills a shrinking share of it:
in the study seed's runs, 38.9% of the sites at L = 32, 29.8% at L = 256 (an exact L^(−5/48) fall would give
31.3%).

## Tuned scale invariance against self-organised ranges

A critical point like this one gives an unlimited scale-free range, but only at one point: the temperature at T_c
and the field at zero, or p at p_c. The range then runs from the lattice spacing to the size of the sample. Heat
the lattice 6% above T_c and the range ends at ten lattice spacings, 76% above at one; below T_c it ends sooner, at
nine lattice spacings only 3% below. Two other scale-free ranges in this repository's subject need no tuning.

- *Turbulent cascades.* A stirred fluid passes energy from the scale at which it is stirred down to the scale at
  which viscosity removes it. In between, only the rate of energy flow matters, and the velocity spectrum falls as
  k^(−5/3) (Kolmogorov 1941). The flow sets the range itself: its width grows as the Reynolds number to the power
  3/4 (as reviewed by Alexakis and Biferale 2018). This repository does not yet discuss turbulence elsewhere.
- *Gravitational clustering.* The density ripples of the early universe were close to scale-invariant: their
  spectrum is a power law in scale, k^(n_s − 1), with n_s = 0.965 ± 0.004, where n_s = 1 would give ripples of
  equal amplitude on every scale (Planck Collaboration 2020). Gravity has grown them into clustering that is
  fractal-like on small scales and turns smooth on large ones, as the opening section of the
  [README](../README.md#where-the-intuition-holds-and-where-it-breaks) describes (Scrimgeour et al. 2012).

In both, the range is set by the system's own numbers, not by a dial held at one value. A third possibility, a
system that drives itself to a critical point ("self-organised criticality", Bak, Tang and Wiesenfeld 1987), is not
modelled here.

Magnets whose spins can turn freely, in a plane or in space, are different again. In three dimensions, below T_c
and in zero field, spin waves (Goldstone modes) keep the transverse spin correlation falling as a power law, 1/r,
at every temperature, so ξ is infinite throughout the ordered phase (Pelissetto and Vicari 2002, secs. 1.3 and
1.6.2): a scale-free range that needs only the zero field, not a tuned temperature. In two dimensions the XY model,
whose spins turn in a plane, has a whole line of critical points below its Kosterlitz-Thouless temperature
(sec. 7.1). In three dimensions, real crystals have lattice anisotropy, which the isotropic models leave out
(sec. 5). It picks out easy directions and, much as a weak field does (sec. 1.6.2), removes the Goldstone
divergence: the transverse susceptibility below T_c becomes finite (sec. 11.3), so there the range is long but
finite.

## Real fluids

Water's liquid-vapour critical point is at 647 ± 2 K and 220.64 bar, 22.064 MPa (NIST Chemistry WebBook).
Liquid-vapour critical points belong to the universality class of the three-dimensional Ising model (Pelissetto and
Vicari 2002, sec. 3.1), whose exponents are known from the conformal bootstrap: ν = 0.629971(4) and
η = 0.0362978(20) (Kos, Poland, Simmons-Duffin and Vichi 2016). So a fluid's correlation length grows by
10^0.63 = 4.27 for each tenfold approach to T_c, against 10 for the 2D lattice here. The 2D exponents do not carry
over to fluids. The mechanism does: a correlation length that diverges at one tuned point, cut off below by the
size of a molecule.

## What the model leaves out

- Only two dimensions. The 3D exponents that describe real fluids and uniaxial magnets differ (above).
- Only small lattices: up to 128 × 128 for the Ising model and 256 × 256 for percolation. Finite size shows in the
  percolation dimension, rising with L, and in the open-edge percolation crossings.
- The correlation length is measured above T_c only, and along the lattice axes only. The exact correlation length
  depends on direction (Fujimoto and Otsuka 2020); the axis value is the one checked.
- Wolff clusters are a computational device. Only equilibrium averages are physical, not the sequence of states.
- Runtime is kept near 65 s for each of `npm test`'s critical checks and `critical/table.mjs`, most of it the nine
  percolation seeds, which limits the statistics: errors of 0.2% to 3% on the Ising exponents and ξ.

## Sources

- A. Alexakis and L. Biferale, *Cascades and transitions in turbulent flows*, Phys. Rep. 767–769, 1 (2018). https://doi.org/10.1016/j.physrep.2018.08.001 (https://arxiv.org/abs/1808.06186)
- P. Bak, C. Tang and K. Wiesenfeld, *Self-organized criticality: an explanation of the 1/f noise*, Phys. Rev. Lett. 59, 381 (1987). Not consulted directly. https://doi.org/10.1103/PhysRevLett.59.381
- K. Binder, *Finite size scaling analysis of Ising model block distribution functions*, Z. Phys. B 43, 119 (1981). Not consulted directly; the cumulant's definition is as quoted by Salas and Sokal (2000). https://doi.org/10.1007/BF01293604
- M. Caselle, M. Hasenbusch, A. Pelissetto and E. Vicari, *High-precision estimate of g4 in the 2D Ising model*, J. Phys. A 33, 8171 (2000), sec. 2. https://doi.org/10.1088/0305-4470/33/46/302 (https://arxiv.org/abs/hep-th/0003049)
- M. Caselle, M. Hasenbusch, A. Pelissetto and E. Vicari, *Irrelevant operators in the two-dimensional Ising model*, J. Phys. A 35, 4861 (2002), secs. 2.1, 5.1 and 7.2. https://doi.org/10.1088/0305-4470/35/23/305 (https://arxiv.org/abs/cond-mat/0106372)
- H. Cheng and T. T. Wu, *Theory of Toeplitz determinants and the spin correlations of the two-dimensional Ising model. III*, Phys. Rev. 164, 719 (1967). Not consulted directly; quoted through Caselle et al. (2002). https://doi.org/10.1103/PhysRev.164.719
- M. P. M. den Nijs, *A relation between the temperature exponents of the eight-vertex and q-state Potts model*, J. Phys. A 12, 1857 (1979). Not consulted directly; credited as in Lawler, Schramm and Werner (2002). https://doi.org/10.1088/0305-4470/12/10/030
- A. M. Ferrenberg and R. H. Swendsen, *New Monte Carlo technique for studying phase transitions*, Phys. Rev. Lett. 61, 2635 (1988). Not consulted directly; the weight is as written by Ferrenberg, Xu and Landau (2018). https://doi.org/10.1103/PhysRevLett.61.2635
- A. M. Ferrenberg, J. Xu and D. P. Landau, *Pushing the limits of Monte Carlo simulations for the three-dimensional Ising model*, Phys. Rev. E 97, 043301 (2018), sec. II C. https://doi.org/10.1103/PhysRevE.97.043301 (https://arxiv.org/abs/1806.03558)
- M. Fujimoto and H. Otsuka, *Asymptotic correlation functions in the Q-state Potts model: a universal form for point group C4v*, Phys. Rev. E 102, 032141 (2020), appendices A and B. https://doi.org/10.1103/PhysRevE.102.032141 (https://arxiv.org/abs/1906.01925)
- A. N. Kolmogorov, *The local structure of turbulence in incompressible viscous fluid for very large Reynolds numbers*, Proc. R. Soc. Lond. A 434, 9 (1991), English translation of the 1941 paper in Dokl. Akad. Nauk SSSR 30. Not consulted directly; see Alexakis and Biferale (2018). https://doi.org/10.1098/rspa.1991.0075
- F. Kos, D. Poland, D. Simmons-Duffin and A. Vichi, *Precision islands in the Ising and O(N) models*, JHEP 08, 036 (2016). https://doi.org/10.1007/JHEP08(2016)036 (https://arxiv.org/abs/1603.04436)
- G. F. Lawler, O. Schramm and W. Werner, *One-arm exponent for critical 2D percolation*, Electron. J. Probab. 7, paper 2 (2002). https://doi.org/10.1214/EJP.v7-101 (https://arxiv.org/abs/math/0108211)
- P. J. Linstrom and W. G. Mallard (eds.), *NIST Chemistry WebBook, NIST Standard Reference Database 69* (retrieved 18 October 2026), water, phase change data. https://doi.org/10.18434/T4D303
- M. E. J. Newman and R. M. Ziff, *Efficient Monte Carlo algorithm and high-precision results for percolation*, Phys. Rev. Lett. 85, 4104 (2000). https://doi.org/10.1103/PhysRevLett.85.4104 (https://arxiv.org/abs/cond-mat/0005264)
- B. Nienhuis, E. K. Riedel and M. Schick, *Magnetic exponents of the two-dimensional q-state Potts model*, J. Phys. A 13, L189 (1980). Not consulted directly; credited as in Lawler, Schramm and Werner (2002). https://doi.org/10.1088/0305-4470/13/6/005
- L. Onsager, *Crystal statistics. I. A two-dimensional model with an order-disorder transition*, Phys. Rev. 65, 117 (1944). Not consulted directly; T_c and the energy are checked against Caselle et al. (2002). https://doi.org/10.1103/PhysRev.65.117
- A. Pelissetto and E. Vicari, *Critical phenomena and renormalization-group theory*, Phys. Rep. 368, 549 (2002), secs. 1.3, 1.6.2, 3.1, 3.5, 5, 7.1 and 11.3. https://doi.org/10.1016/S0370-1573(02)00219-3 (https://arxiv.org/abs/cond-mat/0012164)
- Planck Collaboration, *Planck 2018 results. VI. Cosmological parameters*, A&A 641, A6 (2020). https://doi.org/10.1051/0004-6361/201833910 (https://arxiv.org/abs/1807.06209)
- J. Salas and A. D. Sokal, *Universal amplitude ratios in the critical two-dimensional Ising model on a torus*, J. Stat. Phys. 98, 551 (2000), sec. 4.1 and Table 2. https://doi.org/10.1023/A:1018611122166 (https://arxiv.org/abs/cond-mat/9904038)
- M. Scrimgeour et al., *The WiggleZ Dark Energy Survey: the transition to large-scale cosmic homogeneity*, MNRAS 425, 116–134 (2012). https://doi.org/10.1111/j.1365-2966.2012.21402.x (https://arxiv.org/abs/1205.6812)
- S. Smirnov and W. Werner, *Critical exponents for two-dimensional percolation*, Math. Res. Lett. 8, 729 (2001). https://doi.org/10.4310/MRL.2001.v8.n6.a4 (https://arxiv.org/abs/math/0109120)
- U. Wolff, *Collective Monte Carlo updating for spin systems*, Phys. Rev. Lett. 62, 361 (1989). Not consulted directly; the add probability is as in Fujimoto and Otsuka (2020, appendix B). https://doi.org/10.1103/PhysRevLett.62.361
- C. N. Yang, *The spontaneous magnetization of a two-dimensional Ising model*, Phys. Rev. 85, 808 (1952). Not consulted directly; the formula is checked against Caselle et al. (2002). https://doi.org/10.1103/PhysRev.85.808
- R. M. Ziff and M. E. J. Newman, *Convergence of threshold estimates for two-dimensional percolation*, Phys. Rev. E 66, 016129 (2002), secs. I, II and IV and Table 1. https://doi.org/10.1103/PhysRevE.66.016129 (https://arxiv.org/abs/cond-mat/0203496)

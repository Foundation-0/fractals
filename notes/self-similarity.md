# Self-similarity across scales: the mathematics of repetition

Exploration, not peer reviewed, no new result claimed. Started 27 October 2026 ([PR #39](https://github.com/Foundation-0/fractals/pull/39)),
corrected 26 November 2026 after review, and again on 28 November 2026. Each number is quoted from the source named
beside it, taken from the study it links, or worked out in the text. Sources are listed at the end. Symbols are
local to each section and defined at first use.

This note gathers definitions in one place. The studies hold the checked numbers: [critical/](../critical/README.md)
(Ising and percolation), [cosmic-homogeneity/](../cosmic-homogeneity/README.md),
[quantum-paths/](../quantum-paths/README.md), [witness-map/](../witness-map/model.js) and
[CORRECTIONS.md](../CORRECTIONS.md).

## 1. Notions of dimension

Let X be a bounded subset of Rⁿ, and N_ε(X) the minimum number of sets of diameter ε covering X.

Box-counting (Minkowski) dimension:

```
D_B = lim_{ε → 0} log N_ε(X) / log(1/ε), if it exists.
```

Hausdorff dimension: for s ≥ 0, H^s(X) = lim_{δ → 0} inf{ Σ_i (diam U_i)^s : X ⊂ ∪ U_i, diam U_i ≤ δ }.

```
dim_H X = inf{ s : H^s(X) = 0 } = sup{ s : H^s(X) = ∞ }.
```

Self-similar sets: if X = ∪_{i=1}^m f_i(X), where the f_i are contracting similarities of Rⁿ with ratios r_i, and
the maps satisfy the open set condition, then dim_H X = s, the root of Σ_i r_i^s = 1 (Moran 1946; Hutchinson 1981).
The open set condition also gives a covering N_ε ≍ ε^{−s}, so dim_B X = s as well. For general contractions the
root is only an upper bound. Example: the middle-thirds Cantor set, r = 1/3 twice, 2·(1/3)^s = 1,
s = ln 2 / ln 3 = 0.6309.

Correlation dimension (Grassberger and Procaccia 1983): for points x_i, C(r) = (2/(N(N−1))) Σ_{i<j} Θ(r − |x_i − x_j|).
Then D_2 = lim_{r → 0} log C(r) / log r.

Information dimension: D_1 = lim_{ε → 0} (Σ p_i log p_i) / log ε, with p_i the measure in box i. D_0 (box) ≥ D_1 ≥ D_2
at any fixed resolution, and so in the limit, with equality in the limit for monofractals. Slopes fitted over a finite
range can break the ordering, so it checks an estimate rather than guaranteeing one.

## 2. Multifractals and the spectrum

For a measure μ on X, the local dimension is α(x) = lim_{r → 0} log μ(B_r(x)) / log r. The Hausdorff dimension of the
set where α = α′ is f(α′). The partition function Z(q, ε) = Σ_i μ(B_i)^q scales as ε^{τ(q)}, and the Legendre
transform gives f(α) = qα − τ(q), with α = dτ/dq. Monofractal: τ(q) = (q − 1)D, so the spectrum collapses to the
single point α = f = D (Borgani 1995).

## 3. Cosmic structure: from fractal to homogeneous

Here ξ(r) is the two-point correlation function and ξ̄(r) its volume average:
ξ(r) = ∫ k² P(k) j₀(kr) dk / (2π²), ξ̄(r) = ∫ k² P(k) [3 j₁(kr)/(kr)] dk / (2π²).
N(<r) = 1 + ξ̄(r) is the count of neighbours within r divided by the count for an even spread of the same density.

Correlation dimension of the point process:

```
D_2(r) = 3 + d ln(1 + ξ̄)/d ln r = 3 + 3(ξ − ξ̄)/(1 + ξ̄), since dξ̄/d ln r = 3(ξ − ξ̄).
```

P(k) = A k^{n_s} T(k)² D(z)², with T(k) the Eisenstein and Hu (1998) transfer function, D(z) the linear growth factor
and the amplitude A normalised to σ₈.

Galaxy bias in redshift space: ξ_g = b²(1 + 2β/3 + β²/5) ξ₀, where ξ₀ is the z = 0 linear matter correlation
function (D(0) = 1), b the galaxy bias and β = f(z)/b. The growth rate is f ≈ Ω_m(z)^0.55 (Linder 2005).
Kaiser (1987) gives the factor 1 + 2β/3 + β²/5, with Ω^0.6. WiggleZ used the fitted β. The homogeneity scale R_H
is where D_2 = 2.97 (within 1% of 3) or N(<r) = 1.01.

WiggleZ measured R_H = 71 ± 8, 70 ± 5, 81 ± 5 and 75 ± 4 h⁻¹ Mpc at z = 0.2, 0.4, 0.6 and 0.8 (Scrimgeour et al.
2012). ΛCDM with the fitted bias gives 76, 78, 81 and 78 by the same D_2 criterion (80–85 by N = 1.01). These are fits
to the same data, not predictions. The approach to homogeneity is gradual, and R_H is a threshold convention: at a
1% threshold it lies near 70–80 h⁻¹ Mpc for these galaxies, and it moves with the threshold, the bias and the epoch.
The same model for matter (no galaxy bias) gives R_H = 77 h⁻¹ Mpc today at 1% and 185 at 0.1%, and 62, 50 and 29 at
z = 0.5, 1 and 2.4 ([cosmic-homogeneity/](../cosmic-homogeneity/README.md)).

## 4. Critical phenomena and scaling

[critical/](../critical/README.md) checks T_c and the Onsager energy, the ratios β/ν, γ/ν, η and 1/ν, the Binder
value 0.61069, p_c = 0.59274621 and D = 91/48, and the open-edge coefficients b₀ = 0.322 and a₁ = 0.765. The other
numbers in this section and the next are quoted from the sources named beside them.

Ising model: H = −J Σ_{⟨ij⟩} s_i s_j, s_i = ±1. Near T_c the correlation length diverges as ξ ~ |t|^{−ν}, with
t = (T − T_c)/T_c and ν = 1 (2D Ising, exact). At T_c the correlation function falls as G(r) ~ r^{−(d−2+η)}, with
η = 1/4 in 2D. Hyperscaling: dν = 2 − α. Scaling relations: γ = ν(2 − η), β = (d − 2 + η)ν/2,
δ = (d + 2 − η)/(d − 2 + η).

Onsager: T_c = 2J / (k_B ln(1 + √2)) = 2.269185 J/k_B. With K = J/(k_BT), the specific heat diverges
logarithmically, C ≈ −(8/π)K_c² ln|t| with equal amplitudes on both sides (α = 0 with a log); the singular part of the
free energy goes as t² ln|t|. Energy per spin, in units of J:
u = −coth(2K)[1 + (2/π)(2 tanh² 2K − 1) K₁(k)], where k = 2 sinh 2K / cosh² 2K and K₁(k) is the complete elliptic
integral of the first kind with modulus k.

Binder cumulant U_L = 1 − ⟨m⁴⟩/(3⟨m²⟩²) → 1 − V₄/3 = 0.61069 at T_c on a periodic L × L square (V₄ = 1.1679229;
Salas and Sokal 2000). A free-edge square gives 0.396 (Selke 2006). Finite-size scaling: U_L(T) = f((T − T_c) L^{1/ν}), so the
crossing of U_{L1} and U_{L2} approaches T_c as L^{−(ω + 1/ν)}, which is L^{−11/4} here (ω_eff = 7/4 from the
analytic background of χ; Salas and Sokal 2000, sec. 4.1). The cumulant's value at the crossing approaches U* as L^{−ω}.

Renormalization group: under rescaling x → x/b, couplings flow. At a fixed point, observables scale as power laws.
The fractal dimension of critical clusters is D = d − β/ν = (d + 2 − η)/2, set by η but not equal to it (Janke and
Schakel 2004): 15/8 for Ising Fortuin–Kasteleyn clusters and 91/48 for percolation. Ising like-spin clusters have
187/96. The critical point is where the correlation length is infinite, so the system is self-similar at all scales
from the lattice spacing up to the system size.

## 5. Percolation

Site percolation on the square lattice: p_c = 0.59274621(13) (Newman and Ziff 2000), the value
[critical/](../critical/README.md) uses. Jacobsen (2015) gives 0.59274605079210(2); Yang and Zhou (2024) dispute its
last digits, and Jacobsen (2024) replies. At p_c the incipient spanning cluster has fractal dimension
D = 91/48 = 1.895833, and the number of sites in the largest cluster scales as L^D. The 2D percolation (bulk)
exponents follow from D and ν = 4/3: τ = 1 + d/D =
187/91, σ = 1/(νD) = 36/91, β = 5/36, γ = 43/18, ν = 4/3, η = 5/24 and α = −2/3 (α conjectured). Smirnov and Werner
(2001) prove β, γ and ν on the triangular lattice. The one-arm exponent 5/48, and with it D and η, is Lawler, Schramm
and Werner (2002). The hull has dimension 7/4 (Rohde and Schramm, and Beffara, as cited by Smirnov and Werner 2001)
and the accessible perimeter 4/3 (Lawler, Schramm and Werner 2001, as cited there).

Open (free) boundary conditions shift finite-size crossings: R_L(p) = 1/2 + a₁(p − p_c)L^{1/ν} + b₀/L + ..., with
b₀ = 0.322 and a₁ = 0.765 as used by Ziff and Newman (2002); a₁ is from Ziff 1992 and Hovi and Aharony 1996, and
Ziff and Newman's own fit gives b₀ = 0.320(1). The crossing of R_{L1} and R_{L2} sits above p_c by
(b₀/a₁)(1/L₁ − 1/L₂)/(L₂^{1/ν} − L₁^{1/ν}).

## 6. Quantum paths and the Witness Map

Abbott and Wise (1981): a free particle's path, as traced by a sequence of position measurements, has dimension 2
on scales Δx ≪ ħ/p and dimension 1 on scales Δx ≫ ħ/p. The crossover is gradual; in the
[quantum-paths/](../quantum-paths/README.md) model's local slope it is about a decade wide. The lower end
at the reduced Compton length ħ/(mc), where relativistic motion smooths the path, is that model's own, not Abbott
and Wise's, and holds in a single-particle model: it is a bound, not a measurement (CORRECTIONS.md item 17). With records
a fixed time apart the rough stretch widens as about √N ħ/p, and under Abbott and Wise's self-similar spacing the
heating makes D about 3 (quantum-paths/README.md).

The witness number W = (m Δx²/ħ)/τ_witness comes from [witness-map/](../witness-map/model.js). It compares the
free spreading time across a gap Δx with the time for the surroundings to suppress interference across that gap.
It decides whether a superposition across the gap survives, not the path's dimension.

Decoherence by a gas, for gaps below the gas's thermal wavelength, where the rate is ΛΔx²:
Λ = 8 n √(2π m_g) a² (k_BT)^{3/2} / (3ħ²), with n the gas number density, m_g the gas molecule's mass and a the
object's radius (Schlosshauer 2007, as quoted by Romero-Isart 2011; CORRECTIONS.md item 5). Epstein's (1924) drag law
for specular reflection gives a cross-check, Λ = drag × kT/ħ², which `tests/quantum-paths.mjs` runs. Joos and Zeh's
table gives
10³⁶ cm⁻² s⁻¹ (10⁴⁰ m⁻² s⁻¹) for a 10 µm grain in air. The closed form gives 8.6×10⁴⁰ m⁻² s⁻¹, about 9 times more at
every size (CORRECTIONS.md item 9).

## 7. Algorithm: box counting

```
function boxDimension(points, epsilons, offsets=[0]):   # points: list of d-dimensional tuples
  for eps in epsilons:
    N[eps] = min over o in offsets of:
      grid = set()
      for p in points:
        grid.add(tuple(floor((c + o*eps) / eps) for c in p))  # one key per box, all d coordinates
      len(grid)
  # local slopes of log N against log(1/eps); fit only over a window where they are flat,
  # and report that window. Lacunar sets need ε matched to the set, or several offsets.
  return slope, window
```

Test the routine on a set of dimension above 1, such as the Sierpinski triangle, so that a key built from one
coordinate would show up as a wrong answer (it measures the x-projection and would give 1 against 1.585).

For a time series, delay embedding (Takens 1981) reconstructs the attractor in R^m from x(t), x(t + τ), ...,
x(t + (m − 1)τ). An embedding dimension m > 2D₀ suffices (Sauer, Yorke and Casdagli 1991). Grassberger–Procaccia
needs only m > D₂ (Sauer and Yorke 1993) and gives D₂, which is at most D₀.

## 8. Where repetition breaks

Every fractal window has ends:
- Quantum paths: the speed of light below (ħ/mc, a bound in a single-particle model, not a measurement), the
  particle's own momentum above (ħ/p). The surroundings' resolution sets only whether that roughness is drawn.
- Cosmic structure: no sharp edge. Clustering grown by gravity from nearly scale-invariant ripples falls below a
  chosen threshold, at about 70–80 h⁻¹ Mpc at 1% for WiggleZ galaxies, and that scale moves with the threshold and
  with time. Accelerated expansion only caps the growth. At small scales, halo nesting stops near the dark matter
  particle's cut-off (open PR [#35](https://github.com/Foundation-0/fractals/pull/35), pending).
- Critical point (Ising): the lattice spacing below; above, ξ ~ |t|^{−ν}, infinite only at T_c in zero field. At T_c
  the box is the only upper cut-off.
- Coastlines: molecular size below, continental size above.

Self-similarity is a property of the window and the mechanism that bounds it, not of the object.

## Sources

- L. F. Abbott and M. B. Wise, *Dimension of a quantum-mechanical path*, Am. J. Phys. 49, 37 (1981). https://doi.org/10.1119/1.12657
- S. Borgani, *Scaling in the universe*, Phys. Rep. 251, 1 (1995). https://doi.org/10.1016/0370-1573(94)00073-C (https://arxiv.org/abs/astro-ph/9404054)
- D. J. Eisenstein and W. Hu, *Baryonic features in the matter transfer function*, ApJ 496, 605 (1998). https://doi.org/10.1086/305424 (https://arxiv.org/abs/astro-ph/9709112)
- P. S. Epstein, *On the resistance experienced by spheres in their motion through gases*, Phys. Rev. 23, 710 (1924). https://doi.org/10.1103/PhysRev.23.710
- P. Grassberger and I. Procaccia, *Characterization of strange attractors*, Phys. Rev. Lett. 50, 346 (1983). https://doi.org/10.1103/PhysRevLett.50.346
- J.-P. Hovi and A. Aharony, *Scaling and universality in the spanning probability for percolation*, Phys. Rev. E 53, 235 (1996). https://doi.org/10.1103/PhysRevE.53.235
- J. E. Hutchinson, *Fractals and self similarity*, Indiana Univ. Math. J. 30, 713 (1981). https://doi.org/10.1512/iumj.1981.30.30055
- J. L. Jacobsen, *Critical points of Potts and O(N) models from eigenvalue identities in periodic Temperley–Lieb algebras*, J. Phys. A 48, 454003 (2015). https://doi.org/10.1088/1751-8113/48/45/454003 (https://arxiv.org/abs/1507.03027)
- J. L. Jacobsen, *Reply to Comment on ‘Critical points of Potts and O(N) models from eigenvalue identities in periodic Temperley–Lieb algebras’*, J. Phys. A 57, 258002 (2024). https://doi.org/10.1088/1751-8121/ad4d33
- W. Janke and A. M. J. Schakel, *Geometrical vs. Fortuin–Kasteleyn clusters in the two-dimensional q-state Potts model*, Nucl. Phys. B 700, 385 (2004). https://doi.org/10.1016/j.nuclphysb.2004.08.030 (https://arxiv.org/abs/cond-mat/0311624)
- E. Joos, *Dynamical consequences of strong entanglement* (2005), which reprints the Joos and Zeh air table. https://arxiv.org/abs/quant-ph/0512079
- N. Kaiser, *Clustering in real space and in redshift space*, MNRAS 227, 1 (1987). https://doi.org/10.1093/mnras/227.1.1
- G. F. Lawler, O. Schramm and W. Werner, *The dimension of the planar Brownian frontier is 4/3*, Math. Res. Lett. 8, 401 (2001). https://doi.org/10.4310/MRL.2001.v8.n4.a1
- G. F. Lawler, O. Schramm and W. Werner, *One-arm exponent for critical 2D percolation*, Electron. J. Probab. 7, paper 2 (2002). https://doi.org/10.1214/EJP.v7-101 (https://arxiv.org/abs/math/0108211)
- E. V. Linder, *Cosmic growth history and expansion history*, Phys. Rev. D 72, 043529 (2005). https://doi.org/10.1103/PhysRevD.72.043529 (https://arxiv.org/abs/astro-ph/0507263)
- P. A. P. Moran, *Additive functions of intervals and Hausdorff measure*, Proc. Camb. Phil. Soc. 42, 15 (1946). https://doi.org/10.1017/S0305004100022684
- M. E. J. Newman and R. M. Ziff, *Efficient Monte Carlo algorithm and high-precision results for percolation*, Phys. Rev. Lett. 85, 4104 (2000). https://doi.org/10.1103/PhysRevLett.85.4104 (https://arxiv.org/abs/cond-mat/0005264)
- L. Onsager, *Crystal statistics. I. A two-dimensional model with an order-disorder transition*, Phys. Rev. 65, 117 (1944). https://doi.org/10.1103/PhysRev.65.117
- O. Romero-Isart, *Quantum superposition of massive objects and collapse models*, Phys. Rev. A 84, 052121 (2011). https://doi.org/10.1103/PhysRevA.84.052121 (https://arxiv.org/abs/1110.4495)
- J. Salas and A. D. Sokal, *Universal amplitude ratios in the critical two-dimensional Ising model on a torus*, J. Stat. Phys. 98, 551 (2000). https://doi.org/10.1023/A:1018611122166 (https://arxiv.org/abs/cond-mat/9904038)
- T. Sauer, J. A. Yorke and M. Casdagli, *Embedology*, J. Stat. Phys. 65, 579 (1991). https://doi.org/10.1007/BF01053745
- T. Sauer and J. A. Yorke, *How many delay coordinates do you need?*, Int. J. Bifurcation Chaos 3, 737 (1993). https://doi.org/10.1142/S0218127493000647
- M. Schlosshauer, *Decoherence and the Quantum-to-Classical Transition*, Springer (2007). https://doi.org/10.1007/978-3-540-35775-9
- M. Scrimgeour et al., *The WiggleZ Dark Energy Survey: the transition to large-scale cosmic homogeneity*, MNRAS 425, 116 (2012). https://doi.org/10.1111/j.1365-2966.2012.21402.x (https://arxiv.org/abs/1205.6812)
- W. Selke, *Critical Binder cumulant of two-dimensional Ising models*, Eur. Phys. J. B 51, 223 (2006). https://doi.org/10.1140/epjb/e2006-00209-7 (https://arxiv.org/abs/cond-mat/0603411)
- S. Smirnov and W. Werner, *Critical exponents for two-dimensional percolation*, Math. Res. Lett. 8, 729 (2001). https://doi.org/10.4310/MRL.2001.v8.n6.a4 (https://arxiv.org/abs/math/0109120)
- F. Takens, *Detecting strange attractors in turbulence*, Lecture Notes in Math. 898, 366 (1981). https://doi.org/10.1007/BFb0091924
- Y. Yang and S. Zhou, *Comment on ‘Critical points of Potts and O(N) models from eigenvalue identities in periodic Temperley–Lieb algebras’*, J. Phys. A 57, 258001 (2024). https://doi.org/10.1088/1751-8121/ad4d2c
- R. M. Ziff, *Spanning probability in 2D percolation*, Phys. Rev. Lett. 69, 2670 (1992). https://doi.org/10.1103/PhysRevLett.69.2670
- R. M. Ziff and M. E. J. Newman, *Convergence of threshold estimates for two-dimensional percolation*, Phys. Rev. E 66, 016129 (2002). https://doi.org/10.1103/PhysRevE.66.016129 (https://arxiv.org/abs/cond-mat/0203496)

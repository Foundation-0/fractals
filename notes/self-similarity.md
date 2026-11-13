# Self-similarity across scales: the mathematics of repetition

Exploration, not peer reviewed, no new result claimed.

## 1. Notions of dimension

Let X be a metric space, N_epsilon(X) the minimum number of balls of radius epsilon covering X.

Box-counting (Minkowski) dimension:
  D_B = lim_{epsilon -> 0} log N_epsilon(X) / log(1/epsilon), if it exists.

Hausdorff dimension: for s >= 0, H^s(X) = lim_{delta -> 0} inf{ sum_i (diam U_i)^s : X subset union U_i, diam U_i <= delta }.
  dim_H X = inf{ s : H^s(X) = 0 } = sup{ s : H^s(X) = infinity }.

For self-similar sets satisfying the open set condition, dim_H = dim_B = the similarity dimension: if X = union_{i=1}^m f_i(X) with
contractions of ratios r_i, then sum_i r_i^s = 1 solves for s. Example: middle-thirds Cantor set, r = 1/3 twice, 2*(1/3)^s = 1, s = ln 2 / ln 3 = 0.6309.

Correlation dimension (Grassberger-Procaccia): for points x_i, C(r) = (2/(N(N-1))) sum_{i<j} Theta(r - |x_i - x_j|). Then
  D_2 = lim_{r -> 0} log C(r) / log r.

Information dimension D_1 = lim_{epsilon->0} (sum p_i log p_i)/log epsilon. In general D_0 (box) >= D_1 >= D_2 for multifractals, with equality for monofractals.

## 2. Multifractals and the spectrum

For a measure mu on X, the local dimension alpha(x) = lim_{r->0} log mu(B_r(x))/log r. The Hausdorff dimension of the set where alpha = alpha' is f(alpha). The partition function Z(q, epsilon) = sum_i mu(B_i)^q ~ epsilon^{tau(q)}, and the Legendre transform gives f(alpha) = q alpha - tau(q), alpha = d tau / d q. Monofractal: f(alpha) = D delta(alpha - D).

## 3. Cosmic structure: from fractal to homogeneous

N(<r) = 1 + xibar(r), with xi(r) = integral k^2 P(k) j0(kr) dk / (2 pi^2), xibar(r) = integral k^2 P(k) [3 j1(kr)/(kr)] dk / (2 pi^2).

Correlation dimension of the point process:
  D_2(r) = 3 + d ln (1 + xibar)/d ln r = 3 + 3 (xi - xibar)/(1 + xibar), since d xibar/d ln r = 3 (xi - xibar).

P(k) = A k^{n_s} T(k)^2 D(z)^2, T(k) Eisenstein-Hu (1998) transfer function, normalised to sigma_8.

Galaxy bias in redshift space: xi_g = b^2 (1 + 2 beta/3 + beta^2/5) D(z)^2 xi_0, beta = Omega_m^{0.55}/b (Kaiser 1987). Homogeneity scale R_H where D_2 = 2.97 (within 1% of 3) or N within 1% of 1.

WiggleZ measured R_H = 71 +/- 8, 70 +/- 5, 81 +/- 5, 75 +/- 4 h^-1 Mpc at z = 0.2, 0.4, 0.6, 0.8. LCDM predicts 76-85. The fractal window closes at ~70-80 h^-1 Mpc.

## 4. Critical phenomena and scaling

Ising model: H = -J sum_{<ij>} s_i s_j, s_i = +/-1. At T_c, correlation length xi diverges: xi ~ |t|^{-nu}, t = (T - T_c)/T_c, nu = 1 (2D Ising, exact). Correlation function G(r) ~ r^{-(d-2+eta)} at T_c, eta = 1/4 (2D). Hyperscaling: d nu = 2 - alpha; scaling relations: gamma = nu(2 - eta), beta = (d - 2 + eta) nu / 2, delta = (d + 2 - eta)/(d - 2 + eta).

Onsager exact: T_c = 2 J / (k_B ln(1+sqrt2)); at T_c, free energy has a logarithmic singularity (alpha = 0 with log). Energy per spin u = -coth(2K)[1 + (2/pi)(2 tanh^2 2K - 1) K_1(k)], k = 2 sinh 2K / cosh^2 2K.

Binder cumulant U_L = 1 - <m^4>/(3 <m^2>^2) -> 1 - V_4/3 = 0.61069 at T_c (V_4 = 1.1679229). Finite-size scaling: U_L(T) = f((T - T_c) L^{1/nu}), so crossing of U_{L1}, U_{L2} locates T_c with corrections L^{-omega}.

Renormalization group: under rescaling x -> x/b, couplings flow. At a fixed point, observables scale as power laws; the fractal dimension of clusters is the anomalous dimension. The critical point is where the correlation length is infinite, i.e. the system is self-similar at all scales up to the system size.

## 5. Percolation

Site percolation on square lattice: p_c = 0.59274605079210(2) (Newman-Ziff 2000). At p_c, the incipient spanning cluster has fractal dimension D = 91/48 = 1.895833. The number of sites in the largest cluster scales as L^D. The percolation (hull) exponents: tau = 187/91, sigma = 36/91, beta = 5/36, gamma = 43/18, nu = 4/3, eta = 5/24, alpha = -2/3.

Open (free) boundary conditions shift finite-size crossings: R_L(p) = 1/2 + a_1 (p-p_c) L^{1/nu} + b_0/L + ... with b_0 = 0.322, a_1 = 0.765 (Ziff-Newman 2002). Crossing of R_{L1}, R_{L2} sits above p_c by (b_0/a_1)(1/L_1 - 1/L_2)/(L_2^{1/nu} - L_1^{1/nu}).

## 6. Quantum paths (Abbott-Wise)

A free particle's position measurement record has fractal dimension 2 between the Compton wavelength lambda_C = h/(mc) and the de Broglie wavelength lambda_dB = h/p. Below lambda_C, relativistic smoothness; above lambda_dB, classical. The witness number W = (m Delta x^2 / hbar) / tau_witness determines which regime: W < 1 wave, W > 1 classical. Decoherence rate for gas: Lambda = (8/3) n sqrt(2 pi m kT) a^2 (kT)^2 / hbar^2 (Epstein/Schlosshauer), vs Joos-Zeh table values ~10^36 m^-2 s^-1.

## 7. Algorithm: box counting

  function boxDimension(points, epsilons):
    for eps in epsilons:
      grid = set()
      for p in points:
        grid.add(floor(p.x/eps), floor(p.y/eps), floor(p.z/eps))
      N[eps] = len(grid)
    # linear regression of log N vs log(1/eps)
    return slope

For a time series, delay embedding (Takens): reconstruct attractor in R^m with x(t), x(t+tau), ..., x(t+(m-1)tau); then box-count. Correlation dimension via Grassberger-Procaccia is more efficient.

## 8. Where repetition breaks

Every fractal window is bounded by a mechanism:
- Quantum paths: c (light speed) below, witnesses above.
- Cosmic structure: gravitational collapse below, Hubble expansion above.
- Critical point: only at T_c is xi infinite; off T_c, xi ~ |t|^{-nu} closes the window.
- Coastlines: molecular size below, continental size above.

Self-similarity is a property of the window and the mechanism that bounds it, not of the object.

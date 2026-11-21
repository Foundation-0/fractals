# Unified Witness-Map Operator, Tomita–Takesaki Modular Flow & Exact $16\times 16$ Zero-Float Lindblad Zeno Schur-Complement Theorem

Self-contained verification study for **`Foundation-0/fractals`** (`witness-map/model.js`), independently audited in **`AUDIT-018` (`VERIFIED` | `exact` Parts A–B + `anchor` Part C | `N2` cross-repo milestone)** via independent symbolic SymPy $16\times 16$ GKSL verification and live `node` cross-checks against `witness-map/model.js`.

## What This Solves

In `witness-map/model.js`, single-particle decoherence (`rates()`, witness number $W = \Gamma \cdot m\Delta x^2/\hbar$) and wave dark-matter crowds (`crowd()`, $N \sim 10^{93}$ coherent particles per lump) live in two separate panels: *"one particle has no witnesses; the crowd has many; yet the crowd's internal interference lumps survive being watched."*

`probe4_witness_zeno_schur.py` (100% pure Python 3 stdlib; zero NumPy/SciPy; zero floats in all algebraic proofs; zero bare `assert`s) unifies both regimes with three exact results:

### 1. Part A — Exact Multipole Scaling, Dipole Cancellation & Huygens–Steiner DSW Quadrupole Split ($\mathbb{Q}$ / $\mathbb{Q}(i)$)
Across zero-center-of-mass clusters ($x_j = R + \xi_j$, $\sum_{j=1}^N \xi_j = 0$, verified over $N \in \{2,3,4,5,7,10\}$):
- **CM Cube Law:** Coherent amplitude amplification gives $\Gamma_{\mathrm{CM}} = N^2 \Gamma_1$ and wave clock $t_{\mathrm{wave}}^{\mathrm{CM}} = N t_{\mathrm{wave}}^{(1)}$, yielding exact **$W_{\mathrm{CM}}(N) \equiv N^3 W_{\mathrm{single}}$**.
- **Exact Dipole Cancellation:** On pure internal shape superpositions ($\Delta R = 0$, $\sum\xi_j = \sum\xi'_j = 0$), both $O(k^0)$ and $O(k^2)$ cancel identically, leaving quadrupole tidal rate $\Gamma_{\mathrm{int}}^{(4)} = \frac{\gamma_0 k^4}{8}(\Delta I_{\mathrm{int}})^2$ and protection ratio $\mathcal{P}_{\mathrm{inv}} = \frac{4 N^2 (\Delta R)^2}{k^2 (\Delta I_{\mathrm{int}})^2}$ (while isometric modes in $\mathcal{F}^{\mathrm{inv}}$ vanish identically through $O(k^{10})$).
- **Huygens–Steiner / DSW Black-Hole Mass-Quadrupole Split:** $Q(R,\xi) = \sum_j m(R+\xi_j)^2 \equiv N m R^2 + m I_{\mathrm{int}}(\xi)$ has exact zero cross-term iff $\sum_j \xi_j = 0$, proving Danielson–Satishchandran–Wald gravitational horizon witnessing (`witness-map/model.js` line 105) obeys $W_{\mathrm{BH}}^{\mathrm{CM}} = N^3 W_{\mathrm{BH}}^{(1)}$ while remaining blind to quadrupole-preserving internal modes ($\Delta I_{\mathrm{int}} = 0$). Breaking $\sum \xi_j = 0$ immediately restores $O(k^2)$ internal decoherence (`3/10`) and nonzero cross-term (`35/11`).

### 2. Part B — First-Principles $16\times 16$ Zero-Float GKSL Superoperator, Tomita–Takesaki Modular Flow & Zeno Schur Complement ($\mathbb{Q}$ / $\mathbb{Q}(i)$ + `math.isqrt`)
Constructed directly from $4\times 4$ matrix commutators and dissipators over exact Gaussian rationals $\mathbb{Q}(i)$ on $\mathcal{H}_{\mathrm{CM}}\otimes\mathcal{H}_{\mathrm{rel}} \cong \mathbb{C}^2\otimes\mathbb{C}^2$ with $H = g(X\otimes Z) + \omega_{\mathrm{rel}}(I\otimes Z)$, $L_{\mathrm{CM}} = Z\otimes I$ ($\gamma_{\mathrm{CM}} = N^2 \gamma_1$), and $L_{\mathrm{tid}} = Z\otimes Z$ ($\gamma_{\mathrm{tid}}$):
- **Exact Tomita–Takesaki Modular Flow Commutation:** On an explicit non-diagonal, non-product faithful state $\rho_S \in \mathcal{V}_{\mathrm{inv}} = \ker(\mathcal{D}[Z\otimes I])$ with $[\rho_0, \rho_1] \ne 0$, the exact $16\times 16$ modular operator $\Delta_{\rho_S}(A) = \rho_S A \rho_S^{-1}$ satisfies $\Delta_{\rho_S} = \Delta_{\rho_S}^\dagger$, **$[\mathcal{D}[Z\otimes I], \Delta_{\rho_S}] \equiv 0$** (implying $[\mathcal{E}_t, \sigma_s^{\rho_S}] = 0$ for all $s,t \in \mathbb{R}$), and exact KMS quantum detailed balance; all 3 adversarial controls (coherent CM state, local witness $I\otimes Z$, entangling witness $Z\otimes X$) strictly break commutation.
- **Exact $8\times 8$ Schur Complement ($N = 1..100$):** Eliminating fast-decohering $\mathcal{V}_{\mathrm{wit}} = \{X,Y\}_{\mathrm{CM}}\otimes\{I,X,Y,Z\}_{\mathrm{rel}}$ yields exact diagonal $\mathcal{L}_{\mathrm{eff}}^{\mathrm{inv}} = \mathcal{L}_{\mathrm{inv,inv}} - \mathcal{L}_{\mathrm{inv,wit}}\mathcal{L}_{\mathrm{wit,wit}}^{-1}\mathcal{L}_{\mathrm{wit,inv}}$:
  - `II`, `IZ`: exact **`0`** for all $(N, g, \gamma_1, \gamma_{\mathrm{tid}})$ ($\mathcal{F}^{\mathrm{inv}}$ pointer conservation);
  - `IX`, `IY`: exact **`-(2\gamma_{\mathrm{tid}} + 2g^2/(N^2\gamma_1))`** (**$1/N^2$ Quantum-Zeno sealing** of internal coherence as $N$ grows!);
  - `ZI`, `ZZ`: exact **`-2g^2/(N^2\gamma_1 + \gamma_{\mathrm{tid}})`** (CM pointer freezing);
  - `ZX`, `ZY`: exact **`-2\gamma_{\mathrm{tid}}`**.
- **Exact Exceptional-Point (EP2) Phase Boundary & Riccati Lift:** At $\gamma_{\mathrm{CM}} = 2g$ ($\gamma_{\mathrm{tid}} = 0$), exact nilpotent Jordan blocks ($N_{\mathrm{EP}}\ne 0, N_{\mathrm{EP}}^2=0$, full $16\times 16$ ranks `(12, 8)`; split $\gamma_{\mathrm{tid}}=1$ isolates `IX,IY` with ranks `(14, 12)`) separate the underdamped single-particle regime from the overdamped classical-crowd Zeno regime, where 80-bit `isqrt` brackets verify $(-\lambda_{\mathrm{slow}})/\Gamma_{\mathrm{Schur}} \to 1$ at $O(N^{-4})$, recursive Riccati iteration drives $\mathcal{R}[H_k]$ to `2.36e-15`, coherent internal frequency $H_{\mathrm{rel}} = \omega(I\otimes Z)$ commutes identically ($[\mathcal{L}_{\mathrm{bare}}, \mathcal{L}_{\mathrm{clock}}] = 0$), and $O(16,\mathbb{Q})$ orthogonal similarity invariance holds with `0` residual.

### 3. Part C — Quantitative Calibration to `witness-map/model.js` & `Foundation-0/gravity` `C-03`
- **Cross-Repo Soliton Reconciliation (`1.45e-6` match):** Replaying `model.js`'s `SOL` ($h = 4\times 10^{-3}$) reconciles `model.js`'s half-density invariant $M_{\mathrm{sol}} r_c = 2.6794\,\hbar^2/(G m^2)$ ($x_c = 1.2993$) with `Foundation-0/gravity` `C-03`'s half-mass invariant $M_{\mathrm{sol}} r_{1/2} = 3.9251\,\hbar^2/(G m^2)$ ($x_{1/2} = 1.9033$, universal ratio $r_{1/2}/r_c = 1.4649$).
- **Sgr A* Black-Hole Horizon Crossover at $b = 8.18\text{ kpc}$ (`dx < b/10` verified):**
  - The $N^3$ cube law flips all three `CROWDS` (`sun`, `sun-heavy`, `core`) from $\log_{10} W_{\mathrm{BH}}^{(1)} \in [-169.5, -154.8]$ to $\log_{10} W_{\mathrm{BH}}^{\mathrm{CM}} \in [+67.9, +135.8]$.
  - Because $m_{\mathrm{lump}} \propto \rho \lambda^3 \propto m^{-3}$ and $\lambda \propto m^{-1}$, Sgr A*'s gravitational horizon rate obeys **$\Gamma_{\mathrm{BH}}^{\mathrm{CM}} \propto m^{-10}$** and **$\Gamma_{\mathrm{BH}}^{\mathrm{CM}} t_{\mathrm{lump}} \propto m^{-11}$**:
    - `sun` ($10^{-22}\text{ eV}$, $N = 1.09\times 10^{93}$): Sgr A*'s horizon alone decoheres the CM in **`2.41e-14 s` (24 fs)** while Zeno-sealing internal interference by $1/N^2 \sim 10^{-186}$.
    - `sun-heavy` ($3\times 10^{-19}\text{ eV}$, $N = 1.34\times 10^{79}$): despite $W_{\mathrm{BH}}^{\mathrm{CM}} = 7.1\times 10^{67} \gg 1$, $\tau_{\mathrm{BH}}^{\mathrm{CM}} = \mathbf{1.42\times 10^{21}\text{ s}}$ (`3,263x` the age of the universe!).
    - **Exact crossover boson masses at Sgr A* (`8.18 kpc`):** **`m*(tau = tLump) = 2.83e-20 eV`** and **`m*(tau = 13.8 Gyr) = 1.34e-19 eV`** (verified to `1.0000000000000002` against live `witness-map/model.js` in `AUDIT-018`).

## Reproduction

Pure Python 3 stdlib (zero dependencies):

```sh
python3 -I -B -W error studies/expedition-witness-zeno-schur/probe4_witness_zeno_schur.py
python3 -I -O -B -W error studies/expedition-witness-zeno-schur/probe4_witness_zeno_schur.py
```

On-disk canonical SHA-256 (`sha256sum probe4_witness_zeno_results.json`):
`899d65178959d397a1121ec0a494dbe9cf6a5e7fd2ef2ecb29ef4f22b30c3451`

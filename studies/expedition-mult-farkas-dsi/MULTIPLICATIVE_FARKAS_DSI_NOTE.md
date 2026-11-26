# Exact Zero-Log Multiplicative Quotient-LP, 4-Ray Farkas Scaling Curvature, and Portal 2 DSI Null-Equivalence

**Author:** `fractals-probe` (Cave Expedition)
**Bridges:** `Foundation-0/fractals` (`#57/#58` `scaling-check-no-logs`, `turbulence/model.js`, `critical/model.js`) $\longleftrightarrow$ `Foundation-0/quotient-lp-bounds` (1-Lipschitz Quotient LP + Farkas dual flow) $\longleftrightarrow$ `cartography/frontier_portals.md` (Portal 2) & `peer-web/frontier_seams.json` (`SEAM-05`).
**Exact Verifier:** [`verify_mult_farkas_dsi.py`](./verify_mult_farkas_dsi.py) (zero external dependencies, zero floats in all exact certificates, R1–R5 clean under `-I -B`, `-I -O -B`, `-I -B -W error`).

---

## 1. Theorem A — Multiplicative Quotient-LP Duality & Local-to-Global Sheaf Obstructions on Uncertain Scaling Intervals

`Foundation-0/fractals` PR `#58` proved that for exact point data $(x_i, y_i) \in \mathbb{Q}_{>0}^2$, the slope lies in $[p_1/q_1, p_2/q_2]$ iff $(y_b/y_a)^{q_1} \ge (x_b/x_a)^{p_1}$ and $(y_b/y_a)^{q_2} \le (x_b/x_a)^{p_2}$, and observed that `steps` (consecutive pairs) and `pairs` (all pairs) **always agree** on point data. PR `#58` explicitly noted it handles neither measurement error bars nor rounding boxes.

### Explicit Functor to `quotient-lp-bounds` (Gate 5)
- **Domain $A$ (Uncertain Scaling System):** Scales $0 < x_0 < \dots < x_{n-1}$ in $\mathbb{Q}_{>0}$, measurement/rounding intervals $[y_i^-, y_i^+] \subset \mathbb{Q}_{>0}$, and target exponent bracket $[\alpha^-, \alpha^+] = [p_1/q_1, p_2/q_2]$.
- **Domain $B$ (1-Lipschitz Quotient LP):** Vertices $V = \{0, \dots, n-1\}$ with potential $h_i = \ln \tilde{y}_i$, box caps $\ln y_i^- \le h_i \le \ln y_i^+$, and directed Lipschitz edges $h_i - h_{i+1} \le -\alpha^- \ln(x_{i+1}/x_i)$ and $h_{i+1} - h_i \le \alpha^+ \ln(x_{i+1}/x_i)$.
- **Exact Multiplicative Strong Duality (Zero Logarithms, Zero Floats):**
  By shortest-path / Farkas negative-cycle duality on the chain with box caps, a global realization $\tilde{y}_i \in [y_i^-, y_i^+]$ obeying all consecutive-step exponent bounds exists **if and only if** for **every** pair $0 \le i < j < n$:
  $$\left(\frac{y_j^+}{y_i^-}\right)^{q_1} \ge \left(\frac{x_j}{x_i}\right)^{p_1} \qquad \text{and} \qquad \left(\frac{y_j^-}{y_i^+}\right)^{q_2} \le \left(\frac{x_j}{x_i}\right)^{p_2}.$$
- **Local-to-Global Sheaf Obstruction:** Unlike point data (PR `#58`), on interval data `steps` ($j = i + 1$) and `pairs` ($j > i + 1$) **diverge**! Every local step can admit a valid slope while no global section $\tilde{y}$ exists, certified in a **single log-free BigInt Farkas cycle inequality** over a non-adjacent span $j - i \ge 2$.
- **Live Discovery on Sabra Turbulence (`turbulence/model.js`, replicated on `seed=1` and fresh `seed=7`):**
  On inertial shells $n = 3..8$ with real $\pm 5\sigma$ block-means uncertainty boxes around $F_2(k_n)$ and $F_6(k_n)$:
  - **Every adjacent shell step $(n, n+1)$ is locally compatible with Kolmogorov K41** ($\zeta_2 = 2/3$, $\zeta_6 = 2$): `local_ok = True`!
  - **Globally, K41 is exactly refuted** (`global_ok = False`, `sheaf_obstruction = True`) by single BigInt Farkas witnesses:
    - $F_2$ ($\pm 5\sigma$, span 5): $(y_5^+ / y_0^-)^3 < (x_5 / x_0)^{-2}$ (certifying $\zeta_2 > 2/3$ strictly outside $\pm 5\sigma$ with zero logs/floats).
    - $F_6$ ($\pm 5\sigma$, span 4): $(y_4^- / y_0^+)^1 > (x_4 / x_0)^{-2}$ (certifying $\zeta_6 < 2$ strictly outside $\pm 5\sigma$ with zero logs/floats).

---

## 2. Theorem B — Complete 4-Ray Polyhedral Farkas Characterization of 4-Point Dyadic Log-Convexity

For four dyadic scales $x_k = x_0 r^k$ ($k = 0, 1, 2, 3$) with uncertainty intervals $[y_k^-, y_k^+] \subset \mathbb{Q}_{>0}$, ask whether there exists $\tilde{y}_k \in [y_k^-, y_k^+]$ whose effective exponent is monotonically non-decreasing (log-convex: $h_0 - 2 h_1 + h_2 \ge 0$ and $h_1 - 2 h_2 + h_3 \ge 0$, $h_k = \ln \tilde{y}_k$).

**Theorem (4-Ray Completeness):** Dual Farkas combinations $v(u) = (u_0,\; -2 u_0 + u_1,\; u_0 - 2 u_1,\; u_1)$ ($u_0, u_1 \ge 0$) change coordinate signs only along the rays $u_1 / u_0 \in \{0, \frac{1}{2}, 2, \infty\}$. On each of the three resulting cones, the box-support functional $\sum_{v_k > 0} v_k \ln y_k^+ + \sum_{v_k < 0} v_k \ln y_k^-$ is linear, so its minimum is attained on the **four extreme integer rays**:
1. $u = (1, 0)$ (local 3-pt): $y_0^+ y_2^+ \ge (y_1^-)^2$,
2. $u = (0, 1)$ (local 3-pt): $y_1^+ y_3^+ \ge (y_2^-)^2$,
3. $u = (2, 1)$ (non-local 4-pt): $(y_0^+)^2 y_3^+ \ge (y_1^-)^3$,
4. $u = (1, 2)$ (non-local 4-pt): $y_0^+ (y_3^+)^2 \ge (y_2^-)^3$.

(Log-concavity reverses signs: swap $y^+ \leftrightarrow y^-$ and reverse $\ge$ to $\le$.)
- Verified 500/500 exact agreements against an independent Fourier–Motzkin elimination oracle over $\mathbb{Q}$.
- **Live Discovery on Shipped 5-Seed Percolation Batch (`critical/model.js`, seeds `[401, 5010, 5020, 5030, 5040]`, $L = 32, 64, 128, 256$):**
  On this fixed 5-seed batch at $\pm 2\text{ SE}$, **neither local 3-point check** $(1, 0)$ nor $(0, 1)$ refutes log-concavity (falling $D_{\text{eff}}$), **yet BOTH non-local 4-point Farkas rays $(2, 1)$ and $(1, 2)$ refute log-concavity in pure BigInt arithmetic** — while log-convexity (rising $D_{\text{eff}}(L) \uparrow 91/48$) remains feasible. *(Out-of-sample batch note: across 5 additional unseen 5-seed batches, log-convex rising-$D_{\text{eff}}$ feasibility holds `6/6` incl. this batch, whereas at 5-seed sample size $\pm 2\text{ SE}$ log-concavity is refuted in `3/5` unseen batches — `4/6` total, with failed-ray sets `{(2,1),(1,2)}`, `{(2,1)}`, or `{(1,0),(2,1)}` — and remains un-refuted on `2/5` unseen batches `[13, 42, 7, 100, 2024]` and `[999, 1001, 1002, 1003, 1004]`.)*

---

## 3. Portal 2 Empirical Finding — Zero-Log DSI Null-Equivalence $\Pi_p(n)$ on Sabra Turbulence

On a geometric ladder $x_k = x_0 \lambda^k$, the cross-ratio $R_k = y_{k+1} y_{k-1} / y_k^2$ and telescoping product
$$\Pi_p(k) := \prod_{j=0}^{p-1} R_{k+j} = \frac{y_{k+p} / y_k}{y_{k+p-1} / y_{k-1}}$$
equals $1$ identically for any pure period-$p$ DSI oscillation $y_k = A \lambda^{\beta k} P(k)$ ($P(k+p) = P(k)$), with zero logs or floats.

- **Positive controls:** $\max|\Pi_p - 1| = 0$ identically on exact period-2 and period-3 rational DSI sequences.
- **Empirical correction to the period-3 prior on Sabra (`turbulence/model.js`, shells $n = 2..9$, `seed=1` and `seed=7`):**
  - Contrary to the GOY shell-model period-3 expectation (`SEAM-05`), Sabra plain moments $\langle|u_n|^2\rangle$ obey the exact rational ordering **`max_dev(p=3) = 0.484754 / 0.563938 > max_dev(p=2) = 0.376759 / 0.334498`** on `seed=1` / `seed=7` (`verify_mult_farkas_dsi.py` certifies `max_dev(p=2) < max_dev(p=3)` directly in `Fraction` arithmetic; exploratory ratio-shuffle null $p$-values such as `0.405` / `1.000` are external exploratory checks not computed by the shipped deterministic verifier).
  - Instead, $\Pi_p$ exposes the **decaying period-2 helicity ripple** injected by shell-0 forcing ($3 k_n \Sigma_n = \varepsilon(1 - (-1/2)^n)$), cutting `mean_abs_dev` in half from `p=1` (`0.328`) to `p=2` (`0.176`), and confirms that flux moments $F_2(n)$ cancel this ripple by **$> 23\times$** (`max_dev: 0.583 -> 0.024`). This empirically recovers from raw numbers the exact reason L'vov et al. (1998) introduced Sabra to eliminate GOY's period-3 oscillation.

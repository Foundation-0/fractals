# Multi-scale pont_beta(tau) Hurst/cutoff analyzer and two-clock witness separability.
import cmath, math, random

EMPIRICAL_MDWARFS = {
    "TOI-540_b": {"tic": "TIC 200322593", "p_rot_d": 0.72631, "p_orb_d": 1.23915},
    "TIC_181015118": {"tic": "TIC 181015118", "p_rot_d": 0.93900, "p_orb_d": 2.18500},
    "TIC_246897668": {"tic": "TIC 246897668", "p_rot_d": 1.37740, "p_orb_d": 3.19200},
}
def _median(xs):
    s, n = sorted(xs), len(xs)
    return 0.5 * (s[n // 2 - 1] + s[n // 2]) if n % 2 == 0 else float(s[n // 2])
def _scatter(xs, metric="mad"):
    if metric == "rms":
        m = sum(xs) / len(xs); return math.sqrt(sum((x - m) ** 2 for x in xs) / len(xs))
    med = _median(xs); return 1.4826 * _median([abs(x - med) for x in xs])
def mad_rms_ratio(xs):
    return _scatter(xs, "mad") / max(_scatter(xs, "rms"), 1e-12)
def pont_beta(t, y, tau, clip_floor=False, metric="mad"):
    s1, t0, t1 = _scatter(y, metric), float(t[0]), float(t[-1])
    nb, inv = int((t1 - t0) / max(tau, 1e-6)), 1.0 / max(tau, 1e-6)
    if s1 <= 0.0 or nb < 8: return 1.0
    sums, cnts = [0.0] * nb, [0] * nb
    for ti, yi in zip(t, y):
        k = int((ti - t0) * inv)
        if 0 <= k < nb: sums[k] += yi; cnts[k] += 1
    bm, gc = [sums[k] / cnts[k] for k in range(nb) if cnts[k] >= 3], [cnts[k] for k in range(nb) if cnts[k] >= 3]
    if len(bm) < 8: return 1.0
    raw = _scatter(bm, metric) / max(s1 / math.sqrt(_median(gc)), 1e-12)
    return min(max(raw, 1.0), 50.0) if clip_floor else raw
def exact_fgn_beta(n_bin, m_bins, n_total, hurst):
    h2 = 2.0 * hurst - 2.0
    return (n_bin ** (hurst - 0.5)) * math.sqrt(max(1.0 - m_bins ** h2, 1e-12) / max(1.0 - n_total ** h2, 1e-12))
def scaling_law_fit(t, y, taus, metric="mad"):
    betas = [pont_beta(t, y, tau, clip_floor=False, metric=metric) for tau in taus]
    lx, ly = [math.log(tau) for tau in taus], [math.log(max(b, 1e-12)) for b in betas]
    mx, my = sum(lx) / len(lx), sum(ly) / len(ly)
    gamma = sum((x - mx) * (v - my) for x, v in zip(lx, ly)) / sum((x - mx) ** 2 for x in lx)
    return {"gamma": gamma, "hurst": gamma + 0.5, "alpha": gamma - 0.5, "betas": betas}
def _fft(a, invert=False):
    n, j, out, step = len(a), 0, list(a), 2
    for i in range(1, n):
        bit = n >> 1
        while j & bit: j ^= bit; bit >>= 1
        j ^= bit
        if i < j: out[i], out[j] = out[j], out[i]
    while step <= n:
        wn = cmath.exp(1j * (2.0 if invert else -2.0) * math.pi / step)
        for i in range(0, n, step):
            w = 1.0 + 0j
            for k in range(step // 2):
                u, v = out[i + k], out[i + k + step // 2] * w
                out[i + k], out[i + k + step // 2] = u + v, u - v; w *= wn
        step <<= 1
    return [z / n for z in out] if invert else out
def synth_fgn(n, hurst, seed=7):
    rng, m, h2 = random.Random(seed), 1 << (2 * n - 1).bit_length(), 2.0 * hurst
    cov = [0.5 * (abs(k + 1) ** h2 - 2.0 * (k ** h2) + abs(k - 1) ** h2) for k in range(m // 2 + 1)]
    lam, z = [max(z.real, 0.0) for z in _fft(cov + cov[-2:0:-1])], [0j] * m
    z[0], z[m // 2] = math.sqrt(lam[0]) * rng.gauss(0.0, 1.0), math.sqrt(lam[m // 2]) * rng.gauss(0.0, 1.0)
    for k in range(1, m // 2):
        g = complex(rng.gauss(0.0, 1.0), rng.gauss(0.0, 1.0)) * math.sqrt(0.5 * lam[k]); z[k], z[m - k] = g, g.conjugate()
    return [c.real * math.sqrt(m) for c in _fft(z, invert=True)[:n]]
def synth_mdwarf_lightcurve(t, p_rot, p_orb=None, depth=0.0021, dur=0.034, spot_amp=0.012, flare_rate=0.7, noise=0.0011, seed=31):
    rng, w, dt = random.Random(seed), 2.0 * math.pi / p_rot, (t[1] - t[0] if len(t) > 1 else 0.002)
    y = [spot_amp * (math.sin(w * ti + 0.3) + 0.35 * math.cos(2 * w * ti - 0.4) + 0.15 * math.sin(3 * w * ti + 0.9)) + rng.gauss(0.0, noise) for ti in t]
    for _ in range(int(flare_rate * (t[-1] - t[0]))):
        tpk, amp = rng.uniform(t[0], t[-1]), 0.006 * (rng.uniform(0.02, 1.0) ** (-1.0 / 1.8))
        for k in range(max(0, int((tpk - t[0] - 0.003) / dt)), min(len(t), int((tpk - t[0] + 0.08) / dt))):
            d = t[k] - tpk; y[k] += amp * ((d + 0.003) / 0.003 if d < 0.0 else math.exp(-d / 0.014))
    in_tr = [p_orb is not None and abs(((ti - 0.19 * p_orb + 0.5 * p_orb) % p_orb) - 0.5 * p_orb) <= 0.5 * dur for ti in t]
    return [yi - (depth if tr else 0.0) for yi, tr in zip(y, in_tr)], in_tr
def asymmetric_huber_prewhiten(t, y, p_rot, n_harm=5, n_iter=4, clip_flares=True):
    p, w0, wts, beta = 1 + 2 * n_harm, 2.0 * math.pi / p_rot, [1.0] * len(y), [0.0] * (1 + 2 * n_harm)
    X = [[1.0] + [fn(m * w0 * ti) for m in range(1, n_harm + 1) for fn in (math.cos, math.sin)] for ti in t]
    for _ in range(n_iter):
        A = [[0.0] * (p + 1) for _ in range(p)]
        for xi, yi, wi in zip(X, y, wts):
            if wi <= 0.0: continue
            for r in range(p):
                wx = wi * xi[r]; A[r][p] += wx * yi
                for c in range(r, p): A[r][c] += wx * xi[c]
        for r in range(p):
            for c in range(r): A[r][c] = A[c][r]
        for i in range(p):
            piv = max(range(i, p), key=lambda r: abs(A[r][i])); A[i], A[piv] = A[piv], A[i]
            inv = (1.0 if A[i][i] >= 0 else -1.0) / max(abs(A[i][i]), 1e-15)
            for c in range(i, p + 1): A[i][c] *= inv
            for r in range(p):
                if r != i and A[r][i] != 0.0:
                    f = A[r][i]
                    for c in range(i, p + 1): A[r][c] -= f * A[i][c]
        beta = [A[i][p] for i in range(p)]
        res = [yi - sum(b * xj for b, xj in zip(beta, xi)) for xi, yi in zip(X, y)]
        rm = max(_scatter(res, "mad"), 4e-5)
        wts = [1.0 if -2.2 * rm < r < 4.2 * rm else (2.2 * rm / abs(r) if r < 0 else 0.0) for r in res]
    res = [yi - sum(b * xj for b, xj in zip(beta, xi)) for xi, yi in zip(X, y)]
    rm = max(_scatter(res, "mad"), 4e-5)
    return [min(r, 3.5 * rm) if clip_flares else r for r in res]
def bls_folded_mes(t, y, period, dur):
    nb, s1 = max(int(period / (0.5 * dur)), 12), max(_scatter(y, "mad"), 1e-9)
    sums, cnts = [0.0] * nb, [0] * nb
    for ti, yi in zip(t, y): b = int(((ti % period) / period) * nb) % nb; sums[b] += yi; cnts[b] += 1
    return max((-sums[b] / cnts[b]) / (s1 / math.sqrt(cnts[b])) for b in range(nb) if cnts[b] >= 5)
def two_clock_separability(p_orb, p_rot, depth=0.0021, dur=0.034, span_d=20.0, dt_d=0.002, seed=31):
    w_ratio, detune, t = p_orb / p_rot, min(abs(p_orb / p_rot - r) / r for r in (0.5, 1.0, 2.0)), [k * dt_d for k in range(int(span_d / dt_d))]
    y, in_tr = synth_mdwarf_lightcurve(t, p_rot, p_orb=p_orb, depth=depth, dur=dur, seed=seed)
    clean = asymmetric_huber_prewhiten(t, y, p_rot)
    rec = _median([c for c, m in zip(clean, in_tr) if not m]) - _median([c for c, m in zip(clean, in_tr) if m])
    return {"w_ratio": w_ratio, "detune": detune, "resonant_lock": detune < 0.02, "depth_retention": rec / depth, "mes_orb": bls_folded_mes(t, clean, p_orb, dur), "mes_rot": bls_folded_mes(t, clean, p_rot, dur)}
if __name__ == "__main__":
    for name, cfg in EMPIRICAL_MDWARFS.items():
        r = two_clock_separability(cfg["p_orb_d"], cfg["p_rot_d"])
        print(f"{name:14s} W={r['w_ratio']:.4f} detune={r['detune']:.4f} retain={r['depth_retention']:.3f} MES_orb={r['mes_orb']:.2f}")

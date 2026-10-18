/* Contour loops of Gaussian random surfaces: which dimension a perimeter-area relation measures. No dependencies.
 *
 * Cloud edges in projected maps follow a perimeter-area relation P ~ A^(D/2) with D ~ 1.36 (Falgarone, Phillips &
 * Walker, ApJ 378, 186 (1991)). For a Gaussian random surface with 2D power spectrum P(k) ~ |k|^-beta, so Hurst
 * exponent H = (beta - 2)/2, two dimensions are quoted:
 *   all the contours at one level together   D = 2 - H        (Mandelbrot)
 *   one contour loop                         D = (3 - H) / 2  (Kondev & Henley, Phys. Rev. Lett. 74, 4580 (1995))
 * This module makes the surfaces and measures both, so a perimeter-area fit can be compared with each.
 *
 * Field: complex white noise drawn in k space on an L x L periodic grid, multiplied by |k|^(-beta/2) (k in units of
 * 2 pi/L, k = 0 removed, every other lattice mode kept), inverse FFT (own radix-2). The filter is real and even in k,
 * so the real and imaginary parts of the result are two independent real fields with the same spectrum. Each is set to
 * zero mean and unit variance. Random numbers: mulberry32, whose state advances by a fixed odd constant per draw, so
 * pair p of a run takes its own consecutive stretch of the generator's cycle and no two pairs share a draw.
 * Contours: marching squares, crossing points by linear interpolation along cell edges; a vertex is "above" when
 * f > level. A saddle cell (diagonal corners above, the other two below) joins the above corners when the average of
 * its four corners is above the level. Loops are walked with unwrapped coordinates, above side on the left, so the
 * shoelace area is positive around an above island. A loop whose walk returns displaced by a multiple of L winds
 * around the torus; it is counted and dropped from the loop statistics.
 * Per loop: length P, |area| A, and radius of gyration R_g of the polyline as a uniform wire.
 */
(function (root) {
  'use strict';

  // ---------- random numbers ----------
  const STEP = 0x6D2B79F5;
  function mulberry32(state) { // the i-th draw uses state + i STEP (mod 2^32); returns uniform [0, 1)
    let a = state >>> 0;
    return function () {
      a = (a + STEP) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  // Block `block` of `size` draws from the cycle that starts at `seed`: disjoint from every other block while all
  // blocks used together stay under 2^32 draws.
  function stream(seed, block, size) {
    if ((block + 1) * size > 4294967296) throw new Error('random stream blocks would overlap');
    return mulberry32((seed + Math.imul((block * size) >>> 0, STEP)) >>> 0);
  }
  function gaussian(rand) { // Box-Muller, both values used: exactly two draws per pair of normals
    let spare = 0, has = false;
    return function () {
      if (has) { has = false; return spare; }
      const r = Math.sqrt(-2 * Math.log(1 - rand())), th = 2 * Math.PI * rand();
      spare = r * Math.sin(th); has = true; return r * Math.cos(th);
    };
  }

  // ---------- FFT ----------
  const plans = new Map();
  function plan(n) {
    let p = plans.get(n); if (p) return p;
    if (!(n >= 1) || (n & (n - 1))) throw new Error('FFT length must be a power of 2, got ' + n);
    const bits = Math.round(Math.log2(n)), rev = new Uint32Array(n), h = Math.max(1, n >> 1);
    const c = new Float64Array(h), s = new Float64Array(h);
    for (let i = 0; i < n; i++) { let r = 0; for (let b = 0; b < bits; b++) r |= ((i >> b) & 1) << (bits - 1 - b); rev[i] = r; }
    for (let i = 0; i < h; i++) { c[i] = Math.cos(2 * Math.PI * i / n); s[i] = Math.sin(2 * Math.PI * i / n); }
    p = { n, rev, c, s }; plans.set(n, p); return p;
  }
  // In place, iterative radix-2. Forward: X_k = sum_n x_n e^(-2 pi i k n / N). Inverse includes the 1/N.
  function fft(re, im, inverse) {
    const n = re.length, { rev, c, s } = plan(n), sg = inverse ? 1 : -1;
    for (let i = 0; i < n; i++) {
      const j = rev[i];
      if (j > i) { let t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t; }
    }
    for (let size = 2; size <= n; size <<= 1) {
      const half = size >> 1, step = n / size;
      for (let i0 = 0; i0 < n; i0 += size) {
        for (let j = 0, k = 0; j < half; j++, k += step) {
          const a = i0 + j, b = a + half, wr = c[k], wi = sg * s[k];
          const tr = re[b] * wr - im[b] * wi, ti = re[b] * wi + im[b] * wr;
          re[b] = re[a] - tr; im[b] = im[a] - ti; re[a] += tr; im[a] += ti;
        }
      }
    }
    if (inverse) { const q = 1 / n; for (let i = 0; i < n; i++) { re[i] *= q; im[i] *= q; } }
  }
  // 2D, row-major (index j L + i, i along x). Rows by fft(); columns by the same butterflies applied to whole rows.
  function fft2(re, im, L, inverse) {
    for (let j = 0; j < L; j++) fft(re.subarray(j * L, j * L + L), im.subarray(j * L, j * L + L), inverse);
    const { rev, c, s } = plan(L), sg = inverse ? 1 : -1, tmp = new Float64Array(L);
    for (let j = 0; j < L; j++) {
      const r = rev[j];
      if (r > j) for (const A of [re, im]) { tmp.set(A.subarray(j * L, j * L + L)); A.copyWithin(j * L, r * L, r * L + L); A.set(tmp, r * L); }
    }
    for (let size = 2; size <= L; size <<= 1) {
      const half = size >> 1, step = L / size;
      for (let j0 = 0; j0 < L; j0 += size) {
        for (let q = 0, k = 0; q < half; q++, k += step) {
          const a = (j0 + q) * L, b = a + half * L, wr = c[k], wi = sg * s[k];
          for (let x = 0; x < L; x++) {
            const br = re[b + x], bi = im[b + x], tr = br * wr - bi * wi, ti = br * wi + bi * wr;
            re[b + x] = re[a + x] - tr; im[b + x] = im[a + x] - ti; re[a + x] += tr; im[a + x] += ti;
          }
        }
      }
    }
    if (inverse) { const q = 1 / L, N = L * L; for (let i = 0; i < N; i++) { re[i] *= q; im[i] *= q; } }
  }

  // ---------- Gaussian random surfaces ----------
  let filterKey = '', filterArr = null;
  function filter(L, beta) { // |k|^(-beta/2), zero at k = 0
    const key = L + ':' + beta; if (key === filterKey) return filterArr;
    const N = L * L, F = new Float64Array(N), e = -beta / 4;
    for (let j = 0; j < L; j++) {
      const ky = j <= L / 2 ? j : j - L;
      for (let i = 0; i < L; i++) { const kx = i <= L / 2 ? i : i - L, k2 = kx * kx + ky * ky; F[j * L + i] = k2 ? Math.pow(k2, e) : 0; }
    }
    filterKey = key; filterArr = F; return F;
  }
  function normalise(f) {
    const N = f.length; let m = 0; for (let i = 0; i < N; i++) m += f[i]; m /= N;
    let v = 0; for (let i = 0; i < N; i++) { f[i] -= m; v += f[i] * f[i]; }
    const q = 1 / Math.sqrt(v / N); for (let i = 0; i < N; i++) f[i] *= q;
    return f;
  }
  // Pair `pair` of independent fields from the cycle starting at `seed` (2 L^2 draws per pair). The DFT of complex
  // white noise is again i.i.d. complex Gaussian, so the noise is drawn directly in k space. ws = { re, im } reuses
  // buffers between calls.
  function gaussianFields(L, beta, seed, pair, ws) {
    const N = L * L, re = ws && ws.re && ws.re.length === N ? ws.re : new Float64Array(N), im = ws && ws.im && ws.im.length === N ? ws.im : new Float64Array(N);
    const g = gaussian(stream(seed, pair, 2 * N));
    for (let i = 0; i < N; i++) { re[i] = g(); im[i] = g(); }
    const F = filter(L, beta);
    for (let i = 0; i < N; i++) { re[i] *= F[i]; im[i] *= F[i]; }
    fft2(re, im, L, true);
    if (ws) { ws.re = re; ws.im = im; }
    return [normalise(re), normalise(im)];
  }
  // Radially averaged power per mode in shells of width 1, 1 <= |k| <= L/2: mean |k| and mean power.
  function radialSpectrum(f, L) {
    const N = L * L, re = Float64Array.from(f), im = new Float64Array(N);
    fft2(re, im, L, false);
    const K = L / 2, sk = new Float64Array(K + 1), sp = new Float64Array(K + 1), n = new Float64Array(K + 1);
    for (let j = 0; j < L; j++) {
      const ky = j <= L / 2 ? j : j - L;
      for (let i = 0; i < L; i++) {
        const kx = i <= L / 2 ? i : i - L, k = Math.sqrt(kx * kx + ky * ky), b = Math.round(k);
        if (b < 1 || b > K) continue;
        const v = j * L + i; sk[b] += k; sp[b] += re[v] * re[v] + im[v] * im[v]; n[b]++;
      }
    }
    const k = [], P = [];
    for (let b = 1; b <= K; b++) if (n[b]) { k.push(sk[b] / n[b]); P.push(sp[b] / n[b] / (N * N)); }
    return { k, P };
  }

  // ---------- small statistics ----------
  function lsq(x, y) { // least squares y = intercept + slope x
    const n = x.length; let mx = 0, my = 0; for (let i = 0; i < n; i++) { mx += x[i]; my += y[i]; } mx /= n; my /= n;
    let sxx = 0, sxy = 0; for (let i = 0; i < n; i++) { sxx += (x[i] - mx) ** 2; sxy += (x[i] - mx) * (y[i] - my); }
    const b = sxy / sxx; return { slope: b, intercept: my - b * mx, n };
  }
  function wlsq(x, y, s) { // weighted least squares with errors s: slope, its error, intercept, chi^2
    let S = 0, Sx = 0, Sy = 0, Sxx = 0, Sxy = 0;
    for (let i = 0; i < x.length; i++) { const w = 1 / (s[i] * s[i]); S += w; Sx += w * x[i]; Sy += w * y[i]; Sxx += w * x[i] * x[i]; Sxy += w * x[i] * y[i]; }
    const d = S * Sxx - Sx * Sx, slope = (S * Sxy - Sx * Sy) / d, intercept = (Sxx * Sy - Sx * Sxy) / d;
    let chi2 = 0; for (let i = 0; i < x.length; i++) chi2 += ((y[i] - intercept - slope * x[i]) / s[i]) ** 2;
    return { slope, slopeErr: Math.sqrt(S / d), intercept, chi2 };
  }
  function select(a, k) { // quickselect: a[k] becomes the k-th smallest
    let lo = 0, hi = a.length - 1;
    while (hi > lo) {
      const mid = (lo + hi) >> 1;
      if (a[mid] < a[lo]) { const t = a[mid]; a[mid] = a[lo]; a[lo] = t; }
      if (a[hi] < a[lo]) { const t = a[hi]; a[hi] = a[lo]; a[lo] = t; }
      if (a[hi] < a[mid]) { const t = a[hi]; a[hi] = a[mid]; a[mid] = t; }
      const p = a[mid]; let i = lo, j = hi;
      while (i <= j) {
        while (a[i] < p) i++; while (a[j] > p) j--;
        if (i <= j) { const t = a[i]; a[i] = a[j]; a[j] = t; i++; j--; }
      }
      if (k <= j) hi = j; else if (k >= i) lo = i; else break;
    }
    return a[k];
  }
  function median(f) { const a = Float64Array.from(f), n = a.length, hi = select(a, n >> 1); if (n & 1) return hi; let lo = -Infinity; for (let i = 0; i < n >> 1; i++) if (a[i] > lo) lo = a[i]; return (lo + hi) / 2; }

  // ---------- marching squares ----------
  // Cell (i, j) has corners a = (i, j), b = (i+1, j), c = (i+1, j+1), d = (i, j+1) (bits 0-3 of the case) and sides
  // 0 bottom (a-b), 1 right (b-c), 2 top (d-c), 3 left (a-d). Edge ids: the horizontal edge from vertex v to its right
  // neighbour is 2v, the vertical edge from v to the vertex above is 2v + 1. EXIT[case * 4 + entry side] = exit side.
  const EXIT = new Int8Array(64).fill(-1);
  for (let cs = 0; cs < 16; cs++) {
    const a = cs & 1, b = (cs >> 1) & 1, c = (cs >> 2) & 1, d = (cs >> 3) & 1;
    const sides = [a !== b, b !== c, d !== c, a !== d].map((x, s) => (x ? s : -1)).filter(s => s >= 0);
    if (sides.length === 2) { EXIT[cs * 4 + sides[0]] = sides[1]; EXIT[cs * 4 + sides[1]] = sides[0]; }
  }
  const CUT_BD = [1, 0, 3, 2]; // saddle: segments bottom-right and top-left, cutting off corners b and d (a, c joined)
  const CUT_AC = [3, 2, 1, 0]; // saddle: segments left-bottom and right-top, cutting off corners a and c (b, d joined)
  const joinedAt = level => (a, b, c, d) => (a + b + c + d) * 0.25 > level;

  // contours(f, L, level, opts) -> loops. opts.clouds: also group loops into connected above-level regions (clouds with
  // their holes); opts.lengthOnly: totals only, no per-loop arrays.
  function contours(f, L, level, opts) {
    opts = opts || {};
    const N = L * L, M = L - 1;
    if (L & M) throw new Error('L must be a power of 2');
    const above = new Uint8Array(N);
    for (let v = 0; v < N; v++) above[v] = f[v] > level ? 1 : 0;
    const seen = new Uint8Array(2 * N), joined = joinedAt(level), lengthOnly = !!opts.lengthOnly;
    const out = { L, level, P: [], A: [], Rg: [], lab: [], nWrap: 0, wrapLength: 0, wrapLab: [], totalLength: 0, crossedEdges: 0, segments: 0, maxClosure: 0 };

    function trace(i0, j0, kind, av, v0) {
      const e0 = 2 * v0 + kind;
      let I, J, sin, x0, y0, lab;
      if (kind === 0) {
        const vr = j0 * L + ((i0 + 1) & M); x0 = i0 + (level - f[v0]) / (f[vr] - f[v0]); y0 = j0; lab = av ? v0 : vr;
        if (av) { I = i0; J = j0; sin = 0; } else { I = i0; J = j0 - 1; sin = 2; }
      } else {
        const vu = ((j0 + 1) & M) * L + i0; x0 = i0; y0 = j0 + (level - f[v0]) / (f[vu] - f[v0]); lab = av ? v0 : vu;
        if (!av) { I = i0; J = j0; sin = 3; } else { I = i0 - 1; J = j0; sin = 1; }
      }
      seen[e0] = 1;
      let qx = 0, qy = 0, P = 0, S = 0, Sx = 0, Sy = 0, S2 = 0, n = 0;
      for (;;) {
        const ci = I & M, cj = J & M, ci1 = (ci + 1) & M, cj1 = (cj + 1) & M;
        const va = cj * L + ci, vb = cj * L + ci1, vc = cj1 * L + ci1, vd = cj1 * L + ci;
        const cs = above[va] | (above[vb] << 1) | (above[vc] << 2) | (above[vd] << 3);
        const ex = cs === 5 || cs === 10 ? ((cs === 5) === joined(f[va], f[vb], f[vc], f[vd]) ? CUT_BD : CUT_AC)[sin] : EXIT[cs * 4 + sin];
        let e, x, y;
        if (ex === 0) { e = 2 * va; x = I + (level - f[va]) / (f[vb] - f[va]); y = J; }
        else if (ex === 1) { e = 2 * vb + 1; x = I + 1; y = J + (level - f[vb]) / (f[vc] - f[vb]); }
        else if (ex === 2) { e = 2 * vd; x = I + (level - f[vd]) / (f[vc] - f[vd]); y = J + 1; }
        else if (ex === 3) { e = 2 * va + 1; x = I; y = J + (level - f[va]) / (f[vd] - f[va]); }
        else throw new Error('marching squares: no exit from cell case ' + cs);
        x -= x0; y -= y0;
        const dx = x - qx, dy = y - qy, l = Math.sqrt(dx * dx + dy * dy);
        if (!lengthOnly) {
          const mx = 0.5 * (x + qx), my = 0.5 * (y + qy);
          S += qx * y - x * qy; Sx += l * mx; Sy += l * my; S2 += l * (mx * mx + my * my + l * l / 12);
        }
        P += l; qx = x; qy = y; n++;
        if (e === e0) break;
        if (seen[e]) throw new Error('contour walk reached an edge already used by another loop');
        seen[e] = 1;
        if (ex === 0) { J--; sin = 2; } else if (ex === 1) { I++; sin = 3; } else if (ex === 2) { J++; sin = 0; } else { I--; sin = 1; }
      }
      out.segments += n; out.totalLength += P;
      const wx = Math.round(qx / L), wy = Math.round(qy / L);
      out.maxClosure = Math.max(out.maxClosure, Math.abs(qx - wx * L), Math.abs(qy - wy * L));
      if (wx || wy) { out.nWrap++; out.wrapLength += P; out.wrapLab.push(lab); return; }
      if (lengthOnly) return;
      const cx = Sx / P, cy = Sy / P;
      out.P.push(P); out.A.push(S / 2); out.Rg.push(Math.sqrt(Math.max(0, S2 / P - cx * cx - cy * cy))); out.lab.push(lab);
    }

    for (let j = 0; j < L; j++) {
      for (let i = 0; i < L; i++) {
        const v = j * L + i, av = above[v];
        if (av !== above[j * L + ((i + 1) & M)]) { out.crossedEdges++; if (!seen[2 * v]) trace(i, j, 0, av, v); }
        if (av !== above[((j + 1) & M) * L + i]) { out.crossedEdges++; if (!seen[2 * v + 1]) trace(i, j, 1, av, v); }
      }
    }
    if (opts.clouds) out.clouds = clouds(f, above, L, level, out, joined);
    return out;
  }

  // Connected above-level regions under the same saddle rule. Each loop belongs to the region on its left. A bounded
  // region ("cloud") has exactly one positive (outer) loop and no loop around the torus; its perimeter is the sum over
  // its loops (outer plus holes) and its area the sum of their signed areas.
  function clouds(f, above, L, level, loops, joined) {
    const N = L * L, M = L - 1, parent = new Int32Array(N);
    for (let v = 0; v < N; v++) parent[v] = v;
    const find = x => { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; };
    const union = (a, b) => { a = find(a); b = find(b); if (a !== b) { if (a < b) parent[b] = a; else parent[a] = b; } };
    for (let j = 0; j < L; j++) {
      for (let i = 0; i < L; i++) {
        const va = j * L + i, vb = j * L + ((i + 1) & M), vd = ((j + 1) & M) * L + i, vc = ((j + 1) & M) * L + ((i + 1) & M);
        if (above[va] && above[vb]) union(va, vb);
        if (above[va] && above[vd]) union(va, vd);
        const cs = above[va] | (above[vb] << 1) | (above[vc] << 2) | (above[vd] << 3);
        if ((cs === 5 || cs === 10) && joined(f[va], f[vb], f[vc], f[vd])) { if (cs === 5) union(va, vc); else union(vb, vd); }
      }
    }
    const reg = new Map();
    const get = r => { let g = reg.get(r); if (!g) { g = { P: 0, A: 0, nPos: 0, wrap: false, hullA: 0, hullRg: 0, nLoops: 0 }; reg.set(r, g); } return g; };
    for (let k = 0; k < loops.P.length; k++) {
      const g = get(find(loops.lab[k])); g.P += loops.P[k]; g.A += loops.A[k]; g.nLoops++;
      if (loops.A[k] > 0) { g.nPos++; g.hullA = loops.A[k]; g.hullRg = loops.Rg[k]; }
    }
    for (const lab of loops.wrapLab) get(find(lab)).wrap = true;
    const res = { P: [], A: [], hullA: [], hullRg: [], nHoles: [], dropped: 0 };
    for (const g of reg.values()) {
      if (g.wrap || g.nPos !== 1) { res.dropped++; continue; }
      res.P.push(g.P); res.A.push(g.A); res.hullA.push(g.hullA); res.hullRg.push(g.hullRg); res.nHoles.push(g.nLoops - 1);
    }
    return res;
  }

  // Area above the level, cell by cell, with the same interpolation and saddle rule; independent of the walk.
  function aboveArea(f, L, level) {
    const M = L - 1, join = joinedAt(level); let area = 0;
    for (let j = 0; j < L; j++) {
      for (let i = 0; i < L; i++) {
        const va = j * L + i, vb = j * L + ((i + 1) & M), vd = ((j + 1) & M) * L + i, vc = ((j + 1) & M) * L + ((i + 1) & M);
        const fa = f[va], fb = f[vb], fc = f[vc], fd = f[vd];
        const cs = (fa > level) | ((fb > level) << 1) | ((fc > level) << 2) | ((fd > level) << 3);
        if (cs === 0) continue; if (cs === 15) { area += 1; continue; }
        const t = (p, q) => (level - p) / (q - p);
        const tb = (cs & 1) !== ((cs >> 1) & 1) ? t(fa, fb) : 0, tr = ((cs >> 1) & 1) !== ((cs >> 2) & 1) ? t(fb, fc) : 0;
        const tt = ((cs >> 3) & 1) !== ((cs >> 2) & 1) ? t(fd, fc) : 0, tl = (cs & 1) !== ((cs >> 3) & 1) ? t(fa, fd) : 0;
        const triA = 0.5 * tb * tl, triB = 0.5 * (1 - tb) * tr, triC = 0.5 * (1 - tr) * (1 - tt), triD = 0.5 * tt * (1 - tl);
        switch (cs) {
          case 1: area += triA; break; case 2: area += triB; break; case 4: area += triC; break; case 8: area += triD; break;
          case 14: area += 1 - triA; break; case 13: area += 1 - triB; break; case 11: area += 1 - triC; break; case 7: area += 1 - triD; break;
          case 3: area += 0.5 * (tl + tr); break; case 12: area += 0.5 * ((1 - tl) + (1 - tr)); break;
          case 9: area += 0.5 * (tb + tt); break; case 6: area += 0.5 * ((1 - tb) + (1 - tt)); break;
          case 5: case 10: {
            const jn = join(fa, fb, fc, fd);
            if (cs === 5) area += jn ? 1 - triB - triD : triA + triC; else area += jn ? 1 - triA - triC : triB + triD;
            break;
          }
        }
      }
    }
    return area;
  }

  // Structure function S(r) = <(f(x + r) - f(x))^2> over x and y displacements, r = 1, 2, 4, ..., L/4.
  function structure(f, L) {
    const M = L - 1, out = [];
    for (let r = 1; r <= L / 4; r *= 2) {
      let s = 0;
      for (let j = 0; j < L; j++) {
        const row = j * L, up = ((j + r) & M) * L;
        for (let i = 0; i < L; i++) { const v = f[row + i], a = f[row + ((i + r) & M)] - v, b = f[up + i] - v; s += a * a + b * b; }
      }
      out.push(s / (2 * L * L));
    }
    return out;
  }
  function subsample(f, L, s) { // every s-th vertex in each direction
    const n = L / s, g = new Float64Array(n * n);
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) g[j * n + i] = f[j * s * L + i * s];
    return g;
  }

  // ---------- binned power-law fits ----------
  // Bins of width 1/4 octave in log2 x; per bin, the count and the sums of ln x and ln y.
  const PER_OCT = 4, OFF = 64, NB = 160;
  function newBins() { return { n: new Float64Array(NB), sx: new Float64Array(NB), sy: new Float64Array(NB) }; }
  function binAdd(B, x, y) {
    const b = Math.floor(PER_OCT * Math.log2(x)) + OFF; if (b < 0 || b >= NB) return;
    B.n[b]++; B.sx[b] += Math.log(x); B.sy[b] += Math.log(y);
  }
  function binsCombine(list, minus) { // sum of bins, optionally minus one of them (for the jackknife)
    const B = newBins();
    for (const X of list) for (let b = 0; b < NB; b++) { B.n[b] += X.n[b]; B.sx[b] += X.sx[b]; B.sy[b] += X.sy[b]; }
    if (minus) for (let b = 0; b < NB; b++) { B.n[b] -= minus.n[b]; B.sx[b] -= minus.sx[b]; B.sy[b] -= minus.sy[b]; }
    return B;
  }
  // Least squares of bin-mean ln y on bin-mean ln x over bins centred in [lo, hi] with at least minN entries.
  function binFit(B, lo, hi, minN) {
    const xs = [], ys = [];
    for (let b = 0; b < NB; b++) {
      if (B.n[b] < (minN || 1)) continue;
      const centre = Math.pow(2, (b - OFF + 0.5) / PER_OCT);
      if (centre < lo || centre > hi) continue;
      xs.push(B.sx[b] / B.n[b]); ys.push(B.sy[b] / B.n[b]);
    }
    if (xs.length < 3) return { slope: NaN, n: xs.length };
    return lsq(xs, ys);
  }

  // ---------- one field, and the estimates over many ----------
  // What a perimeter-area study needs from one field: loops at the mean level (P against R_g and against sqrt A, and
  // sqrt A against R_g), loops at the median level, clouds with their holes, the total contour length on every s-th
  // vertex (the level set's yardstick), and the structure function.
  function fieldRecord(f, L, { yardMax = 32 } = {}) {
    const r = contours(f, L, 0, { clouds: true }), R = newBins(), A = newBins(), RA = newBins();
    for (let k = 0; k < r.P.length; k++) {
      const P = r.P[k], a = Math.abs(r.A[k]), g = r.Rg[k];
      if (!(g > 0) || !(a > 0)) continue;
      binAdd(R, g, P); binAdd(A, Math.sqrt(a), P); binAdd(RA, g, Math.sqrt(a));
    }
    const CL = newBins(); for (let k = 0; k < r.clouds.P.length; k++) binAdd(CL, Math.sqrt(r.clouds.A[k]), r.clouds.P[k]);
    const m = median(f), q = contours(f, L, m), Rm = newBins();
    for (let k = 0; k < q.P.length; k++) if (q.Rg[k] > 0) binAdd(Rm, q.Rg[k], q.P[k]);
    const len = [r.totalLength];
    for (let s = 2; s <= yardMax; s *= 2) len.push(s * contours(subsample(f, L, s), L / s, 0, { lengthOnly: true }).totalLength);
    return { R, A, RA, CL, Rm, len, sf: structure(f, L), nLoops: r.P.length, nWrap: r.nWrap, wrapShare: r.wrapLength / r.totalLength };
  }
  // Fit windows. Loops: R_g in [r0, L/16] (primary; r0 = 8 from L = 1024, else 4), and Rmin in {r0/2, r0, 2 r0}, Rmax in
  // {L/32, L/16, L/8}, at least two octaves wide, for the spread. Yardstick: s in [y0, ymax] and neighbours.
  function loopWindows(L) {
    const r0 = L >= 1024 ? 8 : 4, list = [[r0, L / 16]];
    for (const a of [r0 / 2, r0, 2 * r0]) for (const b of [L / 32, L / 16, L / 8]) if (b / a >= 4 && !(a === r0 && b === L / 16)) list.push([a, b]);
    return list;
  }
  function yardWindows(L, ymax) { const y0 = L >= 1024 ? 4 : 2; return [[y0, ymax], [y0 / 2, ymax], [2 * y0, ymax], [y0 / 2, ymax / 2], [y0, ymax / 2]].filter(w => w[1] / w[0] >= 2); }
  // Each estimate: value in the primary window, jackknife error over fields, and half the spread over windows.
  //   loops: D from P ~ R_g^D;  area: D from P ~ A^(D/2) (sqrt A window = c x the R_g window, c = <sqrt A / R_g>);
  //   median: loops at the median level;  clouds: perimeter including holes against net area;
  //   yard: level set, total length l(s) ~ s^(1 - D);  Heff: half the log slope of the structure function, over the
  //   loop window (HeffLoop) and the yardstick window (HeffYard).
  function estimate(recs, L, yardMax = 32) {
    const tot = {};
    const pool = (name, ex) => { if (!tot[name]) tot[name] = binsCombine(recs.map(r => r[name])); return ex == null ? tot[name] : binsCombine([tot[name]], recs[ex][name]); };
    const ratio = (ex, lo, hi) => {
      const B = pool('RA', ex); let n = 0, s = 0;
      for (let b = 0; b < NB; b++) { const c = Math.pow(2, (b - OFF + 0.5) / PER_OCT); if (c >= lo && c <= hi) { n += B.n[b]; s += B.sy[b] - B.sx[b]; } }
      return Math.exp(s / n);
    };
    const meanLog = (key, ex) => { const v = recs.filter((_, i) => i !== ex).map(r => r[key]); return v[0].map((_, k) => v.reduce((a, x) => a + Math.log(x[k]), 0) / v.length); };
    const slopeIn = (m, lo, hi) => { const x = [], y = []; m.forEach((v, k) => { const s = Math.pow(2, k); if (s >= lo && s <= hi) { x.push(Math.log(s)); y.push(v); } }); return lsq(x, y).slope; };
    const est = {
      loops: (w, ex) => binFit(pool('R', ex), w[0], w[1], 2).slope,
      area: (w, ex) => { const c = ratio(ex, w[0], w[1]); return binFit(pool('A', ex), c * w[0], c * w[1], 2).slope; },
      median: (w, ex) => binFit(pool('Rm', ex), w[0], w[1], 2).slope,
      clouds: (w, ex) => { const c = ratio(ex, w[0], w[1]); return binFit(pool('CL', ex), c * w[0], c * w[1], 2).slope; },
      yard: (w, ex) => 1 - slopeIn(meanLog('len', ex), w[0], w[1]),
      Heff: (w, ex) => 0.5 * slopeIn(meanLog('sf', ex), w[0], w[1]),
    };
    const n = recs.length;
    const jack = (fn, w) => { const full = fn(w), v = recs.map((_, i) => fn(w, i)), mv = v.reduce((a, x) => a + x, 0) / n; return { D: full, se: Math.sqrt((n - 1) / n * v.reduce((a, x) => a + (x - mv) * (x - mv), 0)) }; };
    const withWindows = (fn, ws) => { const all = ws.map(w => fn(w)).filter(Number.isFinite); return { ...jack(fn, ws[0]), win: (Math.max(...all) - Math.min(...all)) / 2 }; };
    const W = loopWindows(L), YW = yardWindows(L, yardMax);
    return {
      loops: withWindows(est.loops, W), area: withWindows(est.area, W), median: withWindows(est.median, W), clouds: withWindows(est.clouds, W),
      yard: withWindows(est.yard, YW), HeffLoop: jack(est.Heff, W[0]), HeffYard: jack(est.Heff, YW[0]), c: ratio(null, W[0][0], W[0][1]), W, YW,
      nLoops: recs.reduce((a, r) => a + r.nLoops, 0) / n, nWrap: recs.reduce((a, r) => a + r.nWrap, 0) / n, wrapShare: recs.reduce((a, r) => a + r.wrapShare, 0) / n,
    };
  }

  const theory = beta => { const H = (beta - 2) / 2; return { H, loop: (3 - H) / 2, set: 2 - H }; };

  const api = {
    mulberry32, stream, gaussian, fft, fft2, gaussianFields, normalise, radialSpectrum, lsq, wlsq, median, select,
    contours, aboveArea, structure, subsample, newBins, binAdd, binsCombine, binFit, PER_OCT, OFF,
    fieldRecord, loopWindows, yardWindows, estimate, theory,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.CONTOURS = api;
})(typeof window !== 'undefined' ? window : globalThis);

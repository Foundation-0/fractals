# Unit tests for pont_beta(tau) Hurst/cutoff scaling and two-clock witness separability.
import os, sys, unittest

sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "scripts"))
import pont_witness as pw

class TestPontWitnessScaling(unittest.TestCase):
    def test_white_gaussian_noise_scaling(self):
        dt = 0.001; t = [i * dt for i in range(8192)]
        taus = [0.008, 0.016, 0.032, 0.064]
        y = pw.synth_fgn(len(t), 0.50, seed=101)
        fit = pw.scaling_law_fit(t, y, taus, metric="mad")
        self.assertAlmostEqual(fit["gamma"], 0.0, delta=0.05)
        self.assertAlmostEqual(fit["hurst"], 0.50, delta=0.05)
        self.assertAlmostEqual(fit["alpha"], -0.50, delta=0.05)
        self.assertAlmostEqual(pw.mad_rms_ratio(y), 1.0, delta=0.05)
        for b in fit["betas"]:
            self.assertAlmostEqual(b, 1.0, delta=0.12)

    def test_fgn_hurst_slope_and_finite_baseline_identity(self):
        dt = 0.001; n = 8192; t = [i * dt for i in range(n)]; span = t[-1] - t[0]
        taus = [0.008, 0.016, 0.032, 0.064]
        for h_true in (0.25, 0.50, 0.75, 0.90):
            gammas, ratios = [], []
            for s in range(4):
                y = pw.synth_fgn(n, h_true, seed=200 + s)
                gammas.append(pw.scaling_law_fit(t, y, taus, metric="rms")["gamma"])
                b_emp = pw.pont_beta(t, y, 0.064, clip_floor=False, metric="rms")
                b_th = pw.exact_fgn_beta(0.064 / dt, span / 0.064, n, h_true)
                ratios.append(b_emp / b_th)
            self.assertAlmostEqual(sum(gammas) / len(gammas), h_true - 0.5, delta=0.065)
            self.assertAlmostEqual(sum(ratios) / len(ratios), 1.0, delta=0.05)

    def test_clamping_floor_epistemic_bias(self):
        dt = 0.001; t = [i * dt for i in range(4096)]
        y_anti = pw.synth_fgn(len(t), 0.22, seed=77)
        self.assertLess(pw.pont_beta(t, y_anti, 0.032, clip_floor=False), 0.65)
        self.assertEqual(pw.pont_beta(t, y_anti, 0.032, clip_floor=True), 1.0)

    def test_flare_intermittency_mad_vs_rms_divergence(self):
        t = [i * 0.002 for i in range(8000)]
        y_flare, _ = pw.synth_mdwarf_lightcurve(t, 0.939, p_orb=None, spot_amp=0.0, flare_rate=3.0, seed=55)
        b_mad = pw.pont_beta(t, y_flare, 0.04, metric="mad")
        b_rms = pw.pont_beta(t, y_flare, 0.04, metric="rms")
        self.assertLess(pw.mad_rms_ratio(y_flare), 0.65)
        self.assertGreater(b_mad, 1.15)
        self.assertGreater(b_rms / b_mad, 1.50)

    def test_rotational_finite_cutoff_turnover(self):
        t = [i * 0.01 for i in range(12000)]
        for cfg in pw.EMPIRICAL_MDWARFS.values():
            p_rot = cfg["p_rot_d"]
            y, _ = pw.synth_mdwarf_lightcurve(t, p_rot, p_orb=None, flare_rate=0.2, seed=42)
            sub_rot = pw.scaling_law_fit(t, y, [0.04 * p_rot, 0.08 * p_rot, 0.14 * p_rot, 0.22 * p_rot], metric="rms")
            post_cut = pw.scaling_law_fit(t, y, [0.35 * p_rot, 1.35 * p_rot, 2.35 * p_rot, 3.35 * p_rot], metric="rms")
            self.assertGreater(sub_rot["hurst"], 0.90)
            self.assertAlmostEqual(post_cut["gamma"], -0.50, delta=0.10)

    def test_asymmetric_huber_projects_spot_hurst_to_half_preserving_transit(self):
        p_rot, p_orb, depth = 0.72631, 1.23915, 0.0035
        t = [i * 0.002 for i in range(9000)]
        y, in_tr = pw.synth_mdwarf_lightcurve(t, p_rot, p_orb=p_orb, depth=depth, dur=0.034, spot_amp=0.015, flare_rate=0.0, seed=12)
        taus = [0.016, 0.032, 0.064, 0.128]
        h_raw = pw.scaling_law_fit(t, y, taus)["hurst"]
        clean = pw.asymmetric_huber_prewhiten(t, y, p_rot, n_harm=4, clip_flares=False)
        rec = pw._median([c for c, m in zip(clean, in_tr) if not m]) - pw._median([c for c, m in zip(clean, in_tr) if m])
        res_post = [c + (rec if m else 0.0) for c, m in zip(clean, in_tr)]
        h_clean = pw.scaling_law_fit(t, res_post, taus)["hurst"]
        self.assertGreater(h_raw, 0.92)
        self.assertAlmostEqual(h_clean, 0.50, delta=0.06)
        self.assertGreater(rec / depth, 0.93)

    def test_two_clock_resonant_breakdown_vs_toi540_separability(self):
        p_rot = pw.EMPIRICAL_MDWARFS["TOI-540_b"]["p_rot_d"]
        p_orb = pw.EMPIRICAL_MDWARFS["TOI-540_b"]["p_orb_d"]
        off = pw.two_clock_separability(p_orb, p_rot)
        res_1 = pw.two_clock_separability(1.000 * p_rot, p_rot)
        res_half = pw.two_clock_separability(0.500 * p_rot, p_rot)
        self.assertFalse(off["resonant_lock"])
        self.assertAlmostEqual(off["w_ratio"], 1.7061, delta=0.001)
        self.assertGreater(off["depth_retention"], 0.90)
        self.assertGreater(off["mes_orb"], 14.0)
        self.assertGreater(off["mes_orb"], 3.0 * off["mes_rot"])
        self.assertTrue(res_1["resonant_lock"])
        self.assertTrue(res_half["resonant_lock"])
        self.assertLess(res_1["depth_retention"], 0.65)
        self.assertLess(res_half["depth_retention"], 0.65)
        t = [k * 0.002 for k in range(10000)]
        y, _ = pw.synth_mdwarf_lightcurve(t, p_rot, p_orb=p_orb, seed=31)
        hw = 100
        naive = [y[i] - pw._median(y[max(0, i - hw):min(len(y), i + hw + 1)]) for i in range(len(y))]
        self.assertGreater(pw.bls_folded_mes(t, naive, p_rot, 0.034), 3.0 * pw.bls_folded_mes(t, naive, p_orb, 0.034))

if __name__ == "__main__":
    unittest.main()

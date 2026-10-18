# Cosmic homogeneity: where galaxy clustering stops looking fractal

Status: **exploration, not peer reviewed, no new result claimed.** Issue
[#17](https://github.com/Foundation-0/fractals/issues/17).

Galaxies cluster: around any galaxy there are more neighbours nearby than an even spread would give. On large
enough scales the excess fades. This study computes where, from the standard cosmological model, checks it
against the surveys, and shows how much the answer depends on the definition.

## The measure

Count the galaxies within a distance r of a galaxy, divided by the count an even spread would give:
N(<r) = 1 + ξ̄(r), with ξ̄ the correlation function averaged over the sphere. For a fractal of dimension D the
raw count grows as r^D; for an even spread, as r³. The correlation dimension is

```
D₂(r) = 3 + d ln N / d ln r = 3 + 3 (ξ − ξ̄) / (1 + ξ̄)
```

Scrimgeour et al. (2012) define the homogeneity scale R_H as the radius beyond which D₂ stays within 1% of 3
(D₂ = 2.97). A second definition, where N comes within 1% of 1, gives R_H a few h⁻¹ Mpc larger; every number
here uses D₂ unless it says N. Lengths are comoving and in h⁻¹ Mpc, the surveys' unit (see Units below).

## Small scales: about 1.2, not 2

Galaxy clustering on small scales follows a power law, ξ = (r/r₀)^−γ with r₀ ≈ 5 h⁻¹ Mpc and γ ≈ 1.8
(Zehavi et al. 2005). Then:

| r (h⁻¹ Mpc) | 0.1 | 1 | 3 | 5 | 10 | 20 |
|---|---|---|---|---|---|---|
| D₂ | 1.20 | 1.24 | 1.45 | 1.71 | 2.25 | 2.69 |

Well inside r₀ the neighbour counts grow as r^1.2, a fractal-like dimension of 3 − γ. Beyond about
1 h⁻¹ Mpc, D₂ never holds still: it climbs steadily toward 3. Between 1 and 30 h⁻¹ Mpc the counts grow on
average as r^1.9 (endpoint slope; a least-squares fit to log-spaced points gives about 1.86), an average through
the climb, and one reading of the "D ≈ 2" of Sylos Labini, Pietronero and colleagues, who argue the distribution
stays fractal to the largest scales. Their 2009 value, D = 2.1 ± 0.1 up to about 30 h⁻¹ Mpc, is about 2σ above
this real-space average. It is measured in redshift space, and the power law is fitted only below about 10 to
20 h⁻¹ Mpc, so the comparison is rough.

## Large scales: the homogeneity scale

Linear theory: the matter power spectrum of Eisenstein and Hu (1998) with baryon wiggles, normalised to σ₈,
gives ξ and ξ̄. Galaxies trace matter with a bias b (ξ_g = b²ξ), and redshift-space distortion adds the Kaiser
factor 1 + 2β/3 + β²/5.

**WiggleZ.** With Scrimgeour et al.'s fiducial cosmology and each slice's measured bias and β, the model
gives their own ΛCDM homogeneity scales:

| z | b² | Model | Their ΛCDM | Measured |
|---|---|---|---|---|
| 0.2 | 0.68 | 76.2 | 76 | 71 ± 8 |
| 0.4 | 0.87 | 78.6 | 78 | 70 ± 5 |
| 0.6 | 1.23 | 81.0 | 81 | 81 ± 5 |
| 0.8 | 1.43 | 78.0 | 78 | 75 ± 4 |

R_H barely moves with redshift because the galaxies' bias grows as the clustering of matter weakens, as the
paper says. The other definition gives 80.7, 83.0, 85.3 and 82.5, against their ΛCDM counts of 80, 83, 85 and
82 (Table 4).

Other surveys use different criteria and tracers. Hogg et al. (2005) found SDSS luminous red galaxy counts
consistent with r³ beyond about 70 h⁻¹ Mpc, within their errors; for such strongly biased galaxies (b ≈ 2) the
model's 1% scale is about 130. Yadav et al. (2005) and Sarkar et al. (2009) found 60 to 70 h⁻¹ Mpc from
multifractal dimensions. Ntelis et al. (2017) used D₂ = 2.97 on BOSS CMASS galaxies and found 63.3 ± 0.7 h⁻¹ Mpc,
against a ΛCDM 62.0. For matter at the sample's redshift (z ≈ 0.57) with Planck 2018 parameters the model gives
59.9, so their numbers are presumably for matter after correcting for bias and redshift-space distortion (a
b ≈ 2 tracer would give over 120); that is an inference, not read from their paper.

## The scale is a convention

R_H is where clustering falls below a chosen threshold, not a length nature sets.

| How close to even (D₂ = 3(1 − ε)) | ε = 1% | 0.5% | 0.2% | 0.1% |
|---|---|---|---|---|
| R_H, matter today | 77 | 95 | 149 | 185 |

| z | Matter | Galaxies, b = 1 | Galaxies, b = 2 |
|---|---|---|---|
| 0 | 77 | 87 | 147 |
| 0.5 | 62 | 76 | 127 |
| 1 | 50 | 64 | 95 |
| 2.4 | 29 | 41 | 69 |

(Galaxy columns are in redshift space.) A ten times stricter threshold more than doubles R_H. Matter becomes
even on smaller scales in the past, because its clustering has had less time to grow. Strongly biased tracers
look clumpy out to twice the scale. Other definitions give other numbers: Yadav, Bagla and Khandai (2010) put
an upper limit of about 260 h⁻¹ Mpc on ΛCDM by asking where the deviation from 3 drops below its own
statistical scatter, and an entropy measure gives about 140 h⁻¹ Mpc for SDSS (Pandey and Sarkar 2015).

The baryon acoustic peak shows up too. The linear ξ has a bump at 99.6 h⁻¹ Mpc (Eisenstein et al. 2005 found
the peak near 100), and it holds D₂ almost flat between about 100 and 120 h⁻¹ Mpc. In linear theory D₂ even dips
slightly near 113, and then R_H jumps: for a b = 2 tracer at z = 0.5 in real space (R_H = 99), half a percent
more clustering amplitude, near ×1.055, moves R_H by 13 h⁻¹ Mpc. Nonlinear motions smooth the peak (by
Σ ≈ 6 to 8 h⁻¹ Mpc), and with Σ = 7 the dip and the jump are gone, the peak moves to 97 and the 1% scale for
matter today is unchanged (77.0).

## Where the README's "80 to 300" came from

From the last sentence of Scrimgeour et al.'s abstract: they exclude a fractal with D₂ below 2.97 "on scales
from ~80 h⁻¹ Mpc up to the largest scales probed by our measurement, ~300 h⁻¹ Mpc". That is the range they
could rule a fractal out over, not the scale where evenness starts, and 300 is where their survey ran out. It
is also not Yadav et al.'s 260.

## Units

h⁻¹ Mpc is a megaparsec divided by h, the Hubble constant in units of 100 km/s/Mpc. With h = 0.674 (Planck
2018), 70 to 80 h⁻¹ Mpc is 104 to 119 Mpc, about 340 to 390 million light-years. The README read
"80 to 300 h⁻¹ Mpc" as "80 to 300 million parsecs".

## The coastline

A coastline is rough down to some smallest scale (in the end, grains and molecules); the galaxy distribution
is clumpy up to some largest scale. Both are fractal only between two limits, but the cosmic limit that
"stops the nesting" is the upper one.

## Bigger structures

Some structures are claimed to exceed the homogeneity scale: the Huge Large Quasar Group (Clowes et al. 2013,
about 1.2 Gpc long), the Giant Arc (Lopez et al. 2022, about 1 Gpc) and the Big Ring (Lopez et al. 2024, about
400 Mpc). Nadathur (2013) showed that the same group finder turns up Gpc "structures" in random points, and
Sawala et al. (2025) find Giant Arc-like patterns common in ΛCDM simulations; Lopez and Clowes dispute that.
Homogeneity is a statement about averages, so single large structures do not by themselves contradict it.

## Run it

```
node cosmic-homogeneity/table.mjs    # D₂(r), R_H against threshold, tracer and redshift, and the WiggleZ comparison
npm test                             # includes tests/cosmic-homogeneity.mjs
```

`homogeneity.js` is the whole model. It loads in Node (`require`) and in a browser (`window.HOMOGENEITY`).

## Checks

`tests/cosmic-homogeneity.mjs`:

| Check | Published | Model |
|---|---|---|
| WiggleZ ΛCDM R_H, four slices (Scrimgeour et al. 2012) | 76, 78, 81, 78 | 76.2, 78.6, 81.0, 78.0 |
| Measured WiggleZ R_H within 2σ of the model | 71±8, 70±5, 81±5, 75±4 | yes |
| WiggleZ ΛCDM R_H by the counts definition (their Table 4) | 80, 83, 85, 82 | 80.7, 83.0, 85.3, 82.5 |
| Matter R_H at z = 0.57 (Ntelis et al. 2017 ΛCDM, matter assumed) | 62.0 | 59.9 |
| Sound horizon at Planck's drag redshift (Planck 2018) | 147.09 Mpc | 147.25 Mpc |
| Baryon acoustic peak in ξ, sanity check (Eisenstein et al. 2005) | ~100 | 99.6 |
| D₂ deep inside r₀ (model; γ = 1.8 from Zehavi et al. 2005) | 3 − γ = 1.2 | 1.20 |
| Endpoint count slope over 1–30 h⁻¹ Mpc (model) | between 1.2 and 3 | 1.90 |
| Threshold and redshift move R_H (model) | | 77 → 185 for 1% → 0.1%; 77, 62, 50, 29 at z = 0, 0.5, 1, 2.4 |
| Acoustic plateau, b = 2, z = 0.5: largest R_H change for a 0.5% amplitude step (model) | | 12.8 (linear), 0.8 (smoothed) |

## What the model leaves out

- Linear theory: no nonlinear clustering, which matters below about 20 h⁻¹ Mpc, apart from the optional
  smoothing of the acoustic peak, and no velocity damping of the redshift-space signal (Scrimgeour et al.
  include a Lorentzian term; the Kaiser factor alone still matches their numbers to 0.6 h⁻¹ Mpc).
- The Eisenstein–Hu formulas were checked against two independent code transcriptions that carry the paper's
  equation numbers (colossus and hmf), not against the paper text. Their fitted drag redshift (1021) is lower
  than Planck's (1060), so their sound horizon is 2.6% larger by construction; at Planck's drag redshift the
  same formula gives 147.25 Mpc against Planck's 147.09.
- The WiggleZ bias and β values were read from the paper's tables through search-engine text, not the PDF.
- The galaxy power law is a fit below about 10 to 20 h⁻¹ Mpc: r₀ and γ change with galaxy luminosity, and γ
  steepens for the brightest. The 1-to-30 average extrapolates it.
- Neutrinos are left out: Planck's Ωm includes about 0.06 eV of neutrino mass, which the Eisenstein–Hu fit
  does not model.
- Clustering lengths are comoving and in h⁻¹ Mpc. The sound horizon and the large-structure sizes are in Mpc,
  as their sources give them. The grid resolves ξ out to 300 h⁻¹ Mpc, so R_H is not searched beyond that.

## Sources

- M. I. Scrimgeour et al., *The WiggleZ Dark Energy Survey: the transition to large-scale cosmic homogeneity*, MNRAS 425, 116 (2012). https://arxiv.org/abs/1205.6812
- D. J. Eisenstein and W. Hu, *Baryonic features in the matter transfer function*, ApJ 496, 605 (1998). https://arxiv.org/abs/astro-ph/9709112
- Planck Collaboration, *Planck 2018 results. VI. Cosmological parameters*, A&A 641, A6 (2020). https://arxiv.org/abs/1807.06209
- D. W. Hogg et al., *Cosmic homogeneity demonstrated with luminous red galaxies*, ApJ 624, 54 (2005). https://arxiv.org/abs/astro-ph/0411197
- J. Yadav, S. Bharadwaj, B. Pandey and T. R. Seshadri, MNRAS 364, 601 (2005). https://arxiv.org/abs/astro-ph/0504315
- P. Sarkar, J. Yadav, B. Pandey and S. Bharadwaj, MNRAS 399, L128 (2009). https://arxiv.org/abs/0906.3431
- J. K. Yadav, J. S. Bagla and N. Khandai, *Fractal dimension as a measure of the scale of homogeneity*, MNRAS 405, 2009 (2010). https://arxiv.org/abs/1001.0617
- P. Ntelis et al., *Exploring cosmic homogeneity with the BOSS DR12 galaxy sample*, JCAP 06 (2017) 019. https://arxiv.org/abs/1702.02159
- B. Pandey and S. Sarkar, MNRAS 454, 2647 (2015). https://arxiv.org/abs/1507.03124
- I. Zehavi et al., *The luminosity and color dependence of the galaxy correlation function*, ApJ 630, 1 (2005). https://arxiv.org/abs/astro-ph/0408569
- D. J. Eisenstein et al., *Detection of the baryon acoustic peak in the large-scale correlation function of SDSS luminous red galaxies*, ApJ 633, 560 (2005). https://arxiv.org/abs/astro-ph/0501171
- F. Sylos Labini, M. Montuori and L. Pietronero, *Scale-invariance of galaxy clustering*, Phys. Rep. 293, 61 (1998). https://arxiv.org/abs/astro-ph/9711073
- F. Sylos Labini, N. L. Vasilyev, L. Pietronero and Y. V. Baryshev, EPL 86, 49001 (2009). https://arxiv.org/abs/0805.1132
- R. G. Clowes et al., MNRAS 429, 2910 (2013). https://arxiv.org/abs/1211.6256
- S. Nadathur, *Seeing patterns in noise: gigaparsec-scale 'structures' that do not violate homogeneity*, MNRAS 434, 398 (2013). https://arxiv.org/abs/1306.1700
- A. M. Lopez, R. G. Clowes and G. M. Williger, MNRAS 516, 1557 (2022). https://arxiv.org/abs/2201.06875
- A. M. Lopez et al., *A Big Ring on the sky*, JCAP (2024). https://arxiv.org/abs/2402.07591
- T. Sawala et al., MNRAS Letters 541, L22 (2025). https://arxiv.org/abs/2502.03515

# Does a central black hole shape wave dark matter?

Notes for [issue #1](https://github.com/Foundation-0/fractals/issues/1). Exploration, not peer reviewed, no new
result claimed. Each number is quoted from the source named beside it, printed by `node notes/bh-lensing.mjs`, or
worked out in the text, and is good to a factor of a few. Started 16 October 2026.

The Witness Map found that a black hole horizon barely records where a wave dark matter particle is. The issue asks
the opposite question: can a galaxy's central black hole shape its wave dark matter enough for lensing to notice?

## Short answer

- **Not through superradiance.** For a 10⁻²² eV particle and a 10⁸ to 10⁹ M☉ black hole, the cloud would on paper
  peak 0.3 to 3 kpc from the black hole, the scale lensing probes. But it would take at least 10²⁶ to 10³⁴ years to
  grow, 10¹⁶ to 10²⁴ times the age of the universe. And the galaxy's mass inside that radius is 10 to 400 times the
  black hole's, so the hydrogen-like cloud is not there to grow.
- **No particle mass rescues it.** Around these black holes, a cloud that can grow within the age of the universe
  peaks at most about 0.1 pc out: 40,000 times closer in than the Einstein radius of HS 0810+2554.
- **Ordinary gravity does act, close in.** A black hole a quarter as heavy as the galaxy's wave dark matter core
  squeezes that core to about half its size (Oguri and Kubo 2026). In HS 0810+2554 the core is about 140 pc in
  radius and the lensed images sit 27 times further out, where they cannot feel the squeeze. Only the faint
  central image can.
- **So the test changes shape.** I found no study that tests lensing anomalies against black hole mass or spin.
  Only one anomaly lens, SDP.81, has even a bound on its black hole. Masses read off the M–σ relation would only
  restate the galaxy's velocity dispersion, which also sets the size of the wave granules. Section 6 gives
  testable versions.

## 1. The gravitational atom, step by step

A very light particle bound to a black hole behaves like the electron in hydrogen, with gravity in place of
electric attraction (Baumann, Chia and Porto 2019, below BCP). One number sets everything, the gravitational
fine-structure constant

    α = G M μ / (ħ c) = r_g / λ_c

the black hole's size r_g = GM/c² divided by the particle's reduced Compton wavelength λ_c = ħ/(μc) (BCP eq. 2.6).
For μ = 10⁻²² eV, λ_c = 2.0×10¹⁵ m, or 0.064 pc. A 10⁸ M☉ black hole has r_g = 1.5×10¹¹ m, about 1 AU. So
α = 7.5×10⁻⁵, and ten times that for 10⁹ M☉.

| Black hole mass | 10⁸ M☉ | 10⁹ M☉ |
|---|---|---|
| α | 7.5×10⁻⁵ | 7.5×10⁻⁴ |
| Spin needed for any growth | above 3×10⁻⁴ | above 3×10⁻³ |
| Cloud peak, 4 r_g/α² | 3.4 kpc | 0.34 kpc |
| Orbital speed in the cloud, αc/2 | 11 km/s | 110 km/s |
| Growth time (spin 0.99) | 1×10³⁴ years | 1×10²⁶ years |
| ... in ages of the universe | 7×10²³ | 7×10¹⁵ |
| Velocity dispersion of the host's stars (M–σ) | 150 km/s | 260 km/s |
| Black hole dominates out to GM/σ² | 18 pc | 63 pc |
| Galaxy mass inside the cloud ÷ black hole | 380 | 11 |

How each row comes out:

- **The window is open.** A cloud grows only while it circles more slowly than the horizon spins (BCP eq. 2.1).
  For small α that needs spin above about 4α. With α near 10⁻⁴, almost any spinning black hole qualifies. α sits
  deep inside the superradiant window. The window is not the problem.
- **The size is large because α is small.** The level that grows fastest, |211⟩ (n = 2, one unit of angular
  momentum), peaks at n² r_g/α² (BCP eq. 2.9). Small α means a wide, loosely held cloud, which is why it reaches kpc.
- **The growth is hopelessly slow.** For small α the cloud grows as e^(Γt), with Γ = (a/48) α⁸ μc²/ħ for spin a
  (Detweiler 1980, with the factor of 2 corrected by Pani et al. 2012; BCP eqs. 2.12–2.13). Each "e-fold", a
  factor e ≈ 2.7, takes 1/Γ. The particle's rest frequency μc²/ħ is 1.5×10⁻⁷ per second, one oscillation every
  1.3 years. α⁸ = (7.5×10⁻⁵)⁸ ≈ 10⁻³³. So one e-fold takes 48 / (10⁻³³ × 1.5×10⁻⁷ s⁻¹) ≈ 3×10⁴¹ s ≈ 10³⁴ years. The
  age of the universe is 1.4×10¹⁰ years (Planck Collaboration 2020).
- **The black hole does not hold the particles out there.** The hydrogen picture assumes the black hole's pull
  dominates out to the cloud. It does so only out to GM/σ², the sphere of influence, where σ is the velocity
  dispersion of the surrounding stars (Kormendy and Ho 2013). Taking σ from their M–σ relation,
  M = 3.1×10⁸ M☉ (σ / 200 km/s)^4.38 (eq. 7), the sphere of influence is 18 pc for 10⁸ M☉ and 63 pc for 10⁹ M☉:
  5 to 190 times smaller than the would-be cloud. Put another way, the orbital speed in the cloud, 11 to 110 km/s,
  is below the stars' 150 to 260 km/s. At those radii the galaxy holds the particles: they belong to its wave dark
  matter core and halo, not to a gravitational atom.

So the literal question in the issue, whether the cloud reaches kiloparsec scales, gets the answer "yes on paper",
and that answer misleads.

## 2. No particle mass gives a large cloud that also grows

A heavier particle grows its cloud faster (Γ rises as α⁹ at fixed black hole mass) but makes it smaller (the size
falls as α⁻²). Ask for at least one e-fold within the age of the universe, at the most favourable spin, 0.99:

| Black hole mass | 10⁸ M☉ | 10⁹ M☉ |
|---|---|---|
| Lightest particle whose cloud grows | 4.6×10⁻²⁰ eV | 6.0×10⁻²¹ eV |
| α there | 0.035 | 0.045 |
| Largest cloud | 0.016 pc | 0.095 pc |

These α agree with the lower edge BCP give for growth within the age of the universe, α ≳ 0.005 (M/3 M☉)^(1/9)
(eq. 2.14), which is 0.034 and 0.044 here. One e-fold is generous: a real cloud needs many, so it would be
smaller still. Higher levels (n ≥ 3) grow more slowly and fall back into the black hole once |211⟩ has spun it
down (BCP section 2.2).

The rate formula is derived for α ≪ 1. Where growth is fastest (α ≈ 0.42, spin 0.999) it gives a growth time of
5×10⁷ GM/c³, against 6.7×10⁶ GM/c³ from full numerical solutions (Brito, Cardoso and Pani 2020, eq. 5.32), so there
it is 7 times too slow. The conclusion barely depends on this: the largest cloud scales as the rate to the power
2/9, so even a rate 10 times faster would make it only 1.7 times larger.

A superradiant cloud around a 10⁸ to 10⁹ M☉ black hole therefore peaks at most about 0.1 pc out: 40,000 times
closer in than the 3.8 kpc Einstein radius of HS 0810+2554, and 2,000 times smaller than its 170 pc wave granules
(section 3).
For a 10⁻²² eV cloud to grow within the age of the universe, the black hole would need about 10¹¹ M☉, and the cloud
would still be only 3 pc. The heaviest measured black hole is (4.0 ± 0.8)×10¹⁰ M☉, in Holm 15A (Mehrgan et al. 2019).

Spin therefore says nothing about lensing at 10⁻²² eV. It does constrain heavier particles: the spin of M87*
excludes 2.9×10⁻²¹ to 4.6×10⁻²¹ eV (Davoudiasl and Denton 2019), and spins of other supermassive black holes reach
heavier masses (Stott and Marsh 2018; Unal, Pacucci and Loeb 2021). Those are bounds on the particle, not on lenses.

## 3. What the black hole does do: squeeze the core

Wave dark matter forms a dense core, the soliton, at the centre of every halo (Schive et al. 2014). A black hole
adds its pull and squeezes the core, making it smaller and denser. If the black hole dominates, the core tends to
the hydrogen ground state, with a size set by the black hole's mass (Davies and Mocz 2020; Bar et al. 2019). This is
plain gravity acting on the ground state. It needs no spin and no superradiance.

How strong is it in a lens? Take HS 0810+2554, the system Amruth et al. (2023) fit with wave dark matter:

- Lens redshift about 0.89, an estimate (Mosquera and Kochanek 2011, as quoted by Hartley et al. 2019); source
  redshift 1.51; Einstein radius 0.48″ in Amruth et al.'s power-law model. With flat ΛCDM (H₀ = 67.4 km/s/Mpc,
  Ωm = 0.315; Planck Collaboration 2020), 1″ is 8 kpc there, so the images sit 3.8 kpc from the centre.
- An isothermal lens with that Einstein radius needs σ ≈ 230 km/s. M–σ then gives a black hole of about 6×10⁸ M☉. That is
  an estimate, not a measurement: the relation's scatter alone is a factor of 2 (0.29 dex, Kormendy and Ho 2013),
  and the lens redshift is not measured.
- For the halo mass Amruth et al. use, 7×10¹¹ M☉, and a 10⁻²² eV particle, the core has radius ≈ 140 pc and mass
  ≈ 3×10⁹ M☉ (Oguri and Kubo 2026, eqs. 2.3 and 2.6 at their redshift of 0.88, from Schive et al. 2014). Black hole ÷ core ≈ 0.2. If the halo
  is nearer 10¹³ M☉, as σ ≈ 230 km/s suggests and as Gilman et al. (2020) assume for similar quads (10^13.1 to
  10^13.4 M☉), the core is 2.4 times heavier and the ratio ≈ 0.09.
- Oguri and Kubo find that a ratio of 0.24 halves the core radius; a ratio near 0.1 squeezes it less. So in this
  lens the black hole may reshape the core noticeably. Davies and Mocz, combining the soliton relation at
  redshift zero with a black hole to halo relation from lens galaxies, find the squeeze noticeable at 10⁻²² eV
  only in halos of 10¹³ M☉ and up.

Does the squeeze touch the anomalies? To first order, no. An image responds to the mass inside its radius and to
the density near it. Rearranging mass within 140 pc of the centre changes neither at 3.8 kpc. A change in the
core's shape reaches the images only as a quadrupole, weakened by (0.14 / 3.8)² ≈ 0.001. The black hole's own pull
at the images is 0.6% of the galaxy's. The granules that Amruth et al. model have a size set by the whole halo,
λ_dB = 150 pc (10⁻²² eV / m)(M_h / 10¹² M☉)^(−1/3) (their eq. 1), about 170 pc here, and fill the whole halo. What
the squeeze can change is the faint central image, which forms inside the core.

The black hole does not swallow the core either. For a core the black hole dominates, the swallowing time is about
1 / (32π α⁵ μc²/ħ) (Bar et al. 2019, eq. A21): 9×10¹² years for 10⁹ M☉ at 10⁻²² eV, over 600 ages of the universe.

## 4. Literature check

Asked: has anyone tested lensing anomalies against the lens galaxy's black hole mass or spin? I found no such
study (web searches covering arXiv, October 2026). The closest work:

- **Oguri and Kubo (2026)**: a soliton whose centre is deepened by a black hole makes a dense, hard-to-strip lump.
  The 10⁶ M☉ dark lump in JVAS B1938+666 fits a particle of about 4×10⁻²¹ eV with a 4×10⁵ M☉ black hole. That black
  hole sits in a small satellite halo, not at the centre of the lens.
- **Davies and Mocz (2020)** and **Bar et al. (2019)**: how a black hole squeezes, and may swallow, the core. Bar et
  al. use Sgr A* and M87* to bound the core's mass.
- **Central images** weigh lens-galaxy black holes directly: below 2×10⁸ M☉ in PMN J1632−0033 (Winn, Rusin and
  Kochanek 2004), above 3×10⁸ M☉ in SDP.81 (Tamura et al. 2015; Wong et al. 2015 find log M ≳ 8.5). The SDP.81
  bound trades off against the assumed size of the galaxy's stellar core (Tamura et al. 2015).
- **Is 10⁻²² eV right at all?** Amruth et al. (2023) and Hou et al. (2026) favour wave dark matter near 10⁻²² eV
  from anomalies (Hou et al.: 17 cusp quads, a benchmark of 0.8×10⁻²² eV, and a Bayes factor above 100 against
  cold and self-interacting dark matter).
  Laroche et al. (2022), with 11 quads, prefer cold dark matter 8 to 1 over 10^−22.5 to 10^−22.25 eV. Powell et al.
  (2023) rule out masses up to 4.4×10⁻²¹ eV at 20 to 1 odds from one extended arc. Outside lensing, the Lyman-α
  forest gives above 2×10⁻²⁰ eV at 95% (Rogers and Peiris 2021) and ultra-faint dwarf galaxies above 3×10⁻¹⁹ eV at
  99% (Dalal and Kravtsov 2022). If the particle is that heavy, superradiance does work around these black holes
  (from 6×10⁻²¹ eV for 10⁹ M☉, 5×10⁻²⁰ eV for 10⁸ M☉), but section 2 shows the clouds are then under 0.1 pc, far
  too small for lensing.

## 5. Lens systems: anomalies and black hole masses

| System | Anomaly measurement | Wave dark matter analysis | Lens galaxy's black hole |
|---|---|---|---|
| HS 0810+2554 | Radio jets with VLBI (Hartley et al. 2019); narrow-line fluxes (Nierenberg et al. 2020) | Amruth et al. 2023: reproduced at ~10⁻²² eV | Not measured. M–σ estimate ~6×10⁸ M☉ (section 3) |
| SDP.81 | A 10^(8.96±0.12) M☉ dark lump at 6.9σ (Hezaveh et al. 2016) | None found | Above 3×10⁸ M☉ from the missing central image (Tamura et al. 2015; Wong et al. 2015) |
| PMN J1632−0033 | None found | None found | Below 2×10⁸ M☉ from the central image (Winn, Rusin and Kochanek 2004) |
| JVAS B1938+666 | A 10⁶ M☉ dark lump at 26σ (Powell et al. 2025, as cited by Oguri and Kubo) | Oguri and Kubo 2026: soliton plus a 4×10⁵ M☉ black hole inside the lump | Not measured |
| MG J0751+2716 | Extended arc at milliarcsecond resolution | Powell et al. 2023: up to 4.4×10⁻²¹ eV ruled out | Not measured |
| B1422+231, HE0435−1223, WGD J0405−3308, RX J0911+0551, PS J1606−2333, WFI 2026−4536, WFI 2033−4723, WGD 2038−4008 | Narrow-line fluxes, as compiled by Gilman et al. 2020 | Laroche et al. 2022 bound the particle mass with an 11-quad sample of this kind | Not measured |
| 17 cusp quads, e.g. J1042+1641 | Microlensing-free fluxes, many from JWST | Hou et al. 2026: FDM preferred | Not measured |

SDP.81 is the only system I found with both a small-scale anomaly and a lensing bound on its black hole. "Not
measured" means I found no direct measurement, and none is expected: at these redshifts a black hole's sphere of
influence (18 to 63 pc) spans 2 to 14 milliarcseconds, well inside the 36 milliarcsecond core of the Hubble image
blur that a stellar-dynamical mass must resolve (Kormendy and Ho 2013). Lensing central images are the only route.
I found no spin measurement for any lens galaxy's black hole.

## 6. How the question changes shape

1. **Drop superradiance and spin at 10⁻²² eV.** Sections 1 and 2 close that route for every known black hole.
2. **Beware the common cause.** Heavier lens galaxies have higher σ, heavier black holes (M ∝ σ^4.38) and smaller
   granules (λ_dB ∝ M_h^(−1/3)). So anomalies may correlate with black hole mass even if the black hole does
   nothing. With black hole masses taken from M–σ, testing "anomaly against black hole" is testing "anomaly against
   σ". A fair test needs masses measured independently of σ, compared at fixed σ. No anomaly lens has one today.
3. **Testable versions.**
   - **Central images.** A core squeezed by a black hole of given mass predicts a definite central image. SDP.81 and
     PMN J1632−0033 show deep radio and submillimetre imaging can find or bound it. Doing this in quads with
     anomaly data would weigh the black hole and the core in the same lens.
   - **Lumps with their own black hole.** Oguri and Kubo's reading of JVAS B1938+666 predicts a point mass inside
     some dark lumps. Gravitational imaging can test that lump by lump.
   - **The particle mass.** Anomaly fits and black hole spins constrain the same particle through different
     objects: lensing through kiloparsec halos, spins through sub-parsec clouds. At 10⁻²² eV only lensing can
     speak. From a few times 10⁻²¹ eV up both can, and M87*'s spin already excludes 2.9 to 4.6×10⁻²¹ eV.

## The model

`gravAtom(M, muEV, spin)` in `witness-map/model.js` returns α, the |211⟩ cloud size, its orbital speed, whether it
is inside the superradiant window, and its growth time. `npm test` checks it against published numbers:

| Check | Published | Model |
|---|---|---|
| α for 3 M☉ and 10⁻¹² eV (BCP eq. 2.6) | 0.02 | 0.022 |
| Growth time at BCP's smallest growing α, 0.005 for 3 M☉ (eq. 2.14) | age of the universe, 1.4×10¹⁰ years | 1.2×10¹⁰ years |
| Largest α that grows at spin 0.8 (BCP, after eq. 2.14) | 0.25 | 0.252 |
| Heaviest particle M87*'s spin can grow, spin 0.8, 7.2×10⁹ M☉ (Davoudiasl and Denton 2019) | 4.6×10⁻²¹ eV | 4.7×10⁻²¹ eV |

Two more checks guard this note's main claims: the 10⁻²² eV clouds above take over 10¹⁵ ages of the universe to
grow, and no cloud that grows within that time around 10⁸ to 10⁹ M☉ peaks beyond 1 pc.

What it leaves out: the cloud's own gravity and the surrounding dark matter, levels other than |211⟩, and any
self-interaction of the particle. It assumes the black hole dominates out to the cloud, which section 1 shows fails
at 10⁻²² eV.

## Sources

- A. Amruth et al., *Einstein rings modulated by wavelike dark matter from anomalies in gravitationally lensed images*, Nature Astronomy 7, 736 (2023). https://arxiv.org/abs/2304.09895
- N. Bar, K. Blum, T. Lacroix and P. Panci, *Looking for ultralight dark matter near supermassive black holes*, JCAP 07, 045 (2019). https://arxiv.org/abs/1905.11745
- D. Baumann, H. S. Chia and R. A. Porto, *Probing ultralight bosons with binary black holes*, Phys. Rev. D 99, 044001 (2019). https://arxiv.org/abs/1804.03208
- R. Brito, V. Cardoso and P. Pani, *Superradiance*, Lect. Notes Phys. 971 (2020). https://arxiv.org/abs/1501.06570
- N. Dalal and A. Kravtsov, *Not so fuzzy: excluding FDM with sizes and stellar kinematics of ultra-faint dwarf galaxies* (2022). https://arxiv.org/abs/2203.05750
- H. Davoudiasl and P. B. Denton, *Ultralight boson dark matter and Event Horizon Telescope observations of M87\**, Phys. Rev. Lett. 123, 021102 (2019). https://arxiv.org/abs/1904.09242
- E. Y. Davies and P. Mocz, *Fuzzy dark matter soliton cores around supermassive black holes*, MNRAS 492, 5721 (2020). https://arxiv.org/abs/1908.04790
- S. Detweiler, *Klein-Gordon equation and rotating black holes*, Phys. Rev. D 22, 2323 (1980). https://doi.org/10.1103/PhysRevD.22.2323
- D. Gilman et al., *Warm dark matter chills out: constraints on the halo mass function and the free-streaming length of dark matter with eight quadruple-image strong gravitational lenses*, MNRAS 491, 6077 (2020). https://arxiv.org/abs/1908.06983
- P. Hartley, N. Jackson, D. Sluse, H. R. Stacey and H. Vives-Arias, *Strong lensing reveals jets in a sub-microJy radio-quiet quasar*, MNRAS 485, 3009 (2019). https://arxiv.org/abs/1901.05791
- Y. D. Hezaveh et al., *Detection of lensing substructure using ALMA observations of the dusty galaxy SDP.81*, ApJ 823, 37 (2016). https://arxiv.org/abs/1601.01388
- S. Hou et al., *Flux-ratio anomalies in cusp quasars reveal dark matter beyond CDM* (2026). https://arxiv.org/abs/2601.16818
- J. Kormendy and L. C. Ho, *Coevolution (or not) of supermassive black holes and host galaxies*, ARA&A 51, 511 (2013). https://arxiv.org/abs/1304.7762
- A. Laroche, D. Gilman, X. Li, J. Bovy and X. Du, *Quantum fluctuations masquerade as haloes: bounds on ultra-light dark matter from quadruply-imaged quasars*, MNRAS 517, 1867 (2022). https://arxiv.org/abs/2206.11269
- K. Mehrgan et al., *A 40 billion solar mass black hole in the extreme core of Holm 15A, the central galaxy of Abell 85*, ApJ 887, 195 (2019). https://arxiv.org/abs/1907.10608
- A. M. Nierenberg et al., *Double dark matter vision: twice the number of compact-source lenses with narrow-line lensing and the WFC3 grism*, MNRAS 492, 5314 (2020). https://arxiv.org/abs/1908.06344
- M. Oguri and N. Kubo, *Fuzzy dark matter soliton core hosting a supermassive black hole as a dense low-mass perturber in strong gravitational lensing*, JCAP 07, 088 (2026). https://arxiv.org/abs/2601.15718
- P. Pani, V. Cardoso, L. Gualtieri, E. Berti and A. Ishibashi, *Perturbations of slowly rotating black holes: massive vector fields in the Kerr metric*, Phys. Rev. D 86, 104017 (2012). https://arxiv.org/abs/1209.0773
- Planck Collaboration, *Planck 2018 results. VI. Cosmological parameters*, A&A 641, A6 (2020). https://arxiv.org/abs/1807.06209
- D. M. Powell et al., *A lensed radio jet at milli-arcsecond resolution II: constraints on fuzzy dark matter from an extended gravitational arc*, MNRAS Letters 524, L84 (2023). https://arxiv.org/abs/2302.10941
- D. M. Powell et al., *A million-solar-mass object detected at a cosmological distance using gravitational imaging*, Nature Astronomy 9, 1714 (2025), as cited by Oguri and Kubo. https://arxiv.org/abs/2510.07382
- K. K. Rogers and H. V. Peiris, *Strong bound on canonical ultralight axion dark matter from the Lyman-alpha forest*, Phys. Rev. Lett. 126, 071302 (2021). https://arxiv.org/abs/2007.12705
- H.-Y. Schive et al., *Understanding the core-halo relation of quantum wave dark matter from 3D simulations*, Phys. Rev. Lett. 113, 261302 (2014). https://arxiv.org/abs/1407.7762
- M. J. Stott and D. J. E. Marsh, *Black hole spin constraints on the mass spectrum and number of axion-like fields*, Phys. Rev. D 98, 083006 (2018). https://arxiv.org/abs/1805.02016
- Y. Tamura et al., *High-resolution ALMA observations of SDP.81. I. The innermost mass profile of the lensing elliptical galaxy probed by 30 milli-arcsecond images*, PASJ 67, 72 (2015). https://arxiv.org/abs/1503.07605
- C. Unal, F. Pacucci and A. Loeb, *Properties of ultralight bosons from heavy quasar spins via superradiance*, JCAP 05, 007 (2021). https://arxiv.org/abs/2012.12790
- J. N. Winn, D. Rusin and C. S. Kochanek, *The central image of a gravitationally lensed quasar*, Nature 427, 613 (2004). https://arxiv.org/abs/astro-ph/0312136
- K. C. Wong, S. H. Suyu and S. Matsushita, *The innermost mass distribution of the gravitational lens SDP.81 from ALMA observations*, ApJ 811, 115 (2015). https://arxiv.org/abs/1503.05558

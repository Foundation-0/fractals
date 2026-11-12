# Witness Map interpretation review

Independent implementation review by gpt-forge using GPT-6.1 Sol, 12 November 2026.

Reviewed fractals PR54 head c1a1f53 and the public UI, README and model comments against Riedel and Zurek (2011), sections 2.3 and 2.4, [primary paper](https://arxiv.org/html/1102.3179v2). The source distinguishes finite isotropic-light decoherence from zero redundancy and makes angular-state dependence explicit. Numerical formulas are unchanged.

The UI and model comments consistently label W as a timescale comparison, not a record counter or classicality test. The README retained three contradictory lines about stars witnessing lumps and W deciding whether superposition is possible. The approved followup removes those claims and describes stellar effects as gravitational responses.

Scope: copy and scientific interpretation review. Existing eight numerical tests and browser checks were supplied by the author. This reviewer did not rerun them. Site verification and diff checks were run for the followup. Human scientific review remains pending.

The followup is published in [PR #54](https://github.com/Foundation-0/fractals/pull/54). The [cross-repository synthesis](https://github.com/Foundation-0/physics0/pull/18) places this correction beside the separate field-response, mechanics and galaxy-calibration results.

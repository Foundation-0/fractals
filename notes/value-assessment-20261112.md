# Research value: fold mechanics and weak forces

Status: exploratory calculation, pending independent reproduction and human scientific review. Prepared by gpt-forge (an OpenAI Codex agent) for ahrazzle (Ahraz Arifuddin), with gpt-6-astra research agents and gpt-6.1-sol publication preparation.

Why it belongs here: the assessment asked whether folding a lattice could change critical behaviour of the kind this repository's [critical-point study](../critical/README.md) measures on a flat 2D lattice. For an Ising model on the fixed graph, with every bond keeping the same coupling, it cannot: the Hamiltonian has no fold parameter. The fold does change the elastic response, which is the part this note records.

Pursue the closed elastic tensor for this declared fold and the crossover introduced by weak additional springs. Rank-one elasticity, pentamode constructions and compatibility-matrix methods have prior literature. Their appearance here does not establish novelty.

The control uses six joints, fifteen unstressed central springs, linear internal relaxation, and current cell volume. Along the fold, its relaxed elastic tensor has one nonzero eigenvalue. The open endpoint has three. Twenty-one added springs provide one declared sensitivity family, with reference rest lengths reset at each fold.

The useful increment is the explicit folded tensor and the order-of-limits crossover for that family. It is not a measured modulus, a nonlinear stability proof, or a prediction for CaB6. Geometry alone does not change the fixed-coupling Ising Hamiltonian.

Before further work, search the related framework literature for the same folded tensor and regularization. Stop the broader research claim if that result is already known. Otherwise choose one physical interaction or fabrication design and test its stability and finite-strain domain. Park material and fundamental claims until those checks pass.

[Report, derivation, sources and reproducible controls](https://github.com/Foundation-0/gravity/tree/b7550b10a9f70c546e5004e98fff3e6065717825/research/value-assessment-20261112/convergences), pinned at gravity `main` commit b7550b1 (merge of gravity #26, which landed the gravity #11 assessment after its review fixes). This follows the earlier companion note, [records, changing scales and collective waves](convergences-20261112.md). The assessed fractals snapshot is `48b923bd25dbcfef7fa8e8399d4144592145f0ef`. The geometry source is pinned in the canonical source registry.

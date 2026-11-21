# Scaling exponents without logarithms

A check for the sentence "the exponent between two scales lies between p/q and r/s", made on the numbers a table prints.
Exploration, not peer reviewed, no new result claimed. `node scaling-check/table.mjs` prints the verdicts below in an
instant. `node scaling-check/table.mjs verify` (about 45 s) runs the two scripts that print the series and finds every
number again. `npm test` (`tests/scaling-check.mjs`) checks the comparison itself and the verdicts. Integers only, no
dependencies, Node 18 or later (it uses BigInt).

## What it does

A series is a list of scales x and values y, such as box sizes L and a magnetisation at each. The slope between two
scales a < b is the exponent in y ~ x^slope, taken over that stretch: ln(y_b / y_a) divided by ln(x_b / x_a).

For positive rationals and a rational p/q with q > 0:

> the slope between a and b is at least p/q exactly when (y_b / y_a)^q >= (x_b / x_a)^p.

Take natural logarithms of both sides and divide by the positive ln(x_b / x_a) to see it. Each side is a fraction raised
to an integer power, so the test is a comparison of two integers. No logarithm is taken, no float is made, nothing is
rounded, and a slope that equals p/q exactly counts as at least p/q. (For negative p the powers move to the other side.)
That powers can stand in for logarithms in a comparison of this kind is elementary. The same move is stated for a
bound on an entropy in Krohn-Grimberghe (2026, arXiv 2608.17376, section 6): "a claimed bound m/n on a rational power is
an integer inequality". Two web searches found no tool that applies it to scaling brackets. That is all this study
claims about prior work.

`check.mjs` asks whether the slope lies in a closed bracket [p1/q1, p2/q2], in three modes:

| Mode | What must lie in the bracket |
|---|---|
| window | the slope from the first scale to the last |
| steps | every slope between neighbouring scales |
| all pairs | every slope between any two scales |

Window is the loosest. Steps and all pairs are stricter, so they reject series that a fit over the whole range accepts:
they ask whether the exponent is steady along the range, not whether its average is right.

On exact values steps and all pairs always give the same verdict. The slope over a longer stretch is an average of the
step slopes inside it, weighted by ln(x_b / x_a), so it stays in any bracket that holds every step. All pairs is kept as
a cross-check of steps.

With error bars they can differ. Every step can fit the bracket while a longer stretch does not. Give each value a box
[L, U] and the bracket [p1/q1, p2/q2]. The question is whether values inside the boxes exist with every step slope in the
bracket. The interval form of all pairs decides it exactly: for every i < j, (U_j / L_i)^q1 >= (x_j / x_i)^p1 and
(L_j / U_i)^q2 <= (x_j / x_i)^p2. This is the consistency test for a chain of difference constraints, the simple temporal
problem of Dechter, Meiri and Pearl (1991). Foundation-0/fractals draft pull request 60 states it and applies it. The
interval form is not a mode of `check.mjs`, which takes point values. `tests/scaling-check.mjs` pins the smallest case.
The smallest case has scales 1, 2, 4, the bracket [1, 1] and boxes [1, 1], [3/2, 5/2] and [9/2, 5]. Each step alone
admits slope 1, and the pair of the first and last scales does not.

`exponentInLog2` is the same test for a printed column that already holds base-2 logarithms of y at x = 2^n, such as
log2 <|u_n|^2> against shell n. The test then reads q (L_b - L_a) >= p (n_b - n_a), a comparison of decimals.

## What it certifies, and what it does not

It certifies a statement about the printed numbers: that the slopes the mode looks at, computed from exactly the
digits printed, lie in the bracket. The printed digits are rounded, and the verdict is about them as printed.

It says nothing about measurement error. A table with an error bar of 0.5% on each value gives a slope uncertain by about
as much, and the check does not know that. A bracket chosen narrower than that uncertainty can reject a correct
exponent, which is why steps and all pairs reject some series here. It says nothing about the physics: whether the
exponent should be there, whether the range is long enough, or whether a model is right.

## The series, and the verdict on each

Every number is printed by a script in this repository, and `series.mjs` pins the commit and the place. The brackets are
the published exponent plus and minus 1/100, 3/100 and 1/10. The last line of each block is the smallest half-width,
on a grid of 0.001, that each mode accepts. `node scaling-check/table.mjs` prints all of this, and `npm test` checks
the verdicts.

| Series (source: `node critical/table.mjs`, "At T_c", commit 48b923b) | Published | window | steps | all pairs |
|---|---|---|---|---|
| 2D Ising magnetisation, L = 8 to 128 | slope -1/8 (exact) | accepts at 0.001 | rejects at 1/100, accepts at 3/100 (0.023) | same as steps (0.023) |
| 2D Ising susceptibility, L = 8 to 128 | slope 7/4 (exact) | accepts at 0.001 | rejects at 1/100 and 3/100, accepts at 1/10 (0.032) | same as steps (0.032) |
| 2D Ising correlation G(L/2), L = 8 to 128 | slope -1/4 (exact) | accepts at 0.003 | rejects at 1/100 and 3/100, accepts at 1/10 (0.039) | same as steps (0.039) |
| Site percolation, spanning-cluster mass, L = 32 to 256, seed 401 (`node critical/table.mjs`, percolation table) | 91/48 | **rejects at 1/100**, accepts at 3/100 (0.024) | rejects at 3/100, accepts at 1/10 (0.039) | same as steps (0.039) |
| Sabra shell model, plain moment <\|u_n\|^2> against k_n = 2^n, shells 3 to 8 (`node turbulence/table.mjs quick`, last column, printed as log2) | zeta_2 = 0.720 | **rejects at 1/100 and 3/100**, accepts at 1/10 (slope 0.756, 0.036) | rejects at 1/10 (0.370) | same as steps (0.370) |

How to read the rows that reject:

- **Percolation, one seed.** The printed masses 398, 1442, 5308, 19546 give a window slope of 1.8727, below 91/48 = 1.8958
  by 0.023. (The percolation table's own least-squares fit over the same four sizes prints 1.8735.) Two things bear on
  it. This is the study seed alone, and the series starts at L = 32. `critical/README.md` quotes the nine-seed mean,
  1.880 ± 0.002, 0.8% below 91/48, and explains it as a finite-size shortfall. From L = 64 on, this seed's window slope
  is 1.8804, still 0.015 below 91/48 and still outside plus and minus 1/100. The check does not test the finite-size
  explanation. And a bracket of plus and minus 1/100 is narrower than the shortfall the README already reports.
- **Sabra, plain moment.** The printed column gives a window slope of 0.756 over shells 3 to 8. It lies outside
  0.720 ± 0.008 and outside the Kolmogorov value 2/3 ± 1/30. `turbulence/README.md` says the plain moments ripple from
  shell to shell and are "printed but not used": its exponents come from the flux-based moments against the third one
  (extended self-similarity), and its own table prints the plain-moment ζ₂ as 0.760. So the rejection restates a
  difference the turbulence study already prints. L'vov et al.'s Table I gives ζ₂ = 0.720 for the plain moments
  ⟨|u_n|^q⟩ and 0.719 for the flux-based ones. They fitted both with a power law that bends into the dissipative range
  (their eq. 44), over 34 shells, not with a straight slope over a few shells. So this row measures how far the straight
  slope of the printed column is from 0.720. It is not a test of the model against their table.
- **Ising, steps and all pairs.** Each value is a Monte Carlo average with an error of 0.4% to 1.4%, and slopes between
  neighbouring sizes (a factor of 2) move by a few hundredths. Rejection at 1/100 by these two modes is expected and
  says the bracket is narrower than the noise.

## What is checked and what is not

- Checked by `npm test`: the comparison against 80-digit logarithms on 3,000 random cases, exact ties, the printed-log2
  form against the ratio form, four must-fail controls, the verdict and the smallest half-width in the table for every
  series, and that `scaling-check/table.mjs` runs and prints the same half-widths.
  The smallest error-bar case, where steps pass and all pairs fail, and its widened twin, are checked too.
- Checked by `node scaling-check/table.mjs verify`, not by `npm test` (it runs the Monte Carlo): that every pinned number
  is in what the two scripts print in the current checkout. At the pinned commit every one of them is.
- Not checked: that a different seed or a longer run gives the same verdicts.

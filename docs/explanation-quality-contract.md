# Explanation acceptance contract

These requirements apply to every generated family, variant, difficulty and
supported language, both for correct and incorrect answers.

1. State the general visible rule in a complete sentence, including its scope
   (each row, each column, a specified direction of diagonals, or a move to the
   adjacent cell), the operation/change and what remains unchanged. A list of
   the contents of cells does not satisfy this obligation. Name the objects and
   relationship; do not require readers to decode implementation identifiers,
   semicolon lists or unexplained shorthand.
2. Identify visible evidence in the matrix. The missing cell and the answer
   options cannot serve as evidence for their own correctness.
3. Apply that rule to the actual last row/column/diagonal and derive the missing
   cell. Every stated observation must match the generated cell data.
4. Explain every distinguishing property, including a property that stays
   unchanged (fill, number, position, orientation, etc.). A summary alone is
   not an explanation of the rule.
5. Finish with one concrete description of the required result. For each error,
   explain why the rule requires the expected value, then identify how the
   selected answer contradicts that consequence. "A differs from B" is not a
   causal explanation. Report all violated rules, not just the first difference
   in a serialized object.
6. Use the near-miss introduction only for one independently violated rule.
   Nested arrays and grouped fields do not establish that count.
7. Use the grammar of the selected language: articles, gender, number,
   prepositions, case and word order. Compose coherent paragraphs, avoiding
   repeated conclusions, ambiguous pronouns and unnecessary negative asides.
8. Give each family/variant a reviewed reasoning implementation. Assigning
   several families to a generic phrase is not coverage.
9. Automated checks prove only the assertions they actually test. A text that
   passes regex checks is not thereby certified natural or complete. Track
   unreviewed implementations explicitly and fail the quality gate for them.
10. Sample multiple seeds at all six generator levels. Separately test the
    branches and perturbations that random samples may miss. Never describe a
    finite sample as verification of every possible generated exercise.

## Review record

Each reviewed implementation must record its rule/evidence/conclusion fields,
the properties covered by its diagnosis, the language-specific templates used,
and data assertions tying that reasoning to visible inputs. New variants must
invalidate the review until these obligations are checked.

The audit's `semantic_review` column distinguishes review status from existing
mechanical checks. An unreviewed row is a release blocker, not a default pass.

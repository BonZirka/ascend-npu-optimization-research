# What are the risks?

[[Pitch Presentation]]

**Working assessment:** risks are ordered by severity. **Useful findings are the central outcome.** Risks 1 and 2 are the primary concerns; risks 3–5 are considered manageable. Severity and probability ratings remain provisional.

**Severity** describes the impact if the issue remains unresolved. **Probability** describes its likelihood of remaining a material obstacle after corrective work. Manageability supports the provisional Low ratings for 3–5; probability for 1–2 remains unknown. Early checks are suggestions.

| # | Candidate risk | What failure would look like | Severity | Probability | Possible early check |
| --- | --- | --- | --- | --- | --- |
| 1 | **Too few useful findings** | The agent produces invalid, trivial or narrowly applicable rewrites on real AscendNPU-IR inputs. | High — fails to deliver the central outcome: useful findings. | Unknown — AscendNPU-IR yield untested. | Exercise the proposed baseline on representative examples. |
| 2 | **Integration costs dominate** | Resuming compilation, checking candidates and reproducing comparisons require substantial custom engineering. | High — may consume the experiment's available capacity. | Unknown — integration route unestablished. | Establish one complete original/candidate evaluation route early. |
| 3 | **No net saving of expert effort** | Preparing inputs, reviewing proposals and maintaining the framework consume the time it saves. | High — useful findings do not deliver the expected expert-time savings. | Low — provisional. | Record the full investigation effort on representative cases. |
| 4 | **Misleading improvement metric** | Candidates improve the score without improving relevant compiled code or workloads. | Medium — misleading findings and wasted investigation. | Low — provisional. | Check selected findings against later compilation stages and execution where feasible. |
| 5 | **Insufficient correctness evidence** | Candidates pass the selected checks while violating behavior those checks do not cover. | Medium — unreliable findings and additional review. | Low — provisional. | Establish check coverage and review initial candidates independently. |

## TODO

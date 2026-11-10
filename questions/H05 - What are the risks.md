# What are the risks?

[[Pitch Presentation]]

**Status: candidates for individual discussion.** Likelihood and impact remain to be assessed. Early checks below are suggestions.

| # | Candidate risk | What failure would look like | Possible early check |
| --- | --- | --- | --- |
| 1 | **No net saving of expert effort** | Preparing inputs, reviewing proposals and maintaining the framework consume the time it saves. | Record the full investigation effort on representative cases. |
| 2 | **Misleading improvement metric** | Candidates improve the score without improving relevant compiled code or workloads. | Check selected findings against later compilation stages and execution where feasible. |
| 3 | **Insufficient correctness evidence** | Candidates pass the selected checks while violating behavior those checks do not cover. | Establish check coverage and review initial candidates independently. |
| 4 | **Too few useful findings** | The agent produces invalid, trivial or narrowly applicable rewrites on real AscendNPU-IR inputs. | Exercise the proposed baseline on representative examples. |
| 5 | **Integration costs dominate** | Resuming compilation, checking candidates and reproducing comparisons require substantial custom engineering. | Establish one complete original/candidate evaluation route early. |

## TODO

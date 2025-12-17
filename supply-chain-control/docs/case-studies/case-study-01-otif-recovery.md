# Case Study 01 — OTIF Recovery for Long-Lead Subsystems (Chambers & RF)

![Case 01](../images/case01.png)

## Situation
During a build ramp, multiple long-lead subsystems (process chamber kits, RF components, and precision seals) showed **commit volatility** and late deliveries. Escalations were high and the build line risked missing phase-gate readiness.

## Goals (targets)
- Restore **Tier-A OTIF to ≥ 95%**
- Reduce **Past Due $ by 40%** in 6 weeks
- Reduce **reschedule churn** (commit changes) by 30%

## Dashboard modules
- OTIF trend by supplier + commodity
- Past Due $ burn-down (weekly)
- Commit slip distribution (days late vs promise)
- Pareto of top parts driving late $ / late qty
- Heatmap: supplier × receiving site late-risk density

## KPI impact (example)
- OTIF: **84% → 96%**
- Past Due $: **$2.6M → $1.5M** (−42%)
- Avg commit slip: **+5.4d → +2.0d**
- Lines with reschedules: **58% → 37%**

## Root cause (data-backed)
- Late risk concentrated in two commodities: **machined parts** and **electronics**
- A small set of **critical path** parts drove the majority of Past Due $
- Late ASN and partial shipments increased dock uncertainty

## Actions
- 2-week frozen window with locked commits for Tier-A
- Supplier weekly capacity check + recovery plan tracking
- ASN compliance scorecard and receiving priority rules
- Clear expedite rules for Tier-A only inside shortage window

## Deliverables
- Supplier scorecards (OTIF, slip, churn, hold rate)
- Weekly hotlist export for build readiness reviews
- Exec summary view for phase-gate readiness

## Next step
Add inventory snapshots to calculate **Days of Supply** and auto-flag line-down risk.

# Case Study 03 — Shortage Early-Warning for Build Readiness (Next 6 Weeks)

![Case 03](../images/case03.png)

## Situation
Shortages were discovered too late (inside 1–2 weeks), creating line-down risk and last-minute expedites. The build team needed an early-warning lens similar to semiconductor readiness gates.

## Goals
- Detect shortage risk **6 weeks ahead**
- Reduce line-down events by **50%**
- Prioritize Tier-A and long-lead parts

## Data used
- PO lines: need-by dates, open qty, commits, reschedules
- Shipments: in-transit visibility, delivery performance
- Inventory snapshots (optional): on-hand + usage rate

## Dashboard modules
- Next 6-week coverage view (supply vs demand proxy)
- Risk table: part, supplier, tier, open qty, slip, past due, expedite history
- Heatmap: supplier × week risk density
- Top drivers: reschedule churn and commit slip

## KPI impact (example)
- Line-down events: **6/month → 2/month**
- Tier-A Past Due $ in window: **−35%**
- Expedite rate: **−10%** (shift from reactive to planned)

## Actions
- Weekly material readiness review with exported hotlist
- Recovery playbooks: pull-in, split ship, alternate source, substitute
- Commit lock inside frozen window

## Next step
Add an action log (owner/status/ETA) and integrate into operating rhythm.

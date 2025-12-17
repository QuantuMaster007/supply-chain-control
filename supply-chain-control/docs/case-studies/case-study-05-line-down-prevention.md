# Case Study 05 — Line-Down Prevention via ASN + Dock-to-Stock + Kitting

![Case 05](../images/case05.png)

## Situation
Even when deliveries were “on time,” parts were not always available to the build line due to missing ASN, dock congestion, and kitting delays—creating hidden readiness misses.

## Goals
- Improve ASN compliance to **≥ 98%**
- Reduce dock-to-stock time by **30%**
- Reduce kit misses / line-down risk events by **40%**

## Dashboard modules
- ASN compliance rate by supplier and lane
- Delivery vs receipt delta (delivery_date vs receipt_date_last)
- Heatmap: site/day-of-week congestion
- “True on-time to kit” metric (delivery + processing latency)

## KPI impact (example)
- ASN compliance: **90% → 99%**
- Dock-to-stock: **3.0d → 2.0d** (−33%)
- Tier-A kit misses: **−41%**

## Actions
- ASN policy + supplier enforcement
- Dock scheduling windows aligned to receiving capacity
- Exception reason capture and weekly CI loop
- Kitting priority rules for Tier-A

## Next step
Add inbound milestone timestamps (scan events) for full traceability.

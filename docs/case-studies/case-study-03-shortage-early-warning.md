# Case Study 03: Shortage Early-Warning for Build Readiness (Next 6 Weeks)

## Problem Statement
Line-down events due to undetected shortages in vacuum systems caused 5 production stops, with $3.2M in recovery costs. Lack of time-phased visibility into supply gaps.

## Baseline Metrics (Q1 2025)
- OTIF: 72%
- Past Due $: $1.8M open
- Expedite Spend: $950K
- Reschedule Rate: 42%
- Quality Hold Rate: 9%

## Actions Taken
1. **Time-Phased Coverage Alerts**: Implemented 6-week forward-looking shortage alerts based on DOS < 2 weeks.
2. **Critical Path Mapping**: Identified all A/B-tier parts with single-source risks and buffer requirements.
3. **Supplier Commitment Tracking**: Daily monitoring of last_confirmed_date vs need_by_date.
4. **Kitting Readiness Gates**: Pre-kitting for complex assemblies with 3-day buffers.

## Results (Q2 2025)
- OTIF: +12 pts to 84%
- Past Due $: -55% to $810K
- Expedite Spend: -35% to $618K
- Reschedule Rate: -20% to 34%
- Quality Hold Rate: -45% to 5%

## How Measured
Shortage risk flagged where DOS < 7 OR past due exists. OTIF = (delivery_date <= need_by_date AND ship_qty >= ordered_qty). Past Due $ = open_qty * unit_price where po_status="Open" AND need_by_date < today. Expedite Spend = freight_cost_usd where expedite_flag=true. Reschedule Rate = % lines with reschedule_count > 0. Quality Hold Rate = % lines with quality_hold_flag=true.

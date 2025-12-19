# Case Study 01: OTIF Recovery for Long-Lead Subsystems (Chambers & RF)

## Problem Statement
Critical CVD chamber subsystems from APAC supplier "Sakura Ceramics" showed declining OTIF performance (from 85% to 62%) over 6 months, impacting fab ramp for new 3nm process node. Late deliveries caused 3 production holds, costing $2.8M in lost wafers.

## Baseline Metrics (Q1 2025)
- OTIF: 62%
- Past Due $: $1.2M open
- Reschedule Rate: 45%
- Expedite Spend: $380K
- Quality Hold Rate: 8%

## Actions Taken
1. **Supplier Escalation Cadence**: Weekly cross-functional reviews with supplier engineering, including fab process owners.
2. **Buffer Strategy**: Added 2-week safety buffers to need-by dates for all A-tier parts.
3. **ASN Compliance**: Mandated 100% ASN sent 48h before ship, with automated dock receipt confirmation.
4. **Capacity Planning**: Supplier committed to 20% capacity reserve for our orders.

## Results (Q2 2025)
- OTIF: +18 pts to 80%
- Past Due $: -65% to $420K
- Reschedule Rate: -25% to 34%
- Expedite Spend: -40% to $228K
- Quality Hold Rate: -50% to 4%

## How Measured
OTIF calculated as (delivery_date <= need_by_date AND ship_qty >= ordered_qty). Past Due $ = open_qty * unit_price where po_status="Open" AND need_by_date < today. Expedite Spend = freight_cost_usd where expedite_flag=true. Reschedule Rate = % lines with reschedule_count > 0. Quality Hold Rate = % lines with quality_hold_flag=true.

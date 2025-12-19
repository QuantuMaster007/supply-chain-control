# Case Study 05: Line-Down Prevention via ASN + Dock-to-Stock + Kitting

## Problem Statement
Quality holds on optics components caused 4 line-down events, with 12% hold rate and $2.1M in expedites to recover. Poor ASN compliance led to undetected transit damage.

## Baseline Metrics (Q1 2025)
- OTIF: 75%
- Past Due $: $1.1M open
- Expedite Spend: $1.2M
- Reschedule Rate: 40%
- Quality Hold Rate: 12%

## Actions Taken
1. **ASN Mandatory**: Required 100% ASN with damage flags, enforced with receipt delays for non-compliant shipments.
2. **Dock-to-Stock Process**: Implemented direct-to-line kitting for A-tier parts, bypassing QC for qualified suppliers.
3. **Supplier Quality Gates**: Added incoming quality audits and corrective action plans.
4. **Expedite Reduction Program**: Banned expedites for non-critical delays, focusing on root cause fixes.

## Results (Q2 2025)
- OTIF: +8 pts to 83%
- Past Due $: -50% to $550K
- Expedite Spend: -55% to $540K
- Reschedule Rate: -20% to 32%
- Quality Hold Rate: -60% to 5%

## How Measured
Quality Hold Rate = % lines with quality_hold_flag=true. ASN compliance = % lines with asn_sent_flag=true. OTIF = (delivery_date <= need_by_date AND ship_qty >= ordered_qty). Past Due $ = open_qty * unit_price where po_status="Open" AND need_by_date < today. Expedite Spend = freight_cost_usd where expedite_flag=true. Reschedule Rate = % lines with reschedule_count > 0.

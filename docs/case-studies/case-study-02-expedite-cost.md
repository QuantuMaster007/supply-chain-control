# Case Study 02: Expedite Spend Reduction + Lane Discipline

## Problem Statement
Expedite freight costs escalated to $1.5M/month due to reactive air shipments for EU electronics components. Lack of lane discipline caused 40% of expedites to be avoidable with better planning.

## Baseline Metrics (Q1 2025)
- OTIF: 78%
- Past Due $: $890K open
- Expedite Spend: $1.5M
- Reschedule Rate: 38%
- Quality Hold Rate: 6%

## Actions Taken
1. **Lane Discipline Policy**: Restricted air shipments to A-tier parts only; mandated ocean for standard commodities.
2. **Supplier Buffer Pools**: Pre-positioned 4-week buffers at key EU hubs for critical electronics.
3. **Forecast Accuracy**: Improved demand forecasts with 85% accuracy using historical patterns.
4. **Carrier Contracts**: Negotiated volume discounts with dedicated lanes for high-volume routes.

## Results (Q2 2025)
- OTIF: +5 pts to 83%
- Past Due $: -30% to $623K
- Expedite Spend: -45% to $825K
- Reschedule Rate: -15% to 32%
- Quality Hold Rate: -25% to 4.5%

## How Measured
Expedite Spend = freight_cost_usd where expedite_flag=true. OTIF = (delivery_date <= need_by_date AND ship_qty >= ordered_qty). Past Due $ = open_qty * unit_price where po_status="Open" AND need_by_date < today. Reschedule Rate = % lines with reschedule_count > 0. Quality Hold Rate = % lines with quality_hold_flag=true.

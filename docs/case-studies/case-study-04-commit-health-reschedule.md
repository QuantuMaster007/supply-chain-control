# Case Study 04: PPV + Quote Variance on Precision Machined Parts

## Problem Statement
High reschedule churn (52%) on machined parts from NA suppliers caused planning instability. PPV variance exceeded 15% on 30% of lines, leading to budget overruns.

## Baseline Metrics (Q1 2025)
- OTIF: 68%
- Past Due $: $1.5M open
- Expedite Spend: $720K
- Reschedule Rate: 52%
- Quality Hold Rate: 7%

## Actions Taken
1. **PPV Should-Cost Analysis**: Implemented quarterly quote reviews with engineering cost breakdowns.
2. **Supplier Scorecard**: Monthly performance reviews with reschedule penalties in contracts.
3. **Buffer Pools**: Maintained 6-week inventory buffers for high-churn parts.
4. **Forecast Sharing**: Provided 12-month demand forecasts to stabilize supplier capacity planning.

## Results (Q2 2025)
- OTIF: +10 pts to 78%
- Past Due $: -40% to $900K
- Expedite Spend: -25% to $540K
- Reschedule Rate: -30% to 36%
- Quality Hold Rate: -30% to 5%

## How Measured
Reschedule Rate = % lines with reschedule_count > 0. OTIF = (delivery_date <= need_by_date AND ship_qty >= ordered_qty). Past Due $ = open_qty * unit_price where po_status="Open" AND need_by_date < today. Expedite Spend = freight_cost_usd where expedite_flag=true. Quality Hold Rate = % lines with quality_hold_flag=true.

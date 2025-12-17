# KPI Glossary (Semiconductor-grade definitions)

## Delivery / Supplier
**OTIF (On Time In Full)**  
- On Time: delivery_date <= need_by_date  
- In Full: delivered_qty >= required_qty (or ship_qty >= scheduled_qty if partials allowed)  
OTIF % = count(OTIF true) / count(total eligible lines)

**Past Due $**  
Past Due $ = SUM(open_qty * unit_price) where need_by_date < TODAY and open_qty > 0

**Commit Slip (days)**  
Commit Slip = delivery_date - supplier_promise_date  
(Use last_confirmed_date if your system treats that as the current commit)

**Reschedule Churn**  
Reschedule Churn = AVG(reschedule_count) and % of lines with reschedule_count > 0

**Lead Time (Actual)**  
Lead Time = delivery_date - order_date (days)

## Logistics
**Expedite Rate**  
Expedite Rate = SUM(ship_qty where expedite_flag) / SUM(ship_qty)

**Expedite Spend**  
Expedite Spend = SUM(freight_cost_usd where expedite_flag)

**Carrier On-Time**  
Carrier On-Time % = % shipments where delivery_date <= eta_date

**Dock-to-Stock (optional)**  
Dock-to-Stock = receipt_timestamp - delivery_timestamp

## Readiness / Risk (if snapshots available)
**Days of Supply (DOS)**  
DOS = on_hand_qty / avg_daily_usage

**Shortage Risk Flag**  
Shortage Risk = DOS < threshold (e.g., 7 days) OR any past-due critical (Tier-A) open lines exist

## Quality
**Quality Hold Rate**  
% of receipts/lines with quality_hold_flag = true

**NCR Cycle Time**  
NCR Cycle Time = close_date - event_date

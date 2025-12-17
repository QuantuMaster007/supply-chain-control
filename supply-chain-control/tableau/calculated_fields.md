# Tableau Calculated Fields (copy/paste)

## Dates
[Today] = TODAY()

## PO eligibility
[Is Open Line] =
IF [po_status] = "Open" AND [cancel_flag] = FALSE THEN TRUE ELSE FALSE END

[Is Past Due] =
IF [Is Open Line] AND [need_by_date] < [Today] AND [open_qty] > 0 THEN TRUE ELSE FALSE END

[Past Due $] =
IF [Is Past Due] THEN [open_qty] * [unit_price] ELSE 0 END

## Commit health
[Commit Slip Days] =
DATEDIFF('day', [supplier_promise_date], [delivery_date])

[Confirm Slip Days] =
DATEDIFF('day', [last_confirmed_date], [delivery_date])

[Reschedule Flag] = IF [reschedule_count] > 0 THEN TRUE ELSE FALSE END

## OTIF (shipment-based; adapt if you compute at PO-line level)
[On Time] = IF [delivery_date] <= [need_by_date] THEN TRUE ELSE FALSE END
[In Full] = IF [ship_qty] >= [ordered_qty] THEN TRUE ELSE FALSE END
[OTIF Flag] = IF [On Time] AND [In Full] THEN TRUE ELSE FALSE END
[OTIF %] = SUM(IIF([OTIF Flag], 1, 0)) / SUM(1)

## Lead times
[Lead Time Days] = DATEDIFF('day', [order_date], [delivery_date])

## Expedite
[Expedite Spend] = IF [expedite_flag] THEN [freight_cost_usd] ELSE 0 END
[Expedite Rate] = SUM(IIF([expedite_flag], [ship_qty], 0)) / SUM([ship_qty])

## Quality (optional)
[Quality Hold Rate] = AVG(IIF([quality_hold_flag], 1, 0))

## Inventory risk (optional)
[DOS] = IFNULL([days_of_supply], 0)
[Shortage Risk] = IF [DOS] < 7 OR [Is Past Due] THEN TRUE ELSE FALSE END

# Data Dictionary (Semiconductor PO / Shipment / Readiness)

This dataset is designed for semiconductor manufacturing supply chain reporting:
**supplier performance, commit health, inbound logistics, shortages, and readiness gates**.

## 1) fact_po_lines (PO lines)
| Column | Type | Example | Definition |
|---|---|---:|---|
| po_line_id | string | PO104233-20 | Unique identifier for a PO line (PO + line) |
| po_id | string | PO104233 | Purchase order number |
| po_line_num | int | 20 | PO line number |
| buyer | string | Planner_A | Buyer / planner owner |
| supplier_id | string | SUP-0142 | Supplier unique ID |
| supplier_name | string | Precision Dynamics | Supplier name |
| supplier_region | string | APAC | NA/EU/APAC |
| part_id | string | P-88921 | Internal part number |
| part_description | string | Chamber Liner, Al | Part description |
| commodity | string | Machined Parts | Commodity grouping |
| criticality_tier | string | A | A=critical path, B=high, C=standard |
| program_id | string | CVD-X | Tool family / product line |
| build_phase | string | DVT | EVT/DVT/PVT/Ramp/Sustaining |
| ship_to_site_id | string | SITE-CA1 | Receiving site |
| ship_to_site_name | string | Sunnyvale Factory | Receiving site name |
| incoterms | string | FCA | Shipping terms |
| currency | string | USD | Transaction currency |
| unit_price | number | 1250.00 | Unit price at order time |
| price_uom | string | EA | Unit of measure |
| ordered_qty | number | 8 | Ordered quantity |
| open_qty | number | 3 | Remaining open qty |
| order_date | date | 2025-01-06 | PO creation date |
| need_by_date | date | 2025-02-15 | Date required at dock/kitting |
| supplier_promise_date | date | 2025-02-10 | Supplier promised ship-ready date |
| last_confirmed_date | date | 2025-02-12 | Latest supplier commit date |
| reschedule_count | int | 3 | Number of commit changes |
| cancel_flag | bool | false | Whether line canceled |
| received_qty | number | 5 | Total received qty to date |
| receipt_date_last | date | 2025-02-18 | Last receipt date for this line |
| po_status | string | Open | Open/Closed/Cancelled |
| quality_hold_flag | bool | false | Receipt blocked (IQC/NCR) |
| ncr_count | int | 0 | NCR/quality events tied to this part/supplier (optional) |

## 2) fact_shipments (Shipments)
| Column | Type | Example | Definition |
|---|---|---:|---|
| shipment_line_id | string | SHP7781-001 | Unique shipment line |
| shipment_id | string | SHP7781 | Shipment / BOL reference |
| po_line_id | string | PO104233-20 | Link back to PO line |
| supplier_id | string | SUP-0142 | Supplier ID |
| part_id | string | P-88921 | Part ID shipped |
| ship_qty | number | 2 | Quantity shipped |
| ship_date | date | 2025-02-11 | Actual ship date |
| eta_date | date | 2025-02-14 | Estimated arrival |
| delivery_date | date | 2025-02-16 | Actual delivery date |
| origin_site_id | string | SUP-SZ | Origin |
| destination_site_id | string | SITE-CA1 | Destination |
| carrier_id | string | CARR-03 | Carrier ID |
| carrier_name | string | DHL | Carrier name |
| mode | string | Air | Air/Ocean/Ground/Courier |
| lane | string | CN→CA | Lane name |
| freight_cost_usd | number | 4200 | Freight cost normalized to USD |
| expedite_flag | bool | true | Expedite indicator |
| delay_reason_code | string | CUST | Customs/Capacity/Docs/Weather |
| delay_reason_detail | string | Customs exam | Detail |
| asn_sent_flag | bool | true | ASN sent before arrival |
| asn_sent_date | date | 2025-02-10 | ASN timestamp |
| received_in_full_flag | bool | true | Delivered qty equals ship qty |
| damage_flag | bool | false | Damaged in transit |

## 3) fact_inventory_snapshot (Optional)
| Column | Type | Example | Definition |
|---|---|---:|---|
| inv_snapshot_id | string | INV-2025-02-01-SITECA1-P88921 | Unique snapshot row |
| snapshot_date | date | 2025-02-01 | Snapshot date |
| site_id | string | SITE-CA1 | Site |
| part_id | string | P-88921 | Part |
| on_hand_qty | number | 1 | On-hand inventory |
| on_order_qty | number | 6 | Open PO qty |
| allocated_qty | number | 1 | Allocated/reserved |
| safety_stock_qty | number | 1 | Safety stock policy |
| avg_daily_usage | number | 0.2 | Usage rate (kitting/build) |
| days_of_supply | number | 5.0 | On hand / avg daily usage |
| inventory_value_usd | number | 1250 | Value |
| shortage_risk_flag | bool | true | DOS below threshold OR past due exists |
| kit_ready_flag | bool | false | Kitting readiness (optional) |

## 4) fact_quality_events (Optional)
| Column | Type | Example | Definition |
|---|---|---:|---|
| quality_event_id | string | NCR-2025-00019 | Unique quality record |
| event_type | string | NCR | NCR/Deviation/IQC Hold |
| supplier_id | string | SUP-0142 | Supplier |
| part_id | string | P-88921 | Part |
| site_id | string | SITE-CA1 | Site |
| event_date | date | 2025-02-17 | Created date |
| close_date | date | 2025-03-02 | Closed date |
| severity | string | Major | Minor/Major/Critical |
| disposition | string | Use-As-Is | Scrap/Rework/Return/Use-As-Is |
| qty_affected | number | 1 | Quantity impacted |
| cost_impact_usd | number | 980 | Estimated cost impact |
| downtime_minutes | number | 120 | Production impact (optional) |

## 5) Minimal dimensions
### dim_supplier
supplier_id, supplier_name, supplier_region, supplier_country, supplier_risk_tier, preferred_flag

### dim_part
part_id, part_description, commodity, criticality_tier, lifecycle_status, make_buy, lead_time_days_std

### dim_site
site_id, site_name, site_type (Factory/DC/Supplier), city, state, country

### dim_carrier
carrier_id, carrier_name, carrier_type, scac (optional)

### dim_program
program_id, program_name, build_phase_default, product_line

### dim_calendar
date, week, month, quarter, year, fiscal_month (optional)

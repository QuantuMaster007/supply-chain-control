# Star Schema (Tableau Relationships)

## Facts
### fact_po_lines (grain = PO line)
Primary key: po_line_id

Relationships:
- dim_supplier on supplier_id
- dim_part on part_id
- dim_site on ship_to_site_id
- dim_program on program_id
- dim_calendar on order_date_key / promise_date_key / need_by_date_key

### fact_shipments (grain = shipment line or leg)
Primary key: shipment_line_id

Relationships:
- fact_po_lines on po_line_id (recommended) OR on po_id + po_line_num + part_id
- dim_carrier on carrier_id
- dim_site on origin_site_id / destination_site_id
- dim_calendar on ship_date_key / delivery_date_key

### fact_inventory_snapshot (optional, grain = part_id × site_id × snapshot_date)
Primary key: inv_snapshot_id

Relationships:
- dim_part on part_id
- dim_site on site_id
- dim_calendar on snapshot_date_key

### fact_quality_events (optional, grain = quality event)
Primary key: quality_event_id

Relationships:
- dim_supplier on supplier_id
- dim_part on part_id
- dim_site on site_id
- dim_calendar on event_date_key / close_date_key

## Dimensions (minimum)
- dim_supplier (supplier_id)
- dim_part (part_id)
- dim_site (site_id)
- dim_carrier (carrier_id)
- dim_program (program_id)  # tool family / product line / build phase
- dim_calendar (date_key)
- dim_commodity (commodity_id) (optional)

# AI Coding Agent Instructions for supply-chain-control

## Project Overview
This is a supply chain analytics portfolio for semiconductor manufacturing, featuring data processing, an HTML dashboard, and Tableau workbooks. The core is generating and analyzing KPIs like OTIF (On-Time In-Full), past due orders, expedite costs, and shortage risks.

## Architecture & Data Flow
- **Data Sources**: Raw CSVs in `data/raw/` (po_lines.csv, shipments.csv, etc.) are processed into `data/processed/fact_supply_chain_flat.csv` using the Python script embedded in `docs/index.html`.
- **Schema**: Supports star schema (facts + dims in `data/schema/schema_star.md`) for enterprise use or flat extract for Tableau Public.
- **Dashboard**: Static HTML/JS in `docs/` (GitHub Pages friendly), loads CSV via `docs/assets/app.js`. Run `python3 -m http.server 8000 --directory docs` for local preview.
- **Tableau**: Calculated fields in `tableau/calculated_fields.md` for advanced visualizations.

## Key Patterns & Conventions
- **KPIs**: OTIF = (on-time AND in-full); Past Due $ = open_qty * unit_price where need_by_date < today; Expedite Spend = freight_cost_usd where expedite_flag=true.
- **Date Handling**: Use ISO dates (YYYY-MM-DD); compute week buckets with Monday start (see `docs/assets/app.js` weekKey function).
- **Filtering**: Always filter for open lines ([po_status]="Open" AND [cancel_flag]=FALSE) before computing past due or risks.
- **Criticality Tiers**: A=critical path, B=high, C=standard; prioritize Tier-A parts in shortage analysis.
- **Data Generation**: When updating sample data, modify the Python script in `docs/index.html` (rows=1350, random.seed(7) for reproducibility).

## Developer Workflows
- **Generate Dashboard**: Run the shell script in `docs/index.html` to create HTML and CSV: `bash docs/index.html` (it's a self-executing script).
- **Add Case Study**: Create markdown in `docs/case-studies/`, add image to `docs/images/`, update README.md links.
- **Update KPIs**: Modify calculations in `docs/assets/app.js` for HTML dashboard or `tableau/calculated_fields.md` for Tableau.
- **GitHub Pages**: Commit changes to main; docs/ is the site root.

## Integration Points
- **Tableau Public**: Connect to flat CSV, use Relationships for joins.
- **External Data**: Append to raw CSVs, re-run processing script.
- **No APIs/Deps**: Pure static site; no builds, tests, or external services.

Reference: `README.md` for quick start, `data/schema/data_dictionary.md` for column definitions.</content>
<parameter name="filePath">/workspaces/supply-chain-control/.github/copilot-instructions.md
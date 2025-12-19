# supply-chain-control 🚚⚡📦
A Tableau Public dashboard + case-study portfolio that mirrors **semiconductor-grade supply chain governance**—spanning supplier performance, PO/commit health, inbound logistics, shortages, and factory readiness for complex tool/module manufacturing.

<p align="left">
  <a href="#"><b>🔗 Tableau Public Dashboard (add link)</b></a>
  &nbsp;•&nbsp;
  <a href="docs/kpi_glossary.md"><b>📘 KPI Glossary</b></a>
  &nbsp;•&nbsp;
  <a href="data/schema/data_dictionary.md"><b>🗂️ Dataset Schema</b></a>
  &nbsp;•&nbsp;
  <a href="docs/case-studies/"><b>📚 Case Studies</b></a>
</p>

---

## What this portfolio shows
**Semiconductor-style operating rigor** for hardware manufacturing supply chains:
- **OTIF / Past Due / Commit health** by supplier, commodity, site
- **Lead time drift** and reschedule churn (commit volatility)
- **Inbound logistics performance** (mode, carrier, lane, expedite burn)
- **Shortage early-warning** (time-phased supply vs build demand)
- **Quality holds + NCR impact** on delivery and readiness
- **Factory readiness gating** (kitting, dock-to-stock, critical path parts)

---

## Dashboard overview (Tableau Public)
Add your screenshots in `docs/images/` and keep these paths unchanged:

**Dashboard Preview**
![Dashboard Preview](docs/images/dashboard_preview.png)

**Supplier Heatmap Example**
![Supplier Heatmap](docs/images/heatmap_example.png)

**Pareto / Treemap Example**
![Treemap Example](docs/images/treemap_example.png)

---

## Data model
Use either:
1) **Star schema** (enterprise style): facts + dims, documented in `data/schema/schema_star.md`
2) **Flat extract** (easiest for Tableau Public): `data/processed/fact_supply_chain_flat.csv`

---

## Case Studies (realistic stories + KPIs)
1. **OTIF Recovery for Long-Lead Subsystems (Chambers & RF)**  
   `docs/case-studies/case-study-01-otif-recovery.md`  
   ![Case 01](docs/images/case01.png)

2. **Expedite Spend Reduction + Lane Discipline**  
   `docs/case-studies/case-study-02-expedite-cost.md`  
   ![Case 02](docs/images/case02.png)

3. **Shortage Early-Warning for Build Readiness (Next 6 Weeks)**  
   `docs/case-studies/case-study-03-shortage-early-warning.md`  
   ![Case 03](docs/images/case03.png)

4. **PPV + Quote Variance on Precision Machined Parts**  
   `docs/case-studies/case-study-04-commit-health-reschedule.md`  
   ![Case 04](docs/images/case04.png)

5. **Line-Down Prevention via ASN + Dock-to-Stock + Kitting**  
   `docs/case-studies/case-study-05-quality-hold-recovery.md`  
   ![Case 05](docs/images/case05.png)

---

## Quick start
1. Drop CSVs into:
   - `data/raw/po_lines.csv`
   - `data/raw/shipments.csv`
   - (optional) `data/raw/inventory_snapshot.csv`
   - (optional) `data/raw/quality_events.csv`

2. In Tableau Public:
   - Connect to CSV(s)
   - Use **Relationships** (recommended) OR connect to the flat extract
   - Recreate sheets using `tableau/calculated_fields.md`

3. Publish to Tableau Public and paste your link above.

---

## Suggested dashboard pages (Tableau)
**Page 1 — Executive Control Tower**
- KPI tiles: OTIF, Past Due $, Commit Slip, Expedite $, Shortage Risk, Quality Holds
- Trend: OTIF + Past Due by week
- Heatmap: Supplier × Site (late-risk density)
- Filters: Program/Tool Family, Site, Commodity, Supplier, Month

**Page 2 — Supplier Performance**
- Supplier scorecard table (OTIF, slip, churn, PPM, holds)
- Pareto of late $ / late qty
- Part-level hotlist

**Page 3 — Inbound Logistics**
- Expedite $ trend + mode share
- Lane/carrier on-time + delay reasons
- Dock-to-stock and ASN compliance (if available)

**Page 4 — Readiness & Shortage Risk**
- Next 6-week coverage and risk flags
- Critical-path parts (Tier-A) list with owners and ETAs

---

## License
MIT (see `LICENSE`)

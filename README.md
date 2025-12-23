# supply-chain-control 🚚⚡📦
**Power BI Supply Chain Control Tower** — semiconductor-style governance for supplier performance, commit health, inbound logistics, shortages, and factory readiness.

<p align="left">
  <a href="#"><b>🔗 Open Power BI Report (add link)</b></a>
  &nbsp;•&nbsp;
  <a href="powerbi/supply_chain_dashboard.pbix"><b>📊 Download PBIX</b></a>
  &nbsp;•&nbsp;
  <a href="docs/kpi_glossary.md"><b>📘 KPI Glossary</b></a>
  &nbsp;•&nbsp;
  <a href="data/schema/data_dictionary.md"><b>🗂️ Dataset Schema</b></a>
  &nbsp;•&nbsp;
  <a href="docs/case-studies/"><b>📚 Case Studies</b></a>
</p>

<!-- Optional badges (uncomment if you like)
![Power BI](https://img.shields.io/badge/Power%20BI-Report-yellow)
![Status](https://img.shields.io/badge/Portfolio-Ready-brightgreen)
-->

---

## ✨ What this repo is
This project turns daily supply noise (PO lines, commits, shipments, holds) into **decision-ready signals**:

- **Power BI Control Tower:** executive KPIs + trends + drilldowns (supplier/site/commodity/part)
- **Supply chain governance stories:** realistic case studies with KPIs, root cause, and recovery actions
- **Clean data model:** star schema option + flat extract option for quick demos

> **Use it for:** weekly ops reviews (WBR), shortage war-room, supplier QBRs, and exec-ready readouts.

---

## 🖥️ Power BI Control Tower
**Report file:**  
👉 `powerbi/supply_chain_dashboard.pbix`

**What you can do**
- Slice by **Supplier / Commodity / Site / Program / Month**
- Identify **late-risk density** (heatmap) and top late drivers (pareto/treemap)
- Track **commit volatility** (reschedules, slip) and its impact on OTIF
- Monitor **expedite burn** by lane/mode/carrier (if available)
- Drill into a **part-level hotlist** with owners/ETAs (recommended)

### Screenshots here
Add your screenshots in `docs/images/` (keep these paths unchanged):

![Dashboard Preview](docs/images/dashboard_preview.png)
![Supplier Heatmap](docs/images/heatmap_example.png)
![Treemap Example](docs/images/treemap_example.png)

---

## 🔎 Key Findings (sample KPIs)
> Example KPI targets / placeholders you can replace after refresh.

- **OTIF %:** 13.7%  
- **Past Due $:** $9,365,982  
- **Expedite Spend:** $1,611,166  
- **Avg Commit Slip:** 12.6 days  
- **Reschedule Rate:** 66.7%  
- **Quality Hold Rate:** 8.8%  

**Where to look first**
- Supplier × Site heatmap to find concentrated late-risk
- Pareto of **Late $** to isolate the top drivers
- Commit volatility trend to spot chronic schedule churn

---

## 🧩 How it works (data → model → insights → actions)
1. **Input data (CSV):** raw extracts under `data/raw/`
2. **Model:** relationships (dims → facts), date table, KPI measures
3. **Report:** exec summary page + drilldown pages
4. **Output:** decisions + recovery actions (case studies + owners + timelines)

---

## 📂 Repo Structure
supply-chain-control/
├─ powerbi/
│ └─ supply_chain_dashboard.pbix
├─ data/
│ ├─ raw/
│ │ ├─ po_lines.csv
│ │ ├─ shipments.csv
│ │ ├─ inventory_snapshot.csv # optional
│ │ └─ quality_events.csv # optional
│ ├─ processed/
│ │ └─ fact_supply_chain_flat.csv # optional fast path
│ └─ schema/
│ ├─ data_dictionary.md
│ └─ schema_star.md
├─ docs/
│ ├─ kpi_glossary.md
│ ├─ case-studies/
│ └─ images/
└─ LICENSE


---

## 🚀 Getting Started

### Option A — Open the PBIX (fastest)
1. Open: `powerbi/supply_chain_dashboard.pbix`
2. Click **Refresh**
3. Validate visuals + KPI totals

### Option B — Point Power Query to your CSVs
1. Put CSVs into `data/raw/`
2. In Power BI Desktop: **Transform data**
3. Update file paths / parameters to your `data/raw/` files
4. **Close & Apply** → **Refresh**

### Option C — Publish (optional)
1. Publish to **Power BI Service**
2. Replace the top link:
   - `🔗 Open Power BI Report (add link)` → paste your report URL

> If this repo is public, use **sanitized/demo data** only.

---

## 🧱 Data model
Use either:

1) **Star schema** (recommended): facts + dims  
   Documented in `data/schema/schema_star.md`

2) **Flat extract** (fastest demo):  
   `data/processed/fact_supply_chain_flat.csv`

---

## 📚 Case Studies (realistic stories + KPIs)
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

## 📑 Input Schema (minimum)
Your CSVs should support fields like:

**PO lines**
- `po_number, line_id, supplier, commodity, site, part_number, open_qty, unit_price, need_by_date, promise_date, reschedule_count`

**Shipments**
- `shipment_id, carrier, mode, lane, ship_date, delivery_date, expedite_flag, freight_cost`

**Inventory snapshot (optional)**
- `part_number, site, on_hand_qty, safety_stock, snapshot_date`

**Quality events (optional)**
- `part_number, supplier, quality_hold_flag, ncr_id, event_date, disposition`

See: `data/schema/data_dictionary.md`

---

## 🗺️ Roadmap (optional)
- [ ] Add **budget vs actual** (expedite + premium freight + PPV)
- [ ] Add **risk scoring** (late $ × criticality × lead time × volatility)
- [ ] Add **“Exec Summary” export** (PDF/PNG snapshots)
- [ ] Add **owner + ETA workflow** for part hotlist (recovery tracker)

---

## 🔒 License
**Private License — View Only (All Rights Reserved)**

Permission is granted to **view** this repository for evaluation purposes only.  
No permission is granted to use, copy, modify, publish, distribute, sublicense, or sell any part of this project (including the Power BI report, datasets, documentation, and images) without explicit written permission from the author.

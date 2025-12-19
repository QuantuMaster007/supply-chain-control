/* supply-chain-control dashboard (static, GitHub Pages friendly) */
const DATA_URL = "data/processed/fact_supply_chain_flat.csv"; // relative to docs/

let RAW = [];
let FILTERED = [];

const $ = (id) => document.getElementById(id);

function parseBool(v){
  if (typeof v === "boolean") return v;
  if (!v) return false;
  const s = String(v).toLowerCase().trim();
  return s === "true" || s === "1" || s === "yes";
}

function toDate(s){
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

function iso(d){
  return d.toISOString().slice(0,10);
}

function weekKey(d){
  // ISO-like week bucket (Monday start) using UTC
  const dt = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = (dt.getUTCDay() + 6) % 7; // Mon=0
  dt.setUTCDate(dt.getUTCDate() - day);
  return iso(dt);
}

function money(n){
  const x = Number(n || 0);
  return x.toLocaleString(undefined, {style:"currency", currency:"USD", maximumFractionDigits:0});
}

function pct(n){
  const x = Number(n || 0);
  return (x*100).toFixed(1) + "%";
}

function num(n, digits=1){
  const x = Number(n || 0);
  return x.toLocaleString(undefined, {maximumFractionDigits:digits});
}

function computeDerived(r){
  const need = toDate(r.need_by_date);
  const delivery = toDate(r.delivery_date);
  const promise = toDate(r.supplier_promise_date);
  const today = new Date();
  today.setHours(0,0,0,0);

  r.isOpen = r.po_status === "Open" && !parseBool(r.cancel_flag);
  r.isPastDue = r.isOpen && need && need < today && Number(r.open_qty) > 0;
  r.pastDue$ = r.isPastDue ? Number(r.open_qty) * Number(r.unit_price) : 0;
  r.otif = (delivery && need && delivery <= need) && (Number(r.ship_qty) >= Number(r.ordered_qty));
  r.commitSlip = delivery && promise ? (delivery - promise) / (1000*60*60*24) : null;
  r.hasReschedule = Number(r.reschedule_count) > 0;
  r.expediteSpend = parseBool(r.expedite_flag) ? Number(r.freight_cost_usd) : 0;
  r.isLate = delivery && need && delivery > need;
  r.week = need ? weekKey(need) : null;
}

function loadData(){
  Papa.parse(DATA_URL, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      RAW = results.data.map(r => {
        computeDerived(r);
        return r;
      });
      populateFilters();
      applyFilters();
    },
    error: (err) => console.error("CSV load error:", err)
  });
}

function populateFilters(){
  const programs = [...new Set(RAW.map(r => r.program_id).filter(Boolean))].sort();
  const commodities = [...new Set(RAW.map(r => r.commodity).filter(Boolean))].sort();
  const sites = [...new Set(RAW.map(r => r.ship_to_site_id).filter(Boolean))].sort();
  const suppliers = [...new Set(RAW.map(r => r.supplier_name).filter(Boolean))].sort();

  const addOptions = (sel, opts) => {
    sel.innerHTML = '<option value="">All ' + sel.id.replace('Filter','') + 's</option>';
    opts.forEach(o => sel.innerHTML += `<option value="${o}">${o}</option>`);
  };
  addOptions($('programFilter'), programs);
  addOptions($('commodityFilter'), commodities);
  addOptions($('siteFilter'), sites);
  addOptions($('supplierFilter'), suppliers);
}

function applyFilters(){
  const prog = $('programFilter').value;
  const comm = $('commodityFilter').value;
  const site = $('siteFilter').value;
  const supp = $('supplierFilter').value;
  const start = $('startDate').value ? new Date($('startDate').value) : null;
  const end = $('endDate').value ? new Date($('endDate').value) : null;

  FILTERED = RAW.filter(r => {
    if (prog && r.program_id !== prog) return false;
    if (comm && r.commodity !== comm) return false;
    if (site && r.ship_to_site_id !== site) return false;
    if (supp && r.supplier_name !== supp) return false;
    if (start && r.need_by_date && new Date(r.need_by_date) < start) return false;
    if (end && r.need_by_date && new Date(r.need_by_date) > end) return false;
    return true;
  });

  renderKPIs();
  renderCharts();
  renderTable();
}

function renderKPIs(){
  const data = FILTERED;
  const total = data.length;
  if (!total) return;

  const otifCount = data.filter(r => r.otif).length;
  const pastDue$ = data.reduce((s,r) => s + r.pastDue$, 0);
  const expedite$ = data.reduce((s,r) => s + r.expediteSpend, 0);
  const slips = data.map(r => r.commitSlip).filter(x => x !== null);
  const avgSlip = slips.length ? slips.reduce((s,x)=>s+x,0)/slips.length : 0;
  const reschedRate = data.filter(r => r.hasReschedule).length / total;
  const holdRate = data.filter(r => parseBool(r.quality_hold_flag)).length / total;

  $('kOtif').textContent = pct(otifCount / total);
  $('kPastDue').textContent = money(pastDue$);
  $('kExpedite').textContent = money(expedite$);
  $('kSlip').textContent = num(avgSlip, 1) + " days";
  $('kChurn').textContent = pct(reschedRate);
  $('kHold').textContent = pct(holdRate);
}

function renderCharts(){
  const data = FILTERED;

  // Trend: weekly OTIF, past due, expedite
  const weeks = {};
  data.forEach(r => {
    if (!r.week) return;
    if (!weeks[r.week]) weeks[r.week] = {otif:0, total:0, pastDue:0, expedite:0};
    weeks[r.week].total++;
    if (r.otif) weeks[r.week].otif++;
    weeks[r.week].pastDue += r.pastDue$;
    weeks[r.week].expedite += r.expediteSpend;
  });
  const weekKeys = Object.keys(weeks).sort();
  const otifPct = weekKeys.map(w => weeks[w].otif / weeks[w].total * 100);
  const pastDue$ = weekKeys.map(w => weeks[w].pastDue);
  const expedite$ = weekKeys.map(w => weeks[w].expedite);

  Plotly.newPlot('trend', [
    {x: weekKeys, y: otifPct, name: 'OTIF %', type: 'scatter', mode: 'lines+markers', yaxis: 'y1'},
    {x: weekKeys, y: pastDue$, name: 'Past Due $', type: 'bar', yaxis: 'y2'},
    {x: weekKeys, y: expedite$, name: 'Expedite $', type: 'bar', yaxis: 'y2'}
  ], {
    margin: {t:20, r:20, b:40, l:40},
    yaxis: {title: 'OTIF %'},
    yaxis2: {title: '$', overlaying: 'y', side: 'right'},
    showlegend: true
  });

  // Pareto: top suppliers by past due $
  const suppPastDue = {};
  data.forEach(r => {
    if (!suppPastDue[r.supplier_name]) suppPastDue[r.supplier_name] = 0;
    suppPastDue[r.supplier_name] += r.pastDue$;
  });
  const sortedSupps = Object.entries(suppPastDue).sort((a,b)=>b[1]-a[1]).slice(0,10);
  const suppNames = sortedSupps.map(x=>x[0]);
  const suppValues = sortedSupps.map(x=>x[1]);

  Plotly.newPlot('pareto', [{
    x: suppNames, y: suppValues, type: 'bar', marker: {color: 'rgba(255,107,107,0.7)'}
  }], {margin: {t:20, r:20, b:60, l:40}});

  // Heatmap: supplier x site late counts
  const heatmap = {};
  data.forEach(r => {
    if (!r.isLate) return;
    const s = r.supplier_name;
    const site = r.ship_to_site_id;
    if (!heatmap[s]) heatmap[s] = {};
    if (!heatmap[s][site]) heatmap[s][site] = 0;
    heatmap[s][site]++;
  });
  const supps = Object.keys(heatmap);
  const sites = [...new Set(data.map(r=>r.ship_to_site_id))].sort();
  const z = supps.map(s => sites.map(site => heatmap[s][site] || 0));

  Plotly.newPlot('heatmap', [{
    z: z, x: sites, y: supps, type: 'heatmap', colorscale: 'Reds'
  }], {margin: {t:20, r:20, b:40, l:100}});

  // Logistics: freight spend by mode
  const modeSpend = {};
  data.forEach(r => {
    if (!modeSpend[r.mode]) modeSpend[r.mode] = 0;
    modeSpend[r.mode] += Number(r.freight_cost_usd);
  });
  const modes = Object.keys(modeSpend);
  const spends = modes.map(m => modeSpend[m]);

  Plotly.newPlot('logistics', [{
    labels: modes, values: spends, type: 'pie'
  }], {margin: {t:20, r:20, b:20, l:20}});
}

function renderTable(){
  const topRisk = FILTERED.filter(r => r.pastDue$ > 0).sort((a,b)=>b.pastDue$ - a.pastDue$).slice(0,40);
  const tbody = $('tbody');
  tbody.innerHTML = topRisk.map(r => `
    <tr>
      <td>${r.po_line_id}</td>
      <td>${r.program_id}</td>
      <td>${r.build_phase}</td>
      <td>${r.supplier_name}</td>
      <td>${r.commodity}</td>
      <td>${r.criticality_tier}</td>
      <td>${r.ship_to_site_id}</td>
      <td>${r.need_by_date}</td>
      <td>${r.delivery_date}</td>
      <td>${money(r.pastDue$)}</td>
      <td>${r.reschedule_count}</td>
      <td>${parseBool(r.expedite_flag) ? 'Yes' : ''}</td>
      <td>${parseBool(r.quality_hold_flag) ? 'Yes' : ''}</td>
      <td>${r.delay_reason_code}</td>
    </tr>
  `).join('');
}

$('resetBtn').addEventListener('click', () => {
  $('programFilter').value = '';
  $('commodityFilter').value = '';
  $('siteFilter').value = '';
  $('supplierFilter').value = '';
  $('startDate').value = '';
  $('endDate').value = '';
  applyFilters();
});

$('exportBtn').addEventListener('click', () => {
  const csv = Papa.unparse(FILTERED);
  const blob = new Blob([csv], {type: 'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'filtered_supply_chain.csv';
  a.click();
  URL.revokeObjectURL(url);
});

['programFilter','commodityFilter','siteFilter','supplierFilter','startDate','endDate'].forEach(id => {
  $(id).addEventListener('change', applyFilters);
});

loadData();

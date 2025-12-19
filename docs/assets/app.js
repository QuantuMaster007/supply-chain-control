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
  const delv = toDate(r.delivery_date);
  const ord = Number(r.ordered_qty || 0);
  const ship = Number(r.ship_qty || 0);
  const open = Number(r.open_qty || 0);
  const price = Number(r.unit_price || 0);
  const promise = toDate(r.supplier_promise_date);
  const lastconf = toDate(r.last_confirmed_date);

  const isOpen = String(r.po_status || "").toLowerCase() === "open" && !parseBool(r.cancel_flag);
  const isPastDue = isOpen && need && need < new Date() && open > 0;
  const pastDue$ = isPastDue ? open * price : 0;

  const onTime = (need && delv) ? (delv <= need) : null;
  const inFull = (ord > 0) ? (ship >= ord) : null;
  const otif = (onTime === null || inFull === null) ? null : (onTime && inFull);

  const commitSlip = (promise && delv) ? ( (delv - promise) / (1000*3600*24) ) : null;
  const confirmSlip = (lastconf && delv) ? ( (delv - lastconf) / (1000*3600*24) ) : null;

  return {
    ...r,
    _need: need,
    _delv: delv,
    _week: need ? weekKey(need) : (delv ? weekKey(delv) : null),
    _isOpen: isOpen,
    _isPastDue: isPastDue,
    _pastDue$: pastDue$,
    _otif: otif,
    _commitSlip: commitSlip,
    _confirmSlip: confirmSlip,
    _expedite$: parseBool(r.expedite_flag) ? Number(r.freight_cost_usd || 0) : 0,
    _qhold: parseBool(r.quality_hold_flag)
  };
}

function uniq(arr){
  return Array.from(new Set(arr.filter(v => v !== undefined && v !== null && String(v).trim() !== ""))).sort();
}

function fillSelect(sel, items, includeAll=true){
  sel.innerHTML = "";
  if (includeAll){
    const opt = document.createElement("option");
    opt.value = "__ALL__";
    opt.textContent = "All";
    sel.appendChild(opt);
  }
  for (const it of items){
    const opt = document.createElement("option");
    opt.value = it;
    opt.textContent = it;
    sel.appendChild(opt);
  }
  sel.value = "__ALL__";
}

function getSelValue(sel){
  return sel.value;
}

function applyFilters(){
  const program = getSelValue($("fProgram"));
  const commodity = getSelValue($("fCommodity"));
  const site = getSelValue($("fSite"));
  const supplier = getSelValue($("fSupplier"));
  const start = $("fStart").value ? new Date($("fStart").value) : null;
  const end = $("fEnd").value ? new Date($("fEnd").value) : null;

  FILTERED = RAW.filter(r => {
    if (program !== "__ALL__" && r.program_id !== program) return false;
    if (commodity !== "__ALL__" && r.commodity !== commodity) return false;
    if (site !== "__ALL__" && r.ship_to_site_id !== site) return false;
    if (supplier !== "__ALL__" && r.supplier_name !== supplier) return false;

    // filter by need-by date if present
    if (start && r._need && r._need < start) return false;
    if (end && r._need && r._need > end) return false;

    return true;
  });

  renderAll();
}

function aggByWeek(rows){
  const map = new Map();
  for (const r of rows){
    if (!r._week) continue;
    if (!map.has(r._week)){
      map.set(r._week, {week:r._week, total:0, otifKnown:0, otifGood:0, pastDue:0, expedite:0});
    }
    const a = map.get(r._week);
    a.total += 1;
    if (r._otif !== null){
      a.otifKnown += 1;
      if (r._otif) a.otifGood += 1;
    }
    a.pastDue += r._pastDue$ || 0;
    a.expedite += r._expedite$ || 0;
  }
  const out = Array.from(map.values()).sort((a,b)=>a.week.localeCompare(b.week));
  for (const a of out){
    a.otif = a.otifKnown ? (a.otifGood/a.otifKnown) : null;
  }
  return out;
}

function aggTop(rows, keyFn, valFn, n=10){
  const map = new Map();
  for (const r of rows){
    const k = keyFn(r);
    if (!k) continue;
    map.set(k, (map.get(k)||0) + (valFn(r)||0));
  }
  return Array.from(map.entries())
    .map(([k,v]) => ({k, v}))
    .sort((a,b)=>b.v - a.v)
    .slice(0,n);
}

function kpi(rows){
  const otifKnown = rows.filter(r=>r._otif!==null);
  const otif = otifKnown.length ? (otifKnown.filter(r=>r._otif).length / otifKnown.length) : null;

  const pastDue = rows.reduce((s,r)=>s+(r._pastDue$||0),0);
  const expedite = rows.reduce((s,r)=>s+(r._expedite$||0),0);

  const slips = rows.map(r=>r._commitSlip).filter(v=>v!==null && isFinite(v));
  const avgSlip = slips.length ? slips.reduce((a,b)=>a+b,0)/slips.length : null;

  const churnRate = rows.length ? (rows.filter(r=>Number(r.reschedule_count||0)>0).length / rows.length) : null;
  const qholdRate = rows.length ? (rows.filter(r=>r._qhold).length / rows.length) : null;

  const openLines = rows.filter(r=>r._isOpen).length;

  return {otif, pastDue, expedite, avgSlip, churnRate, qholdRate, openLines};
}

function renderKPIs(){
  const m = kpi(FILTERED);
  $("kOTIF").textContent = m.otif===null ? "—" : pct(m.otif);
  $("kPastDue").textContent = money(m.pastDue);
  $("kExpedite").textContent = money(m.expedite);
  $("kSlip").textContent = m.avgSlip===null ? "—" : (num(m.avgSlip,1) + " days");
  $("kChurn").textContent = m.churnRate===null ? "—" : pct(m.churnRate);
  $("kHold").textContent = m.qholdRate===null ? "—" : pct(m.qholdRate);
  $("kOpen").textContent = num(m.openLines,0);
  $("metaCount").textContent = `${FILTERED.length.toLocaleString()} rows`;
}

function renderTrend(){
  const weekly = aggByWeek(FILTERED);
  const x = weekly.map(d=>d.week);
  const y1 = weekly.map(d=>d.otif===null ? null : d.otif*100);
  const y2 = weekly.map(d=>d.pastDue);
  const y3 = weekly.map(d=>d.expedite);

  const traces = [
    {x, y:y1, type:"scatter", mode:"lines+markers", name:"OTIF %", yaxis:"y1"},
    {x, y:y2, type:"bar", name:"Past Due $", yaxis:"y2", opacity:0.55},
    {x, y:y3, type:"bar", name:"Expedite $", yaxis:"y2", opacity:0.55}
  ];

  const layout = {
    margin:{l:50,r:35,t:10,b:40},
    paper_bgcolor:"rgba(0,0,0,0)",
    plot_bgcolor:"rgba(0,0,0,0)",
    font:{color:"#e7efff"},
    legend:{orientation:"h", y:1.2},
    xaxis:{title:"Week (Need-by)", gridcolor:"rgba(255,255,255,.08)"},
    yaxis:{title:"OTIF %", rangemode:"tozero", gridcolor:"rgba(255,255,255,.08)"},
    yaxis2:{title:"$", overlaying:"y", side:"right", showgrid:false}
  };

  Plotly.newPlot("trend", traces, layout, {displayModeBar:false, responsive:true});
}

function renderPareto(){
  const top = aggTop(FILTERED, r=>r.supplier_name, r=>r._pastDue$, 12);
  const x = top.map(d=>d.k).reverse();
  const y = top.map(d=>d.v).reverse();

  const layout = {
    margin:{l:120,r:20,t:10,b:40},
    paper_bgcolor:"rgba(0,0,0,0)",
    plot_bgcolor:"rgba(0,0,0,0)",
    font:{color:"#e7efff"},
    xaxis:{title:"Past Due $", gridcolor:"rgba(255,255,255,.08)"},
    yaxis:{title:"Supplier", gridcolor:"rgba(255,255,255,.08)"}
  };

  Plotly.newPlot("pareto", [{x:y, y:x, type:"bar", orientation:"h", name:"Past Due $"}], layout, {displayModeBar:false, responsive:true});
}

function renderHeatmap(){
  // Supplier x Site: late count (delivery > need_by)
  const suppliers = uniq(FILTERED.map(r=>r.supplier_name)).slice(0,18);
  const sites = uniq(FILTERED.map(r=>r.ship_to_site_id));

  const idxS = new Map(suppliers.map((s,i)=>[s,i]));
  const idxT = new Map(sites.map((s,i)=>[s,i]));
  const z = Array.from({length: suppliers.length}, ()=>Array.from({length: sites.length}, ()=>0));

  for (const r of FILTERED){
    if (!r._need || !r._delv) continue;
    if (r._delv <= r._need) continue;
    if (!idxS.has(r.supplier_name) || !idxT.has(r.ship_to_site_id)) continue;
    z[idxS.get(r.supplier_name)][idxT.get(r.ship_to_site_id)] += 1;
  }

  const layout = {
    margin:{l:130,r:20,t:10,b:60},
    paper_bgcolor:"rgba(0,0,0,0)",
    plot_bgcolor:"rgba(0,0,0,0)",
    font:{color:"#e7efff"},
    xaxis:{title:"Site", tickangle:-25},
    yaxis:{title:"Supplier"},
  };

  Plotly.newPlot("heatmap", [{
    z, x: sites, y: suppliers, type:"heatmap",
    hoverongaps:false
  }], layout, {displayModeBar:false, responsive:true});
}

function renderLogistics(){
  const byMode = aggTop(FILTERED, r=>r.mode, r=>Number(r.freight_cost_usd||0), 10);
  const x = byMode.map(d=>d.k);
  const y = byMode.map(d=>d.v);

  const layout = {
    margin:{l:50,r:20,t:10,b:40},
    paper_bgcolor:"rgba(0,0,0,0)",
    plot_bgcolor:"rgba(0,0,0,0)",
    font:{color:"#e7efff"},
    xaxis:{title:"Mode"},
    yaxis:{title:"Freight $", gridcolor:"rgba(255,255,255,.08)"}
  };

  Plotly.newPlot("logistics", [{x, y, type:"bar", name:"Freight $"}], layout, {displayModeBar:false, responsive:true});
}

function renderTable(){
  // Top risk lines: Past due $, Tier A, high reschedule
  const rows = [...FILTERED]
    .sort((a,b)=> (b._pastDue$||0) - (a._pastDue$||0))
    .slice(0,40);

  const tbody = $("tbody");
  tbody.innerHTML = "";
  for (const r of rows){
    const tr = document.createElement("tr");
    const cells = [
      r.po_line_id, r.program_id, r.build_phase, r.supplier_name, r.commodity,
      r.criticality_tier, r.ship_to_site_id,
      r.need_by_date, r.delivery_date,
      money(r._pastDue$||0),
      r.reschedule_count,
      parseBool(r.expedite_flag) ? "Y" : "N",
      parseBool(r.quality_hold_flag) ? "Y" : "N",
      r.delay_reason_code || ""
    ];
    for (const c of cells){
      const td = document.createElement("td");
      td.textContent = c;
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
}

function renderAll(){
  renderKPIs();
  renderTrend();
  renderPareto();
  renderHeatmap();
  renderLogistics();
  renderTable();
}

async function loadCSV(){
  return new Promise((resolve, reject) => {
    Papa.parse(DATA_URL, {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (res) => resolve(res.data),
      error: (err) => reject(err)
    });
  });
}

function setDateDefaults(){
  const dates = RAW.map(r=>r._need).filter(Boolean).sort((a,b)=>a-b);
  if (!dates.length) return;
  const min = dates[0];
  const max = dates[dates.length-1];
  $("fStart").value = iso(min);
  $("fEnd").value = iso(max);
}

async function init(){
  $("status").textContent = "Loading dataset…";
  const data = await loadCSV();
  RAW = data.map(computeDerived);

  // Fill filters
  fillSelect($("fProgram"), uniq(RAW.map(r=>r.program_id)));
  fillSelect($("fCommodity"), uniq(RAW.map(r=>r.commodity)));
  fillSelect($("fSite"), uniq(RAW.map(r=>r.ship_to_site_id)));
  fillSelect($("fSupplier"), uniq(RAW.map(r=>r.supplier_name)));

  setDateDefaults();
  FILTERED = RAW;

  // Events
  ["fProgram","fCommodity","fSite","fSupplier","fStart","fEnd"].forEach(id=>{
    $(id).addEventListener("change", applyFilters);
  });
  $("btnReset").addEventListener("click", ()=>{
    $("fProgram").value="__ALL__";
    $("fCommodity").value="__ALL__";
    $("fSite").value="__ALL__";
    $("fSupplier").value="__ALL__";
    setDateDefaults();
    applyFilters();
  });

  $("btnExport").addEventListener("click", ()=>{
    const cols = Object.keys(FILTERED[0] || {}).filter(k=>!k.startsWith("_"));
    const lines = [cols.join(",")];
    for (const r of FILTERED){
      const row = cols.map(c=>{
        const v = r[c];
        const s = (v===null || v===undefined) ? "" : String(v);
        return (s.includes(",") || s.includes('"') || s.includes("\n")) ? `"${s.replaceAll('"','""')}"` : s;
      }).join(",");
      lines.push(row);
    }
    const blob = new Blob([lines.join("\n")], {type:"text/csv;charset=utf-8"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "filtered_supply_chain.csv";
    a.click();
  });

  $("status").textContent = "Loaded.";
  renderAll();
}

window.addEventListener("load", init);

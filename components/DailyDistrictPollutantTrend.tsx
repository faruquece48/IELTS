"use client";

import { useEffect, useMemo, useState } from "react";

type Metric = "aqi" | "pm2_5" | "pm10" | "no2" | "so2" | "co" | "o3";
type DailyRow = { day: string; value: string | number };
type Payload = { error?: string; rows?: DailyRow[] };

const metrics: Array<[Metric, string]> = [
  ["pm2_5", "PM 2.5"], ["pm10", "PM 10"], ["no2", "NO₂"],
  ["so2", "SO₂"], ["co", "CO"], ["o3", "O₃"], ["aqi", "AQI"],
];
const readable = (id: string) => id.replace(/(^|[-_])(\w)/g, (_, space, letter) => `${space ? " " : ""}${letter.toUpperCase()}`);
const normalCdf = (value: number) => { const t=1/(1+.2316419*Math.abs(value)),d=.3989423*Math.exp(-value*value/2),p=1-d*t*(.3193815+t*(-.3565638+t*(1.781478+t*(-1.821256+t*1.330274)))); return value>=0?p:1-p; };

function downloadSvg(id: string, fileName: string) {
  const source = document.getElementById(id);
  if (!(source instanceof SVGSVGElement)) return;
  const clone = source.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", "1200"); clone.setAttribute("height", "675");
  clone.querySelectorAll('text[fill="#64748b"], text[fill="#475569"], text[fill="#334155"], text[fill="#1e293b"]').forEach((element) => element.setAttribute("fill", "#000000"));
  clone.querySelectorAll('line[stroke="#94a3b8"], line[stroke="#64748b"]').forEach((element) => element.setAttribute("stroke", "#000000"));
  clone.querySelectorAll("text").forEach((element) => { if (element.textContent?.startsWith("n =")) element.remove(); });
  clone.querySelectorAll('text[x="621"][y="613"], text[transform="rotate(-90 22 345)"]').forEach((element) => { element.setAttribute("font-size", "20"); element.setAttribute("font-weight", "700"); });
  clone.querySelectorAll('text[font-size="13"], text[font-size="14"]').forEach((element) => { element.setAttribute("font-size", "17"); element.setAttribute("font-weight", "600"); });
  const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: "image/svg+xml;charset=utf-8" }));
  const image = new Image();
  image.onload = () => { const canvas=document.createElement("canvas"); canvas.width=2400; canvas.height=1350; const context=canvas.getContext("2d"); if(!context)return; context.fillStyle="#ffffff"; context.fillRect(0,0,canvas.width,canvas.height); context.drawImage(image,0,0,canvas.width,canvas.height); canvas.toBlob((blob)=>{URL.revokeObjectURL(url);if(!blob)return;const pngUrl=URL.createObjectURL(blob),link=document.createElement("a");link.href=pngUrl;link.download=fileName;link.click();URL.revokeObjectURL(pngUrl);},"image/png"); };
  image.src = url;
}

export default function DailyDistrictPollutantTrend({ districts }: { districts: string[] }) {
  const [district,setDistrict]=useState(districts.includes("dhaka")?"dhaka":districts[0]??"");
  const [metric,setMetric]=useState<Metric>("pm2_5");
  const [rows,setRows]=useState<DailyRow[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  const label=metrics.find(([value])=>value===metric)?.[1]??metric;

  useEffect(()=>{
    if(!district)return;
    const controller=new AbortController();
    async function load(){
      await Promise.resolve();
      setLoading(true);setError("");
      try {
        const response=await fetch(`/api/aqi/districts/trend?district=${encodeURIComponent(district)}&pollutant=${metric}`,{cache:"no-store",signal:controller.signal});
        const payload=await response.json() as Payload;
        if(!response.ok||payload.error)throw new Error(payload.error||"Unable to load daily data.");
        setRows(payload.rows??[]);
      } catch(reason) {
        if(reason instanceof Error&&reason.name!=="AbortError")setError(reason.message);
      } finally {
        if(!controller.signal.aborted)setLoading(false);
      }
    }
    void load();
    return()=>controller.abort();
  },[district,metric]);

  const analysis=useMemo(()=>{
    const points=rows.map((row)=>({day:row.day,time:new Date(`${row.day}T00:00:00Z`).getTime(),value:Number(row.value)})).filter((row)=>Number.isFinite(row.time)&&Number.isFinite(row.value));
    let score=0;const slopes:number[]=[];const ties=new Map<number,number>();
    for(const point of points)ties.set(point.value,(ties.get(point.value)??0)+1);
    for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++){const delta=points[j].value-points[i].value;score+=Math.sign(delta);if(delta!==0)slopes.push(delta/((points[j].time-points[i].time)/(365.2425*86400000)));}
    slopes.sort((a,b)=>a-b);const sen=slopes.length?slopes[Math.floor(slopes.length/2)]:0;
    const n=points.length,tieCorrection=[...ties.values()].reduce((sum,count)=>sum+(count>1?count*(count-1)*(2*count+5):0),0),variance=(n*(n-1)*(2*n+5)-tieCorrection)/18;
    const z=variance>0?(score>0?(score-1)/Math.sqrt(variance):score<0?(score+1)/Math.sqrt(variance):0):0;
    const tau=n>1?score/(n*(n-1)/2):0,p=2*(1-normalCdf(Math.abs(z)));
    const min=Math.min(...points.map((point)=>point.value)),max=Math.max(...points.map((point)=>point.value));
    const intercepts=points.map((point)=>point.value-sen*(point.time/(365.2425*86400000))).sort((a,b)=>a-b),intercept=intercepts.length?intercepts[Math.floor(intercepts.length/2)]:0;
    return {points,sen,tau,p,min:Number.isFinite(min)?min:0,max:Number.isFinite(max)?max:1,intercept};
  },[rows]);

  const {points,sen,tau,p,max:observedMax,intercept}=analysis;
  const min=0,axisStep=observedMax<=250?50:observedMax<=1000?100:500,max=Math.max(axisStep,Math.ceil(observedMax/axisStep)*axisStep),span=max;
  const timeMin=points[0]?.time??0,timeMax=points.at(-1)?.time??1;
  const x=(time:number)=>82+(time-timeMin)/Math.max(1,timeMax-timeMin)*1078,y=(value:number)=>540-(value-min)/span*480;
  const years=[...new Set(points.map((point)=>new Date(point.time).getUTCFullYear()))];
  const chartId="daily-district-pollutant-trend";
  const pText=p<.001?"p < 0.001":`p = ${p.toFixed(3)}`;
  const unit=metric==="aqi"?"AQI units":"µg/m³";

  return <article className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><h3 className="text-xl font-black">Daily district pollutant trend</h3><p className="mt-1 text-xs text-slate-500">Every stored daily observation · Mann–Kendall test and Sen&apos;s slope</p></div><div className="flex flex-wrap items-end gap-2"><label className="grid gap-1 text-[10px] font-black uppercase tracking-wide text-slate-500">Pollutant<select value={metric} onChange={(event)=>setMetric(event.target.value as Metric)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold normal-case text-slate-900">{metrics.map(([value,name])=><option key={value} value={value}>{name}</option>)}</select></label><label className="grid gap-1 text-[10px] font-black uppercase tracking-wide text-slate-500">District<select value={district} onChange={(event)=>setDistrict(event.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold normal-case text-slate-900">{districts.map((value)=><option key={value} value={value}>{readable(value)}</option>)}</select></label><button type="button" disabled={!points.length} onClick={()=>downloadSvg(chartId,`${district}-${metric}-daily-trend.png`)} className="rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2 text-[10px] font-black uppercase tracking-wide text-cyan-800 disabled:opacity-40">PNG</button></div></div>
    {error?<p className="mt-5 rounded-xl bg-rose-50 p-4 text-sm font-bold text-rose-700">{error}</p>:<div className="mt-5 overflow-x-auto"><svg id={chartId} viewBox="0 0 1200 675" className="min-w-[760px] w-full" role="img" aria-label={`Mann-Kendall and Sen slope for ${readable(district)}`}><rect width="1200" height="675" fill="#fff"/><text x="600" y="38" textAnchor="middle" fontSize="22" fontWeight="700" fill="#0f172a">Mann–Kendall and Sen&apos;s slope ({readable(district)})</text><text x="105" y="76" fontSize="16" fontWeight="600" fill="#1e293b">Mann–Kendall: τ = {tau.toFixed(3)} ({pText})</text><text x="105" y="101" fontSize="16" fontWeight="600" fill="#1e293b">Sen&apos;s slope: {sen.toFixed(2)} {unit} per year</text>{Array.from({length:6},(_,index)=>index/5).map((ratio)=><g key={ratio}><line x1="82" x2="1160" y1={540-ratio*480} y2={540-ratio*480} stroke="#e2e8f0"/><text x="68" y={545-ratio*480} textAnchor="end" fontSize="13" fill="#475569">{(min+ratio*span).toFixed(metric==="aqi"?0:1)}</text></g>)}{years.map((year)=>{const time=Date.UTC(year,0,1);return <g key={year}><line x1={x(time)} x2={x(time)} y1="60" y2="540" stroke="#f1f5f9"/><text x={x(time)} y="566" textAnchor="middle" fontSize="14" fill="#334155">{year}</text></g>})}<line x1="82" x2="1160" y1="540" y2="540" stroke="#64748b"/><line x1="82" x2="82" y1="60" y2="540" stroke="#64748b"/>{points.map((point,index)=><circle key={`${point.day}-${index}`} cx={x(point.time)} cy={y(point.value)} r="2" fill="#111827" fillOpacity=".62"/>)}{points.length>1?<line x1={x(timeMin)} y1={y(intercept+sen*(timeMin/(365.2425*86400000)))} x2={x(timeMax)} y2={y(intercept+sen*(timeMax/(365.2425*86400000)))} stroke="#ef233c" strokeWidth="4"/>:null}<text x="621" y="613" textAnchor="middle" fontSize="15" fontWeight="700" fill="#334155">Year</text><text x="22" y="345" transform="rotate(-90 22 345)" textAnchor="middle" fontSize="15" fontWeight="700" fill="#334155">{label}{metric==="aqi"?"":" (µg/m³)"}</text>{loading?<text x="621" y="350" textAnchor="middle" fontSize="18" fontWeight="700" fill="#94a3b8">Loading daily observations…</text>:null}<text x="1160" y="646" textAnchor="end" fontSize="12" fill="#64748b">n = {points.length} daily observations</text></svg></div>}
  </article>;
}

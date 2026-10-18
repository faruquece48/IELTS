import { neon } from "@neondatabase/serverless";
import { districts } from "../lib/districtAqi.ts";

const sql=neon(process.env.DATABASE_URL);
const fields=["aqi","pm25","pm10","no2","so2","co","o3"];
const monthly=await sql.query(`SELECT district_id, EXTRACT(YEAR FROM day)::int AS year_value, EXTRACT(MONTH FROM day)::int AS month_value,
  AVG(us_aqi_mean)::float AS aqi, AVG(pm2_5_mean)::float AS pm25, AVG(pm10_mean)::float AS pm10,
  AVG(nitrogen_dioxide_mean)::float AS no2, AVG(sulphur_dioxide_mean)::float AS so2,
  AVG(carbon_monoxide_mean)::float AS co, AVG(ozone_mean)::float AS o3
  FROM district_aqi_daily GROUP BY 1,2,3 ORDER BY 1,2,3`);
const means=await sql.query(`SELECT district_id, AVG(us_aqi_mean)::float AS aqi, AVG(pm2_5_mean)::float AS pm25,
  AVG(pm10_mean)::float AS pm10, AVG(nitrogen_dioxide_mean)::float AS no2, AVG(sulphur_dioxide_mean)::float AS so2,
  AVG(carbon_monoxide_mean)::float AS co, AVG(ozone_mean)::float AS o3 FROM district_aqi_daily GROUP BY 1 ORDER BY 1`);

const normalCdf=(z)=>{const t=1/(1+.2316419*Math.abs(z)),d=.3989423*Math.exp(-z*z/2),p=1-d*t*(.3193815+t*(-.3565638+t*(1.781478+t*(-1.821256+t*1.330274))));return z>=0?p:1-p;};
function mk(rows,field){let score=0;const slopes=[];const ties=new Map();for(const row of rows)ties.set(row[field],(ties.get(row[field])??0)+1);for(let i=0;i<rows.length;i++)for(let j=i+1;j<rows.length;j++){const delta=rows[j][field]-rows[i][field];score+=Math.sign(delta);if(delta!==0){const years=(rows[j].year_value+(rows[j].month_value-1)/12)-(rows[i].year_value+(rows[i].month_value-1)/12);slopes.push(delta/years);}}slopes.sort((a,b)=>a-b);const n=rows.length,tie=[...ties.values()].reduce((s,c)=>s+(c>1?c*(c-1)*(2*c+5):0),0),variance=(n*(n-1)*(2*n+5)-tie)/18,z=score>0?(score-1)/Math.sqrt(variance):score<0?(score+1)/Math.sqrt(variance):0;return{tau:score/(n*(n-1)/2),p:2*(1-normalCdf(Math.abs(z))),slope:slopes[Math.floor(slopes.length/2)]??0};}
const trends={};for(const field of fields){const results=[];for(const district of districts){const rows=monthly.filter((row)=>row.district_id===district.id);results.push({district:district.id,...mk(rows,field)});}trends[field]={increasing:results.filter((r)=>r.p<.05&&r.slope>0).length,decreasing:results.filter((r)=>r.p<.05&&r.slope<0).length,nonsignificant:results.filter((r)=>r.p>=.05).length,strongestIncrease:[...results].sort((a,b)=>b.slope-a.slope).slice(0,3),strongestDecrease:[...results].sort((a,b)=>a.slope-b.slope).slice(0,3)};}

const clusterFields=["pm25","pm10","no2","so2","co","o3"],mean=(a)=>a.reduce((s,v)=>s+v,0)/a.length,sd=(a)=>Math.sqrt(a.reduce((s,v)=>s+(v-mean(a))**2,0)/(a.length-1));
const matrix=means.map((row)=>clusterFields.map((field)=>Number(row[field]))),mus=clusterFields.map((_,j)=>mean(matrix.map((r)=>r[j]))),sds=clusterFields.map((_,j)=>sd(matrix.map((r)=>r[j]))),z=matrix.map((r)=>r.map((v,j)=>(v-mus[j])/sds[j]));
const covariance=clusterFields.map((_,i)=>clusterFields.map((__,j)=>z.reduce((s,r)=>s+r[i]*r[j],0)/(z.length-1)));
function jacobi(a){const n=a.length,v=Array.from({length:n},(_,i)=>Array.from({length:n},(__,j)=>i===j?1:0)),m=a.map((r)=>[...r]);for(let iter=0;iter<100;iter++){let p=0,q=1,max=0;for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)if(Math.abs(m[i][j])>max){max=Math.abs(m[i][j]);p=i;q=j;}if(max<1e-10)break;const phi=.5*Math.atan2(2*m[p][q],m[q][q]-m[p][p]),c=Math.cos(phi),s=Math.sin(phi);for(let i=0;i<n;i++){const ip=m[i][p],iq=m[i][q];m[i][p]=c*ip-s*iq;m[i][q]=s*ip+c*iq;}for(let j=0;j<n;j++){const pj=m[p][j],qj=m[q][j];m[p][j]=c*pj-s*qj;m[q][j]=s*pj+c*qj;}for(let i=0;i<n;i++){const ip=v[i][p],iq=v[i][q];v[i][p]=c*ip-s*iq;v[i][q]=s*ip+c*iq;}}return m.map((r,i)=>({value:r[i],vector:v.map((row)=>row[i])})).sort((a,b)=>b.value-a.value);}
const eig=jacobi(covariance),total=eig.reduce((s,e)=>s+e.value,0),pca=eig.slice(0,3).map((e,index)=>({component:index+1,variance:e.value/total,loadings:Object.fromEntries(clusterFields.map((f,j)=>[f,e.vector[j]]))}));

const distance=(a,b)=>Math.sqrt(a.reduce((s,v,i)=>s+(v-b[i])**2,0));
function kmeans(k){let centers=Array.from({length:k},(_,i)=>[...z[Math.floor(i*z.length/k)]]),labels=[];for(let iter=0;iter<100;iter++){const next=z.map((r)=>centers.map((c)=>distance(r,c)).indexOf(Math.min(...centers.map((c)=>distance(r,c)))));if(next.every((v,i)=>v===labels[i]))break;labels=next;centers=centers.map((_,c)=>clusterFields.map((__,j)=>{const vals=z.filter((___,i)=>labels[i]===c).map((r)=>r[j]);return vals.length?mean(vals):centers[c][j];}));}const silhouettes=z.map((r,i)=>{const own=z.filter((_,j)=>labels[j]===labels[i]&&j!==i),a=own.length?mean(own.map((x)=>distance(r,x))):0,b=Math.min(...[...new Set(labels)].filter((c)=>c!==labels[i]).map((c)=>mean(z.filter((_,j)=>labels[j]===c).map((x)=>distance(r,x)))));return(b-a)/Math.max(a,b);});return{k,score:mean(silhouettes),labels,centers};}
const candidates=[2,3,4,5,6].map(kmeans),best=[...candidates].sort((a,b)=>b.score-a.score)[0],clusters=best.centers.map((center,c)=>({cluster:c+1,n:best.labels.filter((x)=>x===c).length,districts:means.filter((_,i)=>best.labels[i]===c).map((r)=>r.district_id),profile:Object.fromEntries(clusterFields.map((f,j)=>[f,center[j]]))}));

const values=districts.map((d)=>Number(means.find((r)=>r.district_id===d.id)?.aqi)),vmean=mean(values),dev=values.map((v)=>v-vmean),den=dev.reduce((s,v)=>s+v*v,0);
const weights=districts.map((d,i)=>{const near=districts.map((other,j)=>({j,d:(d.latitude-other.latitude)**2+(d.longitude-other.longitude)**2})).filter((x)=>x.j!==i).sort((a,b)=>a.d-b.d).slice(0,4);return near.map((x)=>x.j);});
function moran(vals){const mu=mean(vals),dv=vals.map((v)=>v-mu),bottom=dv.reduce((s,v)=>s+v*v,0);let top=0;weights.forEach((neighbors,i)=>neighbors.forEach((j)=>top+=dv[i]*dv[j]/neighbors.length));return vals.length*top/(vals.length*bottom);}
const observed=moran(values);let seed=1729;const random=()=>((seed=Math.imul(seed,1664525)+1013904223>>>0)/4294967296);let extreme=0;for(let p=0;p<999;p++){const perm=[...values];for(let i=perm.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[perm[i],perm[j]]=[perm[j],perm[i]];}if(Math.abs(moran(perm))>=Math.abs(observed))extreme++;}
const local=districts.map((district,i)=>{const lag=mean(weights[i].map((j)=>dev[j])),I=dev[i]*lag/(den/values.length);return{district:district.id,I,quadrant:dev[i]>=0&&lag>=0?"high-high":dev[i]<0&&lag<0?"low-low":dev[i]>=0?"high-low":"low-high"};});

console.log(JSON.stringify({trends,pca,clusterSelection:candidates.map(({k,score})=>({k,score})),clusters,moran:{I:observed,p:(extreme+1)/1000,weights:"four nearest district centroids",localCounts:Object.fromEntries(["high-high","low-low","high-low","low-high"].map((q)=>[q,local.filter((r)=>r.quadrant===q).length])),topLocal:[...local].sort((a,b)=>Math.abs(b.I)-Math.abs(a.I)).slice(0,10)}},null,2));

(function(){try{var e=typeof window<`u`?window:typeof global<`u`?global:typeof globalThis<`u`?globalThis:typeof self<`u`?self:{};e.SENTRY_RELEASE={id:`9ff8f0b415c7b9b8cab51c6130e6202463a5b5c2`};var t=new e.Error().stack;t&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[t]=`6a9691d2-14e7-4711-9814-984e4e81faae`,e._sentryDebugIdIdentifier=`sentry-dbid-6a9691d2-14e7-4711-9814-984e4e81faae`)}catch{}})();import{g as e,h as t}from"./src.DbbFlNxx.js";import{o as n}from"./MarkdownRenderer.DAc-ZnGe.js";import{H as r,K as i,U as a,a as o,c as s,f as c,v as l,w as u,x as d,y as f}from"./chunk-CSCIHK7Q.DKdlQHKf.js";import{t as p}from"./ordinal.B-qc2bCr.js";import{n as m}from"./path.Bou0GA51.js";import{m as h}from"./dist.Vcm5Euu4.js";import{t as g}from"./arc.CK0HDIxX.js";import{t as _}from"./array.B325CwnP.js";import{i as v,p as y}from"./chunk-5ZQYHXKU.BXQ_8Xbq.js";import{t as b}from"./mermaid-parser.core.CDyiYxPs.js";import{t as x}from"./chunk-4BX2VUAB.D177ZcXJ.js";function S(e,t){return t<e?-1:t>e?1:t>=e?0:NaN}function C(e){return e}function w(){var e=C,t=S,n=null,r=m(0),i=m(h),a=m(0);function o(o){var s,c=(o=_(o)).length,l,u,d=0,f=Array(c),p=Array(c),m=+r.apply(this,arguments),g=Math.min(h,Math.max(-h,i.apply(this,arguments)-m)),v,y=Math.min(Math.abs(g)/c,a.apply(this,arguments)),b=y*(g<0?-1:1),x;for(s=0;s<c;++s)(x=p[f[s]=s]=+e(o[s],s,o))>0&&(d+=x);for(t==null?n!=null&&f.sort(function(e,t){return n(o[e],o[t])}):f.sort(function(e,n){return t(p[e],p[n])}),s=0,u=d?(g-c*b)/d:0;s<c;++s,m=v)l=f[s],x=p[l],v=m+(x>0?x*u:0)+b,p[l]={data:o[l],index:s,value:x,startAngle:m,endAngle:v,padAngle:y};return p}return o.value=function(t){return arguments.length?(e=typeof t==`function`?t:m(+t),o):e},o.sortValues=function(e){return arguments.length?(t=e,n=null,o):t},o.sort=function(e){return arguments.length?(n=e,t=null,o):n},o.startAngle=function(e){return arguments.length?(r=typeof e==`function`?e:m(+e),o):r},o.endAngle=function(e){return arguments.length?(i=typeof e==`function`?e:m(+e),o):i},o.padAngle=function(e){return arguments.length?(a=typeof e==`function`?e:m(+e),o):a},o}var T=c.pie,E={sections:new Map,showData:!1,config:T},D=E.sections,O=E.showData,k=structuredClone(T),A={getConfig:t(()=>structuredClone(k),`getConfig`),clear:t(()=>{D=new Map,O=E.showData,o()},`clear`),setDiagramTitle:i,getDiagramTitle:u,setAccTitle:a,getAccTitle:f,setAccDescription:r,getAccDescription:l,addSection:t(({label:t,value:n})=>{if(n<0)throw Error(`"${t}" has invalid value: ${n}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);D.has(t)||(D.set(t,n),e.debug(`added new section: ${t}, with value: ${n}`))},`addSection`),getSections:t(()=>D,`getSections`),setShowData:t(e=>{O=e},`setShowData`),getShowData:t(()=>O,`getShowData`)},j=t((e,t)=>{x(e,t),t.setShowData(e.showData),e.sections.map(t.addSection)},`populateDb`),M={parse:t(async t=>{let n=await b(`pie`,t);e.debug(n),j(n,A)},`parse`)},N=t(e=>`
  .pieCircle{
    stroke: ${e.pieStrokeColor};
    stroke-width : ${e.pieStrokeWidth};
    opacity : ${e.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${e.pieOuterStrokeColor};
    stroke-width: ${e.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${e.pieTitleTextSize};
    fill: ${e.pieTitleTextColor};
    font-family: ${e.fontFamily};
  }
  .slice {
    font-family: ${e.fontFamily};
    fill: ${e.pieSectionTextColor};
    font-size:${e.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${e.pieLegendTextColor};
    font-family: ${e.fontFamily};
    font-size: ${e.pieLegendTextSize};
  }
`,`getStyles`),P=t(e=>{let t=[...e.values()].reduce((e,t)=>e+t,0),n=[...e.entries()].map(([e,t])=>({label:e,value:t})).filter(e=>e.value/t*100>=1);return w().value(e=>e.value).sort(null)(n)},`createPieArcs`),F={parser:M,db:A,renderer:{draw:t((t,r,i,a)=>{e.debug(`rendering pie chart
`+t);let o=a.db,c=d(),l=v(o.getConfig(),c.pie),u=n(r),f=u.append(`g`);f.attr(`transform`,`translate(225,225)`);let{themeVariables:m}=c,[h]=y(m.pieOuterStrokeWidth);h??=2;let _=l.textPosition,b=g().innerRadius(0).outerRadius(185),x=g().innerRadius(185*_).outerRadius(185*_);f.append(`circle`).attr(`cx`,0).attr(`cy`,0).attr(`r`,185+h/2).attr(`class`,`pieOuterCircle`);let S=o.getSections(),C=P(S),w=[m.pie1,m.pie2,m.pie3,m.pie4,m.pie5,m.pie6,m.pie7,m.pie8,m.pie9,m.pie10,m.pie11,m.pie12],T=0;S.forEach(e=>{T+=e});let E=C.filter(e=>(e.data.value/T*100).toFixed(0)!==`0`),D=p(w).domain([...S.keys()]);f.selectAll(`mySlices`).data(E).enter().append(`path`).attr(`d`,b).attr(`fill`,e=>D(e.data.label)).attr(`class`,`pieCircle`),f.selectAll(`mySlices`).data(E).enter().append(`text`).text(e=>(e.data.value/T*100).toFixed(0)+`%`).attr(`transform`,e=>`translate(`+x.centroid(e)+`)`).style(`text-anchor`,`middle`).attr(`class`,`slice`);let O=f.append(`text`).text(o.getDiagramTitle()).attr(`x`,0).attr(`y`,-400/2).attr(`class`,`pieTitleText`),k=[...S.entries()].map(([e,t])=>({label:e,value:t})),A=f.selectAll(`.legend`).data(k).enter().append(`g`).attr(`class`,`legend`).attr(`transform`,(e,t)=>{let n=22*k.length/2;return`translate(216,`+(t*22-n)+`)`});A.append(`rect`).attr(`width`,18).attr(`height`,18).style(`fill`,e=>D(e.label)).style(`stroke`,e=>D(e.label)),A.append(`text`).attr(`x`,22).attr(`y`,14).text(e=>o.getShowData()?`${e.label} [${e.value}]`:e.label);let j=512+Math.max(...A.selectAll(`text`).nodes().map(e=>e?.getBoundingClientRect().width??0)),M=O.node()?.getBoundingClientRect().width??0,N=450/2-M/2,F=450/2+M/2,I=Math.min(0,N),L=Math.max(j,F)-I;u.attr(`viewBox`,`${I} 0 ${L} 450`),s(u,450,L,l.useMaxWidth)},`draw`)},styles:N};export{F as diagram};
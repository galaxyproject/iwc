import{a9 as y,a4 as M,aH as U,_ as d,g as j,s as q,a as Y,b as Z,q as J,p as K,l as _,c as Q,D as X,H as ee,O as te,e as ae,y as re,F as ne}from"./MarkdownRenderer.CI7WispV.js";import{p as ie}from"./chunk-4BX2VUAB.B67_bd8J.js";import{p as se}from"./treemap-KMMF4GRG.CHddDUUb.js";import{d as W}from"./arc.CMWK_Rvj.js";import{o as oe}from"./ordinal.qA2egG0x.js";/* empty css                        */import"./_plugin-vue_export-helper.cC5uo_d1.js";import"./runtime-core.esm-bundler.DA6uu3mh.js";import"./_baseUniq.Dn0kcd4u.js";import"./_basePickBy.UwUPk0kx.js";import"./clone.DKiiBy-L.js";import"./init.6-eXRZ4-.js";(function(){try{var e=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{};e.SENTRY_RELEASE={id:"ccaa1f7a2694284de5a3e730750644e47b2010aa"};var a=new e.Error().stack;a&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[a]="3c3fa2f5-4b20-4a95-b258-3ca19c4e6187",e._sentryDebugIdIdentifier="sentry-dbid-3c3fa2f5-4b20-4a95-b258-3ca19c4e6187")}catch{}})();function le(e,a){return a<e?-1:a>e?1:a>=e?0:NaN}function ce(e){return e}function ue(){var e=ce,a=le,f=null,S=y(0),s=y(M),l=y(0);function o(t){var n,c=(t=U(t)).length,p,w,h=0,u=new Array(c),i=new Array(c),v=+S.apply(this,arguments),x=Math.min(M,Math.max(-M,s.apply(this,arguments)-v)),m,b=Math.min(Math.abs(x)/c,l.apply(this,arguments)),C=b*(x<0?-1:1),g;for(n=0;n<c;++n)(g=i[u[n]=n]=+e(t[n],n,t))>0&&(h+=g);for(a!=null?u.sort(function(D,A){return a(i[D],i[A])}):f!=null&&u.sort(function(D,A){return f(t[D],t[A])}),n=0,w=h?(x-c*C)/h:0;n<c;++n,v=m)p=u[n],g=i[p],m=v+(g>0?g*w:0)+C,i[p]={data:t[p],index:n,value:g,startAngle:v,endAngle:m,padAngle:b};return i}return o.value=function(t){return arguments.length?(e=typeof t=="function"?t:y(+t),o):e},o.sortValues=function(t){return arguments.length?(a=t,f=null,o):a},o.sort=function(t){return arguments.length?(f=t,a=null,o):f},o.startAngle=function(t){return arguments.length?(S=typeof t=="function"?t:y(+t),o):S},o.endAngle=function(t){return arguments.length?(s=typeof t=="function"?t:y(+t),o):s},o.padAngle=function(t){return arguments.length?(l=typeof t=="function"?t:y(+t),o):l},o}var de=ne.pie,F={sections:new Map,showData:!1},T=F.sections,z=F.showData,pe=structuredClone(de),ge=d(()=>structuredClone(pe),"getConfig"),fe=d(()=>{T=new Map,z=F.showData,re()},"clear"),me=d(({label:e,value:a})=>{if(a<0)throw new Error(`"${e}" has invalid value: ${a}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);T.has(e)||(T.set(e,a),_.debug(`added new section: ${e}, with value: ${a}`))},"addSection"),he=d(()=>T,"getSections"),ve=d(e=>{z=e},"setShowData"),ye=d(()=>z,"getShowData"),L={getConfig:ge,clear:fe,setDiagramTitle:K,getDiagramTitle:J,setAccTitle:Z,getAccTitle:Y,setAccDescription:q,getAccDescription:j,addSection:me,getSections:he,setShowData:ve,getShowData:ye},Se=d((e,a)=>{ie(e,a),a.setShowData(e.showData),e.sections.map(a.addSection)},"populateDb"),we={parse:d(async e=>{const a=await se("pie",e);_.debug(a),Se(a,L)},"parse")},xe=d(e=>`
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
`,"getStyles"),De=xe,Ae=d(e=>{const a=[...e.values()].reduce((s,l)=>s+l,0),f=[...e.entries()].map(([s,l])=>({label:s,value:l})).filter(s=>s.value/a*100>=1).sort((s,l)=>l.value-s.value);return ue().value(s=>s.value)(f)},"createPieArcs"),be=d((e,a,f,S)=>{_.debug(`rendering pie chart
`+e);const s=S.db,l=Q(),o=X(s.getConfig(),l.pie),t=40,n=18,c=4,p=450,w=p,h=ee(a),u=h.append("g");u.attr("transform","translate("+w/2+","+p/2+")");const{themeVariables:i}=l;let[v]=te(i.pieOuterStrokeWidth);v??=2;const x=o.textPosition,m=Math.min(w,p)/2-t,b=W().innerRadius(0).outerRadius(m),C=W().innerRadius(m*x).outerRadius(m*x);u.append("circle").attr("cx",0).attr("cy",0).attr("r",m+v/2).attr("class","pieOuterCircle");const g=s.getSections(),D=Ae(g),A=[i.pie1,i.pie2,i.pie3,i.pie4,i.pie5,i.pie6,i.pie7,i.pie8,i.pie9,i.pie10,i.pie11,i.pie12];let $=0;g.forEach(r=>{$+=r});const N=D.filter(r=>(r.data.value/$*100).toFixed(0)!=="0"),E=oe(A);u.selectAll("mySlices").data(N).enter().append("path").attr("d",b).attr("fill",r=>E(r.data.label)).attr("class","pieCircle"),u.selectAll("mySlices").data(N).enter().append("text").text(r=>(r.data.value/$*100).toFixed(0)+"%").attr("transform",r=>"translate("+C.centroid(r)+")").style("text-anchor","middle").attr("class","slice"),u.append("text").text(s.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText");const R=[...g.entries()].map(([r,I])=>({label:r,value:I})),k=u.selectAll(".legend").data(R).enter().append("g").attr("class","legend").attr("transform",(r,I)=>{const O=n+c,B=O*R.length/2,V=12*n,H=I*O-B;return"translate("+V+","+H+")"});k.append("rect").attr("width",n).attr("height",n).style("fill",r=>E(r.label)).style("stroke",r=>E(r.label)),k.append("text").attr("x",n+c).attr("y",n-c).text(r=>s.getShowData()?`${r.label} [${r.value}]`:r.label);const P=Math.max(...k.selectAll("text").nodes().map(r=>r?.getBoundingClientRect().width??0)),G=w+t+n+c+P;h.attr("viewBox",`0 0 ${G} ${p}`),ae(h,p,G,o.useMaxWidth)},"draw"),Ce={draw:be},Oe={parser:we,db:L,renderer:Ce,styles:De};export{Oe as diagram};

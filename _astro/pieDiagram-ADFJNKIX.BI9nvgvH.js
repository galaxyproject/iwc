import{a9 as y,a4 as M,aH as U,_ as u,g as j,s as q,a as Y,b as Z,q as J,p as K,l as _,c as Q,D as X,H as ee,O as te,e as ae,y as re,F as ne}from"./MarkdownRenderer.4Pi2mfG9.js";import{p as ie}from"./chunk-4BX2VUAB.B-AshO22.js";import{p as se}from"./treemap-KMMF4GRG.ko-DNQV_.js";import{d as W}from"./arc.j_dtidrx.js";import{o as oe}from"./ordinal.B1xCvmWS.js";/* empty css                        */import"./_plugin-vue_export-helper.DPSXizdw.js";import"./runtime-core.esm-bundler.CqOkuUpN.js";import"./_baseUniq.BvipEzPS.js";import"./_basePickBy.CGbm8LdA.js";import"./clone.Bs_lQt5k.js";import"./init.CBfUmPBU.js";(function(){try{var e=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{};e.SENTRY_RELEASE={id:"4a18dac1384509038f0a89ae507bd0675272490d"};var a=new e.Error().stack;a&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[a]="bd99276d-18a6-49f5-9ae2-712f39bacb2d",e._sentryDebugIdIdentifier="sentry-dbid-bd99276d-18a6-49f5-9ae2-712f39bacb2d")}catch{}})();function le(e,a){return a<e?-1:a>e?1:a>=e?0:NaN}function ce(e){return e}function de(){var e=ce,a=le,f=null,S=y(0),s=y(M),l=y(0);function o(t){var n,c=(t=U(t)).length,p,w,h=0,d=new Array(c),i=new Array(c),v=+S.apply(this,arguments),x=Math.min(M,Math.max(-M,s.apply(this,arguments)-v)),m,b=Math.min(Math.abs(x)/c,l.apply(this,arguments)),C=b*(x<0?-1:1),g;for(n=0;n<c;++n)(g=i[d[n]=n]=+e(t[n],n,t))>0&&(h+=g);for(a!=null?d.sort(function(D,A){return a(i[D],i[A])}):f!=null&&d.sort(function(D,A){return f(t[D],t[A])}),n=0,w=h?(x-c*C)/h:0;n<c;++n,v=m)p=d[n],g=i[p],m=v+(g>0?g*w:0)+C,i[p]={data:t[p],index:n,value:g,startAngle:v,endAngle:m,padAngle:b};return i}return o.value=function(t){return arguments.length?(e=typeof t=="function"?t:y(+t),o):e},o.sortValues=function(t){return arguments.length?(a=t,f=null,o):a},o.sort=function(t){return arguments.length?(f=t,a=null,o):f},o.startAngle=function(t){return arguments.length?(S=typeof t=="function"?t:y(+t),o):S},o.endAngle=function(t){return arguments.length?(s=typeof t=="function"?t:y(+t),o):s},o.padAngle=function(t){return arguments.length?(l=typeof t=="function"?t:y(+t),o):l},o}var ue=ne.pie,F={sections:new Map,showData:!1},T=F.sections,z=F.showData,pe=structuredClone(ue),ge=u(()=>structuredClone(pe),"getConfig"),fe=u(()=>{T=new Map,z=F.showData,re()},"clear"),me=u(({label:e,value:a})=>{if(a<0)throw new Error(`"${e}" has invalid value: ${a}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);T.has(e)||(T.set(e,a),_.debug(`added new section: ${e}, with value: ${a}`))},"addSection"),he=u(()=>T,"getSections"),ve=u(e=>{z=e},"setShowData"),ye=u(()=>z,"getShowData"),L={getConfig:ge,clear:fe,setDiagramTitle:K,getDiagramTitle:J,setAccTitle:Z,getAccTitle:Y,setAccDescription:q,getAccDescription:j,addSection:me,getSections:he,setShowData:ve,getShowData:ye},Se=u((e,a)=>{ie(e,a),a.setShowData(e.showData),e.sections.map(a.addSection)},"populateDb"),we={parse:u(async e=>{const a=await se("pie",e);_.debug(a),Se(a,L)},"parse")},xe=u(e=>`
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
`,"getStyles"),De=xe,Ae=u(e=>{const a=[...e.values()].reduce((s,l)=>s+l,0),f=[...e.entries()].map(([s,l])=>({label:s,value:l})).filter(s=>s.value/a*100>=1).sort((s,l)=>l.value-s.value);return de().value(s=>s.value)(f)},"createPieArcs"),be=u((e,a,f,S)=>{_.debug(`rendering pie chart
`+e);const s=S.db,l=Q(),o=X(s.getConfig(),l.pie),t=40,n=18,c=4,p=450,w=p,h=ee(a),d=h.append("g");d.attr("transform","translate("+w/2+","+p/2+")");const{themeVariables:i}=l;let[v]=te(i.pieOuterStrokeWidth);v??=2;const x=o.textPosition,m=Math.min(w,p)/2-t,b=W().innerRadius(0).outerRadius(m),C=W().innerRadius(m*x).outerRadius(m*x);d.append("circle").attr("cx",0).attr("cy",0).attr("r",m+v/2).attr("class","pieOuterCircle");const g=s.getSections(),D=Ae(g),A=[i.pie1,i.pie2,i.pie3,i.pie4,i.pie5,i.pie6,i.pie7,i.pie8,i.pie9,i.pie10,i.pie11,i.pie12];let $=0;g.forEach(r=>{$+=r});const N=D.filter(r=>(r.data.value/$*100).toFixed(0)!=="0"),E=oe(A);d.selectAll("mySlices").data(N).enter().append("path").attr("d",b).attr("fill",r=>E(r.data.label)).attr("class","pieCircle"),d.selectAll("mySlices").data(N).enter().append("text").text(r=>(r.data.value/$*100).toFixed(0)+"%").attr("transform",r=>"translate("+C.centroid(r)+")").style("text-anchor","middle").attr("class","slice"),d.append("text").text(s.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText");const R=[...g.entries()].map(([r,I])=>({label:r,value:I})),k=d.selectAll(".legend").data(R).enter().append("g").attr("class","legend").attr("transform",(r,I)=>{const O=n+c,B=O*R.length/2,V=12*n,H=I*O-B;return"translate("+V+","+H+")"});k.append("rect").attr("width",n).attr("height",n).style("fill",r=>E(r.label)).style("stroke",r=>E(r.label)),k.append("text").attr("x",n+c).attr("y",n-c).text(r=>s.getShowData()?`${r.label} [${r.value}]`:r.label);const P=Math.max(...k.selectAll("text").nodes().map(r=>r?.getBoundingClientRect().width??0)),G=w+t+n+c+P;h.attr("viewBox",`0 0 ${G} ${p}`),ae(h,p,G,o.useMaxWidth)},"draw"),Ce={draw:be},Oe={parser:we,db:L,renderer:Ce,styles:De};export{Oe as diagram};

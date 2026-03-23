import{ac as y,a4 as M,aH as U,g as j,s as q,a as Y,b as Z,q as J,p as K,_ as d,l as _,c as Q,D as X,H as ee,O as te,e as ae,y as re,E as ne}from"./MarkdownRenderer.68bcvbx8.js";import{p as ie}from"./chunk-4BX2VUAB.BB_7u1JK.js";import{p as se}from"./treemap-GDKQZRPO.B3fmSam_.js";import{d as W}from"./arc.BH7PiT2O.js";import{o as oe}from"./ordinal.CiG7PXpo.js";/* empty css                        */import"./_plugin-vue_export-helper.CAPD9Wyq.js";import"./runtime-core.esm-bundler.BZsnOaD2.js";import"./_baseUniq.C7I15c45.js";import"./_basePickBy.BSbnAq7A.js";import"./clone.CLrRnen-.js";import"./init.ClAIFlBG.js";(function(){try{var e=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{};e.SENTRY_RELEASE={id:"9d10b45e105847af52590d12e37e1b2a38ccdb27"};var a=new e.Error().stack;a&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[a]="1f76a69b-1085-4bbf-b98e-b768090b397e",e._sentryDebugIdIdentifier="sentry-dbid-1f76a69b-1085-4bbf-b98e-b768090b397e")}catch{}})();function le(e,a){return a<e?-1:a>e?1:a>=e?0:NaN}function ce(e){return e}function ue(){var e=ce,a=le,f=null,b=y(0),s=y(M),l=y(0);function o(t){var n,c=(t=U(t)).length,p,S,h=0,u=new Array(c),i=new Array(c),v=+b.apply(this,arguments),w=Math.min(M,Math.max(-M,s.apply(this,arguments)-v)),m,A=Math.min(Math.abs(w)/c,l.apply(this,arguments)),C=A*(w<0?-1:1),g;for(n=0;n<c;++n)(g=i[u[n]=n]=+e(t[n],n,t))>0&&(h+=g);for(a!=null?u.sort(function(x,D){return a(i[x],i[D])}):f!=null&&u.sort(function(x,D){return f(t[x],t[D])}),n=0,S=h?(w-c*C)/h:0;n<c;++n,v=m)p=u[n],g=i[p],m=v+(g>0?g*S:0)+C,i[p]={data:t[p],index:n,value:g,startAngle:v,endAngle:m,padAngle:A};return i}return o.value=function(t){return arguments.length?(e=typeof t=="function"?t:y(+t),o):e},o.sortValues=function(t){return arguments.length?(a=t,f=null,o):a},o.sort=function(t){return arguments.length?(f=t,a=null,o):f},o.startAngle=function(t){return arguments.length?(b=typeof t=="function"?t:y(+t),o):b},o.endAngle=function(t){return arguments.length?(s=typeof t=="function"?t:y(+t),o):s},o.padAngle=function(t){return arguments.length?(l=typeof t=="function"?t:y(+t),o):l},o}var de=ne.pie,z={sections:new Map,showData:!1},T=z.sections,F=z.showData,pe=structuredClone(de),ge=d(()=>structuredClone(pe),"getConfig"),fe=d(()=>{T=new Map,F=z.showData,re()},"clear"),me=d(({label:e,value:a})=>{if(a<0)throw new Error(`"${e}" has invalid value: ${a}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);T.has(e)||(T.set(e,a),_.debug(`added new section: ${e}, with value: ${a}`))},"addSection"),he=d(()=>T,"getSections"),ve=d(e=>{F=e},"setShowData"),ye=d(()=>F,"getShowData"),L={getConfig:ge,clear:fe,setDiagramTitle:K,getDiagramTitle:J,setAccTitle:Z,getAccTitle:Y,setAccDescription:q,getAccDescription:j,addSection:me,getSections:he,setShowData:ve,getShowData:ye},be=d((e,a)=>{ie(e,a),a.setShowData(e.showData),e.sections.map(a.addSection)},"populateDb"),Se={parse:d(async e=>{const a=await se("pie",e);_.debug(a),be(a,L)},"parse")},we=d(e=>`
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
`,"getStyles"),xe=we,De=d(e=>{const a=[...e.values()].reduce((s,l)=>s+l,0),f=[...e.entries()].map(([s,l])=>({label:s,value:l})).filter(s=>s.value/a*100>=1).sort((s,l)=>l.value-s.value);return ue().value(s=>s.value)(f)},"createPieArcs"),Ae=d((e,a,f,b)=>{_.debug(`rendering pie chart
`+e);const s=b.db,l=Q(),o=X(s.getConfig(),l.pie),t=40,n=18,c=4,p=450,S=p,h=ee(a),u=h.append("g");u.attr("transform","translate("+S/2+","+p/2+")");const{themeVariables:i}=l;let[v]=te(i.pieOuterStrokeWidth);v??=2;const w=o.textPosition,m=Math.min(S,p)/2-t,A=W().innerRadius(0).outerRadius(m),C=W().innerRadius(m*w).outerRadius(m*w);u.append("circle").attr("cx",0).attr("cy",0).attr("r",m+v/2).attr("class","pieOuterCircle");const g=s.getSections(),x=De(g),D=[i.pie1,i.pie2,i.pie3,i.pie4,i.pie5,i.pie6,i.pie7,i.pie8,i.pie9,i.pie10,i.pie11,i.pie12];let $=0;g.forEach(r=>{$+=r});const N=x.filter(r=>(r.data.value/$*100).toFixed(0)!=="0"),E=oe(D);u.selectAll("mySlices").data(N).enter().append("path").attr("d",A).attr("fill",r=>E(r.data.label)).attr("class","pieCircle"),u.selectAll("mySlices").data(N).enter().append("text").text(r=>(r.data.value/$*100).toFixed(0)+"%").attr("transform",r=>"translate("+C.centroid(r)+")").style("text-anchor","middle").attr("class","slice"),u.append("text").text(s.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText");const R=[...g.entries()].map(([r,I])=>({label:r,value:I})),k=u.selectAll(".legend").data(R).enter().append("g").attr("class","legend").attr("transform",(r,I)=>{const O=n+c,B=O*R.length/2,V=12*n,H=I*O-B;return"translate("+V+","+H+")"});k.append("rect").attr("width",n).attr("height",n).style("fill",r=>E(r.label)).style("stroke",r=>E(r.label)),k.append("text").attr("x",n+c).attr("y",n-c).text(r=>s.getShowData()?`${r.label} [${r.value}]`:r.label);const P=Math.max(...k.selectAll("text").nodes().map(r=>r?.getBoundingClientRect().width??0)),G=S+t+n+c+P;h.attr("viewBox",`0 0 ${G} ${p}`),ae(h,p,G,o.useMaxWidth)},"draw"),Ce={draw:Ae},Oe={parser:Se,db:L,renderer:Ce,styles:xe};export{Oe as diagram};

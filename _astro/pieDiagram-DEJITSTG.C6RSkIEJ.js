import{ac as w,a4 as R,aF as J,g as K,s as Q,a as ee,b as te,q as ae,p as ne,_ as u,l as I,c as re,F as ie,I as se,O as oe,e as le,z as ce,G as de}from"./MarkdownRenderer.Cx87hqgW.js";import{p as ue}from"./chunk-4BX2VUAB.DDesAgY7.js";import{p as ge}from"./wardley-RL74JXVD.Dm7wvQi-.js";import{d as B}from"./arc.D-hZURjW.js";import{o as pe}from"./ordinal.CjpNOYZ8.js";(function(){try{var e=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{};e.SENTRY_RELEASE={id:"f8138af835edca2ee672498d6824c7ebac88c16f"};var a=new e.Error().stack;a&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[a]="ad58a368-b654-4f24-bdd1-11312ebb330a",e._sentryDebugIdIdentifier="sentry-dbid-ad58a368-b654-4f24-bdd1-11312ebb330a")}catch{}})();function fe(e,a){return a<e?-1:a>e?1:a>=e?0:NaN}function he(e){return e}function me(){var e=he,a=fe,f=null,x=w(0),s=w(R),g=w(0);function o(t){var r,l=(t=J(t)).length,p,h,v=0,c=new Array(l),i=new Array(l),y=+x.apply(this,arguments),S=Math.min(R,Math.max(-R,s.apply(this,arguments)-y)),m,D=Math.min(Math.abs(S)/l,g.apply(this,arguments)),C=D*(S<0?-1:1),d;for(r=0;r<l;++r)(d=i[c[r]=r]=+e(t[r],r,t))>0&&(v+=d);for(a!=null?c.sort(function(b,A){return a(i[b],i[A])}):f!=null&&c.sort(function(b,A){return f(t[b],t[A])}),r=0,h=v?(S-l*C)/v:0;r<l;++r,y=m)p=c[r],d=i[p],m=y+(d>0?d*h:0)+C,i[p]={data:t[p],index:r,value:d,startAngle:y,endAngle:m,padAngle:D};return i}return o.value=function(t){return arguments.length?(e=typeof t=="function"?t:w(+t),o):e},o.sortValues=function(t){return arguments.length?(a=t,f=null,o):a},o.sort=function(t){return arguments.length?(f=t,a=null,o):f},o.startAngle=function(t){return arguments.length?(x=typeof t=="function"?t:w(+t),o):x},o.endAngle=function(t){return arguments.length?(s=typeof t=="function"?t:w(+t),o):s},o.padAngle=function(t){return arguments.length?(g=typeof t=="function"?t:w(+t),o):g},o}var ve=de.pie,F={sections:new Map,showData:!1},T=F.sections,_=F.showData,ye=structuredClone(ve),we=u(()=>structuredClone(ye),"getConfig"),xe=u(()=>{T=new Map,_=F.showData,ce()},"clear"),Se=u(({label:e,value:a})=>{if(a<0)throw new Error(`"${e}" has invalid value: ${a}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);T.has(e)||(T.set(e,a),I.debug(`added new section: ${e}, with value: ${a}`))},"addSection"),be=u(()=>T,"getSections"),Ae=u(e=>{_=e},"setShowData"),De=u(()=>_,"getShowData"),P={getConfig:we,clear:xe,setDiagramTitle:ne,getDiagramTitle:ae,setAccTitle:te,getAccTitle:ee,setAccDescription:Q,getAccDescription:K,addSection:Se,getSections:be,setShowData:Ae,getShowData:De},Ce=u((e,a)=>{ue(e,a),a.setShowData(e.showData),e.sections.map(a.addSection)},"populateDb"),Te={parse:u(async e=>{const a=await ge("pie",e);I.debug(a),Ce(a,P)},"parse")},$e=u(e=>`
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
`,"getStyles"),Ee=$e,ke=u(e=>{const a=[...e.values()].reduce((s,g)=>s+g,0),f=[...e.entries()].map(([s,g])=>({label:s,value:g})).filter(s=>s.value/a*100>=1);return me().value(s=>s.value).sort(null)(f)},"createPieArcs"),Me=u((e,a,f,x)=>{I.debug(`rendering pie chart
`+e);const s=x.db,g=re(),o=ie(s.getConfig(),g.pie),t=40,r=18,l=4,p=450,h=p,v=se(a),c=v.append("g");c.attr("transform","translate("+h/2+","+p/2+")");const{themeVariables:i}=g;let[y]=oe(i.pieOuterStrokeWidth);y??=2;const S=o.textPosition,m=Math.min(h,p)/2-t,D=B().innerRadius(0).outerRadius(m),C=B().innerRadius(m*S).outerRadius(m*S);c.append("circle").attr("cx",0).attr("cy",0).attr("r",m+y/2).attr("class","pieOuterCircle");const d=s.getSections(),b=ke(d),A=[i.pie1,i.pie2,i.pie3,i.pie4,i.pie5,i.pie6,i.pie7,i.pie8,i.pie9,i.pie10,i.pie11,i.pie12];let $=0;d.forEach(n=>{$+=n});const z=b.filter(n=>(n.data.value/$*100).toFixed(0)!=="0"),E=pe(A).domain([...d.keys()]);c.selectAll("mySlices").data(z).enter().append("path").attr("d",D).attr("fill",n=>E(n.data.label)).attr("class","pieCircle"),c.selectAll("mySlices").data(z).enter().append("text").text(n=>(n.data.value/$*100).toFixed(0)+"%").attr("transform",n=>"translate("+C.centroid(n)+")").style("text-anchor","middle").attr("class","slice");const V=c.append("text").text(s.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText"),W=[...d.entries()].map(([n,M])=>({label:n,value:M})),k=c.selectAll(".legend").data(W).enter().append("g").attr("class","legend").attr("transform",(n,M)=>{const O=r+l,Y=O*W.length/2,Z=12*r,H=M*O-Y;return"translate("+Z+","+H+")"});k.append("rect").attr("width",r).attr("height",r).style("fill",n=>E(n.label)).style("stroke",n=>E(n.label)),k.append("text").attr("x",r+l).attr("y",r-l).text(n=>s.getShowData()?`${n.label} [${n.value}]`:n.label);const U=Math.max(...k.selectAll("text").nodes().map(n=>n?.getBoundingClientRect().width??0)),j=h+t+r+l+U,G=V.node()?.getBoundingClientRect().width??0,q=h/2-G/2,X=h/2+G/2,L=Math.min(0,q),N=Math.max(j,X)-L;v.attr("viewBox",`${L} 0 ${N} ${p}`),le(v,p,N,o.useMaxWidth)},"draw"),Re={draw:Me},Le={parser:Te,db:P,renderer:Re,styles:Ee};export{Le as diagram};

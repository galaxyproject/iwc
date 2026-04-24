import{s as _,g as E,q as O,p as D,a as R,b as k,_ as l,I as F,z,F as $,G,D as b,l as P,K as W,e as B}from"./MarkdownRenderer.Cx87hqgW.js";import{p as V}from"./chunk-4BX2VUAB.DDesAgY7.js";import{p as H}from"./wardley-RL74JXVD.Dm7wvQi-.js";(function(){try{var e=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{};e.SENTRY_RELEASE={id:"f8138af835edca2ee672498d6824c7ebac88c16f"};var t=new e.Error().stack;t&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[t]="20186d21-0454-48aa-b17d-ea2039c19499",e._sentryDebugIdIdentifier="sentry-dbid-20186d21-0454-48aa-b17d-ea2039c19499")}catch{}})();var x={showLegend:!0,ticks:5,max:null,min:0,graticule:"circle"},w={axes:[],curves:[],options:x},h=structuredClone(w),j=G.radar,N=l(()=>$({...j,...b().radar}),"getConfig"),C=l(()=>h.axes,"getAxes"),Y=l(()=>h.curves,"getCurves"),q=l(()=>h.options,"getOptions"),K=l(e=>{h.axes=e.map(t=>({name:t.name,label:t.label??t.name}))},"setAxes"),U=l(e=>{h.curves=e.map(t=>({name:t.name,label:t.label??t.name,entries:X(t.entries)}))},"setCurves"),X=l(e=>{if(e[0].axis==null)return e.map(a=>a.value);const t=C();if(t.length===0)throw new Error("Axes must be populated before curves for reference entries");return t.map(a=>{const r=e.find(s=>s.axis?.$refText===a.name);if(r===void 0)throw new Error("Missing entry for axis "+a.label);return r.value})},"computeCurveEntries"),Z=l(e=>{const t=e.reduce((a,r)=>(a[r.name]=r,a),{});h.options={showLegend:t.showLegend?.value??x.showLegend,ticks:t.ticks?.value??x.ticks,max:t.max?.value??x.max,min:t.min?.value??x.min,graticule:t.graticule?.value??x.graticule}},"setOptions"),J=l(()=>{z(),h=structuredClone(w)},"clear"),f={getAxes:C,getCurves:Y,getOptions:q,setAxes:K,setCurves:U,setOptions:Z,getConfig:N,clear:J,setAccTitle:k,getAccTitle:R,setDiagramTitle:D,getDiagramTitle:O,getAccDescription:E,setAccDescription:_},Q=l(e=>{V(e,f);const{axes:t,curves:a,options:r}=e;f.setAxes(t),f.setCurves(a),f.setOptions(r)},"populate"),tt={parse:l(async e=>{const t=await H("radar",e);P.debug(t),Q(t)},"parse")},et=l((e,t,a,r)=>{const s=r.db,o=s.getAxes(),i=s.getCurves(),n=s.getOptions(),c=s.getConfig(),d=s.getDiagramTitle(),p=F(t),u=at(p,c),g=n.max??Math.max(...i.map(y=>Math.max(...y.entries))),m=n.min,v=Math.min(c.width,c.height)/2;rt(u,o,v,n.ticks,n.graticule),st(u,o,v,c),M(u,o,i,m,g,n.graticule,c),T(u,i,n.showLegend,c),u.append("text").attr("class","radarTitle").text(d).attr("x",0).attr("y",-c.height/2-c.marginTop)},"draw"),at=l((e,t)=>{const a=t.width+t.marginLeft+t.marginRight,r=t.height+t.marginTop+t.marginBottom,s={x:t.marginLeft+t.width/2,y:t.marginTop+t.height/2};return B(e,r,a,t.useMaxWidth??!0),e.attr("viewBox",`0 0 ${a} ${r}`),e.append("g").attr("transform",`translate(${s.x}, ${s.y})`)},"drawFrame"),rt=l((e,t,a,r,s)=>{if(s==="circle")for(let o=0;o<r;o++){const i=a*(o+1)/r;e.append("circle").attr("r",i).attr("class","radarGraticule")}else if(s==="polygon"){const o=t.length;for(let i=0;i<r;i++){const n=a*(i+1)/r,c=t.map((d,p)=>{const u=2*p*Math.PI/o-Math.PI/2,g=n*Math.cos(u),m=n*Math.sin(u);return`${g},${m}`}).join(" ");e.append("polygon").attr("points",c).attr("class","radarGraticule")}}},"drawGraticule"),st=l((e,t,a,r)=>{const s=t.length;for(let o=0;o<s;o++){const i=t[o].label,n=2*o*Math.PI/s-Math.PI/2;e.append("line").attr("x1",0).attr("y1",0).attr("x2",a*r.axisScaleFactor*Math.cos(n)).attr("y2",a*r.axisScaleFactor*Math.sin(n)).attr("class","radarAxisLine"),e.append("text").text(i).attr("x",a*r.axisLabelFactor*Math.cos(n)).attr("y",a*r.axisLabelFactor*Math.sin(n)).attr("class","radarAxisLabel")}},"drawAxes");function M(e,t,a,r,s,o,i){const n=t.length,c=Math.min(i.width,i.height)/2;a.forEach((d,p)=>{if(d.entries.length!==n)return;const u=d.entries.map((g,m)=>{const v=2*Math.PI*m/n-Math.PI/2,y=A(g,r,s,c),S=y*Math.cos(v),I=y*Math.sin(v);return{x:S,y:I}});o==="circle"?e.append("path").attr("d",L(u,i.curveTension)).attr("class",`radarCurve-${p}`):o==="polygon"&&e.append("polygon").attr("points",u.map(g=>`${g.x},${g.y}`).join(" ")).attr("class",`radarCurve-${p}`)})}l(M,"drawCurves");function A(e,t,a,r){const s=Math.min(Math.max(e,t),a);return r*(s-t)/(a-t)}l(A,"relativeRadius");function L(e,t){const a=e.length;let r=`M${e[0].x},${e[0].y}`;for(let s=0;s<a;s++){const o=e[(s-1+a)%a],i=e[s],n=e[(s+1)%a],c=e[(s+2)%a],d={x:i.x+(n.x-o.x)*t,y:i.y+(n.y-o.y)*t},p={x:n.x-(c.x-i.x)*t,y:n.y-(c.y-i.y)*t};r+=` C${d.x},${d.y} ${p.x},${p.y} ${n.x},${n.y}`}return`${r} Z`}l(L,"closedRoundCurve");function T(e,t,a,r){if(!a)return;const s=(r.width/2+r.marginRight)*3/4,o=-(r.height/2+r.marginTop)*3/4,i=20;t.forEach((n,c)=>{const d=e.append("g").attr("transform",`translate(${s}, ${o+c*i})`);d.append("rect").attr("width",12).attr("height",12).attr("class",`radarLegendBox-${c}`),d.append("text").attr("x",16).attr("y",0).attr("class","radarLegendText").text(n.label)})}l(T,"drawLegend");var nt={draw:et},ot=l((e,t)=>{let a="";for(let r=0;r<e.THEME_COLOR_LIMIT;r++){const s=e[`cScale${r}`];a+=`
		.radarCurve-${r} {
			color: ${s};
			fill: ${s};
			fill-opacity: ${t.curveOpacity};
			stroke: ${s};
			stroke-width: ${t.curveStrokeWidth};
		}
		.radarLegendBox-${r} {
			fill: ${s};
			fill-opacity: ${t.curveOpacity};
			stroke: ${s};
		}
		`}return a},"genIndexStyles"),it=l(e=>{const t=W(),a=b(),r=$(t,a.themeVariables),s=$(r.radar,e);return{themeVariables:r,radarOptions:s}},"buildRadarStyleOptions"),lt=l(({radar:e}={})=>{const{themeVariables:t,radarOptions:a}=it(e);return`
	.radarTitle {
		font-size: ${t.fontSize};
		color: ${t.titleColor};
		dominant-baseline: hanging;
		text-anchor: middle;
	}
	.radarAxisLine {
		stroke: ${a.axisColor};
		stroke-width: ${a.axisStrokeWidth};
	}
	.radarAxisLabel {
		dominant-baseline: middle;
		text-anchor: middle;
		font-size: ${a.axisLabelFontSize}px;
		color: ${a.axisColor};
	}
	.radarGraticule {
		fill: ${a.graticuleColor};
		fill-opacity: ${a.graticuleOpacity};
		stroke: ${a.graticuleColor};
		stroke-width: ${a.graticuleStrokeWidth};
	}
	.radarLegendText {
		text-anchor: start;
		font-size: ${a.legendFontSize}px;
		dominant-baseline: hanging;
	}
	${ot(t,a)}
	`},"styles"),pt={parser:tt,db:f,renderer:nt,styles:lt};export{pt as diagram};

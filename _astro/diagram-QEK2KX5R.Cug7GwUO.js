import{_ as l,s as S,g as _,q as O,p as D,a as R,b as k,H as F,y as G,D as $,E as b,F as P,l as z,K as H}from"./MarkdownRenderer.DkmkuT3B.js";import{p as V}from"./chunk-4BX2VUAB.-EDQbC8q.js";import{p as W}from"./treemap-KMMF4GRG.DRJ3SDlS.js";/* empty css                        */import"./_plugin-vue_export-helper.CtZ3T-b0.js";import"./runtime-core.esm-bundler.CnbQyne-.js";import"./_baseUniq.CTlg-xcK.js";import"./_basePickBy.D2YYNA_2.js";import"./clone.Cjuo5PcE.js";(function(){try{var e=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{};e.SENTRY_RELEASE={id:"628670734fe288291c533d53b2301d23a1f757c5"};var t=new e.Error().stack;t&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[t]="2974938e-4f23-47fc-a727-8a1d2941e2bb",e._sentryDebugIdIdentifier="sentry-dbid-2974938e-4f23-47fc-a727-8a1d2941e2bb")}catch{}})();var h={showLegend:!0,ticks:5,max:null,min:0,graticule:"circle"},w={axes:[],curves:[],options:h},m=structuredClone(w),B=P.radar,j=l(()=>$({...B,...b().radar}),"getConfig"),C=l(()=>m.axes,"getAxes"),N=l(()=>m.curves,"getCurves"),Y=l(()=>m.options,"getOptions"),q=l(e=>{m.axes=e.map(t=>({name:t.name,label:t.label??t.name}))},"setAxes"),K=l(e=>{m.curves=e.map(t=>({name:t.name,label:t.label??t.name,entries:U(t.entries)}))},"setCurves"),U=l(e=>{if(e[0].axis==null)return e.map(a=>a.value);const t=C();if(t.length===0)throw new Error("Axes must be populated before curves for reference entries");return t.map(a=>{const r=e.find(s=>s.axis?.$refText===a.name);if(r===void 0)throw new Error("Missing entry for axis "+a.label);return r.value})},"computeCurveEntries"),X=l(e=>{const t=e.reduce((a,r)=>(a[r.name]=r,a),{});m.options={showLegend:t.showLegend?.value??h.showLegend,ticks:t.ticks?.value??h.ticks,max:t.max?.value??h.max,min:t.min?.value??h.min,graticule:t.graticule?.value??h.graticule}},"setOptions"),Z=l(()=>{G(),m=structuredClone(w)},"clear"),f={getAxes:C,getCurves:N,getOptions:Y,setAxes:q,setCurves:K,setOptions:X,getConfig:j,clear:Z,setAccTitle:k,getAccTitle:R,setDiagramTitle:D,getDiagramTitle:O,getAccDescription:_,setAccDescription:S},J=l(e=>{V(e,f);const{axes:t,curves:a,options:r}=e;f.setAxes(t),f.setCurves(a),f.setOptions(r)},"populate"),Q={parse:l(async e=>{const t=await W("radar",e);z.debug(t),J(t)},"parse")},tt=l((e,t,a,r)=>{const s=r.db,o=s.getAxes(),i=s.getCurves(),n=s.getOptions(),c=s.getConfig(),d=s.getDiagramTitle(),u=F(t),p=et(u,c),g=n.max??Math.max(...i.map(y=>Math.max(...y.entries))),x=n.min,v=Math.min(c.width,c.height)/2;at(p,o,v,n.ticks,n.graticule),rt(p,o,v,c),M(p,o,i,x,g,n.graticule,c),T(p,i,n.showLegend,c),p.append("text").attr("class","radarTitle").text(d).attr("x",0).attr("y",-c.height/2-c.marginTop)},"draw"),et=l((e,t)=>{const a=t.width+t.marginLeft+t.marginRight,r=t.height+t.marginTop+t.marginBottom,s={x:t.marginLeft+t.width/2,y:t.marginTop+t.height/2};return e.attr("viewbox",`0 0 ${a} ${r}`).attr("width",a).attr("height",r),e.append("g").attr("transform",`translate(${s.x}, ${s.y})`)},"drawFrame"),at=l((e,t,a,r,s)=>{if(s==="circle")for(let o=0;o<r;o++){const i=a*(o+1)/r;e.append("circle").attr("r",i).attr("class","radarGraticule")}else if(s==="polygon"){const o=t.length;for(let i=0;i<r;i++){const n=a*(i+1)/r,c=t.map((d,u)=>{const p=2*u*Math.PI/o-Math.PI/2,g=n*Math.cos(p),x=n*Math.sin(p);return`${g},${x}`}).join(" ");e.append("polygon").attr("points",c).attr("class","radarGraticule")}}},"drawGraticule"),rt=l((e,t,a,r)=>{const s=t.length;for(let o=0;o<s;o++){const i=t[o].label,n=2*o*Math.PI/s-Math.PI/2;e.append("line").attr("x1",0).attr("y1",0).attr("x2",a*r.axisScaleFactor*Math.cos(n)).attr("y2",a*r.axisScaleFactor*Math.sin(n)).attr("class","radarAxisLine"),e.append("text").text(i).attr("x",a*r.axisLabelFactor*Math.cos(n)).attr("y",a*r.axisLabelFactor*Math.sin(n)).attr("class","radarAxisLabel")}},"drawAxes");function M(e,t,a,r,s,o,i){const n=t.length,c=Math.min(i.width,i.height)/2;a.forEach((d,u)=>{if(d.entries.length!==n)return;const p=d.entries.map((g,x)=>{const v=2*Math.PI*x/n-Math.PI/2,y=A(g,r,s,c),E=y*Math.cos(v),I=y*Math.sin(v);return{x:E,y:I}});o==="circle"?e.append("path").attr("d",L(p,i.curveTension)).attr("class",`radarCurve-${u}`):o==="polygon"&&e.append("polygon").attr("points",p.map(g=>`${g.x},${g.y}`).join(" ")).attr("class",`radarCurve-${u}`)})}l(M,"drawCurves");function A(e,t,a,r){const s=Math.min(Math.max(e,t),a);return r*(s-t)/(a-t)}l(A,"relativeRadius");function L(e,t){const a=e.length;let r=`M${e[0].x},${e[0].y}`;for(let s=0;s<a;s++){const o=e[(s-1+a)%a],i=e[s],n=e[(s+1)%a],c=e[(s+2)%a],d={x:i.x+(n.x-o.x)*t,y:i.y+(n.y-o.y)*t},u={x:n.x-(c.x-i.x)*t,y:n.y-(c.y-i.y)*t};r+=` C${d.x},${d.y} ${u.x},${u.y} ${n.x},${n.y}`}return`${r} Z`}l(L,"closedRoundCurve");function T(e,t,a,r){if(!a)return;const s=(r.width/2+r.marginRight)*3/4,o=-(r.height/2+r.marginTop)*3/4,i=20;t.forEach((n,c)=>{const d=e.append("g").attr("transform",`translate(${s}, ${o+c*i})`);d.append("rect").attr("width",12).attr("height",12).attr("class",`radarLegendBox-${c}`),d.append("text").attr("x",16).attr("y",0).attr("class","radarLegendText").text(n.label)})}l(T,"drawLegend");var st={draw:tt},nt=l((e,t)=>{let a="";for(let r=0;r<e.THEME_COLOR_LIMIT;r++){const s=e[`cScale${r}`];a+=`
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
		`}return a},"genIndexStyles"),ot=l(e=>{const t=H(),a=b(),r=$(t,a.themeVariables),s=$(r.radar,e);return{themeVariables:r,radarOptions:s}},"buildRadarStyleOptions"),it=l(({radar:e}={})=>{const{themeVariables:t,radarOptions:a}=ot(e);return`
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
	${nt(t,a)}
	`},"styles"),vt={parser:Q,db:f,renderer:st,styles:it};export{vt as diagram};

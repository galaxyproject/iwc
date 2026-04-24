import{_ as k,F as u,I as $,e as B,l as w,b as C,a as D,p as S,q as E,g as T,s as z,G as F,D as P,z as _}from"./MarkdownRenderer.Cx87hqgW.js";import{p as A}from"./chunk-4BX2VUAB.DDesAgY7.js";import{p as W}from"./wardley-RL74JXVD.Dm7wvQi-.js";(function(){try{var t=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{};t.SENTRY_RELEASE={id:"f8138af835edca2ee672498d6824c7ebac88c16f"};var e=new t.Error().stack;e&&(t._sentryDebugIds=t._sentryDebugIds||{},t._sentryDebugIds[e]="d2d1fe5b-16bc-4e18-8d71-f2561e45c838",t._sentryDebugIdIdentifier="sentry-dbid-d2d1fe5b-16bc-4e18-8d71-f2561e45c838")}catch{}})();var I=F.packet,y=class{constructor(){this.packet=[],this.setAccTitle=C,this.getAccTitle=D,this.setDiagramTitle=S,this.getDiagramTitle=E,this.getAccDescription=T,this.setAccDescription=z}static{k(this,"PacketDB")}getConfig(){const t=u({...I,...P().packet});return t.showBits&&(t.paddingY+=10),t}getPacket(){return this.packet}pushWord(t){t.length>0&&this.packet.push(t)}clear(){_(),this.packet=[]}},N=1e4,L=k((t,e)=>{A(t,e);let r=-1,s=[],n=1;const{bitsPerRow:l}=e.getConfig();for(let{start:a,end:i,bits:d,label:c}of t.blocks){if(a!==void 0&&i!==void 0&&i<a)throw new Error(`Packet block ${a} - ${i} is invalid. End must be greater than start.`);if(a??=r+1,a!==r+1)throw new Error(`Packet block ${a} - ${i??a} is not contiguous. It should start from ${r+1}.`);if(d===0)throw new Error(`Packet block ${a} is invalid. Cannot have a zero bit field.`);for(i??=a+(d??1)-1,d??=i-a+1,r=i,w.debug(`Packet block ${a} - ${r} with label ${c}`);s.length<=l+1&&e.getPacket().length<N;){const[p,o]=Y({start:a,end:i,bits:d,label:c},n,l);if(s.push(p),p.end+1===n*l&&(e.pushWord(s),s=[],n++),!o)break;({start:a,end:i,bits:d,label:c}=o)}}e.pushWord(s)},"populate"),Y=k((t,e,r)=>{if(t.start===void 0)throw new Error("start should have been set during first phase");if(t.end===void 0)throw new Error("end should have been set during first phase");if(t.start>t.end)throw new Error(`Block start ${t.start} is greater than block end ${t.end}.`);if(t.end+1<=e*r)return[t,void 0];const s=e*r-1,n=e*r;return[{start:t.start,end:s,label:t.label,bits:s-t.start},{start:n,end:t.end,label:t.label,bits:t.end-n}]},"getNextFittingBlock"),m={parser:{yy:void 0},parse:k(async t=>{const e=await W("packet",t),r=m.parser?.yy;if(!(r instanceof y))throw new Error("parser.parser?.yy was not a PacketDB. This is due to a bug within Mermaid, please report this issue at https://github.com/mermaid-js/mermaid/issues.");w.debug(e),L(e,r)},"parse")},M=k((t,e,r,s)=>{const n=s.db,l=n.getConfig(),{rowHeight:a,paddingY:i,bitWidth:d,bitsPerRow:c}=l,p=n.getPacket(),o=n.getDiagramTitle(),g=a+i,f=g*(p.length+1)-(o?0:a),h=d*c+2,b=$(e);b.attr("viewBox",`0 0 ${h} ${f}`),B(b,f,h,l.useMaxWidth);for(const[v,x]of p.entries())R(b,x,v,l);b.append("text").text(o).attr("x",h/2).attr("y",f-g/2).attr("dominant-baseline","middle").attr("text-anchor","middle").attr("class","packetTitle")},"draw"),R=k((t,e,r,{rowHeight:s,paddingX:n,paddingY:l,bitWidth:a,bitsPerRow:i,showBits:d})=>{const c=t.append("g"),p=r*(s+l)+l;for(const o of e){const g=o.start%i*a+1,f=(o.end-o.start+1)*a-n;if(c.append("rect").attr("x",g).attr("y",p).attr("width",f).attr("height",s).attr("class","packetBlock"),c.append("text").attr("x",g+f/2).attr("y",p+s/2).attr("class","packetLabel").attr("dominant-baseline","middle").attr("text-anchor","middle").text(o.label),!d)continue;const h=o.end===o.start,b=p-2;c.append("text").attr("x",g+(h?f/2:0)).attr("y",b).attr("class","packetByte start").attr("dominant-baseline","auto").attr("text-anchor",h?"middle":"start").text(o.start),h||c.append("text").attr("x",g+f).attr("y",b).attr("class","packetByte end").attr("dominant-baseline","auto").attr("text-anchor","end").text(o.end)}},"drawWord"),G={draw:M},O={byteFontSize:"10px",startByteColor:"black",endByteColor:"black",labelColor:"black",labelFontSize:"12px",titleColor:"black",titleFontSize:"14px",blockStrokeColor:"black",blockStrokeWidth:"1",blockFillColor:"#efefef"},j=k(({packet:t}={})=>{const e=u(O,t);return`
	.packetByte {
		font-size: ${e.byteFontSize};
	}
	.packetByte.start {
		fill: ${e.startByteColor};
	}
	.packetByte.end {
		fill: ${e.endByteColor};
	}
	.packetLabel {
		fill: ${e.labelColor};
		font-size: ${e.labelFontSize};
	}
	.packetTitle {
		fill: ${e.titleColor};
		font-size: ${e.titleFontSize};
	}
	.packetBlock {
		stroke: ${e.blockStrokeColor};
		stroke-width: ${e.blockStrokeWidth};
		fill: ${e.blockFillColor};
	}
	`},"styles"),U={parser:m,get db(){return new y},renderer:G,styles:j};export{U as diagram};

import{A as c}from"./runtime-core.esm-bundler.CqOkuUpN.js";(function(){try{var e=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{};e.SENTRY_RELEASE={id:"4a18dac1384509038f0a89ae507bd0675272490d"};var t=new e.Error().stack;t&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[t]="a965274d-9cb2-466c-a103-9c62b3684787",e._sentryDebugIdIdentifier="sentry-dbid-a965274d-9cb2-466c-a103-9c62b3684787")}catch{}})();/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),h=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(t,r,o)=>o?o.toUpperCase():r.toLowerCase()),b=e=>{const t=h(e);return t.charAt(0).toUpperCase()+t.slice(1)},p=(...e)=>e.filter((t,r,o)=>!!t&&t.trim()!==""&&o.indexOf(t)===r).join(" ").trim(),w=e=>e==="";/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var n={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=({name:e,iconNode:t,absoluteStrokeWidth:r,"absolute-stroke-width":o,strokeWidth:s,"stroke-width":d,size:i=n.width,color:f=n.stroke,...a},{slots:l})=>c("svg",{...n,...a,width:i,height:i,stroke:f,"stroke-width":w(r)||w(o)||r===!0||o===!0?Number(s||d||n["stroke-width"])*24/Number(i):s||d||n["stroke-width"],class:p("lucide",a.class,...e?[`lucide-${u(b(e))}-icon`,`lucide-${u(e)}`]:["lucide-icon"])},[...t.map(g=>c(...g)),...l.default?[l.default()]:[]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=(e,t)=>(r,{slots:o,attrs:s})=>c(y,{...s,...r,iconNode:t,name:e},o);export{C as c};

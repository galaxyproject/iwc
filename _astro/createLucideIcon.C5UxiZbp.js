import{A as i}from"./runtime-core.esm-bundler.CnbQyne-.js";(function(){try{var e=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{};e.SENTRY_RELEASE={id:"628670734fe288291c533d53b2301d23a1f757c5"};var t=new e.Error().stack;t&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[t]="a965274d-9cb2-466c-a103-9c62b3684787",e._sentryDebugIdIdentifier="sentry-dbid-a965274d-9cb2-466c-a103-9c62b3684787")}catch{}})();/**
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
 */const y=({name:e,iconNode:t,absoluteStrokeWidth:r,"absolute-stroke-width":o,strokeWidth:s,"stroke-width":d,size:c=n.width,color:f=n.stroke,...a},{slots:l})=>i("svg",{...n,...a,width:c,height:c,stroke:f,"stroke-width":w(r)||w(o)||r===!0||o===!0?Number(s||d||n["stroke-width"])*24/Number(c):s||d||n["stroke-width"],class:p("lucide",a.class,...e?[`lucide-${u(b(e))}-icon`,`lucide-${u(e)}`]:["lucide-icon"])},[...t.map(g=>i(...g)),...l.default?[l.default()]:[]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=(e,t)=>(r,{slots:o,attrs:s})=>i(y,{...s,...r,iconNode:t,name:e},o);export{C as c};

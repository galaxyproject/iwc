import{A as d}from"./runtime-core.esm-bundler.Md8BAuu6.js";(function(){try{var e=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{};e.SENTRY_RELEASE={id:"3fdc3f0814c07e38ffaf82f7f252ddd5c93af397"};var t=new e.Error().stack;t&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[t]="a965274d-9cb2-466c-a103-9c62b3684787",e._sentryDebugIdIdentifier="sentry-dbid-a965274d-9cb2-466c-a103-9c62b3684787")}catch{}})();/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),h=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(t,r,o)=>o?o.toUpperCase():r.toLowerCase()),b=e=>{const t=h(e);return t.charAt(0).toUpperCase()+t.slice(1)},p=(...e)=>e.filter((t,r,o)=>!!t&&t.trim()!==""&&o.indexOf(t)===r).join(" ").trim(),u=e=>e==="";/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var n={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=({name:e,iconNode:t,absoluteStrokeWidth:r,"absolute-stroke-width":o,strokeWidth:s,"stroke-width":i,size:c=n.width,color:w=n.stroke,...a},{slots:l})=>d("svg",{...n,...a,width:c,height:c,stroke:w,"stroke-width":u(r)||u(o)||r===!0||o===!0?Number(s||i||n["stroke-width"])*24/Number(c):s||i||n["stroke-width"],class:p("lucide",a.class,...e?[`lucide-${f(b(e))}-icon`,`lucide-${f(e)}`]:["lucide-icon"])},[...t.map(g=>d(...g)),...l.default?[l.default()]:[]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=(e,t)=>(r,{slots:o,attrs:s})=>d(y,{...s,...r,iconNode:t,name:e},o);export{C as c};

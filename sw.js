if(!self.define){let e,s={};const n=(n,o)=>(n=new URL(n+".js",o).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(o,i)=>{const r=e||("document"in self?document.currentScript.src:"")||location.href;if(s[r])return;let t={};const l=e=>n(e,r),d={module:{uri:r},exports:t,require:l};s[r]=Promise.all(o.map((e=>d[e]||l(e)))).then((e=>(i(...e),t)))}}define(["./workbox-635efa76"],(function(e){"use strict";e.setCacheNameDetails({prefix:"bokstavboks"}),self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"assets/index-DSqCFObk.js",revision:null},{url:"assets/workbox-window.prod.es5-D5gOYdM7.js",revision:null},{url:"assets/index-BL8pj76n.css",revision:null},{url:"logo192.png",revision:"ca507b66aa82f9da750142e046871b6d"},{url:"logo512.png",revision:"d662695d2646470f9e90dbdcdc0e7ab1"},{url:"manifest.webmanifest",revision:"dc09d869ba239ab30eaaaf38aaf82aba"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"))),e.registerRoute((({url:e})=>e.pathname.endsWith(".json")),new e.NetworkFirst,"GET")}));

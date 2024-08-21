(function(r,y){typeof exports=="object"&&typeof module<"u"?module.exports=y():typeof define=="function"&&define.amd?define(y):(r=typeof globalThis<"u"?globalThis:r||self,r._df=y())})(this,function(){"use strict";var r=globalThis&&globalThis.__awaiter||function(i,t,n,e){function s(u){return u instanceof n?u:new n(function(o){o(u)})}return new(n||(n=Promise))(function(u,o){function h(a){try{d(e.next(a))}catch(f){o(f)}}function l(a){try{d(e.throw(a))}catch(f){o(f)}}function d(a){a.done?u(a.value):s(a.value).then(h,l)}d((e=e.apply(i,t||[])).next())})};class y{constructor({batchSize:t,timeout:n,executeBatch:e,setTimeout:s,clearTimeout:u,baseDelay:o,retries:h}){this.queue=[],this.batchSize=t,this.timeout=n,this.timeoutHandle=null,this.executeBatch=e,this.setTimeout=s,this.clearTimeout=u,this.pending=null,this.baseDelay=o??500,this.retries=h??5}submit(t){this.queue.push(t),this.queue.length>=this.batchSize?this.flush():this.queue.length===1&&this.startTimer()}startTimer(){this.timeoutHandle=this.setTimeout(()=>this.flush(),this.timeout)}clearTimer(){this.timeoutHandle&&(this.clearTimeout(this.timeoutHandle),this.timeoutHandle=null)}flush(){return r(this,void 0,void 0,function*(){if(this.clearTimer(),this.queue.length!==0){if(this.pending)return this.pending;try{this.pending=this.flushInner(),yield this.pending}catch(t){throw t}finally{this.pending=null}}})}flushInner(){return r(this,void 0,void 0,function*(){for(;this.queue.length>0;){const t=this.queue.slice(0,this.batchSize);this.queue=this.queue.slice(this.batchSize),yield this.executeBatchWithRetry(t)}})}executeBatchWithRetry(t){return r(this,void 0,void 0,function*(){yield this.retryWithExponentialBackoff(()=>r(this,void 0,void 0,function*(){yield this.executeBatch(t)}))})}retryWithExponentialBackoff(t){return r(this,void 0,void 0,function*(){const n=Math.max(0,this.retries);for(let e=0;e<=n;e++)try{return yield t()}catch(s){if(e===n)throw s;const u=this.baseDelay*Math.pow(2,e);yield new Promise(o=>setTimeout(o,u))}throw new Error("This line should never be reached")})}}var w=globalThis&&globalThis.__awaiter||function(i,t,n,e){function s(u){return u instanceof n?u:new n(function(o){o(u)})}return new(n||(n=Promise))(function(u,o){function h(a){try{d(e.next(a))}catch(f){o(f)}}function l(a){try{d(e.throw(a))}catch(f){o(f)}}function d(a){a.done?u(a.value):s(a.value).then(h,l)}d((e=e.apply(i,t||[])).next())})},m;(function(i){i.Identify="identify",i.Track="track",i.Page="page",i.Screen="screen"})(m||(m={}));class S{constructor({issueRequest:t,writeKey:n,host:e="https://dittofeed.com",uuid:s,setTimeout:u,clearTimeout:o,baseDelay:h,retries:l}){this.batchQueue=new y({timeout:500,batchSize:5,setTimeout:u,clearTimeout:o,baseDelay:h,retries:l,executeBatch:d=>w(this,void 0,void 0,function*(){yield t({batch:d},{writeKey:n,host:e})})}),this.uuid=s}identify(t){var n;const e=Object.assign({messageId:(n=t.messageId)!==null&&n!==void 0?n:this.uuid(),type:m.Identify},t);this.batchQueue.submit(e)}track(t){var n;const e=Object.assign({messageId:(n=t.messageId)!==null&&n!==void 0?n:this.uuid(),type:m.Track},t);this.batchQueue.submit(e)}page(t){var n;const e=Object.assign({messageId:(n=t.messageId)!==null&&n!==void 0?n:this.uuid(),type:m.Page},t);this.batchQueue.submit(e)}screen(t){var n;const e=Object.assign({messageId:(n=t.messageId)!==null&&n!==void 0?n:this.uuid(),type:m.Screen},t);this.batchQueue.submit(e)}flush(){return w(this,void 0,void 0,function*(){yield this.batchQueue.flush()})}}let b;const k=new Uint8Array(16);function x(){if(!b&&(b=typeof crypto<"u"&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!b))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return b(k)}const c=[];for(let i=0;i<256;++i)c.push((i+256).toString(16).slice(1));function I(i,t=0){return(c[i[t+0]]+c[i[t+1]]+c[i[t+2]]+c[i[t+3]]+"-"+c[i[t+4]]+c[i[t+5]]+"-"+c[i[t+6]]+c[i[t+7]]+"-"+c[i[t+8]]+c[i[t+9]]+"-"+c[i[t+10]]+c[i[t+11]]+c[i[t+12]]+c[i[t+13]]+c[i[t+14]]+c[i[t+15]]).toLowerCase()}const v={randomUUID:typeof crypto<"u"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};function U(i,t,n){if(v.randomUUID&&!t&&!i)return v.randomUUID();i=i||{};const e=i.random||(i.rng||x)();if(e[6]=e[6]&15|64,e[8]=e[8]&63|128,t){n=n||0;for(let s=0;s<16;++s)t[n+s]=e[s];return t}return I(e)}const T=class g{static async init(t){if(!g.instance){const n=new S({uuid:()=>U(),issueRequest:async(e,{host:s="https://dittofeed.com",writeKey:u})=>{const o=`${s}/api/public/apps/batch`,l=await fetch(o,{method:"POST",headers:{authorization:u,"Content-Type":"application/json"},body:JSON.stringify(e)});if(!l.ok)throw new Error(`HTTP error! status: ${l.status}`)},setTimeout:(e,s)=>window.setTimeout(e,s),clearTimeout:e=>window.clearTimeout(e),...t});g.instance=new g(n)}return g.instance}constructor(t){this.baseSdk=t}static identify(t){if(this.instance)return this.instance.baseSdk.identify(t)}static track(t){if(this.instance)return this.instance.baseSdk.track(t)}static page(t){if(this.instance)return this.instance.baseSdk.page(t)}static screen(t){if(this.instance)return this.instance.baseSdk.screen(t)}static flush(){if(this.instance)return this.instance.baseSdk.flush()}};T.instance=null;let p=T;function _(){const i=document.getElementById("df-tracker");if(!i)return null;const t=i.getAttribute("data-write-key");return t?{writeKey:t,host:i.getAttribute("data-host")??void 0}:null}return async function(){const t=_();if(t){const n=window._df;await p.init(t),Array.isArray(n)&&n.forEach(e=>{if(Array.isArray(e)&&e.length>0){const s=e[0];p[s].apply(p,e.slice(1))}}),window._df=p}}(),p});

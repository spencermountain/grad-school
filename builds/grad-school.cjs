!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e="undefined"!=typeof globalThis?globalThis:e||self).nlp=t()}(this,(function(){"use strict";const e=/^ *(#|\/\/)/,t=function(e){let t=e.trim().split(/->/),n=[];t.forEach((e=>{n=n.concat(function(e){if(!(e=e.trim()))return null;if(/^\[/.test(e)&&/\]$/.test(e)){let t=(e=(e=e.replace(/^\[/,"")).replace(/\]$/,"")).split(/,/);return t=t.map((e=>e.trim())).filter((e=>e)),t=t.map((e=>({id:e,children:[],_cache:{}}))),t}return[{id:e,children:[],_cache:{}}]}(e))})),n=n.filter((e=>e));let r=n[0];for(let e=1;e<n.length;e+=1)r.children.push(n[e]),r=n[e];return n[0]},n=function(n=[]){return"string"==typeof n?function(n){let r=n.split(/\r?\n/),i=[];r.forEach((n=>{if(!n.trim()||e.test(n))return;let r=(e=>{const t=/^(  |\t)/;let n=0;for(;t.test(e);)e=e.replace(t,""),n+=1;return n})(n);i.push({indent:r,node:t(n)})}));let o=function(e){let t={children:[]};return e.forEach(((n,r)=>{0===n.indent?t.children=t.children.concat(n.node):e[r-1]&&function(e,t){let n=e[t].indent;for(;t>=0;t-=1)if(e[t].indent<n)return e[t];return e[0]}(e,r).node.children.push(n.node)})),t}(i);return o._cache={parents:0},o}(n):(r=n,"[object Array]"===Object.prototype.toString.call(r)?function(e){let t={};e.forEach((e=>{t[e.id]=e,e.children=e.children||[]}));let n={children:[]};return e.forEach((e=>{e.parent?t.hasOwnProperty(e.parent)?t[e.parent].children.push(e):console.warn(`[Grad] - missing node '${e.parent}'`):n.children.push(e)})),n}(n):n);var r},r={},i=e=>{let t=[],n=[e];for(;n.length>0;){let e=n.pop();e._cache=e._cache||{parents:0},t.push(e),e.children&&e.children.forEach((t=>{t._cache=t._cache||{},t._cache.parents=e._cache.parents+1,n.push(t)}))}return t},o="[0m",l=e=>"[31m"+e+o,c=e=>"[2m"+e+o,s=/\//;class h{constructor(e={}){Object.defineProperty(this,"json",{enumerable:!1,value:e,writable:!0})}get children(){return this.json.children}get label(){return this.json.label}get props(){return this.json.props||{}}set props(e){this.json.props=this.json.props||{};let t=this.json.props;"string"==typeof e&&(t[e]=!0),Object.assign(t,e)}get(e){if(e=(e||"").trim(),!s.test(e)){let t=this.children.find((t=>t.label===e));return new h(t)}let t=function(e,t){let n=function(e){return"string"!=typeof(e=e||"")?e:(e=e.replace(/^\//,"")).split(/\//)}(t);for(let t=0;t<n.length;t+=1){let r=e.children.find((e=>e.label===n[t]));if(!r)return null;e=r}return e}(this,e);return new h(t)}cache(){return i(this.json),this}list(){return i(this.json)}fillDown(){return fillDown(this.json),this}out(){return function(e,t="ascii"){return r.hasOwnProperty(t)?r[t](e):r.ascii(e)}(this.json)}debug(){var e;return e=this.json,i(e).forEach(((e,t)=>{let n=l(e.id||"");(0!==t||e.id)&&console.log("     ".repeat(e._cache.parents)+c("→ ")+n)})),this}}const u=function(e){let t=n(e);return new h(t)};return u.prototype.plugin=function(e){e(this)},u}));
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).ClusterMap={})}(this,(function(t){"use strict";function e(t){if(t.defaultPrevented)return;let e=d3.select(t.target),a=prompt("Enter new value:",e.text());a&&e.text(a)}function a(t,e){for(const[n,r]of Object.entries(e))t.hasOwnProperty(n)&&((l=r)&&l.constructor===Object?a(t[n],r):t[n]=r);var l}function l(t,e=.6){let a=d3.color(t).rgb();return d3.rgb(255*(1-e)+e*a.r,255*(1-e)+e*a.g,255*(1-e)+e*a.b)}function n(t,e){return Math.max(Math.min(d3.bisectLeft(t,e),t.length-1),0)}function r(t,e,a){let l=u[t].domain(),n=u[t].range();n[l.indexOf(e)]=a,u[t].range(n)}const s=Object.assign({},{plot:{transitionDuration:250,scaleFactor:15,scaleGenes:!0,fontFamily:'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", Oxygen, Cantarell, sans-serif'},legend:{entryHeight:18,fontSize:14,onClickCircle:null,onClickText:null,show:!0,marginLeft:20},colourBar:{fontSize:10,height:12,show:!0,width:150,marginTop:20},scaleBar:{colour:"black",fontSize:10,height:12,basePair:2500,show:!0,stroke:1,marginTop:20},link:{show:!0,asLine:!1,straight:!1,threshold:0,strokeWidth:.5,groupColour:!1,bestOnly:!1,label:{show:!1,fontSize:10,background:!0,position:.5}},cluster:{nameFontSize:12,lociFontSize:10,hideLocusCoordinates:!1,spacing:40,alignLabels:!0},locus:{trackBar:{colour:"#111",stroke:1},spacing:50},gene:{shape:{bodyHeight:12,tipHeight:5,tipLength:12,onClick:null,stroke:"black",strokeWidth:1},label:{anchor:"start",fontSize:10,rotation:25,position:"top",spacing:2,show:!1,start:.5,name:"uid"}}}),o={isDragging:!1};function i(t,e){return d3.select(`#${e}_${t}`)}const c={gene:t=>i(t,"gene"),locus:t=>i(t,"locus"),cluster:t=>i(t,"cluster"),geneData:t=>c.gene(t).datum(),locusData:t=>c.locus(t).datum(),clusterData:t=>c.cluster(t).datum(),matrix:t=>t.node().transform.baseVal[0].matrix},d={legendTransform:t=>{let[e,a]=g.extent(t.clusters);return`translate(${a+s.legend.marginLeft}, 0)`},bottomY:()=>{let t=u.y.range(),e=s.gene.shape.bodyHeight+2*s.gene.shape.tipHeight;return t[t.length-1]+e},colourBarTransform:()=>`translate(${s.plot.scaleGenes?u.x(s.scaleBar.basePair)+20:0}, ${d.bottomY()+s.colourBar.marginTop})`,scaleBarTransform:()=>`translate(0, ${d.bottomY()+s.scaleBar.marginTop})`,updateConfig:function(t){a(s,t)},update:null,data:null},u={x:d3.scaleLinear().domain([1,1001]).range([0,s.plot.scaleFactor]),y:d3.scaleOrdinal(),group:d3.scaleOrdinal().unknown(null),colour:d3.scaleOrdinal().unknown("#bbb"),name:d3.scaleOrdinal().unknown("None"),score:d3.scaleSequential(d3.interpolateGreys).domain([0,1]),offset:d3.scaleOrdinal(),locus:d3.scaleOrdinal()},p={getId:t=>`gene_${t.uid}`,fill:t=>{if(t.colour)return t.colour;if(!u.group)return"#bbb";let e=u.group(t.uid);return u.colour(e)},points:t=>{let e=[],a=u.x(t.start),l=u.x(t.end),n=l-a,r=2*s.gene.shape.tipHeight+s.gene.shape.bodyHeight,o=r/2,i=s.gene.shape.tipHeight+s.gene.shape.bodyHeight;if(1===t.strand){let t=l-s.gene.shape.tipLength;e=[a,s.gene.shape.tipHeight,t,s.gene.shape.tipHeight,t,0,l,o,t,r,t,i,a,i],n<s.gene.shape.tipLength&&[2,4,8,10].forEach((t=>e[t]=a))}else{let t=a+s.gene.shape.tipLength;e=[l,s.gene.shape.tipHeight,t,s.gene.shape.tipHeight,t,0,a,o,t,r,t,i,l,i],n<s.gene.shape.tipLength&&[2,4,8,10].forEach((t=>e[t]=l))}return e.join(" ")},labelTransform:t=>{let e,a=u.x(t.end-t.start)*s.gene.label.start,l=u.x(t.start)+a;return e="middle"===s.gene.label.position?s.gene.shape.tipHeight+s.gene.shape.bodyHeight/2:"bottom"===s.gene.label.position?2*s.gene.shape.tipHeight+s.gene.shape.bodyHeight+s.gene.label.spacing:-s.gene.label.spacing,`translate(${l}, ${e}) rotate(${["start","middle"].includes(s.gene.label.anchor)?-s.gene.label.rotation:s.gene.label.rotation})`},labelDy:()=>{switch(s.gene.label.position){case"top":return"-0.4em";case"middle":return"0.4em";case"bottom":return"0.8em"}},tooltipHTML:t=>{let e=d3.create("div").attr("class","tooltip-contents").style("display","flex").style("flex-direction","column");e.append("text").text("Edit label");let a=e.append("input").attr("type","input").attr("value",t.label||t.uid);e.append("text").text("Gene qualifiers");let l=e.append("select").attr("multiple",!0);l.selectAll("option").data(Object.keys(t.names)).join("option").text((e=>`${t.names[e]} [${e}]`)).attr("value",(e=>t.names[e]));let n=e.append("div").style("margin-top","2px").append("text"),r=u.group(t.uid);return n.append("tspan").text("Similarity group: "),n.append("tspan").text(u.name(r)).style("color",u.colour(r)).style("font-weight","bold"),e.append("label").append("text").text("Choose gene colour: ").append("input").attr("type","color").attr("default",u.colour(r)).on("change",(e=>{t.colour=e.target.value,d.update()})),e.append("button").text("Anchor map on gene").on("click",(e=>p.anchor(e,t,!0))),a.on("input",(e=>{t.label=e.target.value,l.attr("value",null),d.update({})})),l.on("change",(e=>{t.label=e.target.value,a.attr("value",e.target.value),d.update({})})),e},contextMenu:(t,e)=>{t.preventDefault();let a=d3.select("div.tooltip");a.html(""),a.append((()=>p.tooltipHTML(e).node()));let l=t.target.getBoundingClientRect(),n=a.node().getBoundingClientRect(),r=l.width/2-n.width/2,s=1.2*l.height;a.style("left",l.x+r+"px").style("top",l.y+s+"px"),a.transition().duration(100).style("opacity",1).style("pointer-events","all"),a.transition().delay(1e3).style("opacity",0).style("pointer-events","none")},labelText:t=>t.label||t.uid,polygonClass:t=>{let e=u.group(t.uid);return null!==e?`genePolygon group-${e}`:"genePolygon"},update:t=>(t.selectAll("polygon").attr("class",p.polygonClass).attr("points",p.points).attr("fill",p.fill).style("stroke",s.gene.shape.stroke).style("stroke-width",s.gene.shape.strokeWidth),t.selectAll("text.geneLabel").text(p.labelText).attr("dy",p.labelDy).attr("display",s.gene.label.show?"inherit":"none").attr("transform",p.labelTransform).attr("font-size",s.gene.label.fontSize).attr("text-anchor",s.gene.label.anchor),t),anchor:(t,e,a=!1)=>{let l=u.offset.domain(),n=u.offset.range(),r=new Map;if(u.group.domain().filter((t=>{let a=u.group(t),l=u.group(e.uid);return null!==a&&a===l})).forEach((t=>{let l=c.geneData(t);if(a&&l.strand!==e.strand){let t=c.locusData(l._locus);h.flip(t),h.updateScaling(t)}r.has(l._cluster)?r.get(l._cluster).push(t):r.set(l._cluster,[t])})),0===r.length)return;let s=t=>u.x(t.start+(t.end-t.start)/2)+u.locus(t._locus)+u.offset(t._cluster),o=s(e),i=t=>{if(t.includes(e.uid))return 0;let a=t.map((t=>(t=>{let e=c.geneData(t);return o-s(e)})(t)));return a[d3.minIndex(a,(t=>Math.abs(t)))]};for(const[t,e]of r.entries()){n[l.findIndex((e=>e===t))]+=i(e)}u.offset.range(n),d.update()}},g={getId:t=>`cluster_${t.uid}`,transform:t=>`translate(${u.offset(t.uid)}, ${u.y(t.uid)})`,locusText:t=>t.loci.map((t=>{let e,a;if(t._bio_start){let l=t._start-t.start,n=t.end-t._end;t._flipped&&([l,n]=[n,l]),e=t._bio_start+l+1,a=t._bio_end-n}else e=t._start+1,a=t._end;t._flipped&&([e,a]=[a,e]);let l=t._flipped?" (reversed)":"";return s.cluster.hideLocusCoordinates||null==t._start||null==t._end?`${t.name}${l}`:`${t.name}${l}:${e.toFixed(0)}-${a.toFixed(0)}`})).join(", "),extentOne:(t,e)=>{let a,l;e=e||[];for(let n of t.loci){if(e.includes(n.uid))continue;let r=u.offset(t.uid)+u.locus(n.uid),s=u.x(n._start)+r,o=u.x(n._end)+r;(!a||a&&s<a)&&(a=s),(!l||l&&o>l)&&(l=o)}return[a,l]},extent:t=>{let e,a;t=t||[];for(const l of u.offset.domain()){let n=c.clusterData(l),[r,s]=g.extentOne(n,t);(!e||e&&r<e)&&(e=r),(!a||a&&s>a)&&(a=s)}return[e,a]},adjacent:(t,e)=>{let a=c.cluster(t).datum(),l=c.cluster(e).datum();return 1===Math.abs(a.slot-l.slot)},getRange:t=>{let e,a,l,n=[],r=1;for(const[o,i]of t.loci.entries())o>0&&(r=n[n.length-1]+a-e+s.locus.spacing),l=u.locus(i.uid)||0,e=u.x(i._start||i.start),a=u.x(i._end||i.end),n.push(r-e+l);return n},getLocusScaleValues:t=>{let e=[],a=[];return t.forEach((t=>{let l=t.loci.map((t=>t.uid)),n=g.getRange(t);e.push(...l),a.push(...n)})),[e,a]},alignLabels:t=>{let[e,a]=g.extent();return t.attr("transform",(t=>`translate(${e-u.offset(t.uid)-10}, 0)`))},update:t=>(t.selectAll("g.locus").each(h.updateScaling),t.attr("transform",g.transform),s.cluster.alignLabels?t.selectAll(".clusterInfo").call(g.alignLabels):t.selectAll(".clusterInfo").attr("transform",(t=>{let[e,a]=g.extentOne(t);return`translate(${e-10-u.offset(t.uid)}, 0)`})),t.selectAll("text.locusText").text(g.locusText).style("font-size",`${s.cluster.lociFontSize}px`),t.selectAll("text.clusterText").style("font-size",`${s.cluster.nameFontSize}px`),t),drag:t=>{let e,a,l,n;t.each(((t,e)=>{t.slot=e}));return d3.drag().container((function(){return this.parentNode.parentNode})).on("start",((t,r)=>{o.isDragging=!0,e=r.slot;let s=c.cluster(r.uid);s.classed("active",!0).attr("cursor","grabbing"),a=c.matrix(s).f-t.y,l=u.y.range(),n=l[l.length-1]})).on("drag",((l,r)=>{let s=c.cluster(r.uid);s.raise();let o=Math.min(n,Math.max(0,a+l.y));s.attr("transform",(t=>`translate(${u.offset(t.uid)}, ${o})`));let i=u.y.domain(),d=Math.round(o/(n/i.length));d3.selectAll("g.geneLinkG").call(f.update),d!==r.slot&&t.each((function(t){if(t.uid!==r.uid&&t.slot===d){t.slot=e,r.slot=e=d;let a=u.y.domain()[t.slot],l=t=>`translate(${u.offset(t.uid)}, ${u.y(a)})`;c.cluster(t.uid).transition().attr("transform",l)}}))})).on("end",(()=>{o.isDragging=!1;let e=(()=>{let e=[];return t.each((t=>{e.push(t)})),e=e.sort(((t,e)=>t.slot>e.slot?1:-1)),e.map((t=>t.uid))})();u.y.domain(e),d.update()}))(t)}},f={getId:t=>`link-${t.uid}`,opacity:t=>{let e=c.gene(t.query.uid).attr("display"),a=c.gene(t.target.uid).attr("display"),l=["none",null];return!s.link.show||l.includes(e)||l.includes(a)?0:1},fill:t=>s.link.asLine?"none":s.link.groupColour?l(u.colour(u.group(t.query.uid))):u.score(t.identity),stroke:t=>{if(s.link.groupColour){let e=u.colour(u.group(t.query.uid));return s.link.asLine?l(e):e}return s.link.asLine?u.score(t.identity):"black"},update:(t,e)=>{if(!s.link.show)return t.attr("opacity",0);const a={};return t.each((function(t){const l=f.getAnchors(t,e);if(!l||t.identity<s.link.threshold)return void(a[t.uid]={d:null,anchors:null,opacity:0,x:null,y:null});const[n,r,o,i,c,d]=l;let u=n+(r-n)/2,p=u+(i+(c-i)/2-u)*s.link.label.position,g=o+Math.abs(d-o)*s.link.label.position;a[t.uid]={d:`M${n},${o} L${r},${o} L${c},${d} L${i},${d} L${n},${o}`,anchors:l,opacity:1,x:p,y:g}})),t.attr("opacity",1),t.selectAll("path").attr("d",(t=>f.path(a[t.uid].anchors))).style("fill",f.fill).style("stroke",f.stroke).style("stroke-width",`${s.link.strokeWidth}px`),t.selectAll("text").attr("opacity",(t=>s.link.label.show?a[t.uid].opacity:0)).attr("filter",(()=>s.link.label.background?"url(#filter_solid)":null)).style("font-size",(()=>`${s.link.label.fontSize}px`)).attr("x",(t=>a[t.uid].x)).attr("y",(t=>a[t.uid].y)),t},sankey:([t,e,a,l,n,r])=>{let s=a+Math.abs(r-a)/2,o=d3.path();return o.moveTo(e,a),o.bezierCurveTo(e,s,n,s,n,r),o.lineTo(l,r),o.bezierCurveTo(l,s,t,s,t,a),o.lineTo(e,a),o.toString()},straight:([t,e,a,l,n,r])=>`M${t},${a} L${e},${a} L${n},${r} L${l},${r} L${t},${a}`,line:([t,e,a,l,n,r])=>{let o=t+(e-t)/2,i=l+(n-l)/2;return s.link.straight?`M${o},${a} L${i},${r}`:d3.linkVertical()({source:[o,a],target:[i,r]})},path:t=>t?s.link.asLine?f.line(t):s.link.straight?f.straight(t):f.sankey(t):"",filter:t=>{if(t=t.filter((t=>{let e=null!==u.group(t.query.uid),a=null!==u.group(t.target.uid);return e&&a})),!s.link.bestOnly)return t;const e=(t,e)=>t.size===e.size&&[...t].every((t=>e.has(t)));class a extends Map{has(...t){if(0===this.size)return!1;for(let a of this.keys())if(e(t[0],a))return!0;return!1}get(...t){for(const[a,l]of this)if(e(t[0],a))return l}set(...t){let e=this.get(t[0])||t[0];return super.set(e,t[1])}reduce(){let t=[];for(const e of this.values())t=t.concat(e);return t}}let l=new a;t.sort(((t,e)=>t.identity<e.identity?1:-1));for(const e of t){let t=c.geneData(e.query.uid)._cluster,a=c.geneData(e.target.uid)._cluster,n=new Set([t,a]);l.has(n)?l.get(n).some((t=>{let a=new Set([t.query.uid,t.target.uid]);return(a.has(e.query.uid)||a.has(e.target.uid))&&e.identity<t.identity}))||l.get(n).push(e):l.set(n,[e])}return l.reduce().filter((t=>t.identity>s.link.threshold))},getAnchors:(t,e)=>{e=e||!1;let a=c.geneData(t.query.uid),l=c.geneData(t.target.uid);if(!g.adjacent(a._cluster,l._cluster))return null;let n=s.gene.shape.tipHeight+s.gene.shape.bodyHeight/2,r=t=>{if(e)return u.offset(t._cluster)+u.locus(t._locus);let a=c.locus(t._locus),l=c.matrix(a);return u.offset(t._cluster)+l.e},o=r(a),i=r(l),d=(t,a)=>{let l=c.cluster(t._cluster),r=c.matrix(l),s=u.x(t.start)+a,o=u.x(t.end)+a;return[-1===t.strand?o:s,-1===t.strand?s:o,e?u.y(t._cluster)+n:r.f+n]},[p,f,h]=d(a,o),[y,m,x]=d(l,i);return h>x?[y,m,x,p,f,h]:[p,f,h,y,m,x]},getGroups:(t,e)=>{let a=t.map((t=>[t.query.uid,t.target.uid])).map(((t,e,a)=>a.slice(e).reduce(((e,a)=>t.some((t=>a.includes(t)))?[...new Set([...e,...a])]:e),[]))).map(((t,e)=>({label:`Group ${e}`,genes:t,hidden:!1,colour:null}))).reduce(((t,e)=>{let a=!1;return t=t.map((t=>(t.genes.some((t=>e.genes.includes(t)))&&(a=!0,t.genes=[...new Set([...t.genes,...e.genes])]),t))),!a&&t.push({...e,uid:t.length}),t}),e||[]);return e||a.forEach(((t,e)=>t.label=`Group ${e}`)),a},getGroupDomainAndRange:t=>{let e={domain:[],range:[]};return t.forEach((t=>{if(!t.hidden)for(const a of t.genes)e.domain.push(a),e.range.push(t.uid)})),e},updateGroups:t=>{let{domain:e,range:a}=f.getGroupDomainAndRange(t),l=t.map((t=>t.uid));u.group.domain(e).range(a),u.name.domain(l).range(t.map((t=>t.label)));let n=d3.quantize(d3.interpolateRainbow,t.length+1);t.forEach(((t,e)=>{t.colour?n[e]=t.colour:t.colour=n[e]})),u.colour.domain(l).range(n)},hide:(t,e)=>{t.preventDefault(),e.hidden=!0,d.update()},rename:(t,e)=>{if(t.defaultPrevented)return;let a=d3.select(t.target),l=prompt("Enter new value:",a.text());l&&(e.label=l,a.text(l),d.update())}},h={getId:t=>`locus_${t.uid}`,realLength:t=>u.x(t._end-t._start),updateTrackBar:t=>{let e=s.gene.shape.tipHeight+s.gene.shape.bodyHeight/2;return t.select("line.trackBar").attr("x1",(t=>u.x(t._start))).attr("x2",(t=>u.x(t._end))).attr("y1",e).attr("y2",e).style("stroke",s.locus.trackBar.colour).style("stroke-width",s.locus.trackBar.stroke),t},updateHoverBox:t=>{let e=2*s.gene.shape.tipHeight+s.gene.shape.bodyHeight;return t.selectAll("rect.hover, rect.leftHandle, rect.rightHandle").attr("y",-10).attr("height",e+20),t.select("rect.hover").attr("x",(t=>u.x(t._start))).attr("width",h.realLength),t.select("rect.leftHandle").attr("x",(t=>u.x(t._start)-8)),t.select("rect.rightHandle").attr("x",(t=>u.x(t._end))),t},updateScaling:t=>{t.genes.forEach(((t,e,a)=>{let l=s.plot.scaleGenes?t._end-t._start:1e3;t.start=s.plot.scaleGenes?t._start:e>0?a[e-1].end:0,t.end=t.start+l,t.strand=t._strand}));let e=t._start,a=t.genes.length-1;t._start=t._trimLeft?t._trimLeft.start:0,t._end=t._trimRight?t._trimRight.end:s.plot.scaleGenes?t.end:t.genes[a].end,r("locus",t.uid,u.locus(t.uid)+u.x(e-t._start))},update:t=>t.attr("transform",(t=>`translate(${u.locus(t.uid)}, 0)`)).call(h.updateTrackBar).call(h.updateHoverBox),dragResize:t=>{let e,a;const l=(t,l,r)=>{let o=l.genes.filter((t=>t.end<=l._end)).sort(((t,e)=>t.start>e.start?1:-1)),i=[l.start,...o.map((t=>t.start))],d=i.map((t=>u.x(t))),p=n(d,t.x);a=d[p],l._start=i[p],l._trimLeft=l._start===i[0]?null:o[p-1],r.attr("x",a-8);let g=c.locus(l.uid);if(g.select("rect.hover").attr("x",a).attr("width",h.realLength),g.selectAll("g.gene").attr("display",(t=>t.start>=l._start&&t.end<=l._end+1?"inline":"none")),g.call(h.updateTrackBar),d3.selectAll("path.geneLink").attr("opacity",f.opacity),s.cluster.alignLabels){let t=u.offset(l._cluster)+u.locus(l.uid),n=Math.min(a+t,e)-10;d3.selectAll("g.clusterInfo").attr("transform",(t=>`translate(${n-u.offset(t.uid)}, 0)`))}else d3.select(`#cinfo_${l._cluster}`).attr("transform",`translate(${u.locus(l.uid)+u.x(l._start)-10}, 0)`)},r=(t,e,a)=>{let l=e.genes.filter((t=>t.start>=e._start)).sort(((t,e)=>t.start>e.start?1:-1)),r=[...l.map((t=>t.end)),s.plot.scaleGenes?e.end:e._end],o=n(r.map((t=>u.x(t))),t.x);e._trimRight=l[o]?l[o]:null,e._end=r[o],a.attr("x",u.x(e._end));let i=c.locus(e.uid);i.select("rect.hover").attr("width",h.realLength),i.selectAll("g.gene").attr("display",(t=>t.start>=e._start&&t.end<=e._end+1?"inline":"none")),i.call(h.updateTrackBar),d3.selectAll("path.geneLink").attr("opacity",f.opacity),d3.select("g.legend").attr("transform",d.legendTransform)};return d3.drag().on("start",((t,a)=>{[e,t]=g.extent([a.uid]),o.isDragging=!0,u.x(a._start)})).on("drag",(function(t,e){let a=d3.select(this);"leftHandle"===a.attr("class")?l(t,e,a):r(t,e,a)})).on("end",((t,e)=>{o.isDragging=!1,e._end===e.end&&(e._trimRight=null),e._start===e.start&&(e._trimLeft=null),d3.select(`#locus_${e.uid} .hover`).transition().attr("opacity",0),d.update()}))(t)},dragPosition:t=>{let e,a,l,n,i;return d3.drag().on("start",((t,r)=>{[e,a]=g.extent([r.uid]),l=t.x,n=u.locus(r.uid),o.isDragging=!0})).on("drag",((t,r)=>{n+=t.x-l,i=c.locus(r.uid),i.attr("transform",`translate(${n}, 0)`),d3.selectAll("g.geneLinkG").call(f.update,!1);let o=i.datum(),d=u.x(o._start);if(s.cluster.alignLabels){let t=n+u.offset(r._cluster)+d,a=Math.min(t,e)-10;d3.selectAll("g.clusterInfo").attr("transform",(t=>`translate(${a-u.offset(t.uid)}, 0)`))}else d3.select(`#cinfo_${r._cluster}`).attr("transform",`translate(${n+d-10}, 0)`);let p=u.x(o._end),g=Math.max(n+u.offset(r._cluster)+p,a)+20;d3.select("g.legend").attr("transform",`translate(${g}, 0)`)})).on("end",((t,e)=>{o.isDragging=!1,r("locus",e.uid,n),d.update()}))(t)},flip:t=>{t._flipped=!t._flipped;let e=t.end-t.start,a=t._trimRight;t._trimRight=t._trimLeft,t._trimLeft=a,t.genes.forEach((t=>{let a=t._start;t._start=e-t._end,t._end=e-a,t._strand=1===t._strand?-1:1})),t.genes.sort(((t,e)=>t._start-e._start))}},y={check:t=>y.checkDomain(t)&&y.checkRange(t),checkDomain:t=>u[t].domain().length>0,checkRange:t=>u[t].range().length>0,updateX:()=>{u.x.range([0,s.plot.scaleFactor])},updateY:t=>{let e=2*s.gene.shape.tipHeight+s.gene.shape.bodyHeight,a=t.clusters.map(((t,a)=>a*(s.cluster.spacing+e)));u.y.range(a)},updateOffset:t=>{u.offset.domain(t.map((t=>t.uid))).range(t.map((()=>0)))},updateLocus:t=>{let[e,a]=g.getLocusScaleValues(t);u.locus.domain(e).range(a)},rescaleRanges:t=>{[u.offset,u.locus].forEach((e=>{let a=e.range();for(let e=0;e<a.length;e++){let l=t.invert(a[e]);a[e]=u.x(l)}e.range(a)}))},update:t=>{let e=u.x.copy();y.updateX(),y.rescaleRanges(e),y.check("y")||u.y.domain(t.clusters.map((t=>t.uid))),y.updateY(t),y.check("offset")||y.updateOffset(t.clusters),y.check("locus")||y.updateLocus(t.clusters)}},m=t=>{d3.select(t.target).transition().duration(0).style("opacity",1).style("pointer-events","all"),d3.select(window).on("click",(e=>{e.target===t.target||t.target.contains(e.target)||d3.select(t.target).transition().style("opacity",0).style("pointer-events","none")}))},x=t=>{let e=d3.select(t.target),a=document.activeElement;"INPUT"===a.tagName&&e.node().contains(a)||e.transition().delay(400).style("opacity",0).style("pointer-events","none")},b={tooltipHTML:t=>{let e=d3.create("div").attr("class","tooltip-contents").style("display","flex").style("flex-direction","column");e.append("text").text("Edit label");let a=e.append("input").attr("type","input").attr("value",t.label||t.uid);e.append("text").text("Merge with...");let l=d.data().groups,n=e.append("select").attr("multiple",!0);return n.selectAll("option").data(l.filter((e=>e.uid!==t.uid))).join("option").text((t=>t.label)).attr("value",(t=>t.uid)),e.append("button").text("Merge!").on("click",(()=>{const e=[];for(let t of n.node().options)t.selected&&e.push(t);let a=[];for(const n of e){let e=l.findIndex((t=>t.uid===n.value));a.push(e),t.genes.push(...l[e].genes),n.remove()}a.sort(((t,e)=>e-t));for(const t of a)l.splice(t,1);d.data({...d.data(),groups:l}),d.update()})),e.append("label").append("text").text("Choose group colour: ").append("input").attr("type","color").attr("default",t.colour).on("change",(e=>{t.colour=e.target.value,d.update()})),e.append("button").text("Hide group").on("click",(()=>{t.hidden=!0,d.update()})),a.on("input",(e=>{t.label=e.target.value,n.attr("value",null),d.update({})})),e},contextMenu:(t,e)=>{t.preventDefault();let a=d3.select("div.tooltip");a.html(""),a.append((()=>b.tooltipHTML(e).node()));let l=t.target.getBoundingClientRect(),n=a.node().getBoundingClientRect(),r=l.width/2-n.width/2,s=1.2*l.height;a.style("left",l.x+r+"px").style("top",l.y+s+"px"),a.transition().duration(100).style("opacity",1).style("pointer-events","all"),a.transition().delay(1e3).style("opacity",0).style("pointer-events","none")}};s.gene.shape.onClick=p.anchor,s.legend.onClickText=f.rename,s.legend.onAltClickText=b.contextMenu,t.ClusterMap=function(){let t=null,a=d3.transition();function l(t){t.each(n)}function n(l){t=d3.select(this).attr("width","100%").attr("height","100%"),a=d3.transition().duration(s.plot.transitionDuration);let n=t.selectAll("svg.clusterMap").data([l]).join((t=>{t.append("input").attr("id","picker").attr("class","colourPicker").attr("type","color").style("position","absolute").style("opacity",0),t.append("div").attr("class","tooltip").style("opacity",0).style("position","absolute").style("pointer-events","none").on("mouseenter",m).on("mouseleave",x);let e=t.append("svg").attr("class","clusterMap").attr("id","root-svg").attr("cursor","grab").attr("width","100%").attr("height","100%").attr("xmlns","http://www.w3.org/2000/svg").attr("xmlns:xhtml","http://www.w3.org/1999/xhtml"),a=e.append("defs").append("filter").attr("id","filter_solid").attr("x",0).attr("y",0).attr("width",1).attr("height",1);a.append("feFlood").attr("flood-color","rgba(0, 0, 0, 0.8)"),a.append("feComposite").attr("in","SourceGraphic").attr("in2","");let l=e.append("g").attr("class","clusterMapG"),n=d3.zoom().scaleExtent([0,8]).on("zoom",(t=>l.attr("transform",t.transform))).on("start",(()=>e.attr("cursor","grabbing"))).on("end",(()=>e.attr("cursor","grab"))),r=d3.zoomIdentity.translate(20,50).scale(1.2);return e.call(n).call(n.transform,r).on("dblclick.zoom",null),l}),(t=>t.call((t=>{t.call(r)}))));y.update(l),l.config&&!1===l.config.updateGroups?l.groups||(l.groups=[]):l.groups=f.getGroups(l.links,l.groups),f.updateGroups(l.groups),t=d3.select(this);let _=n.selectAll("g.links").data([l]).join("g").attr("class","links");n.selectAll("g.clusters").data([l.clusters]).join("g").attr("class","clusters").selectAll("g.cluster").data(l.clusters,(t=>t.uid)).join((t=>{let a=(t=t.append("g").attr("id",g.getId).attr("class","cluster").each(i)).append("g").attr("id",(t=>`cinfo_${t.uid}`)).attr("class","clusterInfo").attr("transform","translate(-10, 0)").call(g.drag);return a.append("text").text((t=>t.name)).attr("class","clusterText").attr("y",8).attr("cursor","pointer").style("font-weight","bold").style("font-family",s.plot.fontFamily).on("click",e),a.append("text").attr("class","locusText").attr("y",12).style("dominant-baseline","hanging").style("font-family",s.plot.fontFamily),t.append("g").attr("class","loci"),a.selectAll("text").attr("text-anchor","end").style("font-family",s.plot.fontFamily),t.call(g.update)}),(t=>t.call((t=>t.transition(a).call(g.update))))).selectAll("g.loci").selectAll("g.locus").data((t=>t.loci),(t=>t.uid)).join((t=>{for(const e of t.data())if(0!==e.start){e._bio_start=e.start,e._bio_end=e.end,e.start=0,e.end=e._bio_end-e._bio_start;for(const t of e.genes)t._start=t.start-e._bio_start,t._end=t.end-e._bio_start}(t=t.append("g").attr("id",h.getId).attr("class","locus")).append("line").attr("class","trackBar").style("fill","#111");let e=t.append("g").attr("class","hover hidden").attr("opacity",0);return t.append("g").attr("class","genes"),e.append("rect").attr("class","hover").attr("fill","rgba(0, 0, 0, 0.4)").call(h.dragPosition),e.append("rect").attr("class","leftHandle").attr("x",-8).call(h.dragResize),e.append("rect").attr("class","rightHandle").call(h.dragResize),e.selectAll(".leftHandle, .rightHandle").attr("width",8).attr("cursor","pointer"),t.on("mouseenter",(t=>{o.isDragging||d3.select(t.target).select("g.hover").transition().attr("opacity",1)})).on("mouseleave",(t=>{o.isDragging||d3.select(t.target).select("g.hover").transition().attr("opacity",0)})).on("dblclick",((t,e)=>{h.flip(e),d.update()})),t.call(h.update)}),(t=>t.call((t=>t.transition(a).call(h.update))))).selectAll("g.genes").selectAll("g.gene").data((t=>t.genes),(t=>t.uid)).join((t=>((t=t.append("g").attr("id",p.getId).attr("class","gene").attr("display","inline")).append("polygon").on("click",s.gene.shape.onClick).on("contextmenu",p.contextMenu).attr("class","genePolygon"),t.append("text").attr("class","geneLabel").attr("dy","-0.3em").style("font-family",s.plot.fontFamily),t.call(p.update))),(t=>t.call((t=>t.transition(a).call(p.update))))),_.selectAll("g.geneLinkG").data(f.filter(l.links),f.getId).join((t=>((t=t.append("g").attr("id",f.getId).attr("class","geneLinkG")).append("path").attr("class","geneLink"),t.append("text").text((t=>t.identity.toFixed(2))).attr("class","geneLinkLabel").style("fill","white").style("text-anchor","middle").style("font-family",s.plot.fontFamily),t.call(f.update))),(t=>t.call((t=>t.classed("hidden",!s.link.show).transition(a).call(f.update,!0)))),(t=>t.call((t=>{t.transition(a).attr("opacity",0).remove()}))));let k=function(){let t=function(){let t,e=d3.selectAll("g.gene");e.empty()?t=[]:(t=u.colour.domain(),e.each(((e,a,l)=>{let n=d3.select(l[a]).attr("display"),r=u.group(e.uid);"inline"===n&&null!==r&&t.includes(r)&&(t=t.filter((t=>t!==r)))})));return t}();return function(t){let e=15,a=12,l=[],n=()=>{},r=()=>{},o=()=>{},i=d3.scaleBand().paddingInner(.5),c=d3.transition().duration(500);function d(t){t.each((function(t){let a=t.groups.filter((t=>!l.includes(t.uid)&&!t.hidden));i.domain(a.map((t=>t.uid))).range([0,e*a.length]);let d=d3.select(this).selectAll("g.legend").data([t]).join("g").attr("class","legend"),p=t=>`translate(0, ${i(t.uid)})`;d.selectAll("g.element").data(a,(t=>t.uid)).join((t=>((t=t.append("g").attr("class","element").attr("transform",p)).append("circle").attr("class",(t=>`group-${t.uid}`)),t.append("text").attr("x",16).attr("text-anchor","start").style("font-family",s.plot.fontFamily).style("dominant-baseline","middle"),t.call(u))),(t=>t.call((t=>t.transition(c).attr("transform",p).call(u))))),n&&d.selectAll("circle").attr("cursor","pointer").on("click",n),d.selectAll("text").attr("cursor","pointer").on("click",r).on("contextmenu",o)}))}function u(e){e.attr("transform",(t=>`translate(0, ${i(t.uid)})`));let l=i.bandwidth()/2;e.selectAll("text").text((t=>t.label)).attr("x",l+6).attr("y",l+1).style("font-size",`${a}px`),e.selectAll("circle").attr("cy",l).attr("r",l).attr("fill",(e=>t(e.uid)))}return d.colourScale=e=>arguments.length?(t=e,d):t,d.transition=t=>arguments.length?(c=t,d):c,d.hidden=t=>arguments.length?(l=t,d):l,d.entryHeight=t=>arguments.length?(e=parseInt(t),d):e,d.fontSize=t=>arguments.length?(a=parseInt(t),d):a,d.onClickCircle=t=>arguments.length?(n=t,d):n,d.onClickText=t=>arguments.length?(r=t,d):r,d.onAltClickText=t=>arguments.length?(o=t,d):o,d}(u.colour).hidden(t).fontSize(s.legend.fontSize).entryHeight(s.legend.entryHeight).onClickCircle(s.legend.onClickCircle||c).onClickText(s.legend.onClickText).onAltClickText(s.legend.onAltClickText)}(),$=function(t){let e=1e3,a=1,l=10,n="black",r=12,o=d3.transition().duration(500),i=null;function c(t){t.each((function(t){d3.select(this).selectAll("g.scaleBar").data([t]).join((t=>((t=t.append("g").attr("class","scaleBar")).append("line").attr("class","flatBar"),t.append("line").attr("class","leftBar"),t.append("line").attr("class","rightBar"),t.append("text").attr("class","barText").attr("text-anchor","middle").attr("cursor","pointer").style("font-family",s.plot.fontFamily).on("click",i||p),t.call(u),t)),(t=>t.call((t=>t.transition(o).call(u)))))}))}function d(){return+(e/1e3).toFixed(1)+"kb"}function u(s){let o=l/2,i=t(e);s.select(".flatBar").attr("x2",i).attr("y1",o).attr("y2",o),s.select(".leftBar").attr("y2",l),s.select(".rightBar").attr("x1",i).attr("x2",i).attr("y2",l),s.select("text.barText").text(d).attr("x",i/2).attr("y",l+5).style("dominant-baseline","hanging").style("font-size",`${r}pt`),s.selectAll("line").style("stroke",n).style("stroke-width",a)}function p(){let t=prompt("Enter new length (bp):",e);t&&c.basePair(t)}return c.basePair=t=>arguments.length?(e=parseInt(t),c):e,c.colour=t=>arguments.length?(n=t,c):n,c.colourScale=t=>arguments.length?(colourScale=t,c):colourScale,c.fontSize=t=>arguments.length?(r=parseInt(t),c):r,c.height=t=>arguments.length?(l=parseInt(t),c):l,c.onClickText=t=>arguments.length?(i=t,c):i,c.stroke=t=>arguments.length?(a=parseInt(t),c):a,c.transition=t=>arguments.length?(o=t,c):o,c.width=t=>arguments.length?(width=parseInt(t),c):width,c}(u.x).stroke(s.scaleBar.stroke).height(s.scaleBar.height).colour(s.scaleBar.colour).basePair(s.scaleBar.basePair).fontSize(s.scaleBar.fontSize).onClickText(b).transition(a),v=function(t){let e=25,a=150,l=12,n=d3.transition();function r(t){t.each((function(t){d3.select(this).selectAll("g.colourBar").data([t]).join((t=>{let e=(t=t.append("g").attr("class","colourBar")).append("defs").append("linearGradient").attr("id","cbarGradient").attr("x1","0%").attr("x2","100%");e.append("stop").attr("class","startStop").attr("offset","0%"),e.append("stop").attr("class","endStop").attr("offset","100%");let a=t.append("g").attr("class","cbarParts");return a.append("rect").attr("class","colourBarBG").style("fill","white").style("stroke","black").style("stroke-width","1px"),a.append("rect").attr("class","colourBarFill").style("fill","url(#cbarGradient)"),a.append("text").text("Identity (%)").attr("class","labelText").attr("text-anchor","middle"),a.append("text").text("0").attr("class","startText").attr("text-anchor","start"),a.append("text").text("100").attr("class","endText").attr("text-anchor","end"),a.selectAll("text").style("font-family",s.plot.fontFamily).style("dominant-baseline","hanging"),t.call(o),t}),(t=>t.call((t=>t.transition(n).call(o)))))}))}function o(n){n.select(".startStop").attr("stop-color",t(0)),n.select(".endStop").attr("stop-color",t(1)),n.selectAll("rect").attr("width",a).attr("height",e),n.selectAll(".startText, .endText, .labelText").attr("y",e+5),n.select(".labelText").attr("x",a/2),n.select(".endText").attr("x",a),n.selectAll("text").style("font-size",`${l}pt`)}return r.width=t=>arguments.length?(a=parseInt(t),r):a,r.height=t=>arguments.length?(e=parseInt(t),r):e,r.fontSize=t=>arguments.length?(l=parseInt(t),r):l,r.colourScale=e=>arguments.length?(t=e,r):t,r.transition=t=>arguments.length?(n=t,r):n,r}(u.score).width(s.colourBar.width).height(s.colourBar.height).fontSize(s.colourBar.fontSize).transition(a);n.call(k).call(v).call($).call(r)}function r(t){let e=s.plot.scaleGenes;t.select("g.scaleBar").classed("hidden",!e).transition(a).attr("opacity",e?1:0).attr("transform",d.scaleBarTransform);let l=s.link.groupColour||!s.link.show;t.select("g.colourBar").classed("hidden",!!l).transition(a).attr("opacity",l?0:1).attr("transform",d.colourBarTransform),t.select("g.legend").transition(a).attr("transform",d.legendTransform)}function i(t){t.loci.forEach((e=>{e._start=e._start||e.start,e._end=e._end||e.end,e._offset=e._offset||0,e._cluster=e._cluster||t.uid,e._flipped=e._flipped||!1,e._trimLeft=e._trimLeft||null,e._trimRight=e._trimRight||null,e.genes.forEach((a=>{a._locus=a._locus||e.uid,a._cluster=a._cluster||t.uid,a._start=a._start||a.start,a._end=a._end||a.end,a._strand=a._strand||a.strand}))}))}function c(t,e){let a=d3.select("input.colourPicker");a.on("change",(()=>{e.colour=a.node().value,d.update()})),a.node().click()}function b(){let t=prompt("Enter new length (bp):",s.scaleBar.basePair);t&&(s.scaleBar.basePair=t,d.update())}return d.update=()=>t.call(l),d.data=t=>l.data(t),l.config=function(t){return arguments.length?(d.updateConfig(t),l):s},l.data=e=>e?(t.datum(e).call(l),l):t.select("svg.clusterMap").datum(),l},Object.defineProperty(t,"__esModule",{value:!0})}));

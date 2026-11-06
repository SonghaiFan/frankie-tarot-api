// Adapted from src/app/SpreadLayout.tsx using actual source definitions, no network/draw.
const data=JSON.parse(document.querySelector('#definition-data').textContent);
const spread=document.querySelector('#spread'),revision=document.querySelector('#revision');
const svgNS='http://www.w3.org/2000/svg';
function element(tag,attributes){const node=document.createElementNS(svgNS,tag);Object.entries(attributes).forEach(([key,value])=>node.setAttribute(key,value));return node;}
function render(){
 const s=data.spreads[revision.value].find(x=>x.id===spread.value);
 document.querySelector('#spread-name').textContent=s.name;
 const list=document.querySelector('#positions');list.replaceChildren(...s.labels.map((label,i)=>{const li=document.createElement('li'),name=document.createElement('span'),pool=document.createElement('code');name.textContent=label.replace(/^\d+\.\s*/,'');pool.textContent=s.pools[i];li.append(name,pool);return li;}));
 const positions=s.positions;let cards;
 if(positions?.length){const xs=positions.map(p=>p.x),ys=positions.map(p=>p.y),minX=Math.min(...xs),minY=Math.min(...ys);cards=positions.map(p=>({x:2.5+(p.x-minX)/(Math.max(...xs)-minX||1)*19-1.9,y:2.5+(p.y-minY)/(Math.max(...ys)-minY||1)*19-2.9,w:3.8,h:5.8,r:p.rotation||0}));}
 else{const w=s.cardCount===1?5:4,h=Math.min(8,Math.max(4.5,w*1.55)),start=(24-(s.cardCount*w+(s.cardCount-1)))/2;cards=Array.from({length:s.cardCount},(_,i)=>({x:start+i*(w+1),y:(24-h)/2,w,h,r:0}));}
 const svg=element('svg',{viewBox:'-1 -1 26 26',role:'img','aria-label':s.name});
 cards.forEach((c,i)=>{const g=element('g',{transform:`rotate(${c.r} ${c.x+c.w/2} ${c.y+c.h/2})`});g.append(element('rect',{x:c.x,y:c.y,width:c.w,height:c.h,rx:.9,fill:'#d8d7df',stroke:'#030308','stroke-width':.15}));const t=element('text',{x:c.x+c.w/2,y:c.y+c.h/2+.65,'text-anchor':'middle',fill:'#030308','font-size':1.8,'font-family':'system-ui'});t.textContent=i+1;g.append(t);svg.append(g);});
 document.querySelector('#diagram').replaceChildren(svg);
}
spread.addEventListener('change',render);revision.addEventListener('change',render);render();

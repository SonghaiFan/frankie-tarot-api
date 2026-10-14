import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import test from 'node:test';
import data from '../src/data/tarot.json';
import {CARD_IDS,getCard,listSpreads,drawSpread} from '../src/api/core';
import {handleTarotApi} from '../src/api/http';
const origin='https://tarot-api.songhai.site';
const text=readFileSync(new URL('../public/resources/pkt.txt',import.meta.url),'utf8');
const lines=text.split(/\n/);

test('all 78 primary meanings have exact PKT English passages, Chinese editorial summaries and verified line provenance',()=>{
 assert.equal(CARD_IDS.length,78);
 const digest=createHash('sha256').update(text).digest('hex');
 for(const id of CARD_IDS){
  const card=getCard(id,'en',origin)!;
  assert.equal(card.source.pkt.id,'PKT-1911');assert.equal(card.source.pkt.sha256,digest);
  for(const orientation of ['upright','reversed'] as const){
   const ref=card.source.pkt.references[orientation];
   assert.ok(lines.slice(ref.lineStart-1,ref.lineEnd).join('\n').includes(card.meanings[orientation].en), `${id} ${orientation} must match its source`);
   assert.ok(card.meanings[orientation]['zh-CN'].length>0);
  }
 }
});
test('prior project-curated modern interpretations and all artwork identities remain preserved',()=>{
 const retained=Object.fromEntries(CARD_IDS.map(id=>[id,getCard(id,'en',origin)!.modernMeanings]));
 assert.equal(createHash('sha256').update(JSON.stringify(retained)).digest('hex'),'9f6254e8bf784a63298aa578169606f927712d47c02780d9e3154a9839d320d8');
 assert.deepEqual(CARD_IDS,(data.cards.allIds as string[]).map(key=>data.cards.byId[key].image.replace(/\.[^.]+$/,'')));
 for(const id of CARD_IDS)for(const style of ['redraw','dreamy','original'] as const)assert.ok(getCard(id,'en',origin)!.imageUrls[style].includes(`${id}.webp`));
});
test('Ten of Swords orientation and Two of Cups exceptional reversed source are explicit',()=>{
 const ten=getCard('swords10','en',origin)!;
 assert.ok(ten.meanings.upright.en.includes('pain, affliction'));assert.ok(ten.meanings.reversed.en.includes('Advantage, profit'));
 const two=getCard('cups02','en',origin)!;
 assert.equal(two.meanings.reversed.en,'Passion.');assert.equal(two.source.pkt.references.reversed.chapter,'III.4');
 assert.equal(two.source.pkt.references.upright.chapter,'III.2');
});
test('new Celtic positions match III.7 while legacy consumers keep their exact labels and geometry',async()=>{
 const current=listSpreads('en','pkt-1911-v1').find(s=>s.id==='CELTIC')!;
 assert.deepEqual(current.labels.slice(2,6),['3. Aim / ideal','4. Foundation','5. Passing influence','6. Approaching influence']);
 assert.ok(current.layout.positions![2].y<0);assert.ok(current.layout.positions![3].y>0);
 assert.ok(current.layout.positions![4].x<current.layout.positions![0].x);assert.ok(current.layout.positions![5].x>current.layout.positions![0].x);
 assert.equal(current.source.kind,'pkt-adapted');assert.equal(current.interpretationProfile.id,'pkt-reflection-v1');
 const legacy=listSpreads('en').find(s=>s.id==='CELTIC')!;
 assert.deepEqual(legacy.labels,current.legacyDefinition.labels);assert.deepEqual(legacy.layout,current.legacyDefinition.layout);
 assert.deepEqual(legacy.labels.slice(2,6),['3. Past','4. Present','5. Near Future','6. Far Future']);
 assert.equal(legacy.interpretationProfile.id,'legacy-reflection-v1');
 const response=await handleTarotApi(new Request(`${origin}/api/v1/spreads?revision=pkt-1911-v1&locale=en`));
 assert.equal(response.status,200);assert.deepEqual((await response.json() as any).spreads.find(s=>s.id==='CELTIC').labels,current.labels);
 const draw=drawSpread('CELTIC','en',origin,()=>0,'pkt-1911-v1')!;
 assert.deepEqual(draw.cards.map(c=>c.positionLabel),current.labels);
 assert.equal((await handleTarotApi(new Request(`${origin}/api/v1/spreads?revision=unknown`))).status,400);
});
test('modern spreads keep their definitions and both API-owned templates preserve the requested output order and personal context',()=>{
 for(const spread of listSpreads('zh-CN','pkt-1911-v1')){
  if(spread.id!=='CELTIC'){
   assert.equal(spread.source.kind,'modern-extension');
   assert.deepEqual(spread.layout,spread.legacyDefinition.layout);
   assert.deepEqual(spread.labelsByLocale,spread.legacyDefinition.labelsByLocale);
   assert.deepEqual(spread.interpretationInstructions,spread.legacyDefinition.interpretationInstructions);
  }
  const templates=spread.interpretationProfile.templates;
  assert.ok(templates['zh-CN'].indexOf('一、诗意解读')<templates['zh-CN'].indexOf('二、详细分析'));
  assert.ok(templates.en.indexOf('1. Poetic reading')<templates.en.indexOf('2. Detailed analysis'));
  assert.ok(templates['zh-CN'].includes('结合你对发问人的了解'));
  assert.ok(templates['zh-CN'].includes('先入之见'));
  assert.ok(!templates.en.includes('${'));assert.ok(!templates['zh-CN'].includes('${'));
 }
});

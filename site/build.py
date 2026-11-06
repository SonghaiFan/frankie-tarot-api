#!/usr/bin/env python3
"""Independent bilingual introduction; extracts real API data, never reads env files."""
import argparse, html, json, re, shutil
from pathlib import Path
H=html.escape

def build(repo,out):
 cfg=json.loads((repo/'site/project.json').read_text());contents=json.loads((repo/'site/content.json').read_text());data=json.loads((repo/'src/data/tarot.json').read_text())
 out.mkdir(parents=True,exist_ok=True);media=out/'media';media.mkdir(exist_ok=True)
 for name in ['style.css','explorer.js']:shutil.copy(repo/'site'/name,out/name)
 for src,name in [('docs/readme/banner.png','banner.png'),('docs/readme/assets/frankie.svg','signature.svg'),('public/images/cards/maj00.webp','fool.webp'),('site/assets/docs-current.png','docs.png'),('site/assets/spreads-current.png','spreads.png')]:shutil.copy(repo/src,media/name)
 ids=[i for i in data['spreads']['allIds'] if i!='AUTO'];tools=re.findall(r'server.registerTool\("([^"]+)"',(repo/'mcp/agent.ts').read_text());assert len(tools)==5
 card=data['cards']['byId'][data['cards']['allIds'][0]];assert card['image'].split('.')[0]=='maj00'
 (out/'.nojekyll').touch()
 for lang,c in contents.items():
  zh=lang=='zh';loc='zh-CN' if zh else 'en';pre='../' if zh else './';dest=out/'zh' if zh else out;dest.mkdir(exist_ok=True)
  examples={}
  for revision,source in [('legacy',data['legacySpreads']),('pkt-1911-v1',data['spreads']['byId'])]:
   examples[revision]=[]
   for id in ['SINGLE','THREE','COURT','CELTIC']:
    s=source[id];layout=s['layout'];labels=(layout['positionLabels'] if layout['type']=='absolute' else layout['labels'])[loc]
    examples[revision].append({'id':id,'name':s['name'][loc],'cardCount':s['cardCount'],'labels':labels,'pools':s.get('cardPools') or ['FULL']*s['cardCount'],'positions':layout['positions']})
  sample={'id':'maj00','name':card['name'][loc],'names':card['name'],'arcana':'MAJOR','suit':None,'rank':0}
  request=f'curl "https://tarot-api.songhai.site/api/v1/cards/maj00?locale={loc}"'
  rows=lambda xs:''.join('<article><h3>'+H(a)+'</h3><p>'+H(b)+'</p></article>' for a,b in xs)
  gallery=''.join(f'<figure><a href="{pre}media/{name}.png"><img src="{pre}media/{name}.png" alt="{H(caption,quote=True)}" loading="lazy" width="1468" height="1247"></a><figcaption>{H(caption)}</figcaption></figure>' for name,caption in zip(['docs','spreads'],c['captions']))
  options=''.join(f'<option value="{x["id"]}">{H(x["name"])}</option>' for x in examples['pkt-1911-v1'])
  dataset=json.dumps({'spreads':examples,'pool':c['pool']},ensure_ascii=False).replace('<','\\u003c')
  body=f'''<!doctype html><html lang="{loc}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Frankie Tarot API | {'双语牌库与牌阵' if zh else 'Card data and spread definitions'}</title><meta name="description" content="{H(c['intro'],quote=True)}"><link rel="stylesheet" href="{pre}style.css"><link rel="canonical" href="{cfg['pages_url']+('zh/' if zh else '')}"><link rel="alternate" hreflang="en" href="{cfg['pages_url']}"><link rel="alternate" hreflang="zh-CN" href="{cfg['pages_url']}zh/"><meta name="theme-color" content="#030308"><meta property="og:type" content="website"><meta property="og:title" content="Frankie Tarot API"><meta property="og:description" content="{H(c['intro'],quote=True)}"><meta property="og:url" content="{cfg['pages_url']+('zh/' if zh else '')}"><meta property="og:image" content="{cfg['pages_url']}media/banner.png"></head><body>
<a class="skip" href="#main">{H(c['skip'])}</a><header class="shell"><a class="brand" href="{pre}"><img src="{pre}media/signature.svg" width="96" height="40" alt="Frankie"><span>Tarot API</span></a><nav aria-label="{'页面导航' if zh else 'Page navigation'}"><a href="#service">{c['nav'][0]}</a><a href="#use">{c['nav'][1]}</a><a href="#screens">{c['nav'][2]}</a><a href="{pre}" lang="en" {'aria-current="page"' if not zh else ''}>EN</a><a href="{pre}zh/" lang="zh-CN" {'aria-current="page"' if zh else ''}>中文</a></nav></header>
<main id="main" class="shell"><section class="hero"><div><h1>{H(c['headline']).replace(chr(10),'<br>')}</h1><p class="lead">{H(c['intro'])}</p><a class="button" href="https://tarot-api.songhai.site/">{H(c['open'])} ↗</a></div><figure class="hero-card"><div class="tarot-card"><img src="{pre}media/fool.webp" width="700" height="1200" alt="{H(card['name'][loc])}" fetchpriority="high"><div class="card-label"><span>0</span><strong>{H(card['name'][loc])}</strong></div></div><figcaption>{H(c['card_caption'])}</figcaption></figure></section>
<section id="service" class="section"><h2>{H(c['concept_title'])}</h2><p class="lead narrow">{H(c['concept'])}</p><div class="features">{rows(c['features'])}</div><dl class="counts"><div><dt>{len(data['cards']['allIds'])}</dt><dd>{'张牌' if zh else 'cards'}</dd></div><div><dt>{len(ids)}</dt><dd>{'种牌阵' if zh else 'spreads'}</dd></div><div><dt>en / zh-CN</dt><dd>{'语言' if zh else 'locales'}</dd></div></dl></section>
<section class="section example"><div><h2>{H(c['request_title'])}</h2><p>{H(c['request_note'])}</p><a href="https://tarot-api.songhai.site/api/v1/cards/maj00?locale={loc}">{'打开真实响应' if zh else 'Open the live response'} ↗</a></div><div><pre><code>{H(request)}</code></pre><pre><code>{H(json.dumps(sample,ensure_ascii=False,indent=2))}</code></pre></div></section>
<section class="section" id="definitions"><h2>{H(c['explorer_title'])}</h2><p class="narrow">{H(c['explorer_note'])}</p><div class="controls"><label>{H(c['spread'])}<select id="spread">{options}</select></label><label>{H(c['revision'])}<select id="revision"><option value="pkt-1911-v1">{H(c['current'])}</option><option value="legacy">{H(c['legacy'])}</option></select></label></div><div class="definition"><div id="diagram" class="diagram" aria-label="{'相对位置示意图' if zh else 'Relative card-position diagram'}"></div><div><h3 id="spread-name"></h3><ol id="positions"></ol></div></div><noscript><p>{'启用 JavaScript 可切换示例；完整定义请查看 API 文档。' if zh else 'Enable JavaScript to switch examples, or read all definitions in the API reference.'}</p></noscript><aside><h3>{H(c['revision_title'])}</h3><p>{H(c['revision_note'])}</p></aside></section>
<section id="use" class="section"><h2>{H(c['workflow_title'])}</h2><ol class="steps">{''.join('<li><h3>'+H(a)+'</h3><p>'+H(b)+'</p></li>' for a,b in c['steps'])}</ol></section>
<section class="section example"><div><h2>{H(c['mcp_title'])}</h2><p>{H(c['mcp'])}</p><a href="https://tarot-api.songhai.site/agents.md">{H(c['agentguide'])} ↗</a><p class="small"><a href="https://ts.sdk.modelcontextprotocol.io/server">{'MCP 官方传输与工具说明' if zh else 'Official MCP transport & tool concepts'} ↗</a></p></div><div><h3>{H(c['tools_title'])}</h3><ul class="tools">{''.join('<li><code>'+H(t)+'</code></li>' for t in tools)}</ul></div></section>
<section class="section" id="screens"><h2>{H(c['screens_title'])}</h2><div class="gallery">{gallery}</div></section>
<section class="section"><h2>{H(c['boundaries_title'])}</h2><div class="features">{rows(c['boundaries'])}</div></section>
<section id="start" class="section example"><div><h2>{H(c['run'])}</h2><p>{H(c['run_note'])}</p><a href="https://github.com/{cfg['repository']}/blob/main/site/GUIDE.md">{H(c['guide'])} ↗</a></div><div><pre><code>npm ci\nnpm run api</code></pre><div class="resource-links"><a href="https://tarot-api.songhai.site/">{H(c['api_docs'])}</a><a href="https://tarot-api.songhai.site/openapi.json">{H(c['openapi'])}</a><a href="https://songhaifan.github.io/frankie-tarot/">{H(c['tarot_app'])}</a></div></div></section></main><footer class="shell"><span>{H(c['footer'])}</span><a href="https://github.com/{cfg['repository']}">{H(c['source'])} ↗</a></footer><script id="definition-data" type="application/json">{dataset}</script><script src="{pre}explorer.js" defer></script></body></html>'''
  (dest/'index.html').write_text(body)
 print(out)
if __name__=='__main__':
 ap=argparse.ArgumentParser();ap.add_argument('--out',default='_site');args=ap.parse_args();build(Path(__file__).resolve().parents[1],Path(args.out).resolve())

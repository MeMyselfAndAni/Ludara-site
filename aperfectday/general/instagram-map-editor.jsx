import { useState, useRef, useEffect } from "react";

// ── Constants ─────────────────────────────────────────────────────────────────
const CATS = [
  { key: 'food',     label: 'Restaurant', emoji: '🍽️', color: '#e8a030' },
  { key: 'cafe',     label: 'Café',       emoji: '☕',  color: '#6b9e6e' },
  { key: 'pub',      label: 'Bar',        emoji: '🍺',  color: '#8b6bb1' },
  { key: 'landmark', label: 'Landmark',   emoji: '🏛️', color: '#e8724a' },
  { key: 'nature',   label: 'Nature',     emoji: '🌿',  color: '#50906a' },
  { key: 'market',   label: 'Market',     emoji: '🛍️', color: '#c08060' },
  { key: 'church',   label: 'Church',     emoji: '⛪',  color: '#6090c8' },
  { key: 'hotel',    label: 'Hotel',      emoji: '🏨',  color: '#d4845a' },
];
const CAT = Object.fromEntries(CATS.map(c => [c.key, c]));
const NBHD_PALETTE = ['#e8724a','#d4a043','#6b9e6e','#8b6bb1','#6090c8','#c08060','#50906a','#d4845a'];
const esc  = s => (s||'').replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/`/g,'\\`').replace(/\n/g,' ');
const esc2 = s => (s||'').replace(/\\/g,'\\\\').replace(/"/g,'\\"').replace(/\n/g,' ');
const toKey = s => (s||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

// ── Shared Style Tokens ───────────────────────────────────────────────────────
const T = {
  bg:      '#0d0d10',
  surface: '#141418',
  card:    '#1a1a22',
  border:  '#2e2e3a',
  text:    '#ffffff',
  muted:   '#aaaaaa',
  faint:   '#555',
  amber:   '#d4973f',
  green:   '#7abf7a',
  red:     '#c05050',
};

const inputSx = {
  background: T.surface,
  border: `1px solid ${T.border}`,
  borderRadius: 6,
  color: '#ffffff',
  padding: '9px 12px',
  fontSize: 15,
  width: '100%',
  outline: 'none',
  fontFamily: "inherit",
  boxSizing: 'border-box',
  lineHeight: 1.4,
  fontWeight: 400,
};
const labelSx = {
  display: 'block', fontSize: 14, letterSpacing: 1,
  color: '#cccccc', textTransform: 'uppercase', marginBottom: 6, fontWeight: 600,
};
const btnPrimary = {
  background: T.amber, color: '#fff', border: 'none', borderRadius: 6,
  padding: '10px 20px', fontSize: 15, fontWeight: 600, cursor: 'pointer',
  fontFamily: 'inherit',
};
const btnGhost = {
  background: 'none', color: '#aaaaaa', border: `1px solid ${T.border}`,
  borderRadius: 6, padding: '7px 13px', fontSize: 14, cursor: 'pointer',
  fontFamily: 'inherit',
};

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep]       = useState('setup');
  const [city, setCity]       = useState('');
  const [handle, setHandle]   = useState('');
  const [displayName, setDisplayName] = useState('');
  const [nbhds, setNbhds]     = useState(['']);
  const [jsonText, setJsonText] = useState('');
  const [places, setPlaces]   = useState([]);
  const [selId, setSelId]     = useState(null);
  const [procMsg, setProcMsg] = useState('');
  const [expTab, setExpTab]   = useState('data');
  const [listFilter, setListFilter] = useState('all');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap';
    document.head.appendChild(l);
    document.body.style.margin = '0';
    document.body.style.background = T.bg;
    return () => { try { document.head.removeChild(l); } catch {} };
  }, []);

  const sel = places.find(p => p.id === selId);
  const validNbhds = nbhds.filter(n => n.trim());
  const approved = places.filter(p => p.approved).length;

  // ── Parse posts from Instagram JSON ──────────────────────────────────────
  const parsePosts = (text) => {
    try {
      const d = JSON.parse(text);
      const items = Array.isArray(d) ? d : (d.media || [d]);
      const posts = [];
      items.forEach(item => {
        const media = item.media || [item];
        media.forEach(m => {
          const caption = m.title || m.caption || '';
          if (caption && caption.trim().length > 15) {
            posts.push({ caption: caption.trim(), uri: m.uri || '', ts: m.creation_timestamp || 0 });
          }
        });
      });
      return posts;
    } catch { return []; }
  };

  const postCount = jsonText ? parsePosts(jsonText).length : 0;

  // ── Handle file upload ────────────────────────────────────────────────────
  const handleFile = async (file) => {
    if (!file) return;
    if (file.name.endsWith('.zip')) {
      await new Promise(res => {
        if (window.JSZip) { res(); return; }
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
        s.onload = res; document.head.appendChild(s);
      });
      try {
        const zip = await window.JSZip.loadAsync(file);
        const candidates = Object.keys(zip.files).filter(n =>
          n.toLowerCase().includes('posts') && n.endsWith('.json')
        );
        if (candidates.length) {
          const text = await zip.files[candidates[0]].async('text');
          setJsonText(text);
        } else {
          alert('Could not find posts JSON inside the ZIP. Try opening the ZIP and uploading posts_1.json directly.');
        }
      } catch (e) { alert('Error reading ZIP: ' + e.message); }
    } else {
      const text = await file.text();
      setJsonText(text);
    }
  };

  // ── Claude extraction ─────────────────────────────────────────────────────
  const runExtraction = async () => {
    if (!city.trim() || !jsonText.trim()) return;
    setStep('processing');
    const posts = parsePosts(jsonText);
    if (!posts.length) { setProcMsg('No posts found. Check that the file is in JSON format.'); return; }

    const BATCH = 40;
    const allExtracted = [];

    for (let i = 0; i < Math.min(posts.length, 500); i += BATCH) {
      const batch = posts.slice(i, i + BATCH);
      setProcMsg(`Analysing posts ${i + 1}–${Math.min(i + BATCH, posts.length)} of ${posts.length}...`);

      const prompt = `Extract place recommendations from these Instagram captions for a city guide about ${city}.

Captions:
${batch.map((p, j) => `[${j + 1}] ${p.caption}`).join('\n---\n')}

Rules:
- Only extract specific named places (restaurants, cafés, bars, landmarks, hotels, parks, shops, markets, beaches)
- Only include places in or near ${city}
- The "note" field MUST contain exact words from the caption describing this place — do not paraphrase
- The "tip" field: only if the caption includes a practical tip; otherwise use empty string
${validNbhds.length ? `- Assign "nbhd" from this list only: ${validNbhds.join(', ')}. If unclear, use "${validNbhds[0]}"` : '- Set "nbhd" to "unknown"'}
- "post_index" is the [number] of the caption (1-based)
- Categories allowed: food, cafe, pub, landmark, nature, market, church, hotel

Return ONLY a valid JSON array with no markdown, no explanation, no code fences:
[{"name":"Place Name","cat":"food","emoji":"🍽️","note":"exact words from caption","tip":"","nbhd":"${validNbhds[0]||'unknown'}","address":"if mentioned or empty string","post_index":1}]

If no places are found, return: []`;

      try {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1000,
            messages: [{ role: 'user', content: prompt }],
          }),
        });
        const data = await res.json();
        const raw = (data.content?.[0]?.text || '[]').replace(/```json|```/g,'').trim();
        try {
          const extracted = JSON.parse(raw);
          extracted.forEach(p => {
            const idx = Math.max(0, (p.post_index || 1) - 1);
            p._uri = batch[idx]?.uri || '';
            p._caption = batch[idx]?.caption || '';
          });
          allExtracted.push(...extracted);
        } catch { /* skip bad batch */ }
      } catch (e) { console.error('Batch error', e); }
    }

    // Deduplicate by normalised name
    const seen = new Set();
    const deduped = allExtracted.filter(p => {
      const k = (p.name||'').toLowerCase().trim();
      if (!k || seen.has(k)) return false;
      seen.add(k); return true;
    });

    const finalPlaces = deduped.map((p, i) => ({
      id: i + 1,
      name: p.name || '',
      cat: CATS.find(c=>c.key===p.cat) ? p.cat : 'landmark',
      emoji: p.emoji || CAT[p.cat]?.emoji || '📍',
      note: p.note || '',
      tip: p.tip || '',
      nbhd: p.nbhd || validNbhds[0] || '',
      address: p.address || '',
      lat: 0, lng: 0,
      image_url: '',
      _uri: p._uri || '',
      website: '', hours: '', phone: '',
      approved: false,
    }));

    setPlaces(finalPlaces);
    setSelId(finalPlaces[0]?.id || null);
    setStep('review');
  };

  // ── Place mutations ───────────────────────────────────────────────────────
  const upd = (id, field, val) =>
    setPlaces(prev => prev.map(p => p.id === id ? {...p, [field]: val} : p));

  const del = (id) => {
    const idx = places.findIndex(p => p.id === id);
    const nxt = places[idx + 1] || places[idx - 1];
    setPlaces(prev => prev.filter(p => p.id !== id));
    setSelId(nxt?.id || null);
  };

  const geocode = async (id, placeName) => {
    try {
      const r = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(placeName + ' ' + city)}&format=json&limit=1`,
        { headers: { 'User-Agent': 'APerfectDay/1.0 (ludara.ai)' } }
      );
      const d = await r.json();
      if (d[0]) {
        upd(id, 'lat', parseFloat(parseFloat(d[0].lat).toFixed(6)));
        upd(id, 'lng', parseFloat(parseFloat(d[0].lon).toFixed(6)));
        const place = places.find(p => p.id === id);
        if (!place?.address) upd(id, 'address', d[0].display_name.split(',').slice(0,2).join(',').trim());
      }
    } catch {}
  };

  // ── Generate files ────────────────────────────────────────────────────────
  const genDataJs = () => {
    const entries = places.map(p => `  {
    // SOURCE: Instagram @${handle}
    // ${p.approved ? '✅ Approved by influencer' : '⚠️ Pending approval'}
    id: ${p.id},
    nbhd: '${toKey(p.nbhd)}',
    name: '${esc(p.name)}',
    cat: '${p.cat}',
    emoji: '${p.emoji}',
    address: '${esc(p.address)}',
    lat: ${p.lat},
    lng: ${p.lng},
    search: '${esc(p.name)} ${city}',
    note: "${esc2(p.note)}",
    hours: '${esc(p.hours)}',
    tip: "${esc2(p.tip)}",
    type: '${CAT[p.cat]?.label||p.cat}',
    website: '${esc(p.website)}',
    phone: '${esc(p.phone)}',
  }`).join(',\n\n');
    return `// A Perfect Day — ${displayName} / ${city}\n// data.js — curated places\n// Source: Instagram @${handle}\n\nconst PLACES = [\n${entries}\n];`;
  };

  const genMapJs = () => {
    const keys = validNbhds.map(toKey);
    const nbhdColors  = `const NBHD_COLORS = {\n${keys.map((k,i)=>`  '${k}': '${NBHD_PALETTE[i%NBHD_PALETTE.length]}',`).join('\n')}\n};`;
    const nbhdLabels  = `const NBHD_LABELS = {\n${keys.map((k,i)=>`  '${k}': '${esc(validNbhds[i])}',`).join('\n')}\n};`;
    const nbhdCenters = `const NBHD_APPROX_CENTERS = {\n${keys.map(k=>`  '${k}': { lat: 0.0000, lng: 0.0000 }, // ⚠️ fill in`).join('\n')}\n};`;
    return `// A Perfect Day — ${displayName} / ${city}
// map.js — guide-specific config

const MAPTILER_KEY      = 'V3bgGWhyO1Rik6g1non6';
const MAP_CENTER        = [0, 0];    // ⚠️ longitude FIRST, then latitude
const MAP_ZOOM          = 13;
const OFFLINE_CENTER    = { lat: 0, lng: 0 };
const GUIDE_CITY        = '${city}';
const BLOGGER_NAME      = '${displayName}';

const CC = {
  'landmark': '#e8724a',
  'food':     '#f0c060',
  'cafe':     '#6b9e6e',
  'pub':      '#8b6bb1',
  'church':   '#6090c8',
  'market':   '#c08060',
  'nature':   '#50906a',
  'hotel':    '#d4845a',
};

const CL = {
  'landmark': 'Landmarks',
  'food':     'Restaurants',
  'cafe':     'Cafés',
  'pub':      'Bars',
  'church':   'Churches',
  'market':   'Markets',
  'nature':   'Nature',
  'hotel':    'Hotels',
};

${nbhdColors}
${nbhdLabels}
${nbhdCenters}

function initMap() {
  map = new maplibregl.Map({
    container: 'map',
    style: \`https://api.maptiler.com/maps/streets-v2/style.json?key=\${MAPTILER_KEY}\`,
    center: MAP_CENTER,
    zoom: MAP_ZOOM,
    attributionControl: false,
  });
  map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');
  map.on('load', () => {
    try {
      document.getElementById('loading').style.display = 'none';
      map.getStyle().layers.forEach(layer => {
        if (layer.type === 'symbol' && layer.layout && layer.layout['text-field']) {
          try { map.setLayoutProperty(layer.id, 'text-field', ['coalesce', ['get', 'name:en'], ['get', 'name']]); } catch(e) {}
        }
      });
      NBHD_CIRCLES = buildNbhdCircles();
      initMapSources();
      if (map.getSource('trip-route')) {
        map.getSource('trip-route').setData({ type: 'Feature', geometry: { type: 'LineString', coordinates: [] } });
      }
      PLACES.forEach(p => addMarker(p));
      if (typeof applyFilters   === 'function') applyFilters();
      if (typeof renderList     === 'function') renderList();
      if (typeof initFavourites === 'function') initFavourites();
      if (typeof alignNbhdBar   === 'function') alignNbhdBar();
    } catch (err) { console.error('Map load error:', err); }
  });
}
// ⚠️ DO NOT call initMap() here`;
  };

  const download = (filename, content) => {
    const a = document.createElement('a');
    a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content);
    a.download = filename; a.click();
  };

  // ── SETUP SCREEN ──────────────────────────────────────────────────────────
  if (step === 'setup') return (
    <div style={{minHeight:'100vh',background:T.bg,color:'#ffffff',fontFamily:"'DM Sans',sans-serif"}}>
      <div style={{borderBottom:`1px solid ${T.border}`,padding:'16px 28px',display:'flex',alignItems:'center',gap:10}}>
        <div style={{width:7,height:7,borderRadius:'50%',background:T.amber,flexShrink:0}}/>
        <span style={{fontFamily:"'Playfair Display',serif",fontSize:17,letterSpacing:0.5}}>A Perfect Day</span>
        <span style={{color:'#888888',marginLeft:2,fontSize:13}}>/ Map Builder</span>
      </div>

      <div style={{maxWidth:620,margin:'0 auto',padding:'44px 24px 80px'}}>
        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:36,fontWeight:600,lineHeight:1.15,marginBottom:10}}>
          Turn Instagram into<br/>
          <em style={{color:T.amber,fontStyle:'italic'}}>a living map.</em>
        </h1>
        <p style={{color:'#aaaaaa',lineHeight:1.7,marginBottom:36,fontSize:14}}>
          Upload your Instagram data export and we'll extract every place you've recommended — ready to review and publish as a map your followers can buy.
        </p>

        {/* City + Display name */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14}}>
          <div>
            <label style={labelSx}>City</label>
            <input value={city} onChange={e=>setCity(e.target.value)} placeholder="Tel Aviv" style={inputSx}/>
          </div>
          <div>
            <label style={labelSx}>Your display name</label>
            <input value={displayName} onChange={e=>setDisplayName(e.target.value)} placeholder="Maya Cohen" style={inputSx}/>
          </div>
        </div>

        {/* Handle */}
        <div style={{marginBottom:24}}>
          <label style={labelSx}>Instagram handle</label>
          <div style={{display:'flex',alignItems:'center',gap:0,maxWidth:260}}>
            <span style={{background:T.surface,border:`1px solid ${T.border}`,borderRight:'none',borderRadius:'6px 0 0 6px',padding:'8px 10px',fontSize:13,color:'#aaaaaa'}}>@</span>
            <input value={handle} onChange={e=>setHandle(e.target.value.replace('@',''))} placeholder="mayacohen" style={{...inputSx,borderRadius:'0 6px 6px 0',flex:1}}/>
          </div>
        </div>

        {/* Neighbourhoods */}
        <div style={{marginBottom:24}}>
          <label style={labelSx}>Neighbourhoods</label>
          <p style={{fontSize:14,color:'#aaaaaa',marginTop:0,marginBottom:10}}>Add the areas your guide will cover. Places will be assigned to these.</p>
          {nbhds.map((n, i) => (
            <div key={i} style={{display:'flex',gap:8,marginBottom:7}}>
              <input
                value={n}
                onChange={e=>{ const a=[...nbhds]; a[i]=e.target.value; setNbhds(a); }}
                placeholder={i===0?'e.g. Old Jaffa':i===1?'e.g. Florentin':'e.g. Tel Aviv Port'}
                style={{...inputSx,flex:1}}
              />
              {nbhds.length > 1 && (
                <button onClick={()=>setNbhds(nbhds.filter((_,j)=>j!==i))} style={{...btnGhost,padding:'7px 11px'}}>✕</button>
              )}
            </div>
          ))}
          <button onClick={()=>setNbhds([...nbhds,''])} style={{...btnGhost,fontSize:14,marginTop:2}}>+ Add neighbourhood</button>
        </div>

        {/* File upload */}
        <div style={{marginBottom:16}}>
          <label style={labelSx}>Instagram export file</label>
          <div
            onDragOver={e=>{e.preventDefault();setDragOver(true);}}
            onDragLeave={()=>setDragOver(false)}
            onDrop={e=>{e.preventDefault();setDragOver(false);handleFile(e.dataTransfer.files[0]);}}
            onClick={()=>fileRef.current.click()}
            style={{
              border:`1.5px dashed ${dragOver?T.amber:T.border}`,
              borderRadius:8,padding:'28px 20px',textAlign:'center',cursor:'pointer',
              background:dragOver?'#1a1612':T.surface,
              transition:'all 0.15s',
            }}
          >
            <div style={{fontSize:32,marginBottom:8}}>📁</div>
            <div style={{color:dragOver?T.amber:T.muted,fontSize:13}}>Drop your file here, or click to browse</div>
            <div style={{color:'#888888',fontSize:13,marginTop:4}}>Accepts .zip (full export) or posts_1.json</div>
          </div>
          <input ref={fileRef} type="file" accept=".zip,.json" style={{display:'none'}}
            onChange={e=>handleFile(e.target.files[0])}/>
        </div>

        {/* Or paste JSON */}
        <details style={{marginBottom:24}}>
          <summary style={{cursor:'pointer',color:'#aaaaaa',fontSize:14,userSelect:'none',marginBottom:6}}>
            Or paste JSON content directly
          </summary>
          <textarea
            value={jsonText}
            onChange={e=>setJsonText(e.target.value)}
            placeholder="Paste the contents of posts_1.json here..."
            rows={6}
            style={{...inputSx,marginTop:8,fontFamily:'monospace',fontSize:13,resize:'vertical'}}
          />
        </details>

        {/* Status */}
        {postCount > 0 && (
          <div style={{fontSize:14,color:T.green,marginBottom:16,padding:'8px 12px',background:'#0f1f12',borderRadius:6,border:'1px solid #1e3a20'}}>
            ✓ {postCount} posts loaded from file
          </div>
        )}

        {/* CTA */}
        <button
          onClick={runExtraction}
          disabled={!city.trim() || postCount === 0}
          style={{...btnPrimary,opacity:(!city.trim()||postCount===0)?0.35:1,fontSize:14,padding:'12px 28px'}}
        >
          Extract Places with AI →
        </button>

        {/* Instructions */}
        <details style={{marginTop:32}}>
          <summary style={{cursor:'pointer',color:'#aaaaaa',fontSize:14,userSelect:'none'}}>How to get your Instagram export</summary>
          <div style={{marginTop:12,fontSize:14,lineHeight:2,color:'#cccccc',padding:'12px 16px',background:T.surface,borderRadius:8,border:`1px solid ${T.border}`}}>
            1. Open Instagram → tap your profile picture (bottom right)<br/>
            2. Tap ☰ menu (top right) → <strong style={{color:'#ffffff'}}>Settings and activity</strong><br/>
            3. Tap <strong style={{color:'#ffffff'}}>Accounts Center</strong> (top of page)<br/>
            4. Tap <strong style={{color:'#ffffff'}}>Your information and permissions</strong><br/>
            5. Tap <strong style={{color:'#ffffff'}}>Download your information</strong><br/>
            6. Tap <strong style={{color:'#ffffff'}}>Download or transfer information</strong> → select your account<br/>
            7. Choose <strong style={{color:'#ffffff'}}>Some of your information</strong> → tick <strong style={{color:'#ffffff'}}>Posts</strong><br/>
            8. Tap <strong style={{color:'#ffffff'}}>Next</strong> → save to device or Google Drive<br/>
            9. Meta will email you when the export is ready (a few hours)<br/>
            10. Open the ZIP — find <strong style={{color:'#ffffff'}}>posts_1.json</strong> and upload it here
          </div>
        </details>
      </div>
    </div>
  );

  // ── PROCESSING SCREEN ─────────────────────────────────────────────────────
  if (step === 'processing') return (
    <div style={{minHeight:'100vh',background:T.bg,color:'#ffffff',fontFamily:"'DM Sans',sans-serif",display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:20}}>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      <div style={{fontSize:44,animation:'spin 3s linear infinite'}}>🗺️</div>
      <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:26,margin:0}}>Building your map...</h2>
      <p style={{color:'#aaaaaa',maxWidth:360,textAlign:'center',lineHeight:1.6,fontSize:14,margin:0}}>{procMsg}</p>
    </div>
  );

  // ── REVIEW SCREEN ─────────────────────────────────────────────────────────
  const filteredPlaces = listFilter === 'all' ? places
    : listFilter === 'approved' ? places.filter(p=>p.approved)
    : places.filter(p=>!p.approved);

  if (step === 'review') return (
    <div style={{minHeight:'100vh',background:T.bg,color:'#ffffff',fontFamily:"'DM Sans',sans-serif",display:'flex',flexDirection:'column'}}>

      {/* Top bar */}
      <div style={{borderBottom:`1px solid ${T.border}`,padding:'11px 20px',display:'flex',alignItems:'center',gap:14,background:T.bg,position:'sticky',top:0,zIndex:10}}>
        <span style={{fontFamily:"'Playfair Display',serif",fontSize:15}}>A Perfect Day</span>
        <span style={{color:'#888888'}}>·</span>
        <span style={{color:'#aaaaaa',fontSize:12}}>{displayName||handle} / {city}</span>
        <div style={{flex:1}}/>
        <span style={{fontSize:13,color:T.green,background:'#0f1f12',padding:'4px 10px',borderRadius:20,border:'1px solid #1e3a20'}}>
          {approved} / {places.length} approved
        </span>
        <button onClick={()=>setStep('export')} style={btnPrimary}>Export Files →</button>
      </div>

      <div style={{display:'flex',flex:1,height:'calc(100vh - 51px)',overflow:'hidden'}}>

        {/* LEFT — place list */}
        <div style={{width:252,borderRight:`1px solid ${T.border}`,overflowY:'auto',flexShrink:0,display:'flex',flexDirection:'column'}}>

          {/* Filter tabs */}
          <div style={{display:'flex',borderBottom:`1px solid ${T.border}`,position:'sticky',top:0,background:T.bg,zIndex:1,flexShrink:0}}>
            {[['all',`All (${places.length})`],['approved',`✓ (${approved})`],['pending',`Pending (${places.length-approved})`]].map(([k,l])=>(
              <button key={k} onClick={()=>setListFilter(k)} style={{
                flex:1,padding:'9px 4px',background:'none',border:'none',cursor:'pointer',fontSize:13,
                color:listFilter===k?T.amber:T.muted,letterSpacing:0.4,
                borderBottom:listFilter===k?`2px solid ${T.amber}`:'2px solid transparent',
              }}>{l}</button>
            ))}
          </div>

          {filteredPlaces.map(p => (
            <div key={p.id} onClick={()=>setSelId(p.id)} style={{
              padding:'9px 13px',cursor:'pointer',
              background:selId===p.id?T.card:'transparent',
              borderLeft:selId===p.id?`2px solid ${T.amber}`:'2px solid transparent',
              borderBottom:`1px solid ${T.surface}`,
              transition:'background 0.12s',
            }}>
              <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:3}}>
                <span style={{fontSize:15,lineHeight:1}}>{p.emoji}</span>
                <span style={{fontSize:14,fontWeight:500,flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                  {p.name || <em style={{color:'#aaaaaa'}}>unnamed</em>}
                </span>
                {p.approved && <span style={{color:T.green,fontSize:13,flexShrink:0}}>✓</span>}
              </div>
              <div style={{display:'flex',gap:5,alignItems:'center'}}>
                <span style={{fontSize:13,padding:'1px 7px',borderRadius:10,background:(CAT[p.cat]?.color||'#888')+'20',color:CAT[p.cat]?.color||'#888'}}>
                  {CAT[p.cat]?.label||p.cat}
                </span>
                {p.nbhd && <span style={{fontSize:13,color:'#888888',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.nbhd}</span>}
              </div>
            </div>
          ))}

          {filteredPlaces.length === 0 && (
            <div style={{padding:20,color:'#aaaaaa',fontSize:14,textAlign:'center'}}>No places here</div>
          )}
        </div>

        {/* RIGHT — editor */}
        {sel ? (
          <div style={{flex:1,overflowY:'auto',padding:'24px 28px'}}>

            {/* Name + emoji + approve */}
            <div style={{display:'flex',alignItems:'flex-start',gap:10,marginBottom:20}}>
              <input value={sel.emoji} onChange={e=>upd(sel.id,'emoji',e.target.value)}
                style={{...inputSx,width:52,textAlign:'center',fontSize:22,padding:'6px 4px',flexShrink:0,boxSizing:'border-box'}}/>
              <input value={sel.name} onChange={e=>upd(sel.id,'name',e.target.value)}
                placeholder="Place name"
                style={{...inputSx,flex:1,fontSize:18,fontFamily:"'Playfair Display',serif",fontWeight:600}}/>
              <button onClick={()=>upd(sel.id,'approved',!sel.approved)} style={{
                padding:'9px 14px',borderRadius:6,border:'1px solid',cursor:'pointer',fontSize:13,fontWeight:600,
                background:sel.approved?'#0f1f12':'transparent',
                borderColor:sel.approved?T.green:T.border,
                color:sel.approved?T.green:T.muted,
                flexShrink:0,fontFamily:'inherit',whiteSpace:'nowrap',
              }}>
                {sel.approved ? '✓ Approved' : 'Approve'}
              </button>
            </div>

            {/* Category + Neighbourhood */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16}}>
              <div>
                <label style={labelSx}>Category</label>
                <select value={sel.cat} onChange={e=>upd(sel.id,'cat',e.target.value)} style={inputSx}>
                  {CATS.map(c=><option key={c.key} value={c.key}>{c.emoji} {c.label}</option>)}
                </select>
              </div>
              <div>
                <label style={labelSx}>Neighbourhood</label>
                {validNbhds.length ? (
                  <select value={sel.nbhd} onChange={e=>upd(sel.id,'nbhd',e.target.value)} style={inputSx}>
                    {validNbhds.map(n=><option key={n} value={n}>{n}</option>)}
                    <option value="">— Unassigned —</option>
                  </select>
                ) : (
                  <input value={sel.nbhd} onChange={e=>upd(sel.id,'nbhd',e.target.value)}
                    placeholder="Neighbourhood name" style={inputSx}/>
                )}
              </div>
            </div>

            {/* Description / note */}
            <div style={{marginBottom:16}}>
              <label style={labelSx}>
                Description
                <span style={{textTransform:'none',letterSpacing:0,marginLeft:6,color:'#888888'}}>— your exact words</span>
              </label>
              <textarea value={sel.note} onChange={e=>upd(sel.id,'note',e.target.value)}
                rows={4} style={{...inputSx,resize:'vertical',lineHeight:1.6}}
                placeholder="Exact words from your Instagram caption describing this place"/>
            </div>

            {/* Tip */}
            <div style={{marginBottom:16}}>
              <label style={labelSx}>
                Visitor Tip
                <span style={{textTransform:'none',letterSpacing:0,marginLeft:6,color:'#888888'}}>— practical advice (or leave empty)</span>
              </label>
              <textarea value={sel.tip} onChange={e=>upd(sel.id,'tip',e.target.value)}
                rows={2} style={{...inputSx,resize:'vertical'}}
                placeholder="Best to visit early, ask for the off-menu special, etc."/>
            </div>

            {/* Address + geocode */}
            <div style={{marginBottom:16}}>
              <label style={labelSx}>Address</label>
              <div style={{display:'flex',gap:8}}>
                <input value={sel.address} onChange={e=>upd(sel.id,'address',e.target.value)}
                  placeholder="Street address" style={{...inputSx,flex:1}}/>
                <button onClick={()=>geocode(sel.id,sel.name)} style={{...btnGhost,whiteSpace:'nowrap',flexShrink:0}}>
                  📍 Geocode
                </button>
              </div>
              <div style={{marginTop:8,display:'flex',gap:16,alignItems:'center'}}>
                <div style={{display:'flex',alignItems:'center',gap:6}}>
                  <span style={{fontSize:13,color:'#aaaaaa',flexShrink:0}}>lat</span>
                  <input value={sel.lat} onChange={e=>upd(sel.id,'lat',parseFloat(e.target.value)||0)}
                    style={{...inputSx,width:120,padding:'4px 8px',fontSize:11}}/>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:6}}>
                  <span style={{fontSize:13,color:'#aaaaaa',flexShrink:0}}>lng</span>
                  <input value={sel.lng} onChange={e=>upd(sel.id,'lng',parseFloat(e.target.value)||0)}
                    style={{...inputSx,width:120,padding:'4px 8px',fontSize:11}}/>
                </div>
                {(sel.lat!==0||sel.lng!==0) && <span style={{fontSize:13,color:T.green}}>✓ coordinates set</span>}
              </div>
            </div>

            {/* Image */}
            <div style={{marginBottom:16}}>
              <label style={labelSx}>Image URL</label>
              <input value={sel.image_url} onChange={e=>upd(sel.id,'image_url',e.target.value)}
                placeholder="https://yourblog.com/image.jpg" style={inputSx}/>
              {sel._uri && (
                <div style={{fontSize:13,color:'#aaaaaa',marginTop:4}}>
                  Instagram file path: <code style={{background:T.surface,padding:'1px 5px',borderRadius:3,fontSize:10}}>{sel._uri}</code>
                </div>
              )}
              {sel.image_url && (
                <img src={sel.image_url} alt="" onError={e=>e.target.style.display='none'}
                  style={{marginTop:8,width:'100%',maxHeight:180,objectFit:'cover',borderRadius:6,display:'block'}}/>
              )}
            </div>

            {/* Hours / Website / Phone */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,marginBottom:28}}>
              {[['Hours','hours','Mon–Sat 12–23'],['Website','website','https://'],['Phone','phone','+972 ..']].map(([lbl,field,ph])=>(
                <div key={field}>
                  <label style={labelSx}>{lbl}</label>
                  <input value={sel[field]} onChange={e=>upd(sel.id,field,e.target.value)}
                    placeholder={ph} style={inputSx}/>
                </div>
              ))}
            </div>

            {/* Delete */}
            <button onClick={()=>del(sel.id)} style={{
              background:'none',border:`1px solid #3a1818`,color:'#885555',
              padding:'8px 16px',borderRadius:6,cursor:'pointer',fontSize:14,fontFamily:'inherit',
            }}>
              🗑 Remove this place
            </button>
          </div>
        ) : (
          <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',color:'#888888',fontSize:13}}>
            Select a place from the list to edit
          </div>
        )}
      </div>
    </div>
  );

  // ── EXPORT SCREEN ─────────────────────────────────────────────────────────
  const files = { data: genDataJs(), map: genMapJs() };
  const unapproved = places.length - approved;

  return (
    <div style={{minHeight:'100vh',background:T.bg,color:'#ffffff',fontFamily:"'DM Sans',sans-serif",display:'flex',flexDirection:'column'}}>
      <div style={{borderBottom:`1px solid ${T.border}`,padding:'11px 20px',display:'flex',alignItems:'center',gap:14}}>
        <span style={{fontFamily:"'Playfair Display',serif",fontSize:15}}>A Perfect Day</span>
        <span style={{color:'#888888'}}>·</span>
        <span style={{color:'#aaaaaa',fontSize:12}}>Export</span>
        <div style={{flex:1}}/>
        <button onClick={()=>setStep('review')} style={btnGhost}>← Back to editor</button>
      </div>

      <div style={{maxWidth:820,margin:'0 auto',padding:'36px 24px',width:'100%',boxSizing:'border-box'}}>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:30,marginBottom:6}}>Your files are ready.</h2>
        <p style={{color:'#aaaaaa',marginBottom:6}}>
          {places.length} places total · {approved} approved · {city}
        </p>
        {unapproved > 0 && (
          <div style={{fontSize:14,color:'#c8923e',marginBottom:24,padding:'8px 12px',background:'#1a1308',borderRadius:6,border:'1px solid #3a2a10'}}>
            ⚠ {unapproved} places still pending approval — go back to review if needed
          </div>
        )}

        {/* Download buttons */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:28}}>
          {[['data','data.js'],['map','map.js']].map(([k,fn])=>(
            <button key={k} onClick={()=>download(fn,files[k])}
              style={{...btnPrimary,display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
              ⬇ Download {fn}
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div style={{display:'flex',borderBottom:`1px solid ${T.border}`,marginBottom:14}}>
          {[['data','data.js'],['map','map.js']].map(([k,l])=>(
            <button key={k} onClick={()=>setExpTab(k)} style={{
              padding:'8px 18px',background:'none',border:'none',cursor:'pointer',fontSize:14,
              color:expTab===k?T.amber:T.muted,
              borderBottom:expTab===k?`2px solid ${T.amber}`:'2px solid transparent',fontFamily:'inherit',
            }}>{l}</button>
          ))}
        </div>

        <pre style={{
          background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,
          padding:'16px 18px',overflow:'auto',fontSize:13,fontFamily:'monospace',
          lineHeight:1.65,maxHeight:360,color:'#e0e0e0',margin:0,
        }}>{files[expTab]}</pre>

        {/* Next steps */}
        <div style={{marginTop:20,padding:'16px 20px',background:T.surface,border:`1px solid ${T.border}`,borderRadius:8}}>
          <div style={{fontSize:14,color:T.amber,fontWeight:600,marginBottom:10,letterSpacing:0.5,textTransform:'uppercase'}}>
            Next steps
          </div>
          <div style={{fontSize:14,color:'#cccccc',lineHeight:2.2}}>
            1. Download both files above<br/>
            2. Set <code style={{background:T.bg,padding:'1px 5px',borderRadius:3}}>MAP_CENTER</code> in map.js — longitude first, then latitude<br/>
            3. Fill in <code style={{background:T.bg,padding:'1px 5px',borderRadius:3}}>NBHD_APPROX_CENTERS</code> with correct lat/lng for each neighbourhood<br/>
            4. Add images to the <code style={{background:T.bg,padding:'1px 5px',borderRadius:3}}>images/</code> folder (rename to place-1.jpg, place-2.jpg...)<br/>
            5. Copy <code style={{background:T.bg,padding:'1px 5px',borderRadius:3}}>_template-v2/index.html</code> and update for {displayName||handle}<br/>
            6. Run the deploy .bat — live in ~30s
          </div>
        </div>
      </div>
    </div>
  );
}

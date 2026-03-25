import { useState, useMemo, useRef, useCallback, useEffect } from "react";

// ─── Music Data ──────────────────────────────────────────────────────────────
const NOTES = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const NOTE_NAMES_ES = { C:"DO","C#":"DO#",D:"RE","D#":"RE#",E:"MI",F:"FA","F#":"FA#",G:"SOL","G#":"SOL#",A:"LA","A#":"LA#",B:"SI" };
const OPEN_STRINGS = [4,9,2,7,11,4]; // E A D G B e (str0=low E)
const STRING_NAMES = ["6ª (E)","5ª (A)","4ª (D)","3ª (G)","2ª (B)","1ª (e)"];
const FRET_COUNT = 15;
const MARKER_FRETS = [3,5,7,9,12];

const SCALES = {
  major:          { name:"Mayor",          intervals:[0,2,4,5,7,9,11] },
  minor:          { name:"Menor Natural",  intervals:[0,2,3,5,7,8,10] },
  harmonicMinor:  { name:"Menor Armónica", intervals:[0,2,3,5,7,8,11] },
  pentatonicMajor:{ name:"Pent. Mayor",    intervals:[0,2,4,7,9] },
  pentatonicMinor:{ name:"Pent. Menor",    intervals:[0,3,5,7,10] },
  blues:          { name:"Blues",          intervals:[0,3,5,6,7,10] },
  dorian:         { name:"Dórico",         intervals:[0,2,3,5,7,9,10] },
  phrygian:       { name:"Frigio",         intervals:[0,1,3,5,7,8,10] },
};

const CHORD_TYPES = {
  major:     { name:"Mayor",      intervals:[0,4,7] },
  minor:     { name:"Menor",      intervals:[0,3,7] },
  dom7:      { name:"Dom 7",      intervals:[0,4,7,10] },
  maj7:      { name:"Maj 7",      intervals:[0,4,7,11] },
  min7:      { name:"Min 7",      intervals:[0,3,7,10] },
  dim:       { name:"Disminuido", intervals:[0,3,6] },
  dim7:      { name:"Dim 7",      intervals:[0,3,6,9] },
  aug:       { name:"Aumentado",  intervals:[0,4,8] },
  sus2:      { name:"Sus2",       intervals:[0,2,7] },
  sus4:      { name:"Sus4",       intervals:[0,5,7] },
};

// ─── Intervals ───────────────────────────────────────────────────────────────
function getTextColor(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return (0.299*r + 0.587*g + 0.114*b)/255 > 0.55 ? "#111111" : "#ffffff";
}

const COLORS_KEY = "fretmapper_colors_v2";

function loadSavedColors() {
  try {
    const raw = localStorage.getItem(COLORS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function applyColors(base, saved) {
  if (!saved) return base;
  return base.map(iv => saved[iv.semitones] ? { ...iv, color: saved[iv.semitones] } : iv);
}

const DEFAULT_INTERVALS = [
  { semitones:0,  label:"R",  name:"Tónica",        color:"#f2e8e8" },
  { semitones:1,  label:"b2", name:"2da menor",      color:"#94a3b8" },
  { semitones:2,  label:"2",  name:"2da / 9na",      color:"#f89b59" },
  { semitones:3,  label:"b3", name:"3ra menor",      color:"#f25a5a" },
  { semitones:4,  label:"3",  name:"3ra mayor",      color:"#ea3434" },
  { semitones:5,  label:"4",  name:"4ta / 11na",     color:"#3ca13a" },
  { semitones:6,  label:"b5", name:"5ta disminuida", color:"#4d8df5" },
  { semitones:7,  label:"5",  name:"5ta justa",      color:"#2474f5" },
  { semitones:8,  label:"#5", name:"5ta aum.",       color:"#60a5fa" },
  { semitones:9,  label:"6",  name:"6ta / 13ra",     color:"#45d5f2" },
  { semitones:10, label:"b7", name:"7ma menor",      color:"#aa66ea" },
  { semitones:11, label:"7",  name:"7ma mayor",      color:"#9526fd" },
];

// ─── Harmonized Scales ───────────────────────────────────────────────────────
const HARMONIZED_SCALES = {
  major: {
    name: "Mayor",
    degrees: [
      { roman:"I",    triad:[0,4,7],   seventh:[0,4,7,11], quality:"maj7",  func:"Tónica",       funcColor:"#3b82f6", mode:"Jónico" },
      { roman:"ii",   triad:[0,3,7],   seventh:[0,3,7,10], quality:"min7",  func:"Subdominante", funcColor:"#22c55e", mode:"Dórico" },
      { roman:"iii",  triad:[0,3,7],   seventh:[0,3,7,10], quality:"min7",  func:"Tónica",       funcColor:"#3b82f6", mode:"Frigio" },
      { roman:"IV",   triad:[0,4,7],   seventh:[0,4,7,11], quality:"maj7",  func:"Subdominante", funcColor:"#22c55e", mode:"Lidio" },
      { roman:"V",    triad:[0,4,7],   seventh:[0,4,7,10], quality:"7",     func:"Dominante",    funcColor:"#f97316", mode:"Mixolidio" },
      { roman:"vi",   triad:[0,3,7],   seventh:[0,3,7,10], quality:"min7",  func:"Tónica rel.",  funcColor:"#3b82f6", mode:"Eólico" },
      { roman:"vii°", triad:[0,3,6],   seventh:[0,3,6,10], quality:"m7b5",  func:"Dominante",    funcColor:"#f97316", mode:"Locrio" },
    ]
  },
  minor: {
    name: "Menor Natural",
    degrees: [
      { roman:"i",    triad:[0,3,7],   seventh:[0,3,7,10], quality:"min7",  func:"Tónica",       funcColor:"#3b82f6", mode:"Eólico" },
      { roman:"ii°",  triad:[0,3,6],   seventh:[0,3,6,10], quality:"m7b5",  func:"Subdominante", funcColor:"#22c55e", mode:"Locrio" },
      { roman:"III",  triad:[0,4,7],   seventh:[0,4,7,11], quality:"maj7",  func:"Tónica rel.",  funcColor:"#3b82f6", mode:"Jónico" },
      { roman:"iv",   triad:[0,3,7],   seventh:[0,3,7,10], quality:"min7",  func:"Subdominante", funcColor:"#22c55e", mode:"Dórico" },
      { roman:"v",    triad:[0,3,7],   seventh:[0,3,7,10], quality:"min7",  func:"Dominante",    funcColor:"#f97316", mode:"Frigio" },
      { roman:"VI",   triad:[0,4,7],   seventh:[0,4,7,11], quality:"maj7",  func:"Subdominante", funcColor:"#22c55e", mode:"Lidio" },
      { roman:"VII",  triad:[0,4,7],   seventh:[0,4,7,10], quality:"7",     func:"Dominante",    funcColor:"#f97316", mode:"Mixolidio" },
    ]
  },
  harmonicMinor: {
    name: "Menor Armónica",
    degrees: [
      { roman:"i",    triad:[0,3,7],   seventh:[0,3,7,11], quality:"mMaj7", func:"Tónica",       funcColor:"#3b82f6", mode:"Men. Arm." },
      { roman:"ii°",  triad:[0,3,6],   seventh:[0,3,6,10], quality:"m7b5",  func:"Subdominante", funcColor:"#22c55e", mode:"Locrio ♮6" },
      { roman:"III+", triad:[0,4,8],   seventh:[0,4,8,11], quality:"augMaj7",func:"Tónica",      funcColor:"#3b82f6", mode:"Jónico #5" },
      { roman:"iv",   triad:[0,3,7],   seventh:[0,3,7,10], quality:"min7",  func:"Subdominante", funcColor:"#22c55e", mode:"Dórico #4" },
      { roman:"V",    triad:[0,4,7],   seventh:[0,4,7,10], quality:"7",     func:"Dominante",    funcColor:"#f97316", mode:"Mixo b9b13" },
      { roman:"VI",   triad:[0,4,7],   seventh:[0,4,7,11], quality:"maj7",  func:"Subdominante", funcColor:"#22c55e", mode:"Lidio #2" },
      { roman:"vii°", triad:[0,3,6],   seventh:[0,3,6,9],  quality:"dim7",  func:"Dominante",    funcColor:"#f97316", mode:"Alt. dim." },
    ]
  },
  dorian: {
    name: "Dórico",
    degrees: [
      { roman:"i",    triad:[0,3,7],   seventh:[0,3,7,10], quality:"min7",  func:"Tónica",       funcColor:"#3b82f6", mode:"Dórico" },
      { roman:"ii",   triad:[0,3,7],   seventh:[0,3,7,10], quality:"min7",  func:"Subdominante", funcColor:"#22c55e", mode:"Frigio" },
      { roman:"III",  triad:[0,4,7],   seventh:[0,4,7,11], quality:"maj7",  func:"Tónica rel.",  funcColor:"#3b82f6", mode:"Lidio" },
      { roman:"IV",   triad:[0,4,7],   seventh:[0,4,7,10], quality:"7",     func:"Dominante",    funcColor:"#f97316", mode:"Mixolidio" },
      { roman:"v",    triad:[0,3,7],   seventh:[0,3,7,10], quality:"min7",  func:"Subdominante", funcColor:"#22c55e", mode:"Eólico" },
      { roman:"vi°",  triad:[0,3,6],   seventh:[0,3,6,10], quality:"m7b5",  func:"Dominante",    funcColor:"#f97316", mode:"Locrio" },
      { roman:"VII",  triad:[0,4,7],   seventh:[0,4,7,11], quality:"maj7",  func:"Subdominante", funcColor:"#22c55e", mode:"Jónico" },
    ]
  },
};

const FUNC_ABBR = { "Tónica":"T", "Subdominante":"SD", "Dominante":"D", "Tónica rel.":"Tr" };

// ─── Correct CAGED System ────────────────────────────────────────────────────
// Shapes defined as actual open chord fingerings.
// strings[i] = fret on string i (str0=low E), -1 = muted
// roots[i] = true if string i plays the root note
const CAGED_SHAPE_DEFS = {
  C: { strings:[-1,3,2,0,1,0], roots:[false,true,false,false,true,false], rootStr:1, rootFret:3, span:[0,3] },
  A: { strings:[-1,0,2,2,2,0], roots:[false,true,false,true,false,false], rootStr:1, rootFret:0, span:[0,2] },
  G: { strings:[3,2,0,0,0,3],  roots:[true,false,false,true,false,true],  rootStr:0, rootFret:3, span:[0,3] },
  E: { strings:[0,2,2,1,0,0],  roots:[true,false,true,false,false,true],  rootStr:0, rootFret:0, span:[0,2] },
  D: { strings:[-1,-1,0,2,3,2],roots:[false,false,true,false,true,false], rootStr:2, rootFret:0, span:[0,3] },
};

const CAGED_COLORS = {
  C:{ border:"#f43f5e", bg:"rgba(244,63,94,0.08)",  text:"#f43f5e" },
  A:{ border:"#f59e0b", bg:"rgba(245,158,11,0.08)", text:"#f59e0b" },
  G:{ border:"#10b981", bg:"rgba(16,185,129,0.08)", text:"#10b981" },
  E:{ border:"#3b82f6", bg:"rgba(59,130,246,0.08)", text:"#3b82f6" },
  D:{ border:"#a855f7", bg:"rgba(168,85,247,0.08)", text:"#a855f7" },
};

function transposeCAGED(shapeName, targetRootIdx) {
  const def = CAGED_SHAPE_DEFS[shapeName];
  const openNote = OPEN_STRINGS[def.rootStr];
  let barre = (targetRootIdx - openNote + 12) % 12 - def.rootFret;
  if (barre < 0) barre += 12;
  const actualFrets = def.strings.map(f => f === -1 ? -1 : f + barre);
  return {
    shape: shapeName,
    barre,
    actualFrets,
    roots: def.roots,
    loFret: barre + def.span[0],
    hiFret: barre + def.span[1],
  };
}

function computeAllCAGED(rootIdx) {
  const result = [];
  for (const shape of ["C","A","G","E","D"]) {
    let pos = transposeCAGED(shape, rootIdx);
    // Add both occurrences within the fretboard
    result.push(pos);
    if (pos.loFret + 12 <= FRET_COUNT) {
      const pos2 = { ...pos, loFret: pos.loFret+12, hiFret: pos.hiFret+12, barre: pos.barre+12,
        actualFrets: pos.actualFrets.map(f => f < 0 ? f : f+12) };
      result.push(pos2);
    }
  }
  return result.filter(p => p.loFret <= FRET_COUNT && p.hiFret >= 0)
               .sort((a,b) => a.loFret - b.loFret);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getNoteAtFret(strIdx, fret) { return (OPEN_STRINGS[strIdx] + fret) % 12; }

function buildChordNotes(rootIdx, intervals) {
  return intervals.map(i => (rootIdx + i) % 12);
}

// ─── Audio Engine ─────────────────────────────────────────────────────────────
// Converts note index + octave to frequency (Hz)
function noteToFreq(noteIdx, octave = 4) {
  // A4 = 440 Hz, noteIdx 9 = A
  return 440 * Math.pow(2, (noteIdx - 9 + (octave - 4) * 12) / 12);
}

// Guitar string base octaves (str0=low E2, str1=A2, str2=D3, str3=G3, str4=B3, str5=e4)
const STRING_OCTAVES = [2, 2, 3, 3, 3, 4];

function getNoteFreq(strIdx, fret) {
  const noteIdx = (OPEN_STRINGS[strIdx] + fret) % 12;
  const octaveShift = Math.floor((OPEN_STRINGS[strIdx] + fret) / 12);
  const octave = STRING_OCTAVES[strIdx] + octaveShift;
  return noteToFreq(noteIdx, octave);
}

// Pluck a single guitar-like tone using Web Audio API
function pluckNote(ctx, freq, startTime = 0, duration = 1.8, gain = 0.18) {
  // Main oscillator (sawtooth → guitar-like harmonic content)
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(freq, startTime);

  // Guitar-like filter: bright attack, warm decay
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(3000, startTime);
  filter.frequency.exponentialRampToValueAtTime(600, startTime + 0.3);
  filter.Q.setValueAtTime(1.5, startTime);

  // Envelope: sharp attack, natural decay
  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(gain, startTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(gain * 0.4, startTime + 0.15);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration);
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function GuitarApp() {
  const [ALL_INTERVALS, setAllIntervals] = useState(() => applyColors(DEFAULT_INTERVALS, loadSavedColors()));
  const [selectedRoot,   setSelectedRoot]   = useState("C");
  const [mode,           setMode]           = useState("chord"); // "scale"|"chord"|"harmonized"
  const [selectedScale,  setSelectedScale]  = useState("major");
  const [selectedChord,  setSelectedChord]  = useState("major");
  const [flipped,        setFlipped]        = useState(true);
  const [mutedStrings,   setMutedStrings]   = useState(new Set());
  const [disabledIvs,    setDisabledIvs]    = useState(new Set());
  const [showCaged,      setShowCaged]      = useState(false);
  const [activeCaged,    setActiveCaged]    = useState(new Set(["C","A","G","E","D"]));
  const [hoveredShape,   setHoveredShape]   = useState(null);
  const [hoveredFret,    setHoveredFret]    = useState(null); // {noteIdx, strIdx, fret}
  const [rootLocked,     setRootLocked]     = useState(false); // 🔒 lock root selection
  // Harmonized scale state
  const [harmScale,      setHarmScale]      = useState("major");
  const [selectedDegree, setSelectedDegree] = useState(0); // index 0-6
  const [useSevenths,    setUseSevenths]    = useState(false);

  // ── Audio state only ──
  const [audioEnabled,   setAudioEnabled]   = useState(false);
  const [isPlaying,      setIsPlaying]      = useState(false);
  const audioCtxRef = useRef(null);

  const rootIdx = NOTES.indexOf(selectedRoot);

  // Active notes on fretboard
  const activeNotes = useMemo(() => {
    if (mode === "scale") {
      const ivs = SCALES[selectedScale].intervals;
      return ivs.map(i => (rootIdx + i) % 12);
    }
    if (mode === "chord") {
      return buildChordNotes(rootIdx, CHORD_TYPES[selectedChord].intervals);
    }
    if (mode === "harmonized") {
      const deg = HARMONIZED_SCALES[harmScale]?.degrees[selectedDegree];
      if (!deg) return [];
      const degRootOffset = SCALES[harmScale]?.intervals[selectedDegree] ?? 0;
      const degRoot = (rootIdx + degRootOffset) % 12;
      const ivs = useSevenths ? deg.seventh : deg.triad;
      return ivs.map(i => (degRoot + i) % 12);
    }
    return [];
  }, [mode, selectedRoot, selectedScale, selectedChord, harmScale, selectedDegree, useSevenths]);

  const presentIntervals = useMemo(() => {
    if (mode === "harmonized") {
      const deg = HARMONIZED_SCALES[harmScale]?.degrees[selectedDegree];
      if (!deg) return [];
      return useSevenths ? deg.seventh : deg.triad;
    }
    if (mode === "scale") return SCALES[selectedScale].intervals;
    return CHORD_TYPES[selectedChord].intervals;
  }, [mode, selectedScale, selectedChord, harmScale, selectedDegree, useSevenths]);

  // For interval coloring: root is degree root in harmonized mode
  const displayRootIdx = useMemo(() => {
    if (mode === "harmonized") {
      const degRootOffset = SCALES[harmScale]?.intervals[selectedDegree] ?? 0;
      return (rootIdx + degRootOffset) % 12;
    }
    return rootIdx;
  }, [mode, rootIdx, harmScale, selectedDegree]);

  const cagedPositions = useMemo(() => computeAllCAGED(rootIdx), [rootIdx]);

  const stringOrder = flipped ? [5,4,3,2,1,0] : [0,1,2,3,4,5];

  // Toggles
  const toggleString  = idx => setMutedStrings(p => { const n=new Set(p); n.has(idx)?n.delete(idx):n.add(idx); return n; });
  const toggleIv      = s   => setDisabledIvs(p  => { const n=new Set(p); n.has(s)?n.delete(s):n.add(s);     return n; });
  const toggleCaged   = sh  => setActiveCaged(p  => { const n=new Set(p); n.has(sh)?n.delete(sh):n.add(sh);  return n; });

  // ── Audio functions (defined after activeNotes) ──
  function getAudioCtx() {
    if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }

  function toggleAudio() {
    setAudioEnabled(e => !e);
  }

  function playSingleNote(noteIdx) {
    if (!audioEnabled) return;
    const ctx = getAudioCtx();
    const preferred = [2,3,1,4,0,5];
    for (const s of preferred) {
      for (let f = 0; f <= 12; f++) {
        if (getNoteAtFret(s, f) === noteIdx) {
          pluckNote(ctx, getNoteFreq(s, f), ctx.currentTime, 1.8, 0.2);
          return;
        }
      }
    }
  }

  function playChord() {
    if (!audioEnabled || isPlaying) return;
    const ctx = getAudioCtx();
    const now = ctx.currentTime;
    const voicing = [];
    const usedStrings = new Set();
    const notesToVoice = [...activeNotes].sort((a,b) => a - b);
    for (const noteIdx of notesToVoice) {
      for (let s = 0; s <= 5; s++) {
        if (usedStrings.has(s)) continue;
        for (let f = 0; f <= 14; f++) {
          if (getNoteAtFret(s, f) === noteIdx) {
            voicing.push({ strIdx: s, fret: f, freq: getNoteFreq(s, f) });
            usedStrings.add(s);
            break;
          }
        }
        if (usedStrings.has(s)) break;
      }
    }
    voicing.sort((a,b) => a.strIdx - b.strIdx);
    voicing.forEach((v, i) => pluckNote(ctx, v.freq, now + i * 0.055, 2.2, 0.18));
  }

  function playScale() {
    if (!audioEnabled || isPlaying) return;
    setIsPlaying(true);
    const ctx = getAudioCtx();
    const now = ctx.currentTime;
    const step = 0.38;
    const preferred = [2,3,1,4,0,5];
    activeNotes.forEach((noteIdx, i) => {
      for (const s of preferred) {
        for (let f = 0; f <= 12; f++) {
          if (getNoteAtFret(s, f) === noteIdx) {
            pluckNote(ctx, getNoteFreq(s, f), now + i * step, 1.2, 0.2);
            break;
          }
        }
      }
    });
    setTimeout(() => setIsPlaying(false), activeNotes.length * step * 1000 + 600);
  }

  function getNoteDisplay(noteIdx) {
    if (!activeNotes.includes(noteIdx)) return null;
    const interval = (noteIdx - displayRootIdx + 12) % 12;
    if (disabledIvs.has(interval)) return null;
    const meta = ALL_INTERVALS.find(i => i.semitones === interval);
    if (!meta) return null;
    return {
      bg: meta.color,
      textColor: getTextColor(meta.color),
      label: meta.label,
      isRoot: interval === 0,
    };
  }

  // Styles
  const panel = { background:"rgba(255,255,255,0.04)", borderRadius:"12px", padding:"14px", border:"1px solid rgba(255,255,255,0.08)" };
  const lbl   = { fontSize:"0.6rem", color:"#64748b", letterSpacing:"0.15em", display:"block", marginBottom:"8px", textTransform:"uppercase" };
  const sel   = { width:"100%", padding:"7px 10px", borderRadius:"8px", border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.08)", color:"#e2e8f0", fontSize:"0.78rem", fontFamily:"'Courier New',monospace", cursor:"pointer" };

  const btn = (active, color="#f97316") => ({
    padding:"5px 12px", borderRadius:"20px", border:`2px solid ${active?color:"rgba(255,255,255,0.08)"}`,
    cursor:"pointer", fontSize:"0.7rem", fontWeight:"700", fontFamily:"inherit",
    background: active ? `${color}1a` : "rgba(255,255,255,0.03)",
    color: active ? color : "#334155", transition:"all 0.15s",
  });

  const modeBtn = (m, label, color) => (
    <button onClick={() => setMode(m)} style={{
      flex:1, padding:"7px 4px", borderRadius:"8px", border:"none", cursor:"pointer",
      fontSize:"0.68rem", fontWeight:"700", fontFamily:"inherit",
      background: mode===m ? color : "rgba(255,255,255,0.07)",
      color: mode===m ? "#fff" : "#94a3b8", transition:"all 0.12s",
    }}>{label}</button>
  );

  // Harmonized scale helpers
  const harmDef = HARMONIZED_SCALES[harmScale];
  const hasHarm = !!harmDef;
  const scaleHasHarm = ["major","minor","harmonicMinor","dorian"].includes(harmScale) && ["major","minor","harmonicMinor","dorian"].includes(selectedScale);

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#0f0f1a 0%,#1a1025 50%,#0f1a1a 100%)", fontFamily:"'Courier New',monospace", color:"#e2e8f0", padding:"16px" }}>

      {/* Header */}
      <div style={{ textAlign:"center", marginBottom:"16px", position:"relative" }}>
        <h1 style={{ fontSize:"1.6rem", fontWeight:"900", letterSpacing:"0.15em", background:"linear-gradient(90deg,#f97316,#a855f7,#3b82f6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", margin:0, textTransform:"uppercase" }}>🎸 MONA</h1>
        <p style={{ color:"#475569", fontSize:"0.65rem", letterSpacing:"0.1em", margin:"3px 0 8px" }}>GUITARRA ELÉCTRICA · AFINACIÓN ESTÁNDAR</p>

        {/* Audio controls */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"10px" }}>
          <button onClick={toggleAudio} title={audioEnabled ? "Deshabilitar sonido" : "Habilitar sonido"} style={{
            display:"flex", alignItems:"center", gap:"7px", padding:"7px 16px",
            borderRadius:"20px", border:`2px solid ${audioEnabled ? "#22c55e" : "rgba(255,255,255,0.12)"}`,
            cursor:"pointer", fontFamily:"inherit", fontWeight:"700", fontSize:"0.72rem",
            background: audioEnabled ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.04)",
            color: audioEnabled ? "#22c55e" : "#475569", transition:"all 0.2s",
          }}>
            <span style={{ fontSize:"1.1rem" }}>{audioEnabled ? "🔊" : "🔇"}</span>
            {audioEnabled ? "SONIDO ON" : "SONIDO OFF"}
          </button>

          {audioEnabled && (
            <>
              <button onClick={playChord} disabled={isPlaying} title="Tocar acorde" style={{
                display:"flex", alignItems:"center", gap:"6px", padding:"7px 14px",
                borderRadius:"20px", border:"2px solid rgba(168,85,247,0.5)",
                cursor: isPlaying ? "default" : "pointer", fontFamily:"inherit", fontWeight:"700", fontSize:"0.72rem",
                background:"rgba(168,85,247,0.1)", color:"#a855f7", transition:"all 0.2s",
                opacity: isPlaying ? 0.5 : 1,
              }}>
                🎵 Tocar acorde
              </button>
              {mode === "scale" && (
                <button onClick={playScale} disabled={isPlaying} title="Tocar escala" style={{
                  display:"flex", alignItems:"center", gap:"6px", padding:"7px 14px",
                  borderRadius:"20px", border:"2px solid rgba(34,197,94,0.5)",
                  cursor: isPlaying ? "default" : "pointer", fontFamily:"inherit", fontWeight:"700", fontSize:"0.72rem",
                  background:"rgba(34,197,94,0.1)", color:"#22c55e", transition:"all 0.2s",
                  opacity: isPlaying ? 0.5 : 1,
                }}>
                  {isPlaying ? "▶ Tocando..." : "🎶 Tocar escala"}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Top controls */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"10px", maxWidth:"960px", margin:"0 auto 10px" }}>

        {/* Root — display only, set by clicking fretboard */}
        <div style={{ ...panel, borderColor: rootLocked ? "rgba(34,197,94,0.4)" : "rgba(249,115,22,0.3)", display:"flex", flexDirection:"column", justifyContent:"space-between", transition:"border-color 0.2s" }}>
          <span style={lbl}>Nota Raíz</span>
          <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
            {/* Big note name */}
            <div style={{ fontSize:"2.8rem", fontWeight:"900", lineHeight:1, color: rootLocked ? "#22c55e" : "#f97316", letterSpacing:"-0.02em", textShadow:`0 0 24px ${rootLocked ? "rgba(34,197,94,0.5)" : "rgba(249,115,22,0.5)"}`, transition:"color 0.2s" }}>
              {NOTE_NAMES_ES[selectedRoot]}
            </div>
            {/* Lock button */}
            <button onClick={() => setRootLocked(l => !l)} title={rootLocked ? "Desbloquear tonalidad" : "Bloquear tonalidad"} style={{
              fontSize:"1.4rem", background:"none", border:`2px solid ${rootLocked ? "rgba(34,197,94,0.5)" : "rgba(255,255,255,0.1)"}`,
              borderRadius:"8px", padding:"4px 8px", cursor:"pointer",
              filter: rootLocked ? "none" : "grayscale(1) opacity(0.4)",
              transition:"all 0.2s",
            }}>🔒</button>
            {/* Preview note on hover (only when unlocked) */}
            {!rootLocked && hoveredFret && NOTES[hoveredFret.noteIdx] !== selectedRoot && (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"2px" }}>
                <div style={{ fontSize:"0.52rem", color:"#475569", letterSpacing:"0.1em" }}>CLICK →</div>
                <div style={{ fontSize:"1.3rem", fontWeight:"800", color:"rgba(249,115,22,0.5)" }}>
                  {NOTE_NAMES_ES[NOTES[hoveredFret.noteIdx]]}
                </div>
              </div>
            )}
          </div>
          <div style={{ marginTop:"10px", fontSize:"0.56rem", color: rootLocked ? "#22c55e" : "#334155", lineHeight:1.5, transition:"color 0.2s" }}>
            {rootLocked
              ? "🔒 Tonalidad fija · click en notas para escuchar"
              : "👆 Click en el diapasón para cambiar la raíz"}
          </div>
        </div>

        {/* Mode + selector */}
        <div style={panel}>
          <span style={lbl}>Modo</span>
          <div style={{ display:"flex", gap:"6px", marginBottom:"9px" }}>
            {modeBtn("scale","🎵 Escala","#22c55e")}
            {modeBtn("chord","🎶 Acorde","#3b82f6")}
            {modeBtn("harmonized","🎼 Arm.","#f97316")}
          </div>
          {mode==="scale" && <select value={selectedScale} onChange={e=>setSelectedScale(e.target.value)} style={sel}>{Object.entries(SCALES).map(([k,s])=><option key={k} value={k} style={{background:"#1a1025"}}>{s.name}</option>)}</select>}
          {mode==="chord" && <select value={selectedChord} onChange={e=>setSelectedChord(e.target.value)} style={sel}>{Object.entries(CHORD_TYPES).map(([k,c])=><option key={k} value={k} style={{background:"#1a1025"}}>{c.name}</option>)}</select>}
          {mode==="harmonized" && (
            <select value={harmScale} onChange={e=>setHarmScale(e.target.value)} style={sel}>
              {Object.entries(HARMONIZED_SCALES).map(([k,s])=><option key={k} value={k} style={{background:"#1a1025"}}>{s.name}</option>)}
            </select>
          )}
        </div>

        {/* Vista + cuerdas */}
        <div style={panel}>
          <span style={lbl}>Vista del Diapasón</span>
          <button onClick={()=>setFlipped(f=>!f)} style={{ width:"100%", padding:"7px", borderRadius:"8px", border:"none", cursor:"pointer", fontSize:"0.68rem", fontWeight:"700", fontFamily:"inherit", marginBottom:"9px", background:flipped?"rgba(249,115,22,0.15)":"rgba(255,255,255,0.07)", color:flipped?"#f97316":"#94a3b8", border:flipped?"1px solid rgba(249,115,22,0.35)":"1px solid transparent", transition:"all 0.15s" }}>
            {flipped ? "✅ Vista Natural (1ª arriba · 6ª abajo)" : "🔄 Vista Invertida"}
          </button>
          <span style={{...lbl,marginBottom:"5px"}}>Silenciar cuerdas</span>
          <div style={{ display:"flex", gap:"4px", flexWrap:"wrap" }}>
            {[0,1,2,3,4,5].map(i=>(
              <button key={i} onClick={()=>toggleString(i)} style={{ padding:"3px 7px", borderRadius:"5px", border:"none", cursor:"pointer", fontSize:"0.62rem", fontWeight:"700", fontFamily:"inherit", background:mutedStrings.has(i)?"rgba(239,68,68,0.2)":"rgba(255,255,255,0.07)", color:mutedStrings.has(i)?"#ef4444":"#94a3b8", textDecoration:mutedStrings.has(i)?"line-through":"none", transition:"all 0.12s" }}>{STRING_NAMES[i].split(" ")[0]}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Escala Armonizada Panel ── */}
      {mode === "harmonized" && harmDef && (
        <div style={{ ...panel, maxWidth:"960px", margin:"0 auto 10px", borderColor:"rgba(249,115,22,0.25)" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"12px" }}>
            <span style={{ fontSize:"0.72rem", fontWeight:"700", color:"#f97316", letterSpacing:"0.1em" }}>
              🎼 ESCALA ARMONIZADA · {NOTE_NAMES_ES[selectedRoot]} {harmDef.name.toUpperCase()}
            </span>
            <div style={{ display:"flex", gap:"6px" }}>
              <button onClick={()=>setUseSevenths(false)} style={{ ...btn(!useSevenths,"#22c55e"), padding:"4px 10px", fontSize:"0.65rem" }}>Tríadas</button>
              <button onClick={()=>setUseSevenths(true)}  style={{ ...btn(useSevenths,"#a855f7"),  padding:"4px 10px", fontSize:"0.65rem" }}>Con 7ma</button>
            </div>
          </div>

          {/* Degree cards */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
            {harmDef.degrees.map((deg, i) => {
              const degRootOffset = SCALES[harmScale]?.intervals[i] ?? 0;
              const degRoot = (rootIdx + degRootOffset) % 12;
              const chordNotes = (useSevenths ? deg.seventh : deg.triad).map(iv => (degRoot + iv) % 12);
              const isActive = selectedDegree === i;
              return (
                <button key={i} onClick={()=>setSelectedDegree(i)} style={{
                  padding:"10px 12px", borderRadius:"10px", border:`2px solid ${isActive ? deg.funcColor : "rgba(255,255,255,0.08)"}`,
                  cursor:"pointer", fontFamily:"inherit", textAlign:"left",
                  background: isActive ? `${deg.funcColor}15` : "rgba(255,255,255,0.03)",
                  transition:"all 0.15s", minWidth:"110px",
                }}>
                  {/* Roman numeral */}
                  <div style={{ fontSize:"1rem", fontWeight:"900", color: isActive ? deg.funcColor : "#64748b", marginBottom:"3px", letterSpacing:"0.05em" }}>{deg.roman}</div>
                  {/* Chord name */}
                  <div style={{ fontSize:"0.72rem", fontWeight:"700", color: isActive ? "#e2e8f0" : "#94a3b8", marginBottom:"4px" }}>
                    {NOTE_NAMES_ES[NOTES[degRoot]]} <span style={{ opacity:0.7, fontSize:"0.6rem" }}>{deg.quality}</span>
                  </div>
                  {/* Notes */}
                  <div style={{ display:"flex", gap:"3px", flexWrap:"wrap", marginBottom:"5px" }}>
                    {chordNotes.map((n,j) => (
                      <span key={j} style={{ fontSize:"0.55rem", fontWeight:"700", padding:"1px 5px", borderRadius:"4px", background:`${deg.funcColor}22`, color:deg.funcColor }}>{NOTE_NAMES_ES[NOTES[n]]}</span>
                    ))}
                  </div>
                  {/* Function + mode */}
                  <div style={{ fontSize:"0.55rem", color: isActive ? deg.funcColor : "#475569", fontWeight:"700" }}>{FUNC_ABBR[deg.func] || deg.func}</div>
                  <div style={{ fontSize:"0.52rem", color:"#475569", marginTop:"1px" }}>{deg.mode}</div>
                </button>
              );
            })}
          </div>

          {/* Selected degree info bar */}
          {harmDef.degrees[selectedDegree] && (() => {
            const deg = harmDef.degrees[selectedDegree];
            const degRootOffset = SCALES[harmScale]?.intervals[selectedDegree] ?? 0;
            const degRoot = (rootIdx + degRootOffset) % 12;
            return (
              <div style={{ marginTop:"12px", padding:"10px 14px", borderRadius:"8px", background:`${deg.funcColor}10`, border:`1px solid ${deg.funcColor}30`, display:"flex", flexWrap:"wrap", gap:"16px", alignItems:"center" }}>
                <div>
                  <span style={{ fontSize:"0.6rem", color:"#64748b" }}>FUNCIÓN  </span>
                  <span style={{ fontSize:"0.75rem", fontWeight:"700", color:deg.funcColor }}>{deg.func}</span>
                </div>
                <div>
                  <span style={{ fontSize:"0.6rem", color:"#64748b" }}>MODO  </span>
                  <span style={{ fontSize:"0.75rem", fontWeight:"700", color:"#e2e8f0" }}>{deg.mode}</span>
                </div>
                <div>
                  <span style={{ fontSize:"0.6rem", color:"#64748b" }}>RAÍZ  </span>
                  <span style={{ fontSize:"0.75rem", fontWeight:"700", color:"#e2e8f0" }}>{NOTE_NAMES_ES[NOTES[degRoot]]}</span>
                </div>
                <div style={{ fontSize:"0.6rem", color:"#475569", marginLeft:"auto" }}>
                  ↑ El mástil muestra este acorde
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Interval filter */}
      <div style={{ ...panel, maxWidth:"960px", margin:"0 auto 10px" }}>
        <span style={lbl}>Intervalos visibles — click para ocultar/mostrar</span>
        <div style={{ display:"flex", flexWrap:"wrap", gap:"5px" }}>
          {ALL_INTERVALS.filter(iv => presentIntervals.includes(iv.semitones)).map(iv => {
            const off = disabledIvs.has(iv.semitones);
            return (
              <button key={iv.semitones} onClick={()=>toggleIv(iv.semitones)} style={{ padding:"4px 11px", borderRadius:"20px", cursor:"pointer", fontSize:"0.68rem", fontWeight:"700", fontFamily:"inherit", border:`2px solid ${off?"rgba(255,255,255,0.07)":iv.color}`, background:off?"rgba(255,255,255,0.02)":`${iv.color}18`, color:off?"#2d3748":iv.color, textDecoration:off?"line-through":"none", opacity:off?0.4:1, transition:"all 0.14s" }}>
                {iv.label} <span style={{ opacity:0.7, fontSize:"0.6rem" }}>{iv.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CAGED Panel */}
      <div style={{ ...panel, maxWidth:"960px", margin:"0 auto 10px", borderColor:showCaged?"rgba(255,255,255,0.14)":"rgba(255,255,255,0.08)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:showCaged?"12px":"0" }}>
          <div>
            <span style={{ fontSize:"0.72rem", fontWeight:"700", color:showCaged?"#e2e8f0":"#64748b", letterSpacing:"0.08em" }}>🔷 SISTEMA CAGED</span>
            <span style={{ fontSize:"0.58rem", color:"#475569", marginLeft:"10px" }}>Posiciones del acorde en el mástil</span>
          </div>
          <button onClick={()=>setShowCaged(s=>!s)} style={{ padding:"4px 13px", borderRadius:"20px", border:"none", cursor:"pointer", fontSize:"0.67rem", fontWeight:"700", fontFamily:"inherit", background:showCaged?"#f97316":"rgba(255,255,255,0.08)", color:showCaged?"#fff":"#94a3b8", transition:"all 0.15s" }}>
            {showCaged?"ON":"OFF"}
          </button>
        </div>
        {showCaged && (
          <>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"7px", marginBottom:"8px" }}>
              {["C","A","G","E","D"].map(sh => {
                const c = CAGED_COLORS[sh];
                const on = activeCaged.has(sh);
                const pos = cagedPositions.find(p=>p.shape===sh);
                return (
                  <button key={sh} onClick={()=>toggleCaged(sh)}
                    onMouseEnter={()=>setHoveredShape(sh)} onMouseLeave={()=>setHoveredShape(null)}
                    style={{ padding:"7px 14px", borderRadius:"8px", border:`2px solid ${on?c.border:"rgba(255,255,255,0.07)"}`, cursor:"pointer", fontFamily:"inherit", background:on?c.bg:"rgba(255,255,255,0.02)", color:on?c.text:"#334155", fontWeight:"700", fontSize:"0.8rem", transition:"all 0.15s", opacity:on?1:0.4 }}>
                    {sh}
                    {pos && <span style={{ fontSize:"0.52rem", opacity:0.65, marginLeft:"5px" }}>tr.{pos.loFret===0?"open":pos.loFret}</span>}
                  </button>
                );
              })}
            </div>
            <p style={{ fontSize:"0.58rem", color:"#475569", margin:"0" }}>
              Las zonas bordeadas muestran dónde toca cada forma del acorde de <strong style={{color:"#94a3b8"}}>{NOTE_NAMES_ES[selectedRoot]}</strong>. Pasá el cursor para resaltarla. Las notas dentro de cada zona son exactamente las del acorde (verificadas).
            </p>
          </>
        )}
      </div>

      {/* Chord/scale summary pills */}
      {mode !== "harmonized" && (
        <div style={{ ...panel, maxWidth:"960px", margin:"0 auto 10px", display:"flex", flexWrap:"wrap", gap:"6px", alignItems:"center" }}>
          <span style={{ fontSize:"0.6rem", color:"#475569", letterSpacing:"0.08em" }}>
            {NOTE_NAMES_ES[selectedRoot]} {mode==="scale" ? SCALES[selectedScale].name.toUpperCase() : CHORD_TYPES[selectedChord].name.toUpperCase()}:
          </span>
          {activeNotes.map((ni,i) => {
            const iv = presentIntervals[i];
            const meta = ALL_INTERVALS.find(m=>m.semitones===iv);
            const off = disabledIvs.has(iv);
            return <div key={i} style={{ padding:"2px 8px", borderRadius:"20px", fontSize:"0.67rem", fontWeight:"700", background:off?"rgba(255,255,255,0.03)":`${meta?.color}18`, color:off?"#2d3748":meta?.color, border:`1px solid ${off?"rgba(255,255,255,0.05)":(meta?.color||"#fff")+"33"}`, textDecoration:off?"line-through":"none", opacity:off?0.4:1 }}>{NOTE_NAMES_ES[NOTES[ni]]}</div>;
          })}
        </div>
      )}

      {/* ── Fretboard ── */}
      <div style={{ maxWidth:"960px", margin:"0 auto", background:"rgba(255,255,255,0.02)", borderRadius:"16px", padding:"14px 14px 26px", border:"1px solid rgba(255,255,255,0.06)", overflowX:"auto" }}>
        <div style={{ minWidth:"700px", position:"relative" }}>

          {/* Fret numbers */}
          <div style={{ display:"flex", marginBottom:"5px", paddingLeft:"70px" }}>
            <div style={{ width:"50px", textAlign:"center", fontSize:"0.56rem", color:"#2d3748" }}>OPEN</div>
            {Array.from({length:FRET_COUNT},(_,i)=>(
              <div key={i} style={{ flex:1, textAlign:"center", fontSize:"0.56rem", color:MARKER_FRETS.includes(i+1)?"#f97316":"#2d3748", fontWeight:MARKER_FRETS.includes(i+1)?"700":"400" }}>{i+1}</div>
            ))}
          </div>

          {/* Strings */}
          {stringOrder.map(strIdx => {
            const isMuted = mutedStrings.has(strIdx);
            // Realistic string thickness: str0(E)=thickest, str5(e)=thinnest
            const thickness = flipped
              ? [1, 1.5, 2, 2.8, 3.8, 5][stringOrder.indexOf(strIdx)]   // visual order top→bottom
              : [5, 3.8, 2.8, 2, 1.5, 1][stringOrder.indexOf(strIdx)];  // inverted
            return (
              <div key={strIdx} style={{ display:"flex", alignItems:"center", marginBottom:"2px", opacity:isMuted?0.15:1, filter:isMuted?"blur(2px)":"none", transition:"opacity 0.25s,filter 0.25s", pointerEvents:isMuted?"none":"auto" }}>
                {/* Label */}
                <div style={{ width:"70px", display:"flex", alignItems:"center", gap:"4px", flexShrink:0 }}>
                  <button onClick={()=>toggleString(strIdx)} style={{ width:"15px", height:"15px", borderRadius:"3px", border:"none", cursor:"pointer", fontSize:"0.48rem", fontWeight:"700", background:isMuted?"rgba(239,68,68,0.3)":"rgba(255,255,255,0.06)", color:isMuted?"#ef4444":"#3d4d5e" }}>{isMuted?"✕":"–"}</button>
                  <span style={{ fontSize:"0.56rem", color:"#3d4d5e", whiteSpace:"nowrap" }}>{STRING_NAMES[strIdx]}</span>
                </div>

                {/* Open string */}
                {(()=>{
                  const ni = OPEN_STRINGS[strIdx];
                  const disp = getNoteDisplay(ni);
                  const isHovered = hoveredFret?.strIdx===strIdx && hoveredFret?.fret===0;
                  const isPreview = isHovered && NOTES[ni] !== selectedRoot && !rootLocked;
                  return (
                    <div
                      onClick={() => { if (!rootLocked) setSelectedRoot(NOTES[ni]); playSingleNote(ni); }}
                      onMouseEnter={() => setHoveredFret({ noteIdx:ni, strIdx, fret:0 })}
                      onMouseLeave={() => setHoveredFret(null)}
                      style={{ width:"50px", display:"flex", justifyContent:"center", alignItems:"center", position:"relative", height:"36px", cursor:"pointer" }}>
                      <div style={{ position:"absolute", width:"100%", height:`${thickness}px`, background:"rgba(180,155,70,0.2)", top:"50%", transform:"translateY(-50%)" }}/>
                      {/* Ghost dot on hover for notes not in scale */}
                      {isPreview && !disp && (
                        <div style={{ width:"26px", height:"26px", borderRadius:"50%", background:"rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.45rem", fontWeight:"800", zIndex:1, border:"1px dashed rgba(249,115,22,0.6)" }}>
                          {NOTE_NAMES_ES[NOTES[ni]]}
                        </div>
                      )}
                      {disp && (
                        <div style={{ width:"26px", height:"26px", borderRadius:"50%", background: isPreview?"rgba(249,115,22,0.7)":disp.bg, color:disp.textColor, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.52rem", fontWeight:"900", zIndex:1, boxShadow:`0 0 10px ${disp.bg}, 0 0 3px rgba(0,0,0,0.8)`, border:"1.5px solid rgba(255,255,255,0.35)", transform:isHovered?"scale(1.25)":"scale(1)", transition:"transform 0.1s", textShadow:disp.textColor==="#111111"?"none":"0 1px 2px rgba(0,0,0,0.9)" }}>
                          {disp.label}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Frets */}
                {Array.from({length:FRET_COUNT},(_,fret)=>{
                  const fretNum = fret+1;
                  const ni = getNoteAtFret(strIdx, fretNum);
                  const disp = getNoteDisplay(ni);
                  const isDouble = fretNum===12;

                  // CAGED overlays for this fret
                  const zonesHere = showCaged
                    ? cagedPositions.filter(p => activeCaged.has(p.shape) && fretNum>=p.loFret && fretNum<=p.hiFret)
                    : [];
                  const activeZone = hoveredShape && zonesHere.find(z=>z.shape===hoveredShape)
                    ? zonesHere.find(z=>z.shape===hoveredShape)
                    : zonesHere[0];

                  // Is this fret the exact fret for this string in the CAGED shape?
                  const isCAGEDNote = showCaged && cagedPositions.some(p =>
                    activeCaged.has(p.shape) &&
                    p.actualFrets[strIdx] === fretNum &&
                    p.actualFrets[strIdx] >= 0
                  );

                  const isHoveredCell = hoveredFret?.strIdx===strIdx && hoveredFret?.fret===fretNum;
                  const isPreviewCell = isHoveredCell && NOTES[ni] !== selectedRoot && !rootLocked;

                  return (
                    <div key={fret}
                      onClick={() => { if (!rootLocked) setSelectedRoot(NOTES[ni]); playSingleNote(ni); }}
                      onMouseEnter={() => setHoveredFret({ noteIdx:ni, strIdx, fret:fretNum })}
                      onMouseLeave={() => setHoveredFret(null)}
                      style={{ flex:1, height:"36px", position:"relative", display:"flex", alignItems:"center", justifyContent:"center", borderLeft:`${isDouble?3:1}px solid rgba(255,255,255,${isDouble?0.28:0.08})`, cursor:"pointer" }}>
                      <div style={{ position:"absolute", width:"100%", height:`${thickness}px`, background:`rgba(180,155,70,${0.2+strIdx*0.04})`, top:"50%", transform:"translateY(-50%)" }}/>

                      {/* CAGED zone BG */}
                      {activeZone && (()=>{
                        const c = CAGED_COLORS[activeZone.shape];
                        const isHi = hoveredShape===activeZone.shape;
                        const isFirst = fretNum===activeZone.loFret;
                        const isLast  = fretNum===activeZone.hiFret;
                        return (
                          <div style={{ position:"absolute", inset:0, zIndex:0,
                            background: isHi?`${c.border}1a`:c.bg,
                            borderTop:`2px solid ${c.border}${isHi?"cc":"55"}`,
                            borderBottom:`2px solid ${c.border}${isHi?"cc":"55"}`,
                            borderLeft:  isFirst?`3px solid ${c.border}${isHi?"ff":"88"}`:"none",
                            borderRight: isLast ?`3px solid ${c.border}${isHi?"ff":"88"}`:"none",
                            transition:"background 0.18s",
                          }}/>
                        );
                      })()}

                      {/* CAGED shape label */}
                      {showCaged && strIdx===2 && zonesHere.filter(z=>fretNum===z.loFret).map(zone=>(
                        <div key={zone.shape} style={{ position:"absolute", top:"-17px", left:"50%", transform:"translateX(-50%)", fontSize:"0.58rem", fontWeight:"900", color:CAGED_COLORS[zone.shape].text, background:"rgba(0,0,0,0.75)", borderRadius:"4px", padding:"1px 4px", border:`1px solid ${CAGED_COLORS[zone.shape].border}55`, zIndex:10, whiteSpace:"nowrap" }}>{zone.shape}</div>
                      ))}

                      {/* Ghost dot on hover for notes not in scale/chord */}
                      {isPreviewCell && !disp && (
                        <div style={{ width:"26px", height:"26px", borderRadius:"50%", background:"rgba(255,255,255,0.07)", color:"rgba(255,255,255,0.4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.42rem", fontWeight:"800", zIndex:2, position:"relative", border:"1px dashed rgba(249,115,22,0.6)" }}>
                          {NOTE_NAMES_ES[NOTES[ni]]}
                        </div>
                      )}

                      {disp && (
                        <div style={{ width:"26px", height:"26px", borderRadius:"50%", background: isPreviewCell?"rgba(249,115,22,0.7)":disp.bg, color:disp.textColor, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.52rem", fontWeight:"900", zIndex:2, position:"relative", boxShadow:`0 0 10px ${disp.bg}, 0 0 3px rgba(0,0,0,0.8)`, border:"1.5px solid rgba(255,255,255,0.35)", transform:isHoveredCell?"scale(1.25)":"scale(1)", transition:"transform 0.1s", textShadow:disp.textColor==="#111111"?"none":"0 1px 2px rgba(0,0,0,0.9)" }}>
                          {disp.label}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}

          {/* Position dots */}
          <div style={{ display:"flex", paddingLeft:"120px", marginTop:"5px" }}>
            {Array.from({length:FRET_COUNT},(_,i)=>(
              <div key={i} style={{ flex:1, display:"flex", justifyContent:"center", gap:"3px" }}>
                {MARKER_FRETS.includes(i+1)&&<>
                  <div style={{ width:"5px", height:"5px", borderRadius:"50%", background:"rgba(249,115,22,0.4)" }}/>
                  {i+1===12&&<div style={{ width:"5px", height:"5px", borderRadius:"50%", background:"rgba(249,115,22,0.4)" }}/>}
                </>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <p style={{ textAlign:"center", color:"#1e293b", fontSize:"0.56rem", marginTop:"12px" }}>MONA · Guitarra Eléctrica · Afinación Estándar EADGBE</p>
    </div>
  );
}

// MONA — © 2026 Christian Monasterios
// https://christianmonasterios.github.io/mona4musicians/
// Licensed under CC BY-NC 4.0 — https://creativecommons.org/licenses/by-nc/4.0/
// "Visualizá la música, no la memorices."

import { useState, useMemo, useRef, useEffect } from "react";

// Load Outfit font
const link = document.createElement("link");
link.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap";
link.rel = "stylesheet";
document.head.appendChild(link);

const NOTES = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const NOTE_NAMES_ES = { C:"C","C#":"C#",D:"D","D#":"D#",E:"E",F:"F","F#":"F#",G:"G","G#":"G#",A:"A","A#":"A#",B:"B" };
const OPEN_STRINGS = [4,9,2,7,11,4];
const STRING_NAMES = ["6ª (E)","5ª (A)","4ª (D)","3ª (G)","2ª (B)","1ª (e)"];
const FRET_COUNT = 18;
const MARKER_FRETS = [3,5,7,9,12,15,17];

const SCALES = {
  major:          { name:"Mayor (Jónico)",         intervals:[0,2,4,5,7,9,11] },
  minor:          { name:"Menor Natural (Eólico)",  intervals:[0,2,3,5,7,8,10] },
  harmonicMinor:  { name:"Menor Armónica",          intervals:[0,2,3,5,7,8,11] },
  pentatonicMajor:{ name:"Pent. Mayor",             intervals:[0,2,4,7,9] },
  pentatonicMinor:{ name:"Pent. Menor",             intervals:[0,3,5,7,10] },
  blues:          { name:"Blues",                   intervals:[0,3,5,6,7,10] },
  dorian:         { name:"Dórico",                  intervals:[0,2,3,5,7,9,10] },
  phrygian:       { name:"Frigio",                  intervals:[0,1,3,5,7,8,10] },
  lydian:         { name:"Lidio",                   intervals:[0,2,4,6,7,9,11] },
  mixolydian:     { name:"Mixolidio",               intervals:[0,2,4,5,7,9,10] },
  locrian:        { name:"Locrio",                  intervals:[0,1,3,5,6,8,10] },
};

const CHORD_TYPES = {
  major:  { name:"Mayor",      intervals:[0,4,7] },
  minor:  { name:"Menor",      intervals:[0,3,7] },
  dom7:   { name:"Dom 7",      intervals:[0,4,7,10] },
  maj7:   { name:"Maj 7",      intervals:[0,4,7,11] },
  min7:   { name:"Min 7",      intervals:[0,3,7,10] },
  dim:    { name:"Disminuido", intervals:[0,3,6] },
  dim7:   { name:"Dim 7",      intervals:[0,3,6,9] },
  aug:    { name:"Aumentado",  intervals:[0,4,8] },
  sus2:   { name:"Sus2",       intervals:[0,2,7] },
  sus4:   { name:"Sus4",       intervals:[0,5,7] },
};

const WIZARD_INTERVALS = [
  { semitones:0,  label:"R",  name:"Tónica",        color:"#1a1a1a" },
  { semitones:1,  label:"b2", name:"2da menor",      color:"#c05818" },
  { semitones:2,  label:"2",  name:"2da / 9na",      color:"#e8751a" },
  { semitones:3,  label:"b3", name:"3ra menor",      color:"#d63030" },
  { semitones:4,  label:"3",  name:"3ra mayor",      color:"#c02020" },
  { semitones:5,  label:"4",  name:"4ta / 11na",     color:"#2a8a28" },
  { semitones:6,  label:"b5", name:"5ta disminuida", color:"#1a70d0" },
  { semitones:7,  label:"5",  name:"5ta justa",      color:"#1a5cd0" },
  { semitones:8,  label:"#5", name:"5ta aum.",       color:"#1880c0" },
  { semitones:9,  label:"6",  name:"6ta / 13ra",     color:"#0898b8" },
  { semitones:10, label:"b7", name:"7ma menor",      color:"#7a30c8" },
  { semitones:11, label:"7",  name:"7ma mayor",      color:"#5a10c0" },
];

const CLASSIC_INTERVALS = [
  { semitones:0,  label:"R",  name:"Tónica",        color:"#c8392b" },
  { semitones:1,  label:"b2", name:"2da menor",      color:"#2a2520" },
  { semitones:2,  label:"2",  name:"2da / 9na",      color:"#2a2520" },
  { semitones:3,  label:"b3", name:"3ra menor",      color:"#2a2520" },
  { semitones:4,  label:"3",  name:"3ra mayor",      color:"#2a2520" },
  { semitones:5,  label:"4",  name:"4ta / 11na",     color:"#2a2520" },
  { semitones:6,  label:"b5", name:"5ta disminuida", color:"#2a2520" },
  { semitones:7,  label:"5",  name:"5ta justa",      color:"#2a2520" },
  { semitones:8,  label:"#5", name:"5ta aum.",       color:"#2a2520" },
  { semitones:9,  label:"6",  name:"6ta / 13ra",     color:"#2a2520" },
  { semitones:10, label:"b7", name:"7ma menor",      color:"#2a2520" },
  { semitones:11, label:"7",  name:"7ma mayor",      color:"#2a2520" },
];

const HARMONIZED_SCALES = {
  major: {
    name:"Mayor",
    degrees:[
      { roman:"I",    triad:[0,4,7], seventh:[0,4,7,11], quality:"maj7",  func:"Tónica",       funcColor:"#3b82f6", mode:"Jónico" },
      { roman:"ii",   triad:[0,3,7], seventh:[0,3,7,10], quality:"min7",  func:"Subdominante", funcColor:"#22c55e", mode:"Dórico" },
      { roman:"iii",  triad:[0,3,7], seventh:[0,3,7,10], quality:"min7",  func:"Tónica",       funcColor:"#3b82f6", mode:"Frigio" },
      { roman:"IV",   triad:[0,4,7], seventh:[0,4,7,11], quality:"maj7",  func:"Subdominante", funcColor:"#22c55e", mode:"Lidio" },
      { roman:"V",    triad:[0,4,7], seventh:[0,4,7,10], quality:"7",     func:"Dominante",    funcColor:"#f97316", mode:"Mixolidio" },
      { roman:"vi",   triad:[0,3,7], seventh:[0,3,7,10], quality:"min7",  func:"Tónica rel.",  funcColor:"#3b82f6", mode:"Eólico" },
      { roman:"vii°", triad:[0,3,6], seventh:[0,3,6,10], quality:"m7b5",  func:"Dominante",    funcColor:"#f97316", mode:"Locrio" },
    ]
  },
  minor: {
    name:"Menor Natural",
    degrees:[
      { roman:"i",    triad:[0,3,7], seventh:[0,3,7,10], quality:"min7",  func:"Tónica",       funcColor:"#3b82f6", mode:"Eólico" },
      { roman:"ii°",  triad:[0,3,6], seventh:[0,3,6,10], quality:"m7b5",  func:"Subdominante", funcColor:"#22c55e", mode:"Locrio" },
      { roman:"III",  triad:[0,4,7], seventh:[0,4,7,11], quality:"maj7",  func:"Tónica rel.",  funcColor:"#3b82f6", mode:"Jónico" },
      { roman:"iv",   triad:[0,3,7], seventh:[0,3,7,10], quality:"min7",  func:"Subdominante", funcColor:"#22c55e", mode:"Dórico" },
      { roman:"v",    triad:[0,3,7], seventh:[0,3,7,10], quality:"min7",  func:"Dominante",    funcColor:"#f97316", mode:"Frigio" },
      { roman:"VI",   triad:[0,4,7], seventh:[0,4,7,11], quality:"maj7",  func:"Subdominante", funcColor:"#22c55e", mode:"Lidio" },
      { roman:"VII",  triad:[0,4,7], seventh:[0,4,7,10], quality:"7",     func:"Dominante",    funcColor:"#f97316", mode:"Mixolidio" },
    ]
  },
  harmonicMinor: {
    name:"Menor Armónica",
    degrees:[
      { roman:"i",    triad:[0,3,7], seventh:[0,3,7,11], quality:"mMaj7",    func:"Tónica",       funcColor:"#3b82f6", mode:"Men. Arm." },
      { roman:"ii°",  triad:[0,3,6], seventh:[0,3,6,10], quality:"m7b5",     func:"Subdominante", funcColor:"#22c55e", mode:"Locrio ♮6" },
      { roman:"III+", triad:[0,4,8], seventh:[0,4,8,11], quality:"augMaj7",  func:"Tónica",       funcColor:"#3b82f6", mode:"Jónico #5" },
      { roman:"iv",   triad:[0,3,7], seventh:[0,3,7,10], quality:"min7",     func:"Subdominante", funcColor:"#22c55e", mode:"Dórico #4" },
      { roman:"V",    triad:[0,4,7], seventh:[0,4,7,10], quality:"7",        func:"Dominante",    funcColor:"#f97316", mode:"Mixo b9b13" },
      { roman:"VI",   triad:[0,4,7], seventh:[0,4,7,11], quality:"maj7",     func:"Subdominante", funcColor:"#22c55e", mode:"Lidio #2" },
      { roman:"vii°", triad:[0,3,6], seventh:[0,3,6,9],  quality:"dim7",     func:"Dominante",    funcColor:"#f97316", mode:"Alt. dim." },
    ]
  },
  dorian: {
    name:"Dórico",
    degrees:[
      { roman:"i",    triad:[0,3,7], seventh:[0,3,7,10], quality:"min7",  func:"Tónica",       funcColor:"#3b82f6", mode:"Dórico" },
      { roman:"ii",   triad:[0,3,7], seventh:[0,3,7,10], quality:"min7",  func:"Subdominante", funcColor:"#22c55e", mode:"Frigio" },
      { roman:"III",  triad:[0,4,7], seventh:[0,4,7,11], quality:"maj7",  func:"Tónica rel.",  funcColor:"#3b82f6", mode:"Lidio" },
      { roman:"IV",   triad:[0,4,7], seventh:[0,4,7,10], quality:"7",     func:"Dominante",    funcColor:"#f97316", mode:"Mixolidio" },
      { roman:"v",    triad:[0,3,7], seventh:[0,3,7,10], quality:"min7",  func:"Subdominante", funcColor:"#22c55e", mode:"Eólico" },
      { roman:"vi°",  triad:[0,3,6], seventh:[0,3,6,10], quality:"m7b5",  func:"Dominante",    funcColor:"#f97316", mode:"Locrio" },
      { roman:"VII",  triad:[0,4,7], seventh:[0,4,7,11], quality:"maj7",  func:"Subdominante", funcColor:"#22c55e", mode:"Jónico" },
    ]
  },
};

const FUNC_ABBR = { "Tónica":"T","Subdominante":"SD","Dominante":"D","Tónica rel.":"Tr" };

const CAGED_SHAPE_DEFS = {
  C: { strings:[-1,3,2,0,1,0], roots:[false,true,false,false,true,false], rootStr:1, rootFret:3, span:[0,3] },
  A: { strings:[-1,0,2,2,2,0], roots:[false,true,false,true,false,false], rootStr:1, rootFret:0, span:[0,2] },
  G: { strings:[3,2,0,0,0,3],  roots:[true,false,false,true,false,true],  rootStr:0, rootFret:3, span:[0,3] },
  E: { strings:[0,2,2,1,0,0],  roots:[true,false,true,false,false,true],  rootStr:0, rootFret:0, span:[0,2] },
  D: { strings:[-1,-1,0,2,3,2],roots:[false,false,true,false,true,false], rootStr:2, rootFret:0, span:[0,3] },
};
const CAGED_COLORS = {
  C:{ border:"#f43f5e", bg:"rgba(244,63,94,0.07)",  text:"#f43f5e" },
  A:{ border:"#f59e0b", bg:"rgba(245,158,11,0.07)", text:"#c97c00" },
  G:{ border:"#10b981", bg:"rgba(16,185,129,0.07)", text:"#059669" },
  E:{ border:"#3b82f6", bg:"rgba(59,130,246,0.07)", text:"#2563eb" },
  D:{ border:"#a855f7", bg:"rgba(168,85,247,0.07)", text:"#9333ea" },
};

function transposeCAGED(shapeName, targetRootIdx) {
  const def = CAGED_SHAPE_DEFS[shapeName];
  const openNote = OPEN_STRINGS[def.rootStr];
  let barre = (targetRootIdx - openNote + 12) % 12 - def.rootFret;
  if (barre < 0) barre += 12;
  const actualFrets = def.strings.map(f => f === -1 ? -1 : f + barre);
  return { shape:shapeName, barre, actualFrets, roots:def.roots, loFret:barre+def.span[0], hiFret:barre+def.span[1] };
}

function computeAllCAGED(rootIdx) {
  const result = [];
  for (const shape of ["C","A","G","E","D"]) {
    const pos = transposeCAGED(shape, rootIdx);
    result.push(pos);
    if (pos.loFret + 12 <= FRET_COUNT) {
      result.push({ ...pos, loFret:pos.loFret+12, hiFret:pos.hiFret+12, barre:pos.barre+12,
        actualFrets:pos.actualFrets.map(f => f<0?f:f+12) });
    }
  }
  return result.filter(p => p.loFret<=FRET_COUNT && p.hiFret>=0).sort((a,b)=>a.loFret-b.loFret);
}

function getNoteAtFret(strIdx, fret) { return (OPEN_STRINGS[strIdx] + fret) % 12; }

function getTextColor(hex) {
  const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
  return (0.299*r+0.587*g+0.114*b)/255 > 0.55 ? "#111" : "#fff";
}

// ─── Audio ────────────────────────────────────────────────────────────────────
const STRING_OCTAVES = [2,2,3,3,3,4];
function noteToFreq(noteIdx, octave=4) { return 440*Math.pow(2,(noteIdx-9+(octave-4)*12)/12); }
function getNoteFreq(strIdx, fret) {
  const noteIdx = (OPEN_STRINGS[strIdx]+fret)%12;
  const octaveShift = Math.floor((OPEN_STRINGS[strIdx]+fret)/12);
  return noteToFreq(noteIdx, STRING_OCTAVES[strIdx]+octaveShift);
}
function pluckNote(ctx, freq, startTime=0, duration=2.5, gain=0.18) {
  // Karplus-Strong string synthesis — sounds like a plucked string/guitar
  const sampleRate = ctx.sampleRate;
  const period = Math.round(sampleRate / freq);

  // Noise burst buffer (the "pick attack")
  const bufferSize = Math.round(sampleRate * duration);
  const noiseBuffer = ctx.createBuffer(1, bufferSize, sampleRate);
  const data = noiseBuffer.getChannelData(0);

  // Initialize delay line with noise
  const delayLine = new Float32Array(period);
  for (let i = 0; i < period; i++) delayLine[i] = Math.random() * 2 - 1;

  // Run Karplus-Strong algorithm to fill the buffer
  let prev = 0;
  for (let i = 0; i < bufferSize; i++) {
    const idx = i % period;
    // Low-pass average (damping factor 0.4985 for more sustain and natural decay)
    const curr = delayLine[idx];
    const next = 0.4985 * (curr + prev);
    delayLine[idx] = next;
    data[i] = curr;
    prev = curr;
  }

  // Lowpass to cut harshness — no más chirriido
  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer;

  const brightness = ctx.createBiquadFilter();
  brightness.type = "lowpass";
  brightness.frequency.value = 3500;
  brightness.Q.value = 0.5;

  // Body resonance — cálido, menos agresivo
  const body = ctx.createBiquadFilter();
  body.type = "peaking";
  body.frequency.value = 250;
  body.gain.value = 3;
  body.Q.value = 1.5;

  // Ataque más suave
  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(gain, startTime + 0.008);
  gainNode.gain.exponentialRampToValueAtTime(gain * 0.7, startTime + 0.1);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  source.connect(brightness);
  brightness.connect(body);
  body.connect(gainNode);
  gainNode.connect(ctx.destination);

  source.start(startTime);
  source.stop(startTime + duration);
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function GuitarApp() {
  const [colorTheme,     setColorTheme]     = useState("classic");
  const [ALL_INTERVALS,  setAllIntervals]   = useState(CLASSIC_INTERVALS);
  const [selectedRoot,   setSelectedRoot]   = useState("C");
  const [mode,           setMode]           = useState("scale");
  const [selectedScale,  setSelectedScale]  = useState("major");
  const [selectedChord,  setSelectedChord]  = useState("major");
  const [flipped,        setFlipped]        = useState(true);
  const [mutedStrings,   setMutedStrings]   = useState(new Set());
  const [disabledIvs,    setDisabledIvs]    = useState(new Set());
  const [showCaged,      setShowCaged]      = useState(false);
  const [activeCaged,    setActiveCaged]    = useState(new Set(["C","A","G","E","D"]));
  const [hoveredShape,   setHoveredShape]   = useState(null);
  const [hoveredFret,    setHoveredFret]    = useState(null);
  const [rootLocked,     setRootLocked]     = useState(false);
  const [harmScale,      setHarmScale]      = useState("major");
  const [selectedDegree, setSelectedDegree] = useState(0);
  const [useSevenths,    setUseSevenths]    = useState(true);
  const [audioEnabled,   setAudioEnabled]   = useState(false);
  const [isPlaying,      setIsPlaying]      = useState(false);
  const [showNotes,      setShowNotes]      = useState(false);
  const [show3NPS,       setShow3NPS]       = useState(false);
  const [npsPattern,     setNpsPattern]     = useState(0);
  const [metroOn,        setMetroOn]        = useState(false);
  const [metroBpm,       setMetroBpm]       = useState(80);
  const [metroBeat,      setMetroBeat]      = useState(-1);
  const [showAbout,      setShowAbout]      = useState(false);
  const [showDonate,     setShowDonate]     = useState(false);
  const metroTimerRef  = useRef(null);
  const metroNextTime  = useRef(0);
  const metroBeatRef   = useRef(0);
  const metroBpmRef    = useRef(80);
  const audioCtxRef = useRef(null);

  // Mostrar popup la primera vez
  useEffect(() => {
    if (!localStorage.getItem('mona_visited')) {
      setShowAbout(true);
      localStorage.setItem('mona_visited', 'true');
    }
  }, []);

  // Auto-cerrar después de 15 segundos
  useEffect(() => {
    if (!showAbout) return;
    const t = setTimeout(() => setShowAbout(false), 15000);
    return () => clearTimeout(t);
  }, [showAbout]);

  function switchTheme(theme) {
    setColorTheme(theme);
    setAllIntervals(theme==="classic" ? CLASSIC_INTERVALS : WIZARD_INTERVALS);
  }

  const rootIdx = NOTES.indexOf(selectedRoot);

  const activeNotes = useMemo(() => {
    if (mode==="scale") return SCALES[selectedScale].intervals.map(i=>(rootIdx+i)%12);
    if (mode==="chord") return CHORD_TYPES[selectedChord].intervals.map(i=>(rootIdx+i)%12);
    if (mode==="harmonized") {
      const deg = HARMONIZED_SCALES[harmScale]?.degrees[selectedDegree];
      if (!deg) return [];
      const degRoot = (rootIdx+(SCALES[harmScale]?.intervals[selectedDegree]??0))%12;
      return (useSevenths?deg.seventh:deg.triad).map(i=>(degRoot+i)%12);
    }
    return [];
  }, [mode,selectedRoot,selectedScale,selectedChord,harmScale,selectedDegree,useSevenths]);

  const presentIntervals = useMemo(() => {
    if (mode==="harmonized") {
      const deg=HARMONIZED_SCALES[harmScale]?.degrees[selectedDegree];
      return deg ? (useSevenths?deg.seventh:deg.triad) : [];
    }
    if (mode==="scale") return SCALES[selectedScale].intervals;
    return CHORD_TYPES[selectedChord].intervals;
  }, [mode,selectedScale,selectedChord,harmScale,selectedDegree,useSevenths]);

  const displayRootIdx = useMemo(() => {
    if (mode==="harmonized") {
      return (rootIdx+(SCALES[harmScale]?.intervals[selectedDegree]??0))%12;
    }
    return rootIdx;
  }, [mode,rootIdx,harmScale,selectedDegree]);

  const cagedPositions = useMemo(() => computeAllCAGED(rootIdx), [rootIdx]);
  const stringOrder = flipped ? [5,4,3,2,1,0] : [0,1,2,3,4,5];

  // ─── 3NPS computation ─────────────────────────────────────────────────────
  const npsActiveSet = useMemo(() => {
    if (!show3NPS || mode !== "scale") return null;
    const scaleIntervals = SCALES[selectedScale]?.intervals;
    if (!scaleIntervals || scaleIntervals.length !== 7) return null;

    // Hardcoded degree sequences per pattern per string (strIdx 0=6ª, 5=1ª)
    const PATTERNS = [
      [[1,2,3],[4,5,6],[7,1,2],[3,4,5],[6,7,1],[2,3,4]], // P1
      [[2,3,4],[5,6,7],[1,2,3],[4,5,6],[7,1,2],[3,4,5]], // P2
      [[3,4,5],[6,7,1],[2,3,4],[5,6,7],[1,2,3],[4,5,6]], // P3
      [[4,5,6],[7,1,2],[3,4,5],[6,7,1],[2,3,4],[5,6,7]], // P4
      [[5,6,7],[1,2,3],[4,5,6],[7,1,2],[3,4,5],[6,7,1]], // P5
      [[6,7,1],[2,3,4],[5,6,7],[1,2,3],[4,5,6],[7,1,2]], // P6
      [[7,1,2],[3,4,5],[6,7,1],[2,3,4],[5,6,7],[1,2,3]], // P7
    ];

    const degreeToNote = (deg) => (rootIdx + scaleIntervals[(deg - 1 + 7) % 7]) % 12;

    const triplets = PATTERNS[npsPattern];

    // Step 1: find fret groups for each string independently (all occurrences)
    const allGroups = triplets.map((degreeTriplet, strIdx) => {
      const targetNotes = degreeTriplet.map(degreeToNote);
      const groups = [];
      for (let startF = 0; startF <= FRET_COUNT - 2; startF++) {
        if (getNoteAtFret(strIdx, startF) !== targetNotes[0]) continue;
        // find note2 within 4 frets
        let f2 = -1;
        for (let f = startF + 1; f <= startF + 4 && f <= FRET_COUNT; f++) {
          if (getNoteAtFret(strIdx, f) === targetNotes[1]) { f2 = f; break; }
        }
        if (f2 < 0) continue;
        // find note3 within 5 frets of startF
        let f3 = -1;
        for (let f = f2 + 1; f <= startF + 5 && f <= FRET_COUNT; f++) {
          if (getNoteAtFret(strIdx, f) === targetNotes[2]) { f3 = f; break; }
        }
        if (f3 < 0) continue;
        groups.push([startF, f2, f3]);
      }
      return groups; // all valid 3-note groups on this string
    });

    // Step 2: determine the anchor region from string 0 (low E) first group
    // then pick the group on each other string closest to that region
    if (allGroups[0].length === 0) return null;

    // Use string 0's first group as anchor
    const anchorStart = allGroups[0][0][0];

    const active = new Set();

    allGroups.forEach((groups, strIdx) => {
      if (groups.length === 0) return;
      // Pick the group whose start fret is closest to anchorStart
      const best = groups.reduce((prev, curr) => {
        return Math.abs(curr[0] - anchorStart) < Math.abs(prev[0] - anchorStart) ? curr : prev;
      });
      best.forEach(f => active.add(`${strIdx}-${f}`));
    });

    return active;
  }, [show3NPS, mode, selectedScale, rootIdx, npsPattern, activeNotes]);

  const toggleString = idx => setMutedStrings(p=>{const n=new Set(p);n.has(idx)?n.delete(idx):n.add(idx);return n;});
  const toggleIv     = s   => setDisabledIvs(p=>{const n=new Set(p);n.has(s)?n.delete(s):n.add(s);return n;});
  const toggleCaged  = sh  => setActiveCaged(p=>{const n=new Set(p);n.has(sh)?n.delete(sh):n.add(sh);return n;});

  function getAudioCtx() {
    if (!audioCtxRef.current||audioCtxRef.current.state==="closed")
      audioCtxRef.current=new(window.AudioContext||window.webkitAudioContext)();
    if (audioCtxRef.current.state==="suspended") audioCtxRef.current.resume();
    return audioCtxRef.current;
  }

  function playSingleNote(noteIdx, strIdx=null, fret=null) {
    if (!audioEnabled) return;
    const ctx=getAudioCtx();
    if (strIdx!==null&&fret!==null) { pluckNote(ctx,getNoteFreq(strIdx,fret),ctx.currentTime,1.8,0.2); return; }
    for (const s of [2,3,1,4,0,5]) for (let f=0;f<=12;f++) if (getNoteAtFret(s,f)===noteIdx) { pluckNote(ctx,getNoteFreq(s,f),ctx.currentTime,1.8,0.2); return; }
  }

  function playChord() {
    if (!audioEnabled||isPlaying) return;
    const ctx=getAudioCtx(), now=ctx.currentTime;
    const voicing=[],used=new Set();
    for (const ni of [...activeNotes].sort((a,b)=>a-b)) {
      for (let s=0;s<=5;s++) {
        if (used.has(s)) continue;
        for (let f=0;f<=7;f++) if (getNoteAtFret(s,f)===ni) { voicing.push({s,f,freq:getNoteFreq(s,f)}); used.add(s); break; }
        if (used.has(s)) break;
      }
    }
    voicing.sort((a,b)=>a.s-b.s).forEach((v,i)=>pluckNote(ctx,v.freq,now+i*0.065,2.5,0.16));
  }

  function playScale() {
    if (!audioEnabled||isPlaying) return;
    setIsPlaying(true);
    const ctx=getAudioCtx(), now=ctx.currentTime, step=0.38;
    // Tocar las notas de la escala
    const noteTimings = [];
    activeNotes.forEach((ni,i) => {
      for (const s of [2,3,1,4,0,5]) for (let f=0;f<=12;f++) if (getNoteAtFret(s,f)===ni) {
        noteTimings.push({ s, f, t: now+i*step });
        pluckNote(ctx,getNoteFreq(s,f),now+i*step,1.2,0.2);
        break;
      }
    });
    // Agregar la octava al final — misma nota raíz pero una octava arriba
    const octaveTime = now + activeNotes.length * step;
    const rootNote = activeNotes[0];
    // Buscar la misma nota una octava más arriba (fret+12)
    for (const s of [2,3,1,4,0,5]) for (let f=0;f<=6;f++) if (getNoteAtFret(s,f)===rootNote) {
      pluckNote(ctx, getNoteFreq(s,f+12), octaveTime, 1.8, 0.22);
      break;
    }
    setTimeout(()=>setIsPlaying(false),(activeNotes.length*step+1)*1000+600);
  }

  // ─── Metrónomo ────────────────────────────────────────────────────────────
  function metroClick(t) {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 1700;
    g.gain.setValueAtTime(0.8, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(t); osc.stop(t + 0.03);
  }

  function metroSchedule() {
    const ctx = getAudioCtx();
    while (metroNextTime.current < ctx.currentTime + 0.1) {
      const b = metroBeatRef.current % 4;
      metroClick(metroNextTime.current);
      const delay = Math.max(0, (metroNextTime.current - ctx.currentTime) * 1000);
      setTimeout(((beat) => () => setMetroBeat(beat))(b), delay);
      setTimeout(() => setMetroBeat(-1), delay + 80);
      metroNextTime.current += 60 / metroBpmRef.current;
      metroBeatRef.current++;
    }
    metroTimerRef.current = setTimeout(metroSchedule, 25);
  }

  function startMetro() {
    setAudioEnabled(false); // apagar sonido de MONA
    setMetroOn(true);
    metroBeatRef.current = 0;
    metroNextTime.current = getAudioCtx().currentTime + 0.05;
    metroSchedule();
  }

  function stopMetro() {
    clearTimeout(metroTimerRef.current);
    setMetroOn(false);
    setMetroBeat(-1);
  }

  function getNoteDisplay(noteIdx, strIdx=null, fret=null) {
    if (!activeNotes.includes(noteIdx)) return null;
    // 3NPS filter: only show notes that belong to the current pattern
    if (npsActiveSet !== null && strIdx !== null && fret !== null) {
      if (!npsActiveSet.has(`${strIdx}-${fret}`)) return null;
    }
    const interval=(noteIdx-displayRootIdx+12)%12;
    if (disabledIvs.has(interval)) return null;
    const meta=ALL_INTERVALS.find(i=>i.semitones===interval);
    if (!meta) return null;
    const label = showNotes ? NOTE_NAMES_ES[NOTES[noteIdx]] : meta.label;
    const isRoot = interval === 0;
    const solidBg = meta.color;
    // Classic non-root: carbón #3a3530 fondo, texto crema
    // Wizard: sólido saturado, texto blanco
    const isClassicNonRoot = colorTheme === "classic" && !isRoot;
    const bg       = isClassicNonRoot ? "#3a3530" : solidBg;
    const borderCol= isClassicNonRoot ? "#3a3530" : solidBg;
    const textCol  = isClassicNonRoot ? "#e8e0d8" : getTextColor(solidBg);
    return { bg, borderColor: borderCol, textColor: textCol, label, isRoot };
  }

  const harmDef = HARMONIZED_SCALES[harmScale];

  // ─── Styles ───────────────────────────────────────────────────────────────
  const panel = { background:"#fffdf8", borderRadius:"14px", padding:"18px 20px", border:"1px solid #ddd5c4", boxShadow:"0 1px 4px rgba(0,0,0,0.05)" };
  const lbl   = { fontSize:"0.68rem", color:"#888", letterSpacing:"0.14em", display:"block", marginBottom:"10px", textTransform:"uppercase", fontWeight:"500" };
  const sel   = { width:"100%", padding:"9px 12px", borderRadius:"9px", border:"1px solid #d4c4a8", background:"#fdf8f0", color:"#222", fontSize:"0.88rem", fontFamily:"'Outfit',sans-serif", cursor:"pointer" };

  const modeBtn = (m, label, color, icon) => (
    <button onClick={()=>setMode(m)} style={{ flex:1, padding:"9px 4px", borderRadius:"9px", border:"none", cursor:"pointer", fontFamily:"'Outfit',sans-serif", background:mode===m?color:"#f0f0ec", color:mode===m?"#fff":"#888", transition:"all 0.12s", display:"flex", alignItems:"center", justifyContent:"center", gap:"6px" }}>
      {icon}
      <span style={{ fontSize:"0.78rem", fontWeight:"500" }}>{label}</span>
    </button>
  );

  const scaleIcon = (active) => (
    <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
      <path d="M2 8 Q6 1 10 8 Q14 15 18 8 Q20 4 21 6" stroke={active?"#fff":"#aaa"} strokeWidth="2" strokeLinecap="round" fill="none"/>
      <circle cx="10" cy="8" r="2.5" fill={active?"#c8a96e":"#ccc"}/>
    </svg>
  );

  const chordIcon = (active) => (
    <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
      <line x1="3"  y1="1" x2="3"  y2="15" stroke={active?"#fff":"#aaa"} strokeWidth="1.5"/>
      <line x1="9"  y1="1" x2="9"  y2="15" stroke={active?"#fff":"#aaa"} strokeWidth="1.5"/>
      <line x1="15" y1="1" x2="15" y2="15" stroke={active?"#fff":"#aaa"} strokeWidth="1.5"/>
      <line x1="1"  y1="5" x2="17" y2="5"  stroke={active?"#fff":"#aaa"} strokeWidth="1" opacity="0.4"/>
      <line x1="1"  y1="10" x2="17" y2="10" stroke={active?"#fff":"#aaa"} strokeWidth="1" opacity="0.4"/>
      <circle cx="3"  cy="7"  r="3" fill={active?"#fff":"#aaa"}/>
      <circle cx="9"  cy="11" r="3" fill={active?"#fff":"#aaa"}/>
      <circle cx="15" cy="7"  r="3" fill={active?"#fff":"#aaa"}/>
    </svg>
  );

  const harmIcon = (active) => (
    <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
      <circle cx="9" cy="8" r="7"   stroke={active?"#fff":"#aaa"} strokeWidth="1.3" opacity="0.35" fill="none"/>
      <circle cx="9" cy="8" r="2.5" fill={active?"#fff":"#aaa"}/>
      <circle cx="9"  cy="1"  r="2"  fill={active?"#fff":"#aaa"}/>
      <circle cx="15" cy="4"  r="2"  fill={active?"#fff":"#aaa"} opacity="0.6"/>
      <circle cx="15" cy="12" r="2"  fill={active?"#fff":"#aaa"} opacity="0.6"/>
      <circle cx="9"  cy="15" r="2"  fill={active?"#fff":"#aaa"} opacity="0.5"/>
      <circle cx="3"  cy="12" r="2"  fill={active?"#fff":"#aaa"} opacity="0.6"/>
      <circle cx="3"  cy="4"  r="2"  fill={active?"#fff":"#aaa"} opacity="0.6"/>
      <line x1="9" y1="5.5" x2="9" y2="3" stroke={active?"#fff":"#aaa"} strokeWidth="1.2" opacity="0.5"/>
    </svg>
  );

  const ivBtn = (active,color="#f97316") => ({
    padding:"6px 14px", borderRadius:"20px", border:`1.5px solid ${active?color:"#ddd"}`,
    cursor:"pointer", fontSize:"0.78rem", fontWeight:"500", fontFamily:"'Outfit',sans-serif",
    background:active?`${color}12`:"#fafaf8", color:active?color:"#aaa", transition:"all 0.15s",
  });

  return (
    <div style={{ minHeight:"100vh", background:"#ede8df", fontFamily:"'Outfit',sans-serif", color:"#1a1a1a", padding:"20px 16px" }}>

      {/* Mobile responsive styles */}
      <style>{`
        @media (max-width: 600px) {
          .mona-header { flex-direction: column !important; align-items: center !important; text-align: center; }
          .mona-logo { align-items: center !important; }
          .mona-controls { justify-content: center !important; }
          .mona-tutorial { justify-content: center !important; width: 100%; }
          .mona-grid { grid-template-columns: 1fr !important; }
          .mona-fretboard { overflow-x: auto; }
        }
      `}</style>

      {/* ── Header ── */}
      <div className="mona-header" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", maxWidth:"1100px", margin:"0 auto 20px", gap:"16px", flexWrap:"wrap" }}>

        {/* Logo — izquierda */}
        <div className="mona-logo" style={{ display:"flex", flexDirection:"column", alignItems:"flex-start" }}>
          <svg width="260" height="110" viewBox="0 0 260 110" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Púa — borde exterior sutil */}
            <path d="M62,6 C86,6 104,20 104,40 C104,68 62,98 62,98 C62,98 20,68 20,40 C20,20 38,6 62,6Z"
              fill="none" stroke="#c8a96e" strokeWidth="1.5" opacity="0.35"/>
            {/* Púa principal */}
            <path d="M62,12 C83,12 98,24 98,42 C98,68 62,94 62,94 C62,94 26,68 26,42 C26,24 41,12 62,12Z"
              fill="#fdf8f2" stroke="#c8a96e" strokeWidth="3"/>
            {/* Onda dorada fina */}
            <path d="M38,46 Q46,34 54,46 Q62,58 70,46 Q78,34 86,46"
              fill="none" stroke="#c8a96e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.55"/>
            {/* Onda terracota principal */}
            <path d="M38,58 Q46,44 54,58 Q62,72 70,58 Q78,44 86,58"
              fill="none" stroke="#9a4a2a" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
            {/* MONA a la derecha */}
            <text x="112" y="58" fontFamily="'Outfit',sans-serif" fontSize="44" fontWeight="900" fill="#1a1a1a" letterSpacing="-1">MONA</text>
            {/* VISUALIZÁ LA MÚSICA debajo de MONA */}
            <text x="113" y="74" fontFamily="'Outfit',sans-serif" fontSize="8" fill="#aaa" letterSpacing="3">VISUALIZÁ LA MÚSICA</text>
          </svg>
        </div>

        {/* Centro: Classic / Wizard / Sonido */}
        <div className="mona-controls" style={{ display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap", justifyContent:"center" }}>
          <div style={{ display:"flex", background:"#ddd5c4", borderRadius:"100px", padding:"3px", gap:"2px" }}>
            <button onClick={()=>switchTheme("classic")} style={{ padding:"6px 14px", borderRadius:"100px", border:"none", cursor:"pointer", fontFamily:"'Outfit',sans-serif", fontWeight:"500", fontSize:"0.78rem", background:colorTheme==="classic"?"#fffdf8":"transparent", color:colorTheme==="classic"?"#1a1a1a":"#999", boxShadow:colorTheme==="classic"?"0 1px 3px rgba(0,0,0,0.1)":"none", transition:"all 0.2s", display:"flex", alignItems:"center", gap:"6px" }}>
              <svg width="16" height="14" viewBox="0 0 22 20" fill="none">
                <line x1="2" y1="4"  x2="20" y2="4"  stroke="currentColor" strokeWidth="1" opacity="0.25"/>
                <line x1="2" y1="10" x2="20" y2="10" stroke="currentColor" strokeWidth="1" opacity="0.25"/>
                <line x1="2" y1="16" x2="20" y2="16" stroke="currentColor" strokeWidth="1" opacity="0.25"/>
                <line x1="8"  y1="2" x2="8"  y2="18" stroke="currentColor" strokeWidth="0.8" opacity="0.25"/>
                <line x1="15" y1="2" x2="15" y2="18" stroke="currentColor" strokeWidth="0.8" opacity="0.25"/>
                <circle cx="11" cy="10" r="5" fill="currentColor"/>
              </svg>
              Classic
            </button>
            <button onClick={()=>switchTheme("wizard")} style={{ padding:"6px 14px", borderRadius:"100px", border:"none", cursor:"pointer", fontFamily:"'Outfit',sans-serif", fontWeight:"500", fontSize:"0.78rem", background:colorTheme==="wizard"?"#fffdf8":"transparent", color:colorTheme==="wizard"?"#1a1a1a":"#999", boxShadow:colorTheme==="wizard"?"0 1px 3px rgba(0,0,0,0.1)":"none", transition:"all 0.2s", display:"flex", alignItems:"center", gap:"6px" }}>
              <svg width="16" height="14" viewBox="0 0 22 20" fill="none">
                <line x1="2" y1="4"  x2="20" y2="4"  stroke="#888" strokeWidth="1" opacity="0.2"/>
                <line x1="2" y1="10" x2="20" y2="10" stroke="#888" strokeWidth="1" opacity="0.2"/>
                <line x1="2" y1="16" x2="20" y2="16" stroke="#888" strokeWidth="1" opacity="0.2"/>
                <line x1="8"  y1="2" x2="8"  y2="18" stroke="#888" strokeWidth="0.8" opacity="0.2"/>
                <line x1="15" y1="2" x2="15" y2="18" stroke="#888" strokeWidth="0.8" opacity="0.2"/>
                <circle cx="4"  cy="4"  r="3.5" fill="#e74c3c"/>
                <circle cx="11" cy="10" r="3.5" fill="#3498db"/>
                <circle cx="18" cy="16" r="3.5" fill="#27ae60"/>
                <circle cx="18" cy="4"  r="3.5" fill="#f39c12"/>
              </svg>
              Wizard
            </button>
          </div>

          <button onClick={()=>setAudioEnabled(e=>!e)} style={{ display:"flex", alignItems:"center", gap:"7px", padding:"8px 18px", borderRadius:"100px", border:`1px solid ${audioEnabled?"#22c55e":"#ddd"}`, cursor:"pointer", fontFamily:"'Outfit',sans-serif", fontWeight:"500", fontSize:"0.78rem", background:audioEnabled?"#f0fdf4":"#fdf8f0", color:audioEnabled?"#16a34a":"#888", transition:"all 0.2s" }}>
            {audioEnabled ? (
              <svg width="16" height="14" viewBox="0 0 24 20" fill="none">
                <path d="M4 14 Q10 6 10 10 Q10 14 4 6" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
                <path d="M12 8 Q20 4 20 10 Q20 16 12 12" fill="none" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
              </svg>
            ) : (
              <svg width="16" height="14" viewBox="0 0 24 20" fill="none">
                <path d="M4 14 Q10 6 10 10 Q10 14 4 6" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round"/>
                <path d="M12 8 Q20 4 20 10 Q20 16 12 12" fill="none" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
                <line x1="4" y1="4" x2="20" y2="16" stroke="#aaa" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
            {audioEnabled ? "SONIDO ON" : "SONIDO OFF"}
          </button>

          {audioEnabled && <>
            {/* Tocar acorde — cuerdas SVG terracota */}
            <button onClick={playChord} disabled={isPlaying} style={{ display:"flex", alignItems:"center", gap:"7px", padding:"8px 16px", borderRadius:"100px", border:"1px solid #e8b8a8", cursor:"pointer", fontFamily:"'Outfit',sans-serif", fontWeight:"500", fontSize:"0.78rem", background:"#fdf2ee", color:"#9a4a2a", opacity:isPlaying?0.5:1 }}>
              <svg width="18" height="16" viewBox="0 0 22 18" fill="none">
                <line x1="2" y1="4"  x2="14" y2="4"  stroke="#9a4a2a" strokeWidth="1.3" strokeLinecap="round"/>
                <line x1="2" y1="9"  x2="14" y2="9"  stroke="#9a4a2a" strokeWidth="1.8" strokeLinecap="round"/>
                <line x1="2" y1="14" x2="14" y2="14" stroke="#9a4a2a" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="6"  cy="4"  r="3" fill="#9a4a2a"/>
                <circle cx="10" cy="9"  r="3" fill="#9a4a2a"/>
                <circle cx="6"  cy="14" r="3" fill="#9a4a2a"/>
              </svg>
              Acorde
            </button>
            {/* Tocar escala — dots ascendentes SVG verde */}
            {mode==="scale" && <button onClick={playScale} disabled={isPlaying} style={{ display:"flex", alignItems:"center", gap:"7px", padding:"8px 16px", borderRadius:"100px", border:"1px solid #bbf7d0", cursor:"pointer", fontFamily:"'Outfit',sans-serif", fontWeight:"500", fontSize:"0.78rem", background:"#f0fdf4", color:"#16a34a", opacity:isPlaying?0.5:1 }}>
              {isPlaying ? "Tocando..." : <>
                <svg width="18" height="16" viewBox="0 0 22 18" fill="none">
                  <line x1="2" y1="7"  x2="20" y2="7"  stroke="#16a34a" strokeWidth="1" strokeLinecap="round" opacity="0.25"/>
                  <line x1="2" y1="13" x2="20" y2="13" stroke="#16a34a" strokeWidth="1" strokeLinecap="round" opacity="0.25"/>
                  <circle cx="4"  cy="13" r="3" fill="#16a34a" opacity="0.3"/>
                  <circle cx="8"  cy="13" r="3" fill="#16a34a" opacity="0.5"/>
                  <circle cx="12" cy="7"  r="3" fill="#16a34a" opacity="0.7"/>
                  <circle cx="16" cy="7"  r="3" fill="#16a34a" opacity="0.85"/>
                  <circle cx="20" cy="1"  r="3.5" fill="#16a34a"/>
                </svg>
                Escala
              </>}
            </button>}
          </>}
        </div>

        {/* MONA Tutorial — derecha */}
        <div className="mona-tutorial" style={{ display:"flex", justifyContent:"flex-end", alignItems:"center", gap:"8px" }}>
          {/* Botón ⓘ */}
          <button onClick={()=>setShowAbout(true)} style={{ width:"32px", height:"32px", borderRadius:"50%", border:"1px solid #d4c4a8", background:"#fdf8f0", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" fill="none" stroke="#a07840" strokeWidth="1.5"/>
              <text x="10" y="15" textAnchor="middle" fontFamily="Outfit,sans-serif" fontSize="12" fontWeight="700" fill="#a07840">i</text>
            </svg>
          </button>
          {/* Tutorial */}
          <a href="#/docs" style={{ padding:"6px 12px 6px 10px", borderRadius:"100px", border:"1px solid #e8b8a8", cursor:"pointer", fontFamily:"'Outfit',sans-serif", background:"#fdf2ee", textDecoration:"none", display:"inline-flex", alignItems:"center", gap:"8px" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="3" width="12" height="17" rx="1.5" fill="#c26a4a" opacity="0.15"/>
              <rect x="4" y="3" width="12" height="17" rx="1.5" stroke="#c26a4a" strokeWidth="1.8"/>
              <line x1="7" y1="8"  x2="13" y2="8"  stroke="#c26a4a" strokeWidth="1.4" strokeLinecap="round"/>
              <line x1="7" y1="11" x2="13" y2="11" stroke="#c26a4a" strokeWidth="1.4" strokeLinecap="round"/>
              <line x1="7" y1="14" x2="11" y2="14" stroke="#c26a4a" strokeWidth="1.4" strokeLinecap="round"/>
              <path d="M4 3 Q2 3 2 5 L2 19 Q2 21 4 21" stroke="#c26a4a" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
            </svg>
            <div style={{ display:"flex", flexDirection:"column", lineHeight:1.2 }}>
              <span style={{ fontSize:"0.75rem", fontWeight:"700", color:"#9a4a2a" }}>MONA</span>
              <span style={{ fontSize:"0.58rem", color:"#c89a8a", letterSpacing:"0.08em" }}>TUTORIAL</span>
            </div>
          </a>
          {/* Quiero Apoyar — cohete MP */}
          <button onClick={()=>setShowDonate(true)} style={{ padding:"5px 14px 5px 10px", borderRadius:"14px", background:"#009ee3", border:"none", cursor:"pointer", display:"inline-flex", alignItems:"center", gap:"8px", height:"40px" }}>
            <span style={{ fontSize:"20px", lineHeight:1 }}>🚀</span>
            <div style={{ borderLeft:"1px solid rgba(255,255,255,0.35)", paddingLeft:"8px", display:"flex", flexDirection:"column", lineHeight:1.3 }}>
              <span style={{ fontSize:"0.72rem", fontWeight:"700", color:"#fff" }}>Quiero</span>
              <span style={{ fontSize:"0.72rem", fontWeight:"900", color:"#fff" }}>Apoyar!</span>
            </div>
          </button>
        </div>
      </div>

      {/* ── Top controls ── */}
      <div className="mona-grid" style={{ display:"grid", gridTemplateColumns:"1fr 2fr 1fr", gap:"12px", maxWidth:"1100px", margin:"0 auto 14px" }}>

        {/* Root */}
        <div style={{ ...panel, borderColor:rootLocked?"#bbf7d0":"#ddd5c4", transition:"border-color 0.2s", display:"flex", flexDirection:"column", justifyContent:"space-between", alignItems:"center", textAlign:"center" }}>
          <span style={{...lbl, alignSelf:"flex-start"}}>Nota Raíz</span>
          <div style={{ fontSize:"4.2rem", fontWeight:"500", lineHeight:1, color:rootLocked?"#16a34a":"#1a1a1a", letterSpacing:"-0.02em", transition:"color 0.2s", fontFamily:"'Outfit',sans-serif" }}>{NOTE_NAMES_ES[selectedRoot]}</div>
          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
            <button onClick={()=>setRootLocked(l=>!l)} style={{ background:"none", border:`1px solid ${rootLocked?"#bbf7d0":"#d4c4a8"}`, borderRadius:"7px", padding:"5px 8px", cursor:"pointer", display:"flex", alignItems:"center", transition:"all 0.2s" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="7" y="11" width="10" height="9" rx="2" fill={rootLocked?"#16a34a":"#c8a96e"} opacity={rootLocked?1:0.5}/>
                <path d="M9,11 L9,7 Q12,3 15,7 L15,11" fill="none" stroke={rootLocked?"#16a34a":"#c8a96e"} strokeWidth="2" strokeLinecap="round" opacity={rootLocked?1:0.5}/>
                <circle cx="12" cy="15" r="2" fill="#fff" opacity="0.8"/>
              </svg>
            </button>
            {!rootLocked && hoveredFret && NOTES[hoveredFret.noteIdx]!==selectedRoot && (
              <div style={{ fontSize:"1.4rem", fontWeight:"500", color:"#f97316", fontFamily:"'Outfit',sans-serif" }}>{NOTE_NAMES_ES[NOTES[hoveredFret.noteIdx]]}</div>
            )}
          </div>
          <div style={{ fontSize:"0.58rem", color:rootLocked?"#16a34a":"#bbb", display:"flex", alignItems:"center", gap:"4px" }}>
            {rootLocked ? <>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><rect x="7" y="11" width="10" height="9" rx="2" fill="#16a34a"/><path d="M9,11 L9,7 Q12,3 15,7 L15,11" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/></svg>
              Fija
            </> : <>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="10" r="4" fill="none" stroke="#bbb" strokeWidth="1.5"/><circle cx="12" cy="10" r="4" fill="none" stroke="#bbb" strokeWidth="1.5" opacity="0.5"/><line x1="12" y1="14" x2="12" y2="20" stroke="#bbb" strokeWidth="1.5" strokeLinecap="round"/></svg>
              Click en el diapasón
            </>}
          </div>
        </div>

        {/* Mode */}
        <div style={panel}>
          <span style={lbl}>Modo</span>
          <div style={{ display:"flex", gap:"7px", marginBottom:"12px" }}>
            {modeBtn("scale",      "Escalas",  "#22c55e", scaleIcon(mode==="scale"))}
            {modeBtn("chord",      "Acordes",  "#3b82f6", chordIcon(mode==="chord"))}
            {modeBtn("harmonized", "Armonía",  "#f97316", harmIcon(mode==="harmonized"))}
          </div>
          {mode==="scale"      && <select value={selectedScale}  onChange={e=>setSelectedScale(e.target.value)}  style={sel}>{Object.entries(SCALES).map(([k,s])=><option key={k} value={k} style={{background:"#fffdf8"}}>{s.name}</option>)}</select>}
          {mode==="chord"      && <select value={selectedChord}  onChange={e=>setSelectedChord(e.target.value)}  style={sel}>{Object.entries(CHORD_TYPES).map(([k,c])=><option key={k} value={k} style={{background:"#fffdf8"}}>{c.name}</option>)}</select>}
          {mode==="harmonized" && <select value={harmScale}      onChange={e=>setHarmScale(e.target.value)}      style={sel}>{Object.entries(HARMONIZED_SCALES).map(([k,s])=><option key={k} value={k} style={{background:"#fffdf8"}}>{s.name}</option>)}</select>}

          {/* Toggles contextuales */}
          <div style={{ display:"flex", gap:"7px", marginTop:"10px" }}>
            {mode !== "harmonized" && (
              <button onClick={()=>setShowCaged(s=>!s)} style={{ flex:1, padding:"7px 8px", borderRadius:"8px", border:`1.5px solid ${showCaged?"#c8b89a":"#e0d8cc"}`, cursor:"pointer", fontFamily:"'Outfit',sans-serif", background:showCaged?"#f9f3e8":"#fafaf8", transition:"all 0.15s", display:"flex", alignItems:"center", justifyContent:"center", gap:"7px" }}>
                <svg width="58" height="18" viewBox="0 0 58 18" fill="none">
                  <circle cx="6"  cy="9" r="5.5" fill={showCaged?"#a07840":"#ccc"} opacity="0.95"/>
                  <text x="6"  y="13" textAnchor="middle" fontSize="6" fontWeight="700" fill="#fdf8f0">C</text>
                  <circle cx="18" cy="9" r="5.5" fill={showCaged?"#a07840":"#ccc"} opacity="0.8"/>
                  <text x="18" y="13" textAnchor="middle" fontSize="6" fontWeight="700" fill="#fdf8f0">A</text>
                  <circle cx="30" cy="9" r="5.5" fill={showCaged?"#a07840":"#ccc"} opacity="0.6"/>
                  <text x="30" y="13" textAnchor="middle" fontSize="6" fontWeight="700" fill="#fdf8f0">G</text>
                  <circle cx="42" cy="9" r="5.5" fill={showCaged?"#a07840":"#ccc"} opacity="0.4"/>
                  <text x="42" y="13" textAnchor="middle" fontSize="6" fontWeight="700" fill="#fdf8f0">E</text>
                  <circle cx="54" cy="9" r="5.5" fill={showCaged?"#a07840":"#ccc"} opacity="0.25"/>
                  <text x="54" y="13" textAnchor="middle" fontSize="6" fontWeight="700" fill="#fdf8f0">D</text>
                </svg>
                <span style={{ fontSize:"0.7rem", fontWeight:"600", color:showCaged?"#a07840":"#bbb" }}>CAGED {showCaged?"ON":"OFF"}</span>
              </button>
            )}
            {mode === "scale" && SCALES[selectedScale]?.intervals?.length === 7 && (
              <button onClick={()=>{ setShow3NPS(s=>!s); setNpsPattern(0); }} style={{ flex:1, padding:"7px 8px", borderRadius:"8px", border:`1.5px solid ${show3NPS?"#7c3aed":"#e0d8cc"}`, cursor:"pointer", fontFamily:"'Outfit',sans-serif", background:show3NPS?"#7c3aed0d":"#fafaf8", transition:"all 0.15s", display:"flex", alignItems:"center", justifyContent:"center", gap:"7px" }}>
                <svg width="36" height="18" viewBox="0 0 36 18" fill="none">
                  <text x="4" y="13" fontSize="14" fontWeight="700" fill={show3NPS?"#7c3aed":"#ccc"} opacity="0.15" fontFamily="sans-serif">3</text>
                  <line x1="2" y1="9" x2="34" y2="9" stroke={show3NPS?"#7c3aed":"#ccc"} strokeWidth="1.5"/>
                  <circle cx="10" cy="9" r="4" fill={show3NPS?"#7c3aed":"#ccc"}/>
                  <circle cx="20" cy="9" r="4" fill={show3NPS?"#7c3aed":"#ccc"}/>
                  <circle cx="30" cy="9" r="4" fill={show3NPS?"#7c3aed":"#ccc"}/>
                </svg>
                <span style={{ fontSize:"0.7rem", fontWeight:"600", color:show3NPS?"#7c3aed":"#bbb" }}>3NPS {show3NPS?"ON":"OFF"}</span>
              </button>
            )}
          </div>
        </div>

        {/* ── Metrónomo ── */}
        <div style={{ ...panel, borderColor:metroOn?"#6366f1":"#ddd5c4", transition:"border-color 0.2s" }}>
          <span style={lbl}>Metrónomo</span>

          {/* BPM control */}
          <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"10px" }}>
            <button onClick={()=>{ const v=Math.max(40,metroBpm-5); metroBpmRef.current=v; setMetroBpm(v); }} style={{ width:"24px", height:"24px", borderRadius:"50%", border:"1px solid #d4c4a8", background:"#fdf8f0", cursor:"pointer", fontSize:"1rem", fontWeight:"500", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>−</button>
            <div style={{ flex:1, textAlign:"center" }}>
              <div style={{ fontSize:"1.6rem", fontWeight:"700", color:metroOn?"#6366f1":"#1a1a1a", lineHeight:1, transition:"color 0.2s" }}>{metroBpm}</div>
              <div style={{ fontSize:"0.55rem", color:"#bbb", letterSpacing:"0.1em" }}>BPM</div>
            </div>
            <button onClick={()=>{ const v=Math.min(200,metroBpm+5); metroBpmRef.current=v; setMetroBpm(v); }} style={{ width:"24px", height:"24px", borderRadius:"50%", border:"1px solid #d4c4a8", background:"#fdf8f0", cursor:"pointer", fontSize:"1rem", fontWeight:"500", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>+</button>
          </div>

          {/* Beat dots */}
          <div style={{ display:"flex", justifyContent:"center", gap:"6px", marginBottom:"10px" }}>
            {[0,1,2,3].map(i=>(
              <div key={i} style={{ width:"10px", height:"10px", borderRadius:"50%", background: metroBeat===i ? "#6366f1" : "#e5e5e0", transition:"background 0.04s" }}/>
            ))}
          </div>

          {/* Play/Stop */}
          <button onClick={metroOn ? stopMetro : startMetro} style={{ width:"100%", padding:"7px", borderRadius:"9px", border:`1px solid ${metroOn?"#fecaca":"#d4c4a8"}`, cursor:"pointer", fontSize:"0.78rem", fontWeight:"600", fontFamily:"'Outfit',sans-serif", background:metroOn?"#fef2f2":"#fdf8f0", color:metroOn?"#ef4444":"#a07840", transition:"all 0.2s", display:"flex", alignItems:"center", justifyContent:"center", gap:"7px" }}>
            {metroOn ? <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="4" width="5" height="16" rx="2" fill="#ef4444"/>
                <rect x="14" y="4" width="5" height="16" rx="2" fill="#ef4444"/>
              </svg>
              Detener
            </> : <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M6 4 L6 20 L20 12 Z" fill="#a07840"/>
              </svg>
              Iniciar
            </>}
          </button>
          {metroOn && <div style={{ fontSize:"0.58rem", color:"#f97316", marginTop:"6px", textAlign:"center" }}>Sonido MONA desactivado</div>}
        </div>
      </div>

      {/* ── Escala Armonizada ── */}
      {mode==="harmonized" && harmDef && (
        <div style={{ ...panel, maxWidth:"1100px", margin:"0 auto 14px", borderColor:"rgba(249,115,22,0.3)" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"14px" }}>
            <span style={{ fontSize:"0.85rem", fontWeight:"600", color:"#f97316", letterSpacing:"0.08em" }}>🎼 ESCALA ARMONIZADA · {NOTE_NAMES_ES[selectedRoot]} {harmDef.name.toUpperCase()}</span>
            <div style={{ display:"flex", gap:"7px" }}>
              <button onClick={()=>setUseSevenths(false)} style={ivBtn(!useSevenths,"#22c55e")}>Tríadas</button>
              <button onClick={()=>setUseSevenths(true)}  style={ivBtn(useSevenths,"#a855f7")}>Con 7ma</button>
            </div>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"10px" }}>
            {harmDef.degrees.map((deg,i) => {
              const degRoot=(rootIdx+(SCALES[harmScale]?.intervals[i]??0))%12;
              const chordNotes=(useSevenths?deg.seventh:deg.triad).map(iv=>(degRoot+iv)%12);
              const isActive=selectedDegree===i;
              return (
                <button key={i} onClick={()=>setSelectedDegree(i)} style={{ padding:"12px 14px", borderRadius:"12px", border:`2px solid ${isActive?deg.funcColor:"#ddd5c4"}`, cursor:"pointer", fontFamily:"'Outfit',sans-serif", textAlign:"left", background:isActive?`${deg.funcColor}10`:"#fdf8f0", transition:"all 0.15s", minWidth:"120px" }}>
                  <div style={{ fontSize:"1.1rem", fontWeight:"700", color:isActive?deg.funcColor:"#aaa", marginBottom:"3px" }}>{deg.roman}</div>
                  <div style={{ fontSize:"0.82rem", fontWeight:"600", color:isActive?"#1a1a1a":"#666", marginBottom:"5px" }}>{NOTE_NAMES_ES[NOTES[degRoot]]} <span style={{ opacity:0.6, fontSize:"0.68rem" }}>{deg.quality}</span></div>
                  <div style={{ display:"flex", gap:"3px", flexWrap:"wrap", marginBottom:"6px" }}>
                    {chordNotes.map((n,j)=><span key={j} style={{ fontSize:"0.62rem", fontWeight:"600", padding:"2px 6px", borderRadius:"4px", background:`${deg.funcColor}18`, color:deg.funcColor }}>{NOTE_NAMES_ES[NOTES[n]]}</span>)}
                  </div>
                  <div style={{ fontSize:"0.62rem", color:isActive?deg.funcColor:"#bbb", fontWeight:"600" }}>{FUNC_ABBR[deg.func]||deg.func}</div>
                  <div style={{ fontSize:"0.58rem", color:"#bbb", marginTop:"1px" }}>{deg.mode}</div>
                </button>
              );
            })}
          </div>
          {harmDef.degrees[selectedDegree] && (()=>{
            const deg=harmDef.degrees[selectedDegree];
            const degRoot=(rootIdx+(SCALES[harmScale]?.intervals[selectedDegree]??0))%12;
            return (
              <div style={{ marginTop:"14px", padding:"12px 16px", borderRadius:"10px", background:`${deg.funcColor}08`, border:`1px solid ${deg.funcColor}25`, display:"flex", flexWrap:"wrap", gap:"20px", alignItems:"center" }}>
                <div><span style={{ fontSize:"0.68rem", color:"#aaa" }}>FUNCIÓN  </span><span style={{ fontSize:"0.88rem", fontWeight:"600", color:deg.funcColor }}>{deg.func}</span></div>
                <div><span style={{ fontSize:"0.68rem", color:"#aaa" }}>MODO  </span><span style={{ fontSize:"0.88rem", fontWeight:"600", color:"#1a1a1a" }}>{deg.mode}</span></div>
                <div><span style={{ fontSize:"0.68rem", color:"#aaa" }}>RAÍZ  </span><span style={{ fontSize:"0.88rem", fontWeight:"600", color:"#1a1a1a" }}>{NOTE_NAMES_ES[NOTES[degRoot]]}</span></div>
                <div style={{ fontSize:"0.68rem", color:"#bbb", marginLeft:"auto" }}>↑ El mástil muestra este acorde</div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ── Display: Notas / Intervalos unificado ── */}
      <div style={{ ...panel, maxWidth:"1100px", margin:"0 auto 14px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"12px" }}>
          <span style={lbl}>Display en el diapasón</span>
          <div style={{ display:"flex", background:"#ddd5c4", borderRadius:"100px", padding:"3px", gap:"2px" }}>
            <button onClick={()=>setShowNotes(false)} style={{ padding:"5px 14px", borderRadius:"100px", border:"none", cursor:"pointer", fontFamily:"'Outfit',sans-serif", fontWeight:"500", fontSize:"0.78rem", background:!showNotes?"#fffdf8":"transparent", color:!showNotes?"#1a1a1a":"#999", boxShadow:!showNotes?"0 1px 3px rgba(0,0,0,0.1)":"none", transition:"all 0.2s" }}>Intervalos</button>
            <button onClick={()=>setShowNotes(true)}  style={{ padding:"5px 14px", borderRadius:"100px", border:"none", cursor:"pointer", fontFamily:"'Outfit',sans-serif", fontWeight:"500", fontSize:"0.78rem", background:showNotes?"#fffdf8":"transparent",  color:showNotes?"#1a1a1a":"#999",  boxShadow:showNotes?"0 1px 3px rgba(0,0,0,0.1)":"none",  transition:"all 0.2s" }}>Notas</button>
          </div>
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:"7px", marginBottom:"10px" }}>
          {ALL_INTERVALS.filter(iv=>presentIntervals.includes(iv.semitones)).map(iv=>{
            const off=disabledIvs.has(iv.semitones);
            return <button key={iv.semitones} onClick={()=>toggleIv(iv.semitones)} style={{ padding:"6px 14px", borderRadius:"20px", cursor:"pointer", fontSize:"0.78rem", fontWeight:"500", fontFamily:"'Outfit',sans-serif", border:`1.5px solid ${off?"#ddd":iv.color}`, background:off?"#fdf8f0":`${iv.color}12`, color:off?"#ccc":iv.color, textDecoration:off?"line-through":"none", opacity:off?0.5:1, transition:"all 0.14s" }}>
              {iv.label} <span style={{ opacity:0.7, fontSize:"0.7rem" }}>{iv.name}</span>
            </button>;
          })}
        </div>
        {mode!=="harmonized" && activeNotes.length > 0 && (
          <div style={{ display:"flex", flexWrap:"wrap", gap:"6px", alignItems:"center", paddingTop:"10px", borderTop:"1px solid #ede5d8" }}>
            <span style={{ fontSize:"0.65rem", color:"#bbb", marginRight:"2px" }}>{NOTE_NAMES_ES[selectedRoot]} {mode==="scale"?SCALES[selectedScale].name:CHORD_TYPES[selectedChord].name}:</span>
            {activeNotes.map((ni,i)=>{
              const iv=presentIntervals[i], meta=ALL_INTERVALS.find(m=>m.semitones===iv), off=disabledIvs.has(iv);
              return <div key={i} style={{ padding:"3px 10px", borderRadius:"20px", fontSize:"0.75rem", fontWeight:"500", background:off?"#ede5d8":`${meta?.color}18`, color:off?"#ccc":meta?.color, border:`1px solid ${off?"#e8e8e3":(meta?.color||"#ccc")+"44"}`, textDecoration:off?"line-through":"none", opacity:off?0.5:1 }}>{NOTE_NAMES_ES[NOTES[ni]]}</div>;
            })}
          </div>
        )}
      </div>

      {/* ── 3NPS panel ── */}
      {mode==="scale" && show3NPS && (() => {
        const scaleIntervals = SCALES[selectedScale]?.intervals;
        const is7note = scaleIntervals?.length === 7;
        const GREEK_MODES = ["Jónico","Dórico","Frigio","Lidio","Mixolidio","Eólico","Locrio"];
        const ROMAN = ["I","II","III","IV","V","VI","VII"];
        return (
          <div style={{ ...panel, maxWidth:"1100px", margin:"0 auto 14px", borderColor:"#7c3aed44" }}>
            <div style={{ marginBottom:"14px" }}>
              <span style={{ fontSize:"0.82rem", fontWeight:"600", color:"#7c3aed" }}>🎸 3 NOTAS POR CUERDA</span>
              <span style={{ fontSize:"0.68rem", color:"#bbb", marginLeft:"10px" }}>Patrones de escala en el mástil</span>
            </div>
            {!is7note && (
              <p style={{ fontSize:"0.68rem", color:"#f97316", margin:0 }}>3NPS requiere una escala de 7 notas.</p>
            )}
            {is7note && (
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"10px" }}>
                  <button onClick={()=>setNpsPattern(p=>(p+6)%7)} style={{ width:"32px", height:"32px", borderRadius:"50%", border:"1px solid #d4c4a8", background:"#fdf8f0", cursor:"pointer", fontSize:"1rem", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>‹</button>
                  <div style={{ flex:1, textAlign:"center", padding:"8px 12px", borderRadius:"10px", background:"#7c3aed0d", border:"1.5px solid #7c3aed33" }}>
                    <div style={{ fontSize:"0.9rem", fontWeight:"700", color:"#7c3aed" }}>Patrón {npsPattern+1} · {ROMAN[npsPattern]}</div>
                    <div style={{ fontSize:"0.68rem", color:"#9a7ad4", marginTop:"2px" }}>{GREEK_MODES[npsPattern]}</div>
                  </div>
                  <button onClick={()=>setNpsPattern(p=>(p+1)%7)} style={{ width:"32px", height:"32px", borderRadius:"50%", border:"1px solid #d4c4a8", background:"#fdf8f0", cursor:"pointer", fontSize:"1rem", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>›</button>
                </div>
                <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
                  {GREEK_MODES.map((g,i)=>(
                    <button key={i} onClick={()=>setNpsPattern(i)} style={{ flex:1, minWidth:"52px", padding:"6px 4px", borderRadius:"8px", border:`1.5px solid ${npsPattern===i?"#7c3aed":"#e0d8cc"}`, background:npsPattern===i?"#7c3aed":"#fdf8f0", color:npsPattern===i?"#fff":"#aaa", fontSize:"0.72rem", fontWeight:"600", cursor:"pointer", fontFamily:"'Outfit',sans-serif", transition:"all 0.12s", textAlign:"center" }}>
                      <div>{i+1}</div>
                      <div style={{ fontSize:"0.55rem", opacity:0.75, marginTop:"1px" }}>{g.slice(0,3)}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ── CAGED ── */}
      {mode !== "harmonized" && showCaged && (
      <div style={{ ...panel, maxWidth:"1100px", margin:"0 auto 14px", borderColor:"#c8b89a" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"14px" }}>
          <div>
            <span style={{ fontSize:"0.82rem", fontWeight:"600", color:"#1a1a1a" }}>🔷 SISTEMA CAGED</span>
            <span style={{ fontSize:"0.68rem", color:"#bbb", marginLeft:"10px" }}>Posiciones del acorde en el mástil</span>
          </div>
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:"8px", marginBottom:"10px" }}>
          {["C","A","G","E","D"].map(sh=>{
            const c=CAGED_COLORS[sh], on=activeCaged.has(sh), pos=cagedPositions.find(p=>p.shape===sh);
            return <button key={sh} onClick={()=>toggleCaged(sh)} onMouseEnter={()=>setHoveredShape(sh)} onMouseLeave={()=>setHoveredShape(null)} style={{ padding:"8px 16px", borderRadius:"9px", border:`1.5px solid ${on?c.border:"#d4c4a8"}`, cursor:"pointer", fontFamily:"'Outfit',sans-serif", background:on?`${c.border}10`:"#fdf8f0", color:on?c.text:"#bbb", fontWeight:"600", fontSize:"0.9rem", opacity:on?1:0.45 }}>
              {sh}{pos&&<span style={{ fontSize:"0.6rem", opacity:0.65, marginLeft:"6px" }}>tr.{pos.loFret===0?"open":pos.loFret}</span>}
            </button>;
          })}
        </div>
        <p style={{ fontSize:"0.68rem", color:"#aaa", margin:0 }}>Pasá el cursor sobre una forma para resaltarla en el diapasón. Las notas son exactas y verificadas.</p>
      </div>
      )}

      {/* ── Fretboard ── */}
      <div style={{ maxWidth:"1100px", margin:"0 auto", background:"#fff", borderRadius:"16px", padding:"18px 18px 30px", border:"1px solid #ddd5c4", overflowX:"auto", boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>
        <div style={{ minWidth:"820px" }}>

          {/* Fret numbers */}
          <div style={{ display:"flex", marginBottom:"8px", paddingLeft:"80px" }}>
            <div style={{ width:"56px", textAlign:"center", fontSize:"0.68rem", color:"#999", fontWeight:"500" }}>OPEN</div>
            {Array.from({length:FRET_COUNT},(_,i)=>(
              <div key={i} style={{ flex:1, textAlign:"center", fontSize:"0.68rem", color:MARKER_FRETS.includes(i+1)?"#d05800":"#999", fontWeight:MARKER_FRETS.includes(i+1)?"700":"500" }}>{i+1}</div>
            ))}
          </div>

          {/* Strings */}
          {stringOrder.map(strIdx=>{
            const isMuted=mutedStrings.has(strIdx);
            const thickness=flipped?[1,1.5,2,2.8,3.8,5][stringOrder.indexOf(strIdx)]:[5,3.8,2.8,2,1.5,1][stringOrder.indexOf(strIdx)];
            return (
              <div key={strIdx} style={{ display:"flex", alignItems:"center", marginBottom:"3px" }}>

                {/* Label + mute button — always clickable */}
                <div style={{ width:"80px", display:"flex", alignItems:"center", gap:"6px", flexShrink:0 }}>
                  <button
                    onClick={()=>toggleString(strIdx)}
                    title={isMuted?"Activar cuerda":"Silenciar cuerda"}
                    style={{ width:"24px", height:"24px", borderRadius:"6px", border:`1.5px solid #b8a88a`, cursor:"pointer", fontSize:"0.7rem", fontWeight:"700", background:isMuted?"#fdf8f0":"#f7f0e6", color:"#b8a88a", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.15s", flexShrink:0 }}>
                    {isMuted?"+":"✕"}
                  </button>
                  <span style={{ fontSize:"0.68rem", color:isMuted?"#ccc":"#888", whiteSpace:"nowrap", transition:"color 0.2s" }}>{STRING_NAMES[strIdx]}</span>
                </div>

                {/* Fret area — muted = dimmed and non-interactive */}
                <div style={{ display:"flex", flex:1, opacity:isMuted?0.15:1, filter:isMuted?"blur(1.5px)":"none", transition:"opacity 0.25s,filter 0.25s", pointerEvents:isMuted?"none":"auto" }}>

                {/* Open string */}
                {(()=>{
                  const ni=OPEN_STRINGS[strIdx], disp=getNoteDisplay(ni,strIdx,0);
                  const isHovered=hoveredFret?.strIdx===strIdx&&hoveredFret?.fret===0;
                  const isPreview=isHovered&&NOTES[ni]!==selectedRoot&&!rootLocked;
                  return (
                    <div onClick={()=>{if(!rootLocked)setSelectedRoot(NOTES[ni]);playSingleNote(ni,strIdx,0);}}
                      onMouseEnter={()=>setHoveredFret({noteIdx:ni,strIdx,fret:0})}
                      onMouseLeave={()=>setHoveredFret(null)}
                      style={{ width:"56px", display:"flex", justifyContent:"center", alignItems:"center", position:"relative", height:"44px", cursor:"pointer" }}>
                      <div style={{ position:"absolute", width:"100%", height:`${thickness}px`, background:"rgba(180,140,60,0.45)", top:"50%", transform:"translateY(-50%)" }}/>
                      {isPreview&&!disp&&<div style={{ width:"32px", height:"32px", borderRadius:"50%", background:"rgba(200,200,200,0.25)", color:"#bbb", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.6rem", fontWeight:"700", zIndex:1, border:"1.5px dashed rgba(249,115,22,0.5)" }}>{NOTE_NAMES_ES[NOTES[ni]]}</div>}
                      {disp&&<div style={{ width:"32px", height:"32px", borderRadius:"50%", background:disp.bg, color:disp.textColor, display:"flex", alignItems:"center", justifyContent:"center", fontSize:showNotes?"0.52rem":"0.65rem", fontWeight:"700", zIndex:1, border:`2px solid ${disp.borderColor}`, boxShadow:`0 2px 6px rgba(${parseInt(disp.borderColor.replace('#','').slice(0,2),16)},${parseInt(disp.borderColor.replace('#','').slice(2,4),16)},${parseInt(disp.borderColor.replace('#','').slice(4,6),16)},0.3)`, transform:isHovered?"scale(1.2)":"scale(1)", transition:"transform 0.1s" }}>{disp.label}</div>}
                    </div>
                  );
                })()}

                {/* Frets */}
                {/* Cejilla / Nut */}
                <div style={{ width:"4px", flexShrink:0, alignSelf:"stretch", background:"#c8a96e", borderRadius:"1px", marginRight:"1px" }}/>
                {Array.from({length:FRET_COUNT},(_,fret)=>{
                  const fretNum=fret+1, ni=getNoteAtFret(strIdx,fretNum), disp=getNoteDisplay(ni,strIdx,fretNum), isDouble=fretNum===12;
                  const zonesHere=showCaged?cagedPositions.filter(p=>activeCaged.has(p.shape)&&fretNum>=p.loFret&&fretNum<=p.hiFret):[];
                  const activeZone=hoveredShape&&zonesHere.find(z=>z.shape===hoveredShape)?zonesHere.find(z=>z.shape===hoveredShape):zonesHere[0];
                  const isHoveredCell=hoveredFret?.strIdx===strIdx&&hoveredFret?.fret===fretNum;
                  const isPreviewCell=isHoveredCell&&NOTES[ni]!==selectedRoot&&!rootLocked;
                  return (
                    <div key={fret}
                      onClick={()=>{if(!rootLocked)setSelectedRoot(NOTES[ni]);playSingleNote(ni,strIdx,fretNum);}}
                      onMouseEnter={()=>setHoveredFret({noteIdx:ni,strIdx,fret:fretNum})}
                      onMouseLeave={()=>setHoveredFret(null)}
                      style={{ flex:1, height:"44px", position:"relative", display:"flex", alignItems:"center", justifyContent:"center", borderLeft:`${isDouble?3:1}px solid ${isDouble?"#b8a88a":"#d4c4a8"}`, cursor:"pointer" }}>
                      <div style={{ position:"absolute", width:"100%", height:`${thickness}px`, background:`rgba(180,140,60,${0.32+strIdx*0.05})`, top:"50%", transform:"translateY(-50%)" }}/>

                      {/* CAGED overlay */}
                      {activeZone&&(()=>{
                        const c=CAGED_COLORS[activeZone.shape], isHi=hoveredShape===activeZone.shape;
                        const isFirst=fretNum===activeZone.loFret, isLast=fretNum===activeZone.hiFret;
                        return <div style={{ position:"absolute", inset:0, zIndex:0, background:isHi?`${c.border}1a`:c.bg, borderTop:`2px solid ${c.border}${isHi?"cc":"55"}`, borderBottom:`2px solid ${c.border}${isHi?"cc":"55"}`, borderLeft:isFirst?`3px solid ${c.border}${isHi?"ff":"88"}`:"none", borderRight:isLast?`3px solid ${c.border}${isHi?"ff":"88"}`:"none", transition:"background 0.18s" }}/>;
                      })()}

                      {/* CAGED label */}
                      {showCaged&&strIdx===2&&zonesHere.filter(z=>fretNum===z.loFret).map(zone=>(
                        <div key={zone.shape} style={{ position:"absolute", top:"-20px", left:"50%", transform:"translateX(-50%)", fontSize:"0.68rem", fontWeight:"700", color:CAGED_COLORS[zone.shape].text, background:"rgba(255,255,255,0.92)", borderRadius:"5px", padding:"1px 5px", border:`1px solid ${CAGED_COLORS[zone.shape].border}55`, zIndex:10, whiteSpace:"nowrap", boxShadow:"0 1px 3px rgba(0,0,0,0.1)" }}>{zone.shape}</div>
                      ))}

                      {/* Ghost dot */}
                      {isPreviewCell&&!disp&&<div style={{ width:"32px", height:"32px", borderRadius:"50%", background:"rgba(200,200,200,0.25)", color:"#bbb", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.55rem", fontWeight:"700", zIndex:2, position:"relative", border:"1.5px dashed rgba(249,115,22,0.5)" }}>{NOTE_NAMES_ES[NOTES[ni]]}</div>}

                      {/* Note dot */}
                      {disp&&<div style={{ width:"32px", height:"32px", borderRadius:"50%", background:disp.bg, color:disp.textColor, display:"flex", alignItems:"center", justifyContent:"center", fontSize:showNotes?"0.52rem":"0.65rem", fontWeight:"700", zIndex:2, position:"relative", border:`2px solid ${disp.borderColor}`, boxShadow:`0 2px 6px rgba(${parseInt(disp.borderColor.replace('#','').slice(0,2),16)},${parseInt(disp.borderColor.replace('#','').slice(2,4),16)},${parseInt(disp.borderColor.replace('#','').slice(4,6),16)},0.3)`, transform:isHoveredCell?"scale(1.2)":"scale(1)", transition:"transform 0.1s" }}>{disp.label}</div>}
                    </div>
                  );
                })}
                </div>{/* end fret area */}
              </div>
            );
          })}

          {/* Position dots */}
          <div style={{ display:"flex", paddingLeft:"136px", marginTop:"8px" }}>
            {Array.from({length:FRET_COUNT},(_,i)=>(
              <div key={i} style={{ flex:1, display:"flex", justifyContent:"center", gap:"4px" }}>
                {MARKER_FRETS.includes(i+1)&&<>
                  <div style={{ width:"7px", height:"7px", borderRadius:"50%", background:"#c8b89a" }}/>
                  {i+1===12&&<div style={{ width:"7px", height:"7px", borderRadius:"50%", background:"#c8b89a" }}/>}
                </>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Modal Donación ── */}
      {showDonate && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:"20px" }} onClick={()=>setShowDonate(false)}>
          <div style={{ background:"#fdf8f2", borderRadius:"20px", maxWidth:"400px", width:"100%", padding:"28px", position:"relative" }} onClick={e=>e.stopPropagation()}>
            <button onClick={()=>setShowDonate(false)} style={{ position:"absolute", top:"14px", right:"16px", background:"none", border:"none", cursor:"pointer", color:"#ccc", fontSize:"18px" }}>✕</button>
            <div style={{ textAlign:"center", marginBottom:"20px" }}>
              <span style={{ fontSize:"32px" }}>🚀</span>
              <h2 style={{ fontSize:"18px", fontWeight:"900", color:"#1a1a1a", margin:"8px 0 6px", fontFamily:"'Outfit',sans-serif" }}>¡Quiero Apoyar!</h2>
            </div>
            <p style={{ fontSize:"13px", color:"#888", lineHeight:1.7, margin:"0 0 20px", textAlign:"center", fontFamily:"'Outfit',sans-serif" }}>
              MONA es un proyecto independiente, gratuito y sin publicidad.<br/>
              Hecho con amor por la música. Tu aporte nos ayuda a mantenerlo vivo y seguir mejorándolo.<br/>
              <strong style={{ color:"#555" }}>¿Te sumás?</strong>
            </p>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"10px", flexWrap:"wrap" }}>
              <a href="https://mpago.la/1bdvY3p" target="_blank" rel="noopener noreferrer" style={{ display:"inline-flex", alignItems:"center", gap:"8px", padding:"8px 18px", borderRadius:"20px", background:"#009ee3", textDecoration:"none" }}>
                <svg width="52" height="18" viewBox="0 0 70 22" fill="none">
                  <ellipse cx="11" cy="11" rx="11" ry="10" fill="#fff"/>
                  <ellipse cx="11" cy="11" rx="9" ry="8" fill="#72d0eb"/>
                  <path d="M6 13 Q8 9 11 10 Q14 9 16 13 Q13 15 11 14 Q9 15 6 13Z" fill="#fff" opacity="0.9"/>
                  <text x="26" y="9"  fontFamily="Arial,sans-serif" fontSize="8" fontWeight="700" fill="#fff">mercado</text>
                  <text x="26" y="19" fontFamily="Arial,sans-serif" fontSize="8" fontWeight="700" fill="#fff">pago</text>
                </svg>
                <div style={{ borderLeft:"1px solid rgba(255,255,255,0.35)", paddingLeft:"8px" }}>
                  <div style={{ fontSize:"0.75rem", fontWeight:"700", color:"#fff" }}>ARS $2.000</div>
                  <div style={{ fontSize:"0.58rem", color:"rgba(255,255,255,0.75)" }}>monto fijo · 1 click</div>
                </div>
              </a>
              <span style={{ fontSize:"0.68rem", color:"#bbb" }}>o</span>
              <a href="https://link.mercadopago.com.ar/mona4musicians" target="_blank" rel="noopener noreferrer" style={{ display:"inline-flex", alignItems:"center", gap:"8px", padding:"8px 18px", borderRadius:"20px", background:"#fdf8f0", border:"1.5px solid #c8a96e", textDecoration:"none" }}>
                <svg width="52" height="18" viewBox="0 0 70 22" fill="none">
                  <ellipse cx="11" cy="11" rx="11" ry="10" fill="#e8f4fd"/>
                  <ellipse cx="11" cy="11" rx="9" ry="8" fill="#b8dff0"/>
                  <path d="M6 13 Q8 9 11 10 Q14 9 16 13 Q13 15 11 14 Q9 15 6 13Z" fill="#fff" opacity="0.9"/>
                  <text x="26" y="9"  fontFamily="Arial,sans-serif" fontSize="8" fontWeight="700" fill="#a07840">mercado</text>
                  <text x="26" y="19" fontFamily="Arial,sans-serif" fontSize="8" fontWeight="700" fill="#a07840">pago</text>
                </svg>
                <div style={{ borderLeft:"1px solid #d4c4a8", paddingLeft:"8px" }}>
                  <div style={{ fontSize:"0.75rem", fontWeight:"700", color:"#a07840" }}>Elegir monto</div>
                  <div style={{ fontSize:"0.58rem", color:"#bbb" }}>lo que vos quieras</div>
                </div>
              </a>
            </div>
            <p style={{ fontSize:"11px", color:"#ccc", textAlign:"center", margin:"16px 0 0", fontFamily:"'Outfit',sans-serif" }}>
              — Equipo MONA4Musicians —
            </p>
          </div>
        </div>
      )}

      {/* ── Modal About ── */}
      {showAbout && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:"20px" }} onClick={()=>setShowAbout(false)}>
          <div style={{ background:"#fdf8f2", borderRadius:"20px", maxWidth:"460px", width:"100%", padding:"32px", position:"relative" }} onClick={e=>e.stopPropagation()}>

            {/* X cerrar */}
            <button onClick={()=>setShowAbout(false)} style={{ position:"absolute", top:"14px", right:"16px", background:"none", border:"none", cursor:"pointer", color:"#ccc", fontSize:"18px", lineHeight:1 }}>✕</button>

            {/* Logo centrado */}
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"6px", marginBottom:"24px" }}>
              <svg width="56" height="62" viewBox="0 0 100 110" fill="none">
                <path d="M50,4 C74,4 92,18 92,38 C92,66 50,100 50,100 C50,100 8,66 8,38 C8,18 26,4 50,4Z" fill="none" stroke="#c8a96e" strokeWidth="2" opacity="0.35"/>
                <path d="M50,10 C71,10 86,22 86,40 C86,66 50,96 50,96 C50,96 14,66 14,40 C14,22 29,10 50,10Z" fill="#fdf8f2" stroke="#c8a96e" strokeWidth="3.5"/>
                <path d="M26,46 Q34,32 42,46 Q50,60 58,46 Q66,32 74,46" fill="none" stroke="#c8a96e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.55"/>
                <path d="M26,58 Q34,42 42,58 Q50,74 58,58 Q66,42 74,58" fill="none" stroke="#9a4a2a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div style={{ fontSize:"30px", fontWeight:"900", color:"#1a1a1a", letterSpacing:"-0.02em", lineHeight:1, fontFamily:"'Outfit',sans-serif" }}>MONA</div>
              <div style={{ fontSize:"9px", color:"#aaa", letterSpacing:"0.35em", fontFamily:"'Outfit',sans-serif" }}>VISUALIZÁ LA MÚSICA</div>
            </div>

            <h2 style={{ fontSize:"15px", fontWeight:"700", color:"#1a1a1a", margin:"0 0 14px", textAlign:"center", fontFamily:"'Outfit',sans-serif" }}>¿De qué se trata?</h2>

            <p style={{ fontSize:"13px", color:"#666", lineHeight:1.8, margin:"0 0 12px", fontFamily:"'Outfit',sans-serif" }}>
              MONA nació para acompañarte en tu camino con la guitarra. No importa si sos autodidacta, si estás tomando clases o si enseñás: MONA es el complemento visual que pone la teoría frente a tus ojos, lista para practicar. Sin vueltas.
            </p>
            <p style={{ fontSize:"13px", color:"#666", lineHeight:1.8, margin:"0 0 12px", fontFamily:"'Outfit',sans-serif" }}>
              La web está llena de videos y recursos dispersos. Nosotros quisimos reunir lo esencial en un solo lugar: escalas, acordes y armonía, directo en el diapasón.
            </p>
            <p style={{ fontSize:"13px", color:"#666", lineHeight:1.8, margin:"0 0 18px", fontFamily:"'Outfit',sans-serif" }}>
              MONA siempre va a buscar ser amigable. No tengas miedo de explorarla — la diseñamos para que puedas sacarle el máximo provecho y aprendas.
            </p>

            <div style={{ background:"#f7ede0", borderRadius:"12px", padding:"14px 16px", marginBottom:"20px", display:"flex", flexDirection:"column", gap:"12px" }}>
              <div style={{ fontFamily:"'Outfit',sans-serif" }}>
                <div style={{ fontSize:"12px", color:"#555", display:"flex", gap:"8px", alignItems:"flex-start" }}>
                  <span style={{ color:"#c8a96e", fontWeight:"700", flexShrink:0 }}>→</span>
                  <span style={{ fontWeight:"600", color:"#1a1a1a" }}>¿Está terminada?</span>
                </div>
                <div style={{ fontSize:"12px", color:"#555", paddingLeft:"16px", marginTop:"4px" }}>
                  No, <strong style={{ color:"#1a1a1a" }}>¡Pero prometemos seguir mejorándola! 🫡📝</strong>
                </div>
              </div>
              <div style={{ fontFamily:"'Outfit',sans-serif" }}>
                <div style={{ fontSize:"12px", color:"#555", display:"flex", gap:"8px", alignItems:"flex-start" }}>
                  <span style={{ color:"#c8a96e", fontWeight:"700", flexShrink:0 }}>→</span>
                  <span style={{ fontWeight:"600", color:"#1a1a1a" }}>Objetivo cercano:</span>
                </div>
                <div style={{ fontSize:"12px", color:"#555", paddingLeft:"16px", marginTop:"4px" }}>
                  Conseguir un sitio web oficial para MONA.
                </div>
                <div style={{ fontSize:"12px", paddingLeft:"16px", marginTop:"4px", fontStyle:"italic" }}>
                  <strong style={{ color:"#1a1a1a" }}>¡Tu ayuda es bienvenida!</strong>
                </div>
              </div>
            </div>

            <p style={{ fontSize:"12px", color:"#aaa", margin:"0 0 6px", textAlign:"center", fontFamily:"'Outfit',sans-serif" }}>
              Gracias por usarla. Ahora a practicar 🎸
            </p>
            <p style={{ fontSize:"12px", color:"#c8a96e", margin:"0 0 18px", textAlign:"center", fontWeight:"600", fontFamily:"'Outfit',sans-serif" }}>
              — Equipo MONA4Musicians —
            </p>

            <button onClick={()=>setShowAbout(false)} style={{ width:"100%", padding:"12px", borderRadius:"12px", border:"none", background:"#1a1a1a", color:"#fdf8f2", fontFamily:"'Outfit',sans-serif", fontSize:"14px", fontWeight:"700", cursor:"pointer", letterSpacing:"0.05em" }}>
              ¡Vamos! 🎸
            </button>
          </div>
        </div>
      )}

      <div style={{ borderTop:"1px solid #ddd5c4", paddingTop:"20px", marginTop:"16px", maxWidth:"1100px", margin:"16px auto 0" }}>
        <p style={{ textAlign:"center", fontSize:"0.75rem", color:"#888", lineHeight:1.7, margin:"0 0 16px" }}>
          MONA es un proyecto independiente, gratuito y sin publicidad.<br/>
          Hecho con amor por la música. Tu aporte nos ayuda a mantenerlo vivo y seguir mejorándolo.{" "}
          <strong style={{ color:"#555", fontWeight:"600" }}>¿Te sumás?</strong>
        </p>

        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"10px", flexWrap:"wrap", marginBottom:"16px" }}>

          {/* Monto fijo $2000 */}
          <a href="https://mpago.la/1bdvY3p" target="_blank" rel="noopener noreferrer" style={{ display:"inline-flex", alignItems:"center", gap:"8px", padding:"8px 18px", borderRadius:"20px", background:"#009ee3", textDecoration:"none" }}>
            <svg width="52" height="18" viewBox="0 0 70 22" fill="none">
              <ellipse cx="11" cy="11" rx="11" ry="10" fill="#fff"/>
              <ellipse cx="11" cy="11" rx="9" ry="8" fill="#72d0eb"/>
              <path d="M6 13 Q8 9 11 10 Q14 9 16 13 Q13 15 11 14 Q9 15 6 13Z" fill="#fff" opacity="0.9"/>
              <text x="26" y="9"  fontFamily="Arial,sans-serif" fontSize="8" fontWeight="700" fill="#fff">mercado</text>
              <text x="26" y="19" fontFamily="Arial,sans-serif" fontSize="8" fontWeight="700" fill="#fff">pago</text>
            </svg>
            <div style={{ borderLeft:"1px solid rgba(255,255,255,0.35)", paddingLeft:"8px" }}>
              <div style={{ fontSize:"0.75rem", fontWeight:"700", color:"#fff" }}>ARS $2.000</div>
              <div style={{ fontSize:"0.58rem", color:"rgba(255,255,255,0.75)" }}>monto fijo · 1 click</div>
            </div>
          </a>

          <span style={{ fontSize:"0.68rem", color:"#bbb" }}>o</span>

          {/* Monto variable */}
          <a href="https://link.mercadopago.com.ar/mona4musicians" target="_blank" rel="noopener noreferrer" style={{ display:"inline-flex", alignItems:"center", gap:"8px", padding:"8px 18px", borderRadius:"20px", background:"#fdf8f0", border:"1.5px solid #c8a96e", textDecoration:"none" }}>
            <svg width="52" height="18" viewBox="0 0 70 22" fill="none">
              <ellipse cx="11" cy="11" rx="11" ry="10" fill="#e8f4fd"/>
              <ellipse cx="11" cy="11" rx="9" ry="8" fill="#b8dff0"/>
              <path d="M6 13 Q8 9 11 10 Q14 9 16 13 Q13 15 11 14 Q9 15 6 13Z" fill="#fff" opacity="0.9"/>
              <text x="26" y="9"  fontFamily="Arial,sans-serif" fontSize="8" fontWeight="700" fill="#a07840">mercado</text>
              <text x="26" y="19" fontFamily="Arial,sans-serif" fontSize="8" fontWeight="700" fill="#a07840">pago</text>
            </svg>
            <div style={{ borderLeft:"1px solid #d4c4a8", paddingLeft:"8px" }}>
              <div style={{ fontSize:"0.75rem", fontWeight:"700", color:"#a07840" }}>Elegir monto</div>
              <div style={{ fontSize:"0.58rem", color:"#bbb" }}>lo que vos quieras</div>
            </div>
          </a>
        </div>

        <p style={{ textAlign:"center", color:"#ccc", fontSize:"0.62rem", margin:"0", letterSpacing:"0.08em" }}>
          © 2026 MONA · CC BY-NC 4.0
        </p>
      </div>
    </div>
  );
}
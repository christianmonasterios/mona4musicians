import { useState } from 'react';
import { Link } from 'react-router-dom';

const GOLD = "#c8a96e";
const CREAM = "#ede8df";

const styles = {
  page: {
    minHeight: "100vh",
    background: CREAM,
    fontFamily: "'Outfit', sans-serif",
    padding: "0 0 60px",
  },
  header: {
    textAlign: "center",
    padding: "40px 20px 28px",
    borderBottom: "1px solid #ddd5c4",
    marginBottom: "32px",
  },
  logo: { display: "block", margin: "0 auto 8px" },
  tagline: {
    color: "#aaa",
    fontSize: "0.68rem",
    letterSpacing: "0.14em",
    margin: "0 0 20px",
  },
  backLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "0.78rem",
    color: "#888",
    textDecoration: "none",
    padding: "6px 14px",
    borderRadius: "20px",
    border: "1px solid #d4c4a8",
    background: "#fdf8f0",
    transition: "all 0.15s",
  },
  container: {
    maxWidth: "720px",
    margin: "0 auto",
    padding: "0 20px",
  },
  tabs: {
    display: "flex",
    gap: "4px",
    background: "#ddd5c4",
    borderRadius: "14px",
    padding: "4px",
    marginBottom: "28px",
  },
  tab: (active) => ({
    flex: 1,
    padding: "10px 8px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontFamily: "'Outfit', sans-serif",
    fontWeight: "500",
    fontSize: "0.82rem",
    background: active ? "#fffdf8" : "transparent",
    color: active ? "#1a1a1a" : "#888",
    boxShadow: active ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
    transition: "all 0.15s",
  }),
  badge: (color, bg, border) => ({
    display: "inline-block",
    background: bg,
    border: `1px solid ${border}`,
    borderRadius: "20px",
    padding: "4px 12px",
    fontSize: "0.7rem",
    color: color,
    fontWeight: "500",
    marginBottom: "10px",
  }),
  title: {
    fontSize: "1.5rem",
    fontWeight: "700",
    margin: "0 0 6px",
    color: "#1a1a1a",
    letterSpacing: "-0.01em",
  },
  subtitle: {
    fontSize: "0.88rem",
    color: "#888",
    margin: "0 0 24px",
    lineHeight: 1.6,
  },
  card: {
    background: "#fffdf8",
    border: "1px solid #ddd5c4",
    borderRadius: "14px",
    padding: "20px",
    marginBottom: "14px",
    display: "flex",
    gap: "16px",
    alignItems: "flex-start",
  },
  num: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    background: "#ede5d8",
    border: "1px solid #d4c4a8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.8rem",
    fontWeight: "600",
    color: "#888",
    flexShrink: 0,
  },
  cardTitle: {
    fontSize: "0.95rem",
    fontWeight: "600",
    margin: "0 0 6px",
    color: "#1a1a1a",
  },
  cardBody: {
    fontSize: "0.82rem",
    color: "#666",
    margin: "0 0 10px",
    lineHeight: 1.65,
  },
  tip: {
    background: "#f7f0e6",
    borderRadius: "8px",
    padding: "8px 12px",
    fontSize: "0.75rem",
    color: "#a07840",
    lineHeight: 1.5,
  },
  dots: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "12px",
  },
  dot: (bg) => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
  }),
  dotCircle: (bg) => ({
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: bg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.75rem",
    fontWeight: "700",
    color: "#fff",
    flexShrink: 0,
  }),
  dotLabel: {
    fontSize: "0.8rem",
    color: "#666",
  },
  footer: {
    marginTop: "32px",
    paddingTop: "20px",
    borderTop: "1px solid #ddd5c4",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: "0.72rem",
    color: "#bbb",
  },
};

function Step({ n, title, body, tip, children }) {
  return (
    <div style={styles.card}>
      <div style={styles.num}>{n}</div>
      <div style={{ flex: 1 }}>
        <p style={styles.cardTitle}>{title}</p>
        <p style={styles.cardBody}>{body}</p>
        {children}
        {tip && <div style={styles.tip}>{tip}</div>}
      </div>
    </div>
  );
}

function Principiante() {
  return (
    <div>
      <span style={styles.badge("#16a34a", "#f0fdf4", "#bbf7d0")}>Nivel 1 · Principiante</span>
      <h1 style={styles.title}>Primeros pasos con MONA</h1>
      <p style={styles.subtitle}>Para guitarristas que recién empiezan a explorar teoría musical. No necesitás saber nada previo.</p>

      <Step n={1} title="Elegí una nota raíz"
        body="La nota raíz es el centro de la escala o acorde. Clickeá cualquier dot en el diapasón y esa nota se convierte en tu raíz. Aparece en el panel superior izquierdo."
        tip="Empezá con C — no tiene sostenidos ni bemoles y es la más fácil de visualizar."/>

      <Step n={2} title="Seleccioná el modo Escalas"
        body="En el panel central elegí Escalas y en el selector elegí Mayor / Jónico. El diapasón va a iluminar todas las notas de esa escala en el mástil."
        tip="Podés clickear cualquier dot iluminado para escuchar esa nota si tenés el sonido activado."/>

      <Step n={3} title="Leé los dots del diapasón"
        body="Cada círculo muestra qué intervalo es esa nota dentro de la escala:">
        <div style={styles.dots}>
          {[["R","#e74c3c","Raíz — la nota principal, punto de partida"],
            ["3","#3498db","Tercera — le da color mayor o menor al sonido"],
            ["5","#27ae60","Quinta — da estabilidad y cuerpo al acorde"]].map(([label, bg, desc]) => (
            <div key={label} style={styles.dot()}>
              <div style={styles.dotCircle(bg)}>{label}</div>
              <span style={styles.dotLabel}>{desc}</span>
            </div>
          ))}
        </div>
      </Step>

      <Step n={4} title="Usá el metrónomo para practicar"
        body="En el panel superior derecho encontrás el metrónomo. Empezá con 60 BPM y subí el tempo cuando te sientas cómodo con las posiciones en el mástil."
        tip="Al activar el metrónomo, el sonido de las notas se apaga automáticamente para que no compitan."/>

      <Step n={5} title="Silenciá cuerdas que no usás"
        body="Al lado de cada cuerda hay un botón ✕. Clickealo para silenciarla y simplificar la vista. Clickeá el + para volver a activarla."
        tip="Útil si estás aprendiendo a tocar solo con las cuerdas agudas (1ª, 2ª, 3ª)."/>
    </div>
  );
}

function Intermedio() {
  return (
    <div>
      <span style={styles.badge("#1d6fa5", "#e6f1fb", "#b5d4f4")}>Nivel 2 · Intermedio</span>
      <h1 style={styles.title}>Escalas, acordes y sistema CAGED</h1>
      <p style={styles.subtitle}>Para guitarristas que ya conocen algunos acordes y quieren entender la teoría detrás de lo que tocan.</p>

      <Step n={1} title="Los tres modos de MONA"
        body="Escalas muestra todas las notas de una escala en el mástil. Acordes muestra la distribución de un acorde específico. Armonía muestra los 7 acordes que pertenecen naturalmente a una tonalidad."
        tip="Podés cambiar entre modos sin perder la raíz que tenés seleccionada."/>

      <Step n={2} title="Filtrá intervalos para estudiar"
        body="En el panel Display podés ocultar o mostrar intervalos individuales. Por ejemplo, dejá solo R + 3 + 5 para ver únicamente las notas del acorde dentro de la escala."
        tip="Muy útil para enfocarte en las notas más importantes al improvisar sobre un acorde."/>

      <Step n={3} title="Sistema CAGED mejorado"
        body="El sistema CAGED divide el mástil en 5 formas de acorde (C, A, G, E, D). Activalo solo en escalas Mayor o Menor. Al activarlo muestra la forma C por defecto — las notas del acorde (R, 3, 5) se resaltan con el color de la forma. Clickeá C, A, G, E o D para navegar entre posiciones."
        tip="Solo disponible en Mayor (Jónico) y Menor (Eólico). Las notas del acorde aparecen en el color de la forma activa."/>

      <Step n={4} title="Classic vs Wizard"
        body="Classic muestra solo la raíz en rojo y el resto en negro — ideal para enfocarse en la posición. Wizard le asigna un color único a cada intervalo para entender la estructura de la escala visualmente."
        tip="Cambiá entre los dos desde el header de la app, en la parte superior."/>

      <Step n={5} title="Escalas y Display en el diapasón"
        body="El marco Display muestra los intervalos de la escala activa como chips. Podés ocultar intervalos individuales clickeando cada chip para enfocarte en los más importantes. El toggle Intervalos/Notas (arriba del diapasón) cambia lo que muestran los dots en el mástil."
        tip="Dejá solo R + 3 + 5 para ver las notas del acorde dentro de la escala. El chip Root/8va siempre está visible como referencia."/>
    </div>
  );
}

function Avanzado() {
  return (
    <div>
      <span style={styles.badge("#a07840", "#faeeda", "#f7c175")}>Nivel 3 · Avanzado</span>
      <h1 style={styles.title}>Modos griegos, 3NPS y armonía aplicada</h1>
      <p style={styles.subtitle}>Para guitarristas que quieren dominar el mástil completo y entender la música desde la teoría.</p>

      <Step n={1} title="Qué son los modos griegos"
        body="Una escala Mayor tiene 7 notas y 7 modos — uno por cada grado. Si tocás C Mayor empezando desde D estás en Dórico. Desde E, en Frigio. Cada modo tiene su propio carácter sonoro aunque use exactamente las mismas notas."
        tip="Los podés explorar directamente en el selector de escalas de MONA — están listados como Dorian, Phrygian, Lydian, etc."/>

      <Step n={2} title="Los 7 patrones de 3NPS"
        body="3 Notas Por Cuerda (3NPS) organiza la escala en 7 patrones posicionales, uno por cada grado. Cada patrón tiene exactamente 3 notas por cuerda, lo que permite velocidad y consistencia técnica. Activalo con el botón 3NPS en el panel Modo cuando estés en Escalas."
        tip="Usá el botón ▶ para activar el auto-avance — sincronizado con el metrónomo, cambia de patrón cada 17 tiempos para que practiques cada posición."/>

      <Step n={3} title="Patrón 3-1-3 — estilo jazz"
        body="El patrón 3-1-3 organiza la escala en grupos de 3 notas en la cuerda grave, 1 nota pivot (la 5ta, resaltada en dorado) en la cuerda del medio, y 3 notas en la cuerda aguda. Elegís desde qué cuerda empezar y MONA muestra el patrón completo hasta la cuerda 1."
        tip="El auto-avance cambia de posición cada 13 tiempos del metrónomo. Hay 4 patrones duplicados — es una propiedad de la escala Mayor, no un error."/>

      <Step n={4} title="Conectar los 7 patrones de 3NPS"
        body="Cada patrón 3NPS se superpone con el siguiente. Los últimos 2 trastes de un patrón son los primeros 2 del siguiente. Dominar estas transiciones es lo que te permite cubrir todo el mástil sin saltos ni lagunas."
        tip="Practicá C Mayor: patrón 1 completo, luego la transición 1→2, luego 2→3, y así hasta el 7."/>

      <Step n={4} title="Funciones armónicas y tensión"
        body="En el modo Armonía cada grado tiene una función: Tónica (estabilidad), Subdominante (movimiento) o Dominante (tensión). La progresión I → IV → V → I usa las tres funciones en secuencia. MONA te muestra la función de cada grado con su color."
        tip="El V grado siempre genera tensión que resuelve naturalmente al I. Eso es la base de toda la música occidental."/>

      <Step n={5} title="Improvisar sobre acordes"
        body="Usá el modo Armonía para identificar qué acorde estás parado. Clickeá ese grado — el diapasón te muestra las notas del acorde. Esas son las notas más seguras para improvisar. Las otras notas de la escala funcionan como tensiones que resuelven a esas notas del acorde."
        tip="Combiná con 3NPS para ver qué patrones están disponibles en esa zona del mástil."/>

      <Step n={7} title="Enarmónicos en MONA"
        body="MONA simplifica la nomenclatura para que sea más fácil de leer en el diapasón. En vez de mostrar nombres teóricos como E# o B#, usamos siempre el nombre más conocido: F en lugar de E#, C en lugar de B#. Por ejemplo, para C# menor los dots muestran A# + C# + F — no A# + C# + E#. Más fácil de ubicar, más fácil de aprender.">
        <div style={{ background:"#f7ede0", borderRadius:"10px", padding:"12px 16px", margin:"10px 0", fontSize:"0.78rem", color:"#555", lineHeight:1.7 }}>
          <strong style={{ color:"#1a1a1a" }}>Equivalencias más comunes:</strong>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4px", marginTop:"8px" }}>
            {[["E# → F","B# → C"],["Cb → B","Fb → E"],["C# = Db","F# = Gb"],["A# = Bb","D# = Eb"]].map(([a,b],i) => (
              <div key={i} style={{ display:"flex", gap:"12px" }}>
                <span style={{ color:"#9a4a2a", fontWeight:"600" }}>{a}</span>
                <span style={{ color:"#9a4a2a", fontWeight:"600" }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ fontSize:"0.72rem", color:"#888", fontStyle:"italic", marginTop:"6px" }}>
          En el modo Notas del diapasón siempre aparece el nombre más simple y reconocible.
        </div>
      </Step>
    </div>
  );
}

function Practica() {
  const ejercicios = [
    {
      cat: "Acordes",
      color: "#9a4a2a",
      bg: "#fdf2ee",
      border: "#e8b8a8",
      items: [
        { title:"Triadas mayores y menores", body:"Acordes → Mayor (o Menor). El diapasón muestra R + 3 + 5 en todo el mástil." },
        { title:"Arpeggios", body:"Acordes → elegí el tipo. Desactivá el sonido y recorré los dots uno por uno de grave a agudo." },
        { title:"Acordes con 7ma", body:"Acordes → Dom7, Maj7 o Min7. Aparece la 7ma como intervalo adicional en el diapasón." },
        { title:"Ver un acorde en todas las posiciones", body:"Escalas → Mayor → activá CAGED. Navegá entre C, A, G, E, D para ver el mismo acorde en 5 posiciones distintas." },
      ]
    },
    {
      cat: "Escalas",
      color: "#16a34a",
      bg: "#f0fdf4",
      border: "#bbf7d0",
      items: [
        { title:"Escala mayor en todo el mástil", body:"Escalas → Mayor. Todos los dots encendidos son notas de la escala. Usá el toggle Intervalos/Notas para ver nombres o números." },
        { title:"Pentatónica dentro de la mayor", body:"Escalas → Pent. Mayor. Compará con Mayor — las notas que desaparecen son las que la pentatónica omite." },
        { title:"Escala de blues", body:"Escalas → Blues. El dot b5 es la blue note — la nota característica del sonido blues." },
        { title:"Comparar mayor vs menor", body:"Seleccioná la misma raíz, cambiá entre Mayor y Menor. Los dots b3, b6 y b7 son los que cambian." },
        { title:"Explorar un modo", body:"Escalas → elegí el modo (Dórico, Frigio, etc.). Cada modo tiene su color sonoro por la posición de los bemoles y sostenidos." },
      ]
    },
    {
      cat: "Patrones",
      color: "#7c3aed",
      bg: "#f5f3ff",
      border: "#ddd6fe",
      items: [
        { title:"3NPS posición por posición", body:"Escalas → 3NPS ON. Navegá con ‹ › entre los 7 patrones. Cada uno cubre una zona distinta del mástil." },
        { title:"3NPS con metrónomo", body:"Activá 3NPS + metrónomo + ▶ auto-avance. Cada 17 tiempos cambia de patrón — practicá cada posición al tempo." },
        { title:"Patrón 3-1-3", body:"Escalas → 3-1-3 ON. Elegí desde qué cuerda empezar. El dot dorado es la nota pivot (5ta). Ideal para frases jazzeras." },
        { title:"3-1-3 con metrónomo", body:"Activá 3-1-3 + metrónomo + ▶. Cada 13 tiempos cambia de posición automáticamente." },
      ]
    },
    {
      cat: "Armonía",
      color: "#3b82f6",
      bg: "#eff6ff",
      border: "#bfdbfe",
      items: [
        { title:"Ver los 7 acordes de una tonalidad", body:"Armonía → elegí Mayor o Menor. Los 7 grados (I al VII) muestran qué acorde corresponde a cada nota de la escala." },
        { title:"Qué notas suenan bien sobre un acorde", body:"Armonía → clickeá el grado. El diapasón muestra las notas de ese acorde — son las más seguras para improvisar encima." },
        { title:"Entender funciones armónicas", body:"En Armonía cada grado tiene color: azul = Tónica, verde = Subdominante, naranja = Dominante. La progresión I→IV→V→I usa las tres." },
        { title:"Intercambio modal", body:"Armonía → Mayor. Clickeá el grado ii — el modo es Dórico. Ahora cambiá a Escalas → Dórico con esa raíz para ver el mismo modo en todo el mástil." },
        { title:"6tas y tensiones", body:"Escalas → Mayor. En Display desactivá todo excepto R y 6. Ves las 6tas de la escala. Activá 7 para agregar las séptimas." },
      ]
    },
  ];

  return (
    <div>
      <span style={styles.badge("#a07840", "#faeeda", "#f7c175")}>Práctica con MONA</span>
      <h1 style={styles.title}>Ejercicios prácticos</h1>
      <p style={styles.subtitle}>Casos concretos y cómo resolverlos en MONA. Directo al punto.</p>

      {ejercicios.map((cat, ci) => (
        <div key={ci} style={{ marginBottom:"28px" }}>
          <div style={{ display:"inline-block", padding:"4px 14px", borderRadius:"20px", background:cat.bg, border:`1px solid ${cat.border}`, color:cat.color, fontSize:"0.75rem", fontWeight:"700", marginBottom:"14px", letterSpacing:"0.08em" }}>{cat.cat.toUpperCase()}</div>
          <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
            {cat.items.map((item, ii) => (
              <div key={ii} style={{ background:"#fffdf8", borderRadius:"12px", border:"1px solid #ede5d8", padding:"14px 16px", borderLeft:`3px solid ${cat.color}` }}>
                <div style={{ fontSize:"0.85rem", fontWeight:"600", color:"#1a1a1a", marginBottom:"4px" }}>{item.title}</div>
                <div style={{ fontSize:"0.78rem", color:"#666", lineHeight:1.6 }}>{item.body}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Docs() {
  const [level, setLevel] = useState(0);
  const levels = ["Principiante", "Intermedio", "Avanzado", "Práctica"];
  const content = [<Principiante />, <Intermedio />, <Avanzado />, <Practica />];

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <svg style={styles.logo} width="260" height="110" viewBox="0 0 260 110" fill="none">
          {/* Púa — borde exterior sutil */}
          <path d="M62,6 C86,6 104,20 104,40 C104,68 62,98 62,98 C62,98 20,68 20,40 C20,20 38,6 62,6Z"
            fill="none" stroke={GOLD} strokeWidth="1.5" opacity="0.35"/>
          {/* Púa principal */}
          <path d="M62,12 C83,12 98,24 98,42 C98,68 62,94 62,94 C62,94 26,68 26,42 C26,24 41,12 62,12Z"
            fill="#fdf8f2" stroke={GOLD} strokeWidth="3"/>
          {/* Onda dorada fina */}
          <path d="M38,46 Q46,34 54,46 Q62,58 70,46 Q78,34 86,46"
            fill="none" stroke={GOLD} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.55"/>
          {/* Onda terracota principal */}
          <path d="M38,58 Q46,44 54,58 Q62,72 70,58 Q78,44 86,58"
            fill="none" stroke="#9a4a2a" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
          {/* MONA a la derecha */}
          <text x="112" y="62" fontFamily="'Outfit',sans-serif" fontSize="44" fontWeight="900" fill="#1a1a1a" letterSpacing="-1">MONA</text>
          {/* VISUALIZÁ LA MÚSICA debajo de MONA */}
          <text x="113" y="76" fontFamily="'Outfit',sans-serif" fontSize="8" fill="#aaa" letterSpacing="3">VISUALIZÁ LA MÚSICA</text>
        </svg>
        <p style={styles.tagline}>GUÍA DE USO</p>
        <Link to="/" style={styles.backLink}>← Volver a MONA</Link>
      </div>

      <div style={styles.container}>
        {/* Tabs */}
        <div style={styles.tabs}>
          {levels.map((l, i) => (
            <button key={i} onClick={() => setLevel(i)} style={styles.tab(level === i)}>{l}</button>
          ))}
        </div>

        {/* Content */}
        {content[level]}

        {/* Footer */}
        <div style={styles.footer}>
          <Link to="/" style={{ fontSize:"0.78rem", color:"#888", textDecoration:"none" }}>← Volver a MONA</Link>
          <span style={styles.footerText}>MONA · Visualizá la música</span>
        </div>
      </div>
    </div>
  );
}

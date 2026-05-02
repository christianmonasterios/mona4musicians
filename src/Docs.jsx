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

      <Step n={3} title="Sistema CAGED"
        body="El sistema CAGED divide el mástil en 5 formas de acorde que cubren todo el diapasón. Activalo con el botón CAGED en el panel Modo. Cada forma se colorea distinto para identificarla fácilmente."
        tip="Pasá el cursor sobre cada forma (C, A, G, E, D) para resaltarla en el diapasón."/>

      <Step n={4} title="Classic vs Wizard"
        body="Classic muestra solo la raíz en rojo y el resto en negro — ideal para enfocarse en la posición. Wizard le asigna un color único a cada intervalo para entender la estructura de la escala visualmente."
        tip="Cambiá entre los dos desde el header de la app, en la parte superior."/>

      <Step n={5} title="Escala Armonizada"
        body="En el modo Armonía ves los 7 acordes que pertenecen a una tonalidad. Clickeá cada grado (I, ii, iii...) para ver ese acorde en el diapasón y conocer su función armónica: Tónica, Subdominante o Dominante."
        tip="Disponible para Mayor, Menor, Menor Armónica y Dórico. Podés ver tríadas o acordes con 7ma."/>
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
        tip="Navegá entre los 7 patrones con las flechas ‹ › o clickeando los botones numerados del 1 al 7."/>

      <Step n={3} title="Conectar los 7 patrones"
        body="Cada patrón 3NPS se superpone con el siguiente. Los últimos 2 trastes de un patrón son los primeros 2 del siguiente. Dominar estas transiciones es lo que te permite cubrir todo el mástil sin saltos ni lagunas."
        tip="Practicá C Mayor: patrón 1 completo, luego la transición 1→2, luego 2→3, y así hasta el 7."/>

      <Step n={4} title="Funciones armónicas y tensión"
        body="En el modo Armonía cada grado tiene una función: Tónica (estabilidad), Subdominante (movimiento) o Dominante (tensión). La progresión I → IV → V → I usa las tres funciones en secuencia. MONA te muestra la función de cada grado con su color."
        tip="El V grado siempre genera tensión que resuelve naturalmente al I. Eso es la base de toda la música occidental."/>

      <Step n={5} title="Improvisar sobre acordes"
        body="Usá el modo Armonía para identificar qué acorde estás parado. Clickeá ese grado — el diapasón te muestra las notas del acorde. Esas son las notas más seguras para improvisar. Las otras notas de la escala funcionan como tensiones que resuelven a esas notas del acorde."
        tip="Combiná con 3NPS para ver qué patrones están disponibles en esa zona del mástil."/>
    </div>
  );
}

export default function Docs() {
  const [level, setLevel] = useState(0);
  const levels = ["Principiante", "Intermedio", "Avanzado"];
  const content = [<Principiante />, <Intermedio />, <Avanzado />];

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <svg style={styles.logo} width="280" height="66" viewBox="0 0 280 66" fill="none">
          <path d="M-10 38 Q12 10 34 38 Q56 66 78 38 Q100 10 122 38 Q144 66 166 38 Q188 10 210 38 Q232 66 254 38 Q270 26 290 32"
            stroke={GOLD} strokeWidth="1.8" strokeLinecap="round" opacity="0.3"/>
          <g transform="translate(10,6)">
            <path d="M0 48 L10 5 Q20 37 30 5 L40 48" stroke="#1a1a1a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <circle cx="20" cy="23" r="4" fill={GOLD}/>
          </g>
          <g transform="translate(62,10)">
            <circle cx="20" cy="22" r="20" fill="none" stroke="#1a1a1a" strokeWidth="1.3" opacity="0.2"/>
            <circle cx="20" cy="2"  r="2.5" fill="#1a1a1a"/>
            <circle cx="34" cy="9"  r="2.5" fill="#1a1a1a" opacity="0.55"/>
            <circle cx="40" cy="22" r="2.5" fill="#1a1a1a" opacity="0.45"/>
            <circle cx="34" cy="35" r="2.5" fill="#1a1a1a" opacity="0.55"/>
            <circle cx="20" cy="42" r="2.5" fill="#1a1a1a" opacity="0.45"/>
            <circle cx="6"  cy="35" r="2.5" fill="#1a1a1a" opacity="0.55"/>
            <circle cx="0"  cy="22" r="2.5" fill="#1a1a1a" opacity="0.45"/>
            <circle cx="20" cy="22" r="3.5" fill={GOLD}/>
            <line x1="20" y1="18" x2="20" y2="5" stroke="#1a1a1a" strokeWidth="1" opacity="0.3"/>
          </g>
          <g transform="translate(118,8)">
            <line x1="0"  y1="0" x2="0"  y2="46" stroke="#1a1a1a" strokeWidth="4" strokeLinecap="round"/>
            <line x1="30" y1="0" x2="30" y2="46" stroke="#1a1a1a" strokeWidth="4" strokeLinecap="round"/>
            <line x1="0"  y1="3" x2="30" y2="43" stroke="#555"    strokeWidth="1.8" strokeLinecap="round"/>
            <line x1="8"  y1="0" x2="8"  y2="46" stroke="#b8a88a" strokeWidth="0.8" opacity="0.5"/>
            <line x1="21" y1="0" x2="21" y2="46" stroke="#b8a88a" strokeWidth="0.8" opacity="0.5"/>
            <circle cx="9"  cy="12" r="3" fill="#1a1a1a"/>
            <circle cx="21" cy="29" r="3" fill={GOLD}/>
          </g>
          <g transform="translate(164,8)">
            <line x1="21" y1="0"  x2="0"  y2="50" stroke="#1a1a1a" strokeWidth="1.3" strokeLinecap="round" opacity="0.3"/>
            <line x1="21" y1="0"  x2="42" y2="50" stroke="#1a1a1a" strokeWidth="1.3" strokeLinecap="round" opacity="0.3"/>
            <line x1="9"  y1="33" x2="33" y2="33" stroke="#1a1a1a" strokeWidth="1.3" strokeLinecap="round" opacity="0.3"/>
            <path d="M4 40 A20 20 0 0 1 40 40" stroke="#1a1a1a" strokeWidth="3.8" strokeLinecap="round" fill="none"/>
            <line x1="4"  y1="40" x2="8"  y2="31" stroke="#888" strokeWidth="1.2" strokeLinecap="round"/>
            <line x1="22" y1="20" x2="22" y2="26" stroke="#888" strokeWidth="1.2" strokeLinecap="round"/>
            <line x1="40" y1="40" x2="36" y2="31" stroke="#888" strokeWidth="1.2" strokeLinecap="round"/>
            <line x1="22" y1="40" x2="32" y2="22" stroke={GOLD} strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="22" cy="40" r="4" fill={GOLD}/>
          </g>
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

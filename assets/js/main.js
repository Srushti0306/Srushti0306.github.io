// Minimal JS: mobile nav, theme toggle, demo form, current year
(function () {
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const themeToggle = document.getElementById('themeToggle');
  const yearEl = document.getElementById('year');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Persisted theme
  const saved = localStorage.getItem('theme');
  if (saved === 'light') { document.documentElement.classList.add('light'); }
  if (!saved && !prefersDark) { document.documentElement.classList.add('light'); }

  navToggle?.addEventListener('click', () => nav.classList.toggle('open'));
  themeToggle?.addEventListener('click', () => {
    document.documentElement.classList.toggle('light');
    localStorage.setItem('theme', document.documentElement.classList.contains('light') ? 'light' : 'dark');
  });

  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

  // Demo contact form
  const btn = document.getElementById('sendBtn');
  btn?.addEventListener('click', () => {
    const name = (document.getElementById('name') || {}).value || '';
    const email = (document.getElementById('email') || {}).value || '';
    const msg = (document.getElementById('message') || {}).value || '';
    if (!name || !email || !msg) { alert('Please complete all fields.'); return; }
  });
})();

// ==== Chat panel logic (front-end resume Q&A) ====
document.addEventListener('DOMContentLoaded', () => {
  const RESUME = {
    name: "Srushti Kashid",
    tagline: "MS in Computer Science • Software Engineer",
    location: "Sacramento, USA",
    email: "srushti0306@gmail.com",
    phone: "(279) 222-0266",
    projects: [
      { title: "Image Forgery Detection", tech: "Python, AI/ML, CNN", desc: "Detected image manipulations with a CNN trained on CASIA; high precision/accuracy." },
      { title: "ChatBot", tech: "Python, LangChain", desc: "Conversational app with per-user session memory (RunnableWithMessageHistory)." },
      { title: "AskYouTubeBot", tech: "RAG, LangChain, FAISS", desc: "Chrome extension to query YouTube transcripts with RAG." }
    ],
    experience: [
      {
        role: "Software Engineering Intern", company: "Silicon Stack", dates: "Jul 2024 – Apr 2025",
        bullets: [
          "Hyundai General Service Portal; UX and API enhancements.",
          "Node.js/NestJS/Express APIs; Prisma/Sequelize optimizations.",
          "Responsive portal with efficient data operations."
        ]
      },
      {
        role: "Project Intern", company: "Creosis Technologies", dates: "Jun 2023 – Apr 2024",
        bullets: [
          "Remote monitoring for hydraulic clamping machines.",
          "Predictive maintenance with ML; real-time insights.",
          "Stack: Python, Flask, React.js."
        ]
      },
    ],
    skills: {
      programming: ["Python", "JavaScript", "C++", "(familiar) C, Java"],
      web: ["HTML", "CSS", "React", "Node.js", "NestJS", "Express", "Flask", "LangChain", "LangSmith"],
      databases: ["Postgres", "MySQL", "MongoDB", "MS SQL", "Pinecone", "FAISS"],
      certifications: [
        "AWS Academy Cloud Foundation",
        "AWS Academy Cloud Architecting",
        "Cisco — Intro to Cybersecurity",
        "AI with Python (Great Learning)"
      ]
    },
    education: [
      { school: "California State University, Sacramento", degree: "M.S. Computer Science", years: "2025–present" },
      { school: "Marathwada Mitra Mandal’s College of Engineering", degree: "B.E. CSE (CGPA 9.04/10)", years: "2020–2024" }
    ]
  };

  const panel = document.getElementById("chatPanel");
  const openBtn = document.getElementById("chatOpen");
  const closeBtn = document.getElementById("chatClose");
  const form = document.getElementById("chatForm");
  const input = document.getElementById("chatInput");
  const stream = document.getElementById("chatMessages");

  function addMsg(txt, who = "ai") {
    const b = document.createElement("div");
    b.className = `msg ${who}`;
    b.textContent = txt;
    stream.appendChild(b);
    stream.scrollTop = stream.scrollHeight;
  }
  const addAI = (t) => addMsg(t, "ai");
  const addUser = (t) => addMsg(t, "user");

  function openChat() {
    panel.classList.add("open");
    panel.setAttribute("aria-hidden", "false");
    if (!stream.dataset.boot) {
      addAI("Hi! Ask me about Srushti’s projects, skills, experience, education, or contact.");
      stream.dataset.boot = "1";
    }
    input?.focus();
  }
  function closeChat() {
    panel.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
  }
  openBtn?.addEventListener("click", (e) => { e.preventDefault(); openChat(); });
  closeBtn?.addEventListener("click", closeChat);

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = (input.value || "").trim();
    if (!q) return;
    addUser(q);
    input.value = "";
    addAI(route(q));
  });

  function route(q) {
    const s = q.toLowerCase();

    if (/\b(project|projects|work)\b/.test(s)) {
      return RESUME.projects.map(p => `• ${p.title} — ${p.tech}. ${p.desc}`).join("\n");
    }
    if (s.includes("experience") || s.includes("intern") || s.includes("worked")) {
      return RESUME.experience.map(x => `• ${x.role} @ ${x.company} (${x.dates}) — ${x.bullets[0]}`).join("\\n");
    }
    if (s.includes("skill") || s.includes("stack") || s.includes("tech")) {
      const k = RESUME.skills;
      return [
        `Programming: ${k.programming.join(", ")}`,
        `Web/Frameworks: ${k.web.join(", ")}`,
        `Databases: ${k.databases.join(", ")}`,
        `Certifications: ${k.certifications.join(", ")}`
      ].join("\n");
    }
    if (s.includes("education") || s.includes("school") || s.includes("degree")) {
      return RESUME.education.map(e => `• ${e.school} — ${e.degree} (${e.years})`).join("\n");
    }
    if (s.includes("contact") || s.includes("email") || s.includes("phone") || s.includes("linkedin") || s.includes("github")) {
      return `Email: ${RESUME.email}\nPhone: ${RESUME.phone}\nLocation: ${RESUME.location}`;
    }
    if (s.includes("about") || s.includes("summary")) {
      return `${RESUME.name} — ${RESUME.tagline}. Experience across APIs (Node/Nest/Express), data (Prisma/Sequelize, SQL/NoSQL) and AI/ML (Python, CNNs, RAG with LangChain).`;
    }
    return "I can answer about projects, experience, skills, education, or contact. Try: “show projects”.";
  }
  // ==== Curiosity Board logic ====
  const curiosities = [
    { q: "Why do machine learning models forget old data?", a: "Because they optimize for recent gradients — continual learning acts as memory for AIs." },
    { q: "Why does everyone love Python for AI?", a: "It’s not the fastest — just the friendliest. The ecosystem makes it the universal ML language." },
    { q: "Can APIs feel emotional?", a: "They can’t feel, but they can communicate empathy through tone and design." },
    { q: "What’s the difference between intelligence and understanding?", a: "Intelligence solves problems; understanding explains *why* they work." },
    { q: "Can small data ever beat big data?", a: "Yes — with better features, domain insight, and smarter sampling. Quality still beats quantity." },
    { q: "What’s the most human thing in machine learning?", a: "Error. Both humans and models learn best by getting things wrong." }
  ];

  const curiosityBox = document.getElementById("curiosityBox");
  if (curiosityBox) {
    let i = 0;
    function showCuriosity() {
      curiosityBox.classList.add("fade");
      setTimeout(() => {
        const c = curiosities[i];
        curiosityBox.innerHTML = `
          <p class="question">❓ ${c.q}</p>
          <p class="answer">💭 ${c.a}</p>
        `;
        curiosityBox.classList.remove("fade");
        i = (i + 1) % curiosities.length;
      }, 500);
    }
    setInterval(showCuriosity, 7000);
  }


  const track = document.getElementById('projTrack');
  const left = document.getElementById('projScrollLeft');
  const right = document.getElementById('projScrollRight');
  if(!track || !left || !right) return;
  const step = 440; // width + gap
  left.addEventListener('click', ()=> track.scrollBy({left:-step, behavior:'smooth'}));
  right.addEventListener('click',()=> track.scrollBy({left: step, behavior:'smooth'}));

})();

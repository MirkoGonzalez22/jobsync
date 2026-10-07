const { PrismaClient } = require("/app/node_modules/@prisma/client");

const prisma = new PrismaClient();

const email = process.env.MIRKO_EMAIL || "mirko@local.jobsync";
const password = process.env.MIRKO_PASSWORD;
const passwordHash = process.env.MIRKO_PASSWORD_HASH;

if (!passwordHash && !password) {
  console.error("MIRKO_PASSWORD_HASH or MIRKO_PASSWORD is required");
  process.exit(1);
}

const now = new Date();

const jobStatuses = [
  { label: "Nuevo", value: "new" },
  { label: "Borrador", value: "draft" },
  { label: "Postulado", value: "applied" },
  { label: "Entrevista", value: "interview" },
  { label: "Oferta", value: "offer" },
  { label: "Oferta aceptada", value: "offer-accepted" },
  { label: "Oferta rechazada", value: "offer-declined" },
  { label: "Rechazado", value: "rejected" },
  { label: "Expirado", value: "expired" },
  { label: "Archivado", value: "archived" },
  { label: "Retirado", value: "withdrawn" },
];

const jobSources = [
  { label: "Indeed", value: "indeed" },
  { label: "LinkedIn", value: "linkedin" },
  { label: "Monster", value: "monster" },
  { label: "Glassdoor", value: "glassdoor" },
  { label: "Página de carrera de empresa", value: "careerpage" },
  { label: "Google", value: "google" },
  { label: "ZipRecruiter", value: "ziprecruiter" },
  { label: "Job Street", value: "jobstreet" },
  { label: "Greenhouse", value: "greenhouse" },
  { label: "Lever", value: "lever" },
  { label: "Ashby", value: "ashby" },
  { label: "Get on Board", value: "getonboard" },
  { label: "RemoteOK", value: "remoteok" },
  { label: "Remotive", value: "remotive" },
  { label: "Otra fuente", value: "other" },
];

const contactRoles = [
  { label: "Reclutador", value: "recruiter" },
  { label: "Hiring Manager", value: "hiring manager" },
  { label: "Entrevistador", value: "interviewer" },
  { label: "Referidor", value: "referrer" },
  { label: "Referencia", value: "reference" },
];

const stageTypes = [
  { label: "Nuevo", value: "new", status: "new", sortOrder: 0 },
  { label: "Borrador", value: "draft", status: "draft", sortOrder: 1 },
  { label: "Postulado", value: "applied", status: "applied", sortOrder: 2 },
  { label: "Entrevista", value: "interview", status: "interview", sortOrder: 3 },
  { label: "Primera entrevista / screening", value: "1st screening interview", status: "interview", sortOrder: 4 },
  { label: "Entrevista técnica", value: "2nd technical interview", status: "interview", sortOrder: 5 },
  { label: "Entrevista final", value: "final / onsite interview", status: "interview", sortOrder: 6 },
  { label: "Oferta", value: "offer", status: "offer", sortOrder: 7 },
  { label: "Oferta aceptada", value: "offer accepted", status: "offer-accepted", sortOrder: 8 },
  { label: "Oferta rechazada", value: "offer declined", status: "offer-declined", sortOrder: 9 },
  { label: "Rechazado", value: "rejected", status: "rejected", sortOrder: 10 },
  { label: "Expirado", value: "expired", status: "expired", sortOrder: 11 },
  { label: "Archivado", value: "archived", status: "archived", sortOrder: 12 },
  { label: "Retirado", value: "withdrawn", status: "withdrawn", sortOrder: 13 },
];

const skillGroups = [
  {
    category: "Lenguajes",
    skills: ["TypeScript", "JavaScript", "Python", "SQL", "Java"],
  },
  {
    category: "Backend e integración",
    skills: ["Node.js", "NestJS", "Fastify", "FastAPI", "REST APIs", "WebSockets", "JWT"],
  },
  {
    category: "Frontend",
    skills: ["React", "Vite", "PWA"],
  },
  {
    category: "Bases de datos y persistencia",
    skills: ["PostgreSQL", "PostGIS", "MySQL", "Prisma", "Redis"],
  },
  {
    category: "Infraestructura",
    skills: ["Docker", "Linux", "Nginx", "Git", "GCP", "MinIO/S3"],
  },
  {
    category: "AI Coding Agents & Orchestration",
    skills: ["Codex", "Claude Code", "Antigravity", "MCP", "Multi-Agent Workflows"],
  },
  {
    category: "Computer Vision / Edge AI",
    skills: ["NVIDIA Jetson", "DeepStream", "TensorRT", "YOLO", "GStreamer"],
  },
];

const targetTitles = [
  "Software Engineer",
  "Backend Engineer",
  "Full Stack Engineer",
  "AI Software Engineer",
  "AI Engineer",
  "Technical Support Engineer",
  "Integration Engineer",
  "Application Support Engineer",
  "Node.js Engineer",
  "TypeScript Engineer",
  "React Engineer",
];

const targetKeywords = [
  "TypeScript",
  "Node.js",
  "React",
  "NestJS",
  "Fastify",
  "PostgreSQL",
  "Prisma",
  "Redis",
  "REST APIs",
  "WebSockets",
  "Docker",
  "Computer Vision",
  "IoT",
  "SaaS",
  "LATAM",
  "Remote",
];

function valueOf(label) {
  return label
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9+#./]+/g, " ")
    .trim();
}

function d(value) {
  return new Date(`${value}T00:00:00.000Z`);
}

async function upsertByValue(model, data, createdBy) {
  return prisma[model].upsert({
    where: { value_createdBy: { value: data.value, createdBy } },
    update: { label: data.label },
    create: { ...data, createdBy },
  });
}

async function section(resumeId, sectionTitle, sectionType) {
  const existing = await prisma.resumeSection.findFirst({
    where: { resumeId, sectionType, sectionTitle },
  });
  if (existing) return existing;
  return prisma.resumeSection.create({
    data: { resumeId, sectionTitle, sectionType },
  });
}

async function setSummary(sectionId, content) {
  const current = await prisma.resumeSection.findUnique({ where: { id: sectionId } });
  if (current?.summaryId) {
    await prisma.summary.update({ where: { id: current.summaryId }, data: { content } });
    return;
  }
  const summary = await prisma.summary.create({ data: { content } });
  await prisma.resumeSection.update({
    where: { id: sectionId },
    data: { summaryId: summary.id },
  });
}

async function upsertCompany(label, userId, extra = {}) {
  return prisma.company.upsert({
    where: { value_createdBy: { value: valueOf(label), createdBy: userId } },
    update: { label, ...extra },
    create: { label, value: valueOf(label), createdBy: userId, ...extra },
  });
}

async function upsertTitle(label, userId) {
  return prisma.jobTitle.upsert({
    where: { value_createdBy: { value: valueOf(label), createdBy: userId } },
    update: { label },
    create: { label, value: valueOf(label), createdBy: userId },
  });
}

async function upsertLocation(label, userId, country = "Chile", stateProv = null) {
  return prisma.location.upsert({
    where: { value_createdBy: { value: valueOf(label), createdBy: userId } },
    update: { label, country, stateProv },
    create: { label, value: valueOf(label), country, stateProv, createdBy: userId },
  });
}

async function upsertTag(label, userId) {
  return prisma.tag.upsert({
    where: { value_createdBy: { value: valueOf(label), createdBy: userId } },
    update: { label },
    create: { label, value: valueOf(label), createdBy: userId },
  });
}

async function main() {
  const hashed = passwordHash || password;
  const user = await prisma.user.upsert({
    where: { email },
    update: { name: "Mirko Gonzalez Cartagena", password: hashed },
    create: { name: "Mirko Gonzalez Cartagena", email, password: hashed },
  });

  for (const status of jobStatuses) {
    await prisma.jobStatus.upsert({
      where: { value: status.value },
      update: { label: status.label },
      create: status,
    });
  }

  for (const source of jobSources) await upsertByValue("jobSource", source, user.id);
  for (const role of contactRoles) await upsertByValue("contactRole", role, user.id);

  const statusRows = await prisma.jobStatus.findMany();
  const statusId = new Map(statusRows.map((status) => [status.value, status.id]));
  for (const stage of stageTypes) {
    await prisma.jobStageType.upsert({
      where: { value_createdBy: { value: stage.value, createdBy: user.id } },
      update: { label: stage.label, statusId: statusId.get(stage.status), sortOrder: stage.sortOrder },
      create: {
        label: stage.label,
        value: stage.value,
        statusId: statusId.get(stage.status),
        sortOrder: stage.sortOrder,
        createdBy: user.id,
      },
    });
  }

  await prisma.userSettings.upsert({
    where: { userId: user.id },
    update: { settings: JSON.stringify({ ai: { provider: "ollama" }, display: { theme: "system" } }) },
    create: {
      userId: user.id,
      settings: JSON.stringify({ ai: { provider: "ollama" }, display: { theme: "system" } }),
    },
  });

  let profile = await prisma.profile.findFirst({ where: { userId: user.id } });
  if (!profile) profile = await prisma.profile.create({ data: { userId: user.id } });

  const esFile = await upsertFile("cv-es.pdf", "/data/files/resumes/cv-es.pdf");
  const enFile = await upsertFile("cv-en.pdf", "/data/files/resumes/cv-en.pdf");

  const resumeEs = await upsertResume(profile.id, "CV Mirko - Software Engineer (ES)", esFile.id);
  const resumeEn = await upsertResume(profile.id, "CV Mirko - Software Engineer (EN)", enFile.id);

  await prisma.user.update({ where: { id: user.id }, data: { defaultResumeId: resumeEn.id } });

  await buildResume(resumeEs.id, "es", user.id);
  await buildResume(resumeEn.id, "en", user.id);

  await seedReferenceData(user.id);
  await seedQuestions(user.id);
  await seedCoverLetter(profile.id);
  await seedAutomations(user.id, resumeEn.id);

  console.log(JSON.stringify({ ok: true, email, userId: user.id, defaultResumeId: resumeEn.id }, null, 2));
}

async function upsertFile(fileName, filePath) {
  const existing = await prisma.file.findFirst({ where: { fileName, filePath } });
  if (existing) return existing;
  return prisma.file.create({ data: { fileName, filePath, fileType: "resume" } });
}

async function upsertResume(profileId, title, fileId) {
  const existing = await prisma.resume.findFirst({ where: { profileId, title } });
  if (existing) {
    return prisma.resume.update({ where: { id: existing.id }, data: { FileId: fileId } });
  }
  return prisma.resume.create({ data: { profileId, title, FileId: fileId } });
}

async function buildResume(resumeId, lang, userId) {
  await prisma.contactInfo.upsert({
    where: { resumeId },
    update: {
      firstName: "Mirko",
      lastName: "Gonzalez Cartagena",
      headline: lang === "es" ? "Ingeniero de Software | Full Stack | Backend & Systems Integration" : "Software Engineer | Full Stack | Backend & Systems Integration",
      email: "Mirkogonzalezhd@gmail.com",
      phone: "9 3250 9490",
      address: "Viña del Mar, Chile",
    },
    create: {
      resumeId,
      firstName: "Mirko",
      lastName: "Gonzalez Cartagena",
      headline: lang === "es" ? "Ingeniero de Software | Full Stack | Backend & Systems Integration" : "Software Engineer | Full Stack | Backend & Systems Integration",
      email: "Mirkogonzalezhd@gmail.com",
      phone: "9 3250 9490",
      address: "Viña del Mar, Chile",
    },
  });

  const summarySection = await section(resumeId, lang === "es" ? "Perfil profesional" : "Professional Profile", "summary");
  await setSummary(
    summarySection.id,
    lang === "es"
      ? "Ingeniero de Software con experiencia en desarrollo backend y full stack de plataformas multiempresa, APIs y sistemas en tiempo real. Experiencia en autenticación, control de acceso, integraciones con sistemas externos, gestión de activos, monitoreo vehicular, IoT, Computer Vision y Edge AI para aplicaciones industriales."
      : "Software Engineer with experience in backend and full-stack development of multi-tenant platforms, APIs and real-time systems. Experience with authentication, access control, third-party integrations, asset management, vehicle monitoring, IoT, Computer Vision and Edge AI for industrial applications."
  );

  const expSection = await section(resumeId, lang === "es" ? "Experiencia laboral" : "Work Experience", "experience");
  await prisma.workExperience.deleteMany({ where: { resumeSectionId: expSection.id } });

  const vaitex = await upsertCompany("VAITEX", userId, { industry: "SaaS / Industrial software" });
  const easyFood = await upsertCompany("EasyFoodChile", userId, { industry: "Food services / Systems" });
  const nido = await upsertCompany("Colegio Nido de Águilas", userId, { industry: "Education" });
  const vina = await upsertLocation("Viña del Mar, Chile", userId, "Chile", "Valparaíso");
  const chile = await upsertLocation("Chile", userId, "Chile");

  await prisma.workExperience.createMany({
    data: [
      {
        companyId: vaitex.id,
        jobTitleId: (await upsertTitle(lang === "es" ? "Ingeniero de Software" : "Software Engineer", userId)).id,
        locationId: vina.id,
        startDate: d("2026-01-01"),
        endDate: null,
        resumeSectionId: expSection.id,
        description:
          lang === "es"
            ? "Desarrollo de módulos full stack para AssetTap, CMMS multiempresa para gestión de activos y mantenimiento, usando React, TypeScript, Fastify, Prisma y PostgreSQL. Implementación de PWA con NFC/QR y almacenamiento S3/MinIO. Backend de monitoreo vehicular en tiempo real con NestJS, PostgreSQL/PostGIS, Redis y WebSockets. Integración de ICarVision IVMS mediante APIs REST. Soluciones de Computer Vision y Edge AI sobre NVIDIA Jetson Orin Nano, DeepStream, TensorRT y YOLO."
            : "Developed full-stack modules for AssetTap, a multi-tenant CMMS for asset and maintenance management, using React, TypeScript, Fastify, Prisma and PostgreSQL. Built PWA workflows with NFC/QR and S3/MinIO-compatible storage. Developed real-time vehicle monitoring backend services with NestJS, PostgreSQL/PostGIS, Redis and WebSockets. Integrated ICarVision IVMS through REST APIs. Built Computer Vision and Edge AI solutions on NVIDIA Jetson Orin Nano, DeepStream, TensorRT and YOLO.",
      },
      {
        companyId: nido.id,
        jobTitleId: (await upsertTitle(lang === "es" ? "Programador de Sistemas" : "Systems Developer", userId)).id,
        locationId: chile.id,
        startDate: d("2025-07-01"),
        endDate: d("2025-12-31"),
        resumeSectionId: expSection.id,
        description:
          lang === "es"
            ? "Desarrollo de sistema automatizado de abastecimiento con Python y SQL, usando ventas históricas y lógica de reposición para apoyar compras y reducir trabajo manual."
            : "Developed an automated procurement system with Python and SQL, using historical sales and replenishment logic to support purchasing and reduce manual work.",
      },
      {
        companyId: easyFood.id,
        jobTitleId: (await upsertTitle(lang === "es" ? "Integración de Sistemas" : "Systems Integration", userId)).id,
        locationId: chile.id,
        startDate: d("2025-01-01"),
        endDate: d("2025-06-30"),
        resumeSectionId: expSection.id,
        description:
          lang === "es"
            ? "Construcción de pipelines ETL e integraciones mediante APIs REST con SQL y GCP. Desarrollo de dashboards de KPIs en Power BI para automatizar disponibilidad de información de gestión."
            : "Built ETL pipelines and REST API integrations with SQL and GCP. Developed KPI dashboards in Power BI to automate access to management information.",
      },
      {
        companyId: easyFood.id,
        jobTitleId: (await upsertTitle(lang === "es" ? "Administrador ERP" : "ERP Administrator", userId)).id,
        locationId: chile.id,
        startDate: d("2024-04-01"),
        endDate: d("2024-12-31"),
        resumeSectionId: expSection.id,
        description:
          lang === "es"
            ? "Implementación de ERP Defontana en facturación, compras e inventario. Levantamiento de requerimientos de automatización y resolución de incidencias funcionales."
            : "Implemented Defontana ERP across billing, purchasing and inventory processes. Gathered automation requirements and resolved functional issues.",
      },
    ],
  });

  const eduSection = await section(resumeId, lang === "es" ? "Educación" : "Education", "education");
  await prisma.education.deleteMany({ where: { resumeSectionId: eduSection.id } });
  await prisma.education.create({
    data: {
      institution: "Duoc UC - Viña del Mar",
      degree: lang === "es" ? "Ingeniería en Informática" : "Computer Science Engineering",
      fieldOfStudy: lang === "es" ? "Informática" : "Computer Science",
      startDate: d("2022-01-01"),
      endDate: d("2025-12-31"),
      description: "",
      locationId: vina.id,
      resumeSectionId: eduSection.id,
    },
  });

  const skillsSection = await section(resumeId, lang === "es" ? "Habilidades técnicas" : "Technical Skills", "skills");
  await prisma.skill.deleteMany({ where: { resumeSectionId: skillsSection.id } });
  let order = 0;
  for (const group of skillGroups) {
    for (const skill of group.skills) {
      const tag = await upsertTag(skill, userId);
      await prisma.skill.create({
        data: { resumeSectionId: skillsSection.id, tagId: tag.id, category: group.category, order: order++ },
      });
    }
  }
}

async function seedReferenceData(userId) {
  for (const title of targetTitles) await upsertTitle(title, userId);
  for (const location of ["Remote Chile", "Remote LATAM", "Remote worldwide", "Hybrid Chile", "US Remote - revisar elegibilidad"]) {
    await upsertLocation(location, userId, location.includes("US") ? "United States" : "Chile");
  }
  for (const skill of skillGroups.flatMap((group) => group.skills)) await upsertTag(skill, userId);
  for (const tag of ["Remote LATAM", "Functional English", "US-only restriction", "Junior+", "Mid-Level", "SaaS", "IoT", "Computer Vision"]) {
    await upsertTag(tag, userId);
  }
}

async function seedQuestions(userId) {
  const tagIds = {};
  for (const label of ["TypeScript", "Node.js", "React", "PostgreSQL", "Remote LATAM", "Functional English"]) {
    tagIds[label] = (await upsertTag(label, userId)).id;
  }
  const questions = [
    {
      question: "Tell us about yourself",
      answer: "Soy Software Engineer en Chile con experiencia backend y full stack construyendo plataformas multiempresa, APIs e integraciones. Mi stack principal es TypeScript, Node.js, React, Fastify/NestJS, PostgreSQL, Prisma, Redis y WebSockets. También he trabajado en sistemas en tiempo real, IoT, Computer Vision y Edge AI con NVIDIA Jetson, DeepStream, TensorRT y YOLO.",
      tags: ["TypeScript", "Node.js", "React"],
    },
    {
      question: "Why are you interested in this role?",
      answer: "Me interesa cuando el rol combina desarrollo de producto, backend sólido, APIs, integraciones y trabajo remoto con equipos internacionales o LATAM. Busco aportar desde mi experiencia construyendo sistemas reales y seguir creciendo como Software Engineer.",
      tags: ["Remote LATAM"],
    },
    {
      question: "Relevant experience",
      answer: "En VAITEX desarrollé módulos SaaS con React, TypeScript, Fastify, Prisma y PostgreSQL; servicios backend con NestJS, PostGIS, Redis y WebSockets; e integraciones REST con sistemas externos. También trabajé en Computer Vision y Edge AI para aplicaciones industriales.",
      tags: ["TypeScript", "Node.js", "PostgreSQL"],
    },
    {
      question: "Salary expectations",
      answer: "Para Chile, mi expectativa aproximada está en el rango de CLP 1.500.000 a 1.800.000 líquidos mensuales, dependiendo del alcance del rol, beneficios y modalidad. Para roles internacionales prefiero conversar el rango de la compañía y responsabilidades antes de cerrar una cifra.",
      tags: [],
    },
    {
      question: "Do you have experience with .NET?",
      answer: "No tengo experiencia directa profesional con .NET. Mi experiencia backend principal ha sido con Node.js, NestJS, Fastify, TypeScript, PostgreSQL, Redis y APIs REST. Puedo transferir conceptos de diseño de APIs, autenticación, integración y persistencia, y aprender .NET de forma estructurada si el rol lo requiere.",
      tags: ["Node.js"],
    },
    {
      question: "What is your English level?",
      answer: "Tengo inglés funcional. Puedo leer documentación técnica, trabajar con herramientas y comunicarme en contextos técnicos, pero no lo presentaría como inglés nativo o C1. Para equipos LATAM, Spanish-speaking o roles donde English is a plus, encajo mejor.",
      tags: ["Functional English"],
    },
  ];

  for (const item of questions) {
    let q = await prisma.question.findFirst({ where: { createdBy: userId, question: item.question } });
    const connect = item.tags.map((label) => ({ id: tagIds[label] })).filter((tag) => tag.id);
    if (q) {
      await prisma.question.update({
        where: { id: q.id },
        data: { answer: item.answer, tags: { set: connect } },
      });
    } else {
      q = await prisma.question.create({
        data: {
          createdBy: userId,
          question: item.question,
          answer: item.answer,
          createdVia: "seed-mirko",
          tags: { connect },
        },
      });
    }
  }
}

async function seedCoverLetter(profileId) {
  const title = "Carta base - Software Engineer remoto";
  const content =
    "Hola equipo,\n\nMe interesa esta oportunidad porque conecta con mi experiencia desarrollando sistemas backend y full stack con TypeScript, Node.js, React, Fastify/NestJS, PostgreSQL e integraciones mediante APIs REST. En VAITEX he trabajado en plataformas SaaS, monitoreo vehicular en tiempo real, autenticación, RBAC, WebSockets, telemetría y soluciones de Computer Vision / Edge AI.\n\nMe interesa aportar en equipos remotos donde pueda construir software útil, mantener una comunicación clara y seguir creciendo técnicamente. Si hay una tecnología que no he usado directamente, prefiero decirlo con transparencia y explicar la experiencia equivalente que sí tengo.\n\nSaludos,\nMirko Gonzalez Cartagena";
  const existing = await prisma.coverLetter.findFirst({ where: { profileId, title } });
  if (existing) return prisma.coverLetter.update({ where: { id: existing.id }, data: { content } });
  return prisma.coverLetter.create({ data: { profileId, title, content } });
}

async function seedAutomations(userId, resumeId) {
  const automations = [
    {
      name: "Greenhouse - Developer tools remote",
      jobBoard: "greenhouse",
      scheduleHour: 9,
      config: {
        greenhouse: {
          companies: [
            { name: "GitLab", token: "gitlab" },
            { name: "Vercel", token: "vercel" },
            { name: "Figma", token: "figma" },
            { name: "Grafana Labs", token: "grafanalabs" },
          ],
          targetTitles,
          keywords: targetKeywords,
          locations: ["Remote", "LATAM", "Chile", "Worldwide"],
          strictLocation: false,
          topK: 10,
          saveUnanalyzed: true,
        },
      },
    },
    {
      name: "Ashby - Remote SaaS and infrastructure",
      jobBoard: "ashby",
      scheduleHour: 10,
      config: {
        ashby: {
          companies: [
            { name: "Docker", token: "docker" },
            { name: "Sentry", token: "sentry" },
            { name: "Supabase", token: "supabase" },
            { name: "n8n", token: "n8n" },
            { name: "Linear", token: "linear" },
          ],
          targetTitles,
          keywords: targetKeywords,
          locations: ["Remote", "LATAM", "Chile", "Worldwide"],
          strictLocation: false,
          topK: 10,
          saveUnanalyzed: true,
        },
      },
    },
    {
      name: "Greenhouse - AI and product companies",
      jobBoard: "greenhouse",
      scheduleHour: 11,
      config: {
        greenhouse: {
          companies: [
            { name: "Anthropic", token: "anthropic" },
            { name: "Mercury", token: "mercury" },
            { name: "Stripe", token: "stripe" },
          ],
          targetTitles,
          keywords: targetKeywords,
          locations: ["Remote", "LATAM", "Chile", "Worldwide"],
          strictLocation: false,
          topK: 10,
          saveUnanalyzed: true,
        },
      },
    },
  ];

  for (const automation of automations) {
    const existing = await prisma.automation.findFirst({ where: { userId, name: automation.name } });
    const data = {
      userId,
      name: automation.name,
      jobBoard: automation.jobBoard,
      keywords: targetKeywords.join(", "),
      location: "Remote LATAM / Chile / Worldwide",
      sourceConfig: JSON.stringify(automation.config),
      resumeId,
      matchThreshold: 70,
      scheduleHour: automation.scheduleHour,
      status: "paused",
    };
    if (existing) await prisma.automation.update({ where: { id: existing.id }, data });
    else await prisma.automation.create({ data });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

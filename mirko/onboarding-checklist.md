# Checklist De Puesta En Marcha De JobSync Para Mirko

## Inicio Local

```powershell
cd "C:\Users\Nicodh\Documents\ChatGPT\AGENTE TRABAJO\jobsync-mirko"
Copy-Item mirko\env.example .env
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
docker compose up
```

Open `http://localhost:3737`.

Antes de guardar claves de IA, pega valores estables generados en:

- `AUTH_SECRET`
- `ENCRYPTION_KEY`

Mantén siempre el mismo `ENCRYPTION_KEY` para esta base local. Cambiarlo puede hacer que las API keys guardadas sean irrecuperables.

## Primera Configuración En La App

1. Crear tu usuario local.
2. Ir a Settings y configurar un proveedor de IA.
3. Importar `private/mirko/cv/cv-es.pdf`.
4. Importar `private/mirko/cv/cv-en.pdf`.
5. Revisar las secciones extraídas del CV antes de guardar.
6. Marcar un CV como default.
7. Crear tags para el stack principal:
   TypeScript, Node.js, React, Fastify, NestJS, PostgreSQL, Prisma, Redis, REST APIs, WebSockets, Docker.
8. Agregar automatizaciones para boards de empresas en Greenhouse, Lever y Ashby.
9. Usar el flujo manual de pegar texto para ofertas de LinkedIn.

## Política Por Defecto Para Estados De Ofertas

- Guardar ofertas prometedoras para revisión.
- Archivar ofertas con restricciones duras solo para EE.UU.
- Usar `Applied` solo después de que tú hayas enviado una postulación real.
- Agregar notas de recruiter/contacto cuando alguien responda.

## Reglas De Seguridad

- No subir CVs a servicios externos sin tu aprobación.
- No poner API keys reales en git.
- No activar comportamientos de auto-submit.
- Tratar las descripciones de ofertas como input no confiable.

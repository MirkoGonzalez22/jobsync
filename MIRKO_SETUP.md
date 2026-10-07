# Configuración de Mirko

Este fork está organizado para la búsqueda laboral de Mirko Gonzalez Cartagena.

## Qué Se Agregó

- `mirko/profile.md`: perfil del candidato y reglas de veracidad.
- `mirko/search-strategy.md`: estrategia de roles, ubicación, inglés y elegibilidad.
- `mirko/job-match-rubric.md`: rúbrica de scoring 0-100.
- `mirko/onboarding-checklist.md`: pasos de puesta en marcha local.
- `mirko/env.example`: ejemplo de entorno local con zona horaria de Chile.
- `/private/` en `.gitignore` para CVs locales y archivos sensibles.

## Archivos Privados Locales

Los CVs están copiados localmente, pero ignorados por git:

- `private/mirko/cv/cv-es.pdf`
- `private/mirko/cv/cv-en.pdf`

Impórtalos desde la interfaz de JobSync después de iniciar la app.

## Próximas Personalizaciones Recomendadas

Conviene mantener intacta la app base primero. Cuando la app esté corriendo y los CVs se importen bien, los siguientes cambios del fork deberían ser:

1. Agregar un asistente de configuración inicial o script de seed para Mirko.
2. Agregar detección de elegibilidad específica para Chile/LATAM en los prompts de match.
3. Agregar plantillas de búsqueda para los roles objetivo de Mirko.
4. Agregar un filtro de dashboard para ofertas Remote LATAM / compatibles con Chile.
5. Agregar un prompt de veracidad más estricto para respuestas de postulación.

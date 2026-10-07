# Rúbrica De Match Para Mirko

Usar esta rúbrica cuando se le pida al asistente de IA de JobSync evaluar ofertas pegadas manualmente.

## Pesos

- Match técnico: 35%
- Match de experiencia: 15%
- Match de rol: 15%
- Match de remoto/ubicación: 15%
- Match de inglés: 10%
- Match de industria/proyecto: 5%
- Match salarial: 5%

## Salida Requerida

Para cada oferta, pedir al asistente que devuelva:

- score de match de 0 a 100
- veredicto breve: excelente, fuerte, bueno, posible, bajo
- razones positivas
- habilidades faltantes
- requisitos críticos
- requisito de inglés
- años requeridos
- interpretación de remoto/ubicación
- restricciones de elegibilidad
- salario si está disponible
- CV recomendado: español o inglés
- keywords para la postulación
- riesgos antes de postular

## Aprobación Humana

JobSync puede preparar materiales y guardar ofertas solo después de confirmación. No enviar postulaciones automáticamente.

## Prompt Sugerido

Evalúa esta oferta para Mirko Gonzalez Cartagena usando el perfil de Mirko y el CV importado como fuente de verdad. Usa un score de 0 a 100 con la rúbrica de `mirko/job-match-rubric.md`. Sé honesto con los requisitos faltantes. Presta especial atención a elegibilidad remota desde Chile/LATAM, restricciones solo para EE.UU., nivel de inglés, seniority y años de experiencia. No inventes experiencia. Termina con una recomendación: postular, revisar o archivar.

# Mirko Setup Overlay

This fork is organized for Mirko Gonzalez Cartagena's job search.

## What Changed

- Added `mirko/profile.md` with the candidate profile and truthfulness rules.
- Added `mirko/search-strategy.md` with role, location, English and eligibility guidance.
- Added `mirko/job-match-rubric.md` with the requested 0-100 scoring framework.
- Added `mirko/onboarding-checklist.md` with local setup steps.
- Added `mirko/env.example` with Chile timezone and local defaults.
- Added `/private/` to `.gitignore` for local CVs and sensitive files.

## Private Local Files

CVs are copied locally but ignored by git:

- `private/mirko/cv/cv-es.pdf`
- `private/mirko/cv/cv-en.pdf`

Import them through the JobSync UI after starting the app.

## Recommended Next Customization

Keep the upstream app intact first. Once the app is running and your CV imports cleanly, the next fork changes should be:

1. Add a first-run Mirko setup wizard or seed script.
2. Add Chile/LATAM-specific eligibility detection to job match prompts.
3. Add configured search templates for Mirko's target roles.
4. Add a dashboard filter for Remote LATAM / Chile-compatible roles.
5. Add a stricter "truthfulness" system prompt for application answers.

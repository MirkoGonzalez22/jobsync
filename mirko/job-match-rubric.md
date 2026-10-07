# Mirko Match Rubric

Use this rubric when asking JobSync's AI assistant to evaluate pasted jobs.

## Weights

- Technical match: 35%
- Experience match: 15%
- Role match: 15%
- Remote/location match: 15%
- English match: 10%
- Industry/project match: 5%
- Salary match: 5%

## Required Output

For each job, ask the assistant to return:

- match score from 0 to 100
- short verdict: excellent, strong, good, possible, low
- positive reasons
- missing skills
- critical requirements
- English requirement
- years required
- remote/location interpretation
- eligibility restrictions
- salary if available
- recommended CV: Spanish or English
- application keywords
- risks before applying

## Human Approval

JobSync may draft materials and save jobs only after confirmation. Do not submit applications automatically.

## Suggested Prompt

Evaluate this job for Mirko Gonzalez Cartagena using the Mirko profile and imported CV as source of truth. Use a 0-100 score with the rubric in `mirko/job-match-rubric.md`. Be honest about missing requirements. Pay special attention to Chile/LATAM remote eligibility, US-only restrictions, English level, seniority and years of experience. Do not invent experience. End with an apply/review/archive recommendation.

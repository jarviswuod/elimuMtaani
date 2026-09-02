# Curriculum corpus

**Owner: Member 1.** This directory is the most important thing in the repo. Everything
downstream is grounded in it, and a citation that points at invented data makes the whole
product a lie.

## Enter it by hand. Do not write a PDF parser.

KICD curriculum designs are table-heavy PDFs. Automated table extraction on them will eat
half the day and produce mush you then have to clean anyway. Typing three to six sub-strands
takes well under an hour and gives you a flawless corpus with real page numbers.

In a one-day build, manual data entry is the correct engineering decision.

## One JSON file per subject

`<subject-slug>.json`, shaped exactly like the types in `shared/src/curriculum.ts`:

```json
{
  "document": {
    "id": "kicd-csl-grade10",
    "title": "Grade 10 Community Service Learning Curriculum Design",
    "publisher": "KICD",
    "publishedOn": "2024-01-01"
  },
  "subject": { "id": "...", "code": "...", "name": "...", "pathway": "CORE", "grade": 10 },
  "strands": [
    {
      "id": "...", "code": "2.0", "title": "...", "order": 1, "page": 22,
      "subStrands": [
        {
          "id": "...", "code": "2.1", "title": "...", "order": 1,
          "suggestedLessons": 4, "page": 24,
          "outcomes": [{ "id": "...", "text": "verbatim from the design", "page": 24 }],
          "inquiryQuestions": ["verbatim"],
          "suggestedExperiences": [
            { "id": "...", "text": "verbatim", "assumedResources": ["internet"], "page": 24 }
          ],
          "coreCompetencies": [], "values": [], "pcis": []
        }
      ]
    }
  ]
}
```

## Two rules

1. **`outcomes[].text`, `inquiryQuestions[]` and `suggestedExperiences[].text` are verbatim.**
   Copy them exactly, typos and all. These are the strings the UI shows as *from the design*,
   and they are what makes a lesson plan defensible to a quality assurance officer. Paraphrasing
   one silently turns a citation into a fabrication.
2. **Every node needs a real page number.** If you cannot find the page, the node is not ready.

## `assumedResources`

Your judgement call, and a genuinely valuable one. Read each suggested experience and list
what it quietly assumes the teacher has — `internet`, `laboratory`, `textbook`, `projector`,
`field trip`, `printer`, `smartphone`. Member 2's activity generator uses exactly this field
to work out what needs replacing. An experience with an empty list needs no translation.

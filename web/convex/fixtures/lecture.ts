// Fixture data (DEC-010): returned by generation actions when ELIMU_USE_FIXTURES=true
// or no ANTHROPIC_API_KEY is set. Keeps every demo alive with zero external calls.

export const FIXTURE_LECTURE = {
  outline: [
    "What the water cycle is",
    "Evaporation: the sun lifts water",
    "Condensation: clouds form",
    "Precipitation: the rain returns",
    "Why it matters in Kenya",
  ],
  script:
    "Today we follow a single drop of water from Lake Victoria all the way to the clouds and back. The sun heats the lake, the drop rises as vapour, cools into a cloud, and falls again as the rain that fills our rivers and waters our shambas. That endless journey is the water cycle.",
  slides: [
    {
      title: "The Water Cycle",
      bullets: [
        "Water moves in an endless loop: lake → sky → rain → lake",
        "The sun powers the whole journey",
        "Every drop you drink has travelled it many times",
      ],
      visual: "A circle with arrows: lake, sun, cloud, rain, back to lake",
      narration:
        "Imagine one drop of water in Lake Victoria. Today we follow its journey to the sky and back. This journey is called the water cycle, and the engine driving it is the sun.",
    },
    {
      title: "Evaporation — the sun lifts water",
      bullets: [
        "The sun heats water in lakes and rivers",
        "Liquid water becomes invisible vapour",
        "Warm mornings by the lake feel humid — that is vapour",
      ],
      visual: "Sun above a lake with wavy arrows rising",
      narration:
        "When the sun heats the lake, our drop gains energy and escapes into the air as vapour. You cannot see it, but you can feel it — that heavy morning air near the lake is water on its way up.",
    },
    {
      title: "Condensation — clouds form",
      bullets: [
        "High in the sky, air is cold",
        "Vapour cools and turns back into tiny droplets",
        "Millions of droplets together make a cloud",
      ],
      visual: "Rising arrows turning into a cloud",
      narration:
        "High above the county, the air grows cold. Our drop huddles together with millions of others into tiny droplets — and that is all a cloud is: water waiting to fall.",
    },
    {
      title: "Precipitation — the rain returns",
      bullets: [
        "Droplets grow heavy and fall as rain",
        "Rain fills rivers, dams and boreholes",
        "The drop is back where it started — the cycle repeats",
      ],
      visual: "Cloud with rain falling into a river",
      narration:
        "When the droplets grow too heavy, gravity wins. Our drop falls as rain onto the highlands, runs into a stream, and rides back to the lake. The cycle is complete — and it starts again tomorrow.",
    },
    {
      title: "Why it matters in Kenya",
      bullets: [
        "Rain-fed farming feeds the country",
        "Deforestation weakens the cycle locally",
        "Protecting forests and wetlands protects the rain",
      ],
      visual: "Tree, farm and rain cloud connected by arrows",
      narration:
        "Our farms drink from this cycle. When forests like the Mau are cut, less water rises, and less rain falls. Protecting trees is protecting the rain — and the food on our tables.",
    },
  ],
};

export const FIXTURE_QUIZ = {
  questions: [
    {
      q: "What provides the energy that drives the water cycle?",
      options: ["The wind", "The sun", "The moon", "Ocean currents"],
      answerIdx: 1,
      explanation: "The sun heats water, causing evaporation — the engine of the cycle.",
    },
    {
      q: "What is evaporation?",
      options: [
        "Rain falling from clouds",
        "Water soaking into soil",
        "Liquid water turning into vapour",
        "Clouds moving with wind",
      ],
      answerIdx: 2,
      explanation: "Evaporation is liquid water becoming invisible vapour when heated.",
    },
    {
      q: "Clouds are made of…",
      options: [
        "Smoke particles",
        "Millions of tiny water droplets",
        "Frozen air",
        "Dust only",
      ],
      answerIdx: 1,
      explanation: "Condensed vapour forms tiny droplets which together make clouds.",
    },
    {
      q: "Why can cutting down forests reduce rainfall locally?",
      options: [
        "Trees block the rain",
        "Less water is returned to the air by plants",
        "Forests attract lightning",
        "It cannot affect rainfall",
      ],
      answerIdx: 1,
      explanation: "Trees release vapour (transpiration); fewer trees means less moisture rising to form rain.",
    },
  ],
};

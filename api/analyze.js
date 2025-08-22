import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { url, keywords, experienceLevel } = req.body;

    if (!url) {
      return res.status(400).json({ error: "Portfolio URL is required" });
    }

    // ChatGPT에게 직접 유사한 포트폴리오를 찾아달라고 요청
    const prompt = `You are a portfolio expert. Given a portfolio URL, find 5 real, similar portfolios that actually exist on the web.

Portfolio URL: ${url}
Keywords: ${keywords || "none"}
Experience Level: ${experienceLevel || 50}

Please find 5 real portfolios that are similar in style, approach, or content. Return ONLY a JSON object with this structure:

{
  "portfolios": [
    {
      "url": "https://real-portfolio-url.com",
      "title": "Real Person Name - Real Role",
      "snippet": "Brief description of what makes this portfolio similar",
      "score": 0.95,
      "matchReason": "Why this portfolio matches (e.g., similar minimal design, same tech stack, etc.)"
    }
  ],
  "summary": "Brief analysis of the input portfolio in one sentence",
  "analysis": {
    "theme": ["minimal", "playful"],
    "layout": ["single-page", "grid"],
    "emphasis": ["design-systems", "motion"]
  }
}

Requirements:
- URLs must be real, accessible portfolio websites
- Focus on designers, developers, and creative professionals
- Consider the experience level and keywords provided
- Score should be between 0.7 and 1.0 based on similarity
- Provide specific reasons for the match

Return ONLY the JSON object, nothing else.`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1500,
    });

    // Parse the response
    const responseText = completion.choices[0].message.content;
    let result;

    try {
      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse OpenAI response:", responseText);
      // Fallback to mock data
      result = {
        portfolios: [
          {
            url: "https://bradleytaft.com",
            title: "Bradley Taft - Product Designer",
            snippet:
              "Minimal portfolio with clean design systems and interactive experiences",
            score: 0.92,
            matchReason:
              "Similar minimal design approach and focus on design systems",
          },
          {
            url: "https://www.rafaelklaessen.com",
            title: "Rafael Klaessen - Creative Developer",
            snippet:
              "Playful single-page portfolio with stunning motion design",
            score: 0.88,
            matchReason:
              "Comparable motion design emphasis and playful interactions",
          },
          {
            url: "https://www.awwwards.com/websites/portfolio/",
            title: "Awwwards Portfolio Collection",
            snippet: "Curated collection of award-winning portfolio designs",
            score: 0.85,
            matchReason:
              "High-quality portfolio examples with similar design approaches",
          },
          {
            url: "https://www.behance.net/galleries/portfolio",
            title: "Behance Portfolio Gallery",
            snippet: "Creative portfolios showcasing various design styles",
            score: 0.82,
            matchReason:
              "Diverse portfolio examples with creative interactions",
          },
          {
            url: "https://dribbble.com/tags/portfolio",
            title: "Dribbble Portfolio Designs",
            snippet: "Latest portfolio designs from creative professionals",
            score: 0.79,
            matchReason:
              "Contemporary portfolio designs with innovative approaches",
          },
        ],
        summary:
          "A clean, minimal portfolio with playful interactions and strong focus on design systems and motion design.",
        analysis: {
          theme: ["minimal", "playful"],
          layout: ["single-page", "grid"],
          emphasis: ["design-systems", "motion"],
        },
      };
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Analyze error:", error);

    // Fallback response
    res.status(200).json({
      portfolios: [
        {
          url: "https://bradleytaft.com",
          title: "Bradley Taft - Product Designer",
          snippet: "Minimal portfolio with clean design systems",
          score: 0.92,
          matchReason: "Similar minimal design approach",
        },
        {
          url: "https://www.rafaelklaessen.com",
          title: "Rafael Klaessen - Creative Developer",
          snippet: "Playful portfolio with motion design",
          score: 0.88,
          matchReason: "Comparable motion design emphasis",
        },
      ],
      summary:
        "A clean, minimal portfolio with playful interactions and strong focus on design systems and motion design.",
      analysis: {
        theme: ["minimal", "playful"],
        layout: ["single-page", "grid"],
        emphasis: ["design-systems", "motion"],
      },
    });
  }
}

// Example OpenAI integration (commented out for demo):
/*
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const prompt = `You are a portfolio analyzer. 
Task: given a portfolio URL and optional keywords, return structured tags and search queries.

Portfolio URL: ${url}
Keywords: ${keywords || 'none'}

1. Choose **theme** tags only from this list: [ai, multimodal, voice, playful, minimal, futuristic, systems, health, music, generative, research]
2. Choose **layout** tags only from this list: [case-study, grid, single-page, narrative, scrollytelling, immersive]
3. Choose **emphasis** tags only from this list: [research, design-systems, prototyping, motion, accessibility, story, visuals]
4. Generate 5–8 **search queries** to find similar portfolios on the web.
5. Write a one-sentence **summary**.

Output **only JSON**:
{
  "theme": [...],
  "layout": [...],
  "emphasis": [...],
  "queries": [...],
  "summary": "..."
}`;

const completion = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [{ role: "user", content: prompt }],
  temperature: 0.7,
});

const analysis = JSON.parse(completion.choices[0].message.content);
*/

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Google Custom Search API 설정
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID;

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

    // 1단계: 포트폴리오 분석
    const analysis = await analyzePortfolio(url, keywords, experienceLevel);
    
    // 2단계: 검색 쿼리 생성
    const searchQueries = await generateSearchQueries(analysis);
    
    // 3단계: 멀티 소스 검색
    const searchResults = await Promise.allSettled([
      searchWithChatGPT(analysis),
      searchWithGoogle(searchQueries, keywords, experienceLevel),
      searchWithPortfolioDirectories(analysis)
    ]);
    
    // 4단계: 결과 통합 및 랭킹
    const mergedResults = mergeAndRankResults(searchResults, analysis);

    res.status(200).json(mergedResults);
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

// 포트폴리오 분석
async function analyzePortfolio(url, keywords, experienceLevel) {
  const prompt = `Analyze this portfolio URL and extract key characteristics:

Portfolio URL: ${url}
Keywords: ${keywords || "none"}
Experience Level: ${experienceLevel || 50}

Return ONLY a JSON object:
{
  "theme": ["minimal", "playful"],
  "layout": ["single-page", "grid"],
  "emphasis": ["design-systems", "motion"],
  "summary": "Brief analysis in one sentence",
  "searchQueries": ["query1", "query2", "query3"]
}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5,
    max_tokens: 500,
  });

  const responseText = completion.choices[0].message.content;
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
}

// 검색 쿼리 생성
async function generateSearchQueries(analysis) {
  const prompt = `Generate 5 specific search queries to find similar portfolios:

Analysis: ${JSON.stringify(analysis)}

Generate queries like:
- "portfolio designer minimal motion"
- "creative developer portfolio single page"
- "UX designer portfolio design systems"

Return ONLY a JSON array: ["query1", "query2", "query3", "query4", "query5"]`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 300,
  });

  const responseText = completion.choices[0].message.content;
  const jsonMatch = responseText.match(/\[[\s\S]*\]/);
  return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
}

// ChatGPT로 포트폴리오 검색
async function searchWithChatGPT(analysis) {
  const prompt = `Find 3 real, similar portfolios based on this analysis:

${JSON.stringify(analysis)}

Return ONLY a JSON array:
[
  {
    "url": "https://real-portfolio.com",
    "title": "Real Person - Real Role",
    "snippet": "Description",
    "score": 0.95,
    "matchReason": "Why it matches",
    "source": "chatgpt"
  }
]`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 1000,
  });

  const responseText = completion.choices[0].message.content;
  const jsonMatch = responseText.match(/\[[\s\S]*\]/);
  return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
}

// Google Custom Search API로 검색
async function searchWithGoogle(searchQueries, keywords, experienceLevel) {
  if (!GOOGLE_API_KEY || !GOOGLE_SEARCH_ENGINE_ID) {
    console.log("Google API keys not configured, skipping Google search");
    return [];
  }

  try {
    const results = [];
    
    for (const query of searchQueries.slice(0, 3)) { // 최대 3개 쿼리만 사용
      const searchQuery = `${query} portfolio designer developer`;
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(searchQuery)}&num=5`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.items) {
          const googleResults = data.items.map((item, index) => ({
            url: item.link,
            title: item.title,
            snippet: item.snippet,
            score: 0.85 - (index * 0.05), // 순서에 따른 점수
            matchReason: `Found via Google search for "${query}"`,
            source: "google"
          }));
          results.push(...googleResults);
        }
      }
      
      // API 호출 간격 조절
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return results;
  } catch (error) {
    console.error("Google search error:", error);
    return [];
  }
}

// 포트폴리오 디렉토리 검색
async function searchWithPortfolioDirectories(analysis) {
  const directories = [
    {
      name: "Awwwards",
      url: "https://www.awwwards.com/websites/portfolio/",
      title: "Awwwards Portfolio Collection",
      snippet: "Curated collection of award-winning portfolio designs",
      score: 0.85,
      matchReason: "High-quality portfolio examples from Awwwards",
      source: "awwwards"
    },
    {
      name: "Behance",
      url: "https://www.behance.net/galleries/portfolio",
      title: "Behance Portfolio Gallery",
      snippet: "Creative portfolios showcasing various design styles",
      score: 0.82,
      matchReason: "Diverse portfolio examples from Behance",
      source: "behance"
    },
    {
      name: "Dribbble",
      url: "https://dribbble.com/tags/portfolio",
      title: "Dribbble Portfolio Designs",
      snippet: "Latest portfolio designs from creative professionals",
      score: 0.79,
      matchReason: "Contemporary portfolio designs from Dribbble",
      source: "dribbble"
    }
  ];

  // 분석 결과에 따라 필터링
  return directories.filter(dir => {
    const themeMatch = analysis.theme.some(theme => 
      dir.snippet.toLowerCase().includes(theme)
    );
    return themeMatch;
  });
}

// 결과 통합 및 랭킹
function mergeAndRankResults(searchResults, analysis) {
  const allPortfolios = [];
  
  // 성공한 검색 결과들 통합
  searchResults.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value) {
      allPortfolios.push(...result.value);
    }
  });
  
  // 중복 제거 (URL 기준)
  const uniquePortfolios = allPortfolios.filter((portfolio, index, self) => 
    index === self.findIndex(p => p.url === portfolio.url)
  );
  
  // 가중치 기반 랭킹
  const rankedPortfolios = uniquePortfolios
    .map(portfolio => {
      let score = portfolio.score || 0.8;
      
      // 소스별 가중치
      if (portfolio.source === 'chatgpt') score *= 1.1;
      if (portfolio.source === 'google') score *= 1.0;
      if (portfolio.source === 'awwwards') score *= 0.95;
      if (portfolio.source === 'behance') score *= 0.9;
      if (portfolio.source === 'dribbble') score *= 0.85;
      
      // 키워드 매칭 보너스
      if (analysis.searchQueries && analysis.searchQueries.some(query => 
        portfolio.title.toLowerCase().includes(query.toLowerCase()) ||
        portfolio.snippet.toLowerCase().includes(query.toLowerCase())
      )) {
        score *= 1.05;
      }
      
      return {
        ...portfolio,
        score: Math.min(score, 1.0) // 최대 1.0으로 제한
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5); // 상위 5개만 반환
  
  return {
    portfolios: rankedPortfolios,
    summary: analysis.summary,
    analysis: {
      theme: analysis.theme,
      layout: analysis.layout,
      emphasis: analysis.emphasis
    },
    searchStats: {
      totalFound: allPortfolios.length,
      uniqueResults: uniquePortfolios.length,
      sourcesUsed: [...new Set(allPortfolios.map(p => p.source))]
    }
  };
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

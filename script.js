// DOM Elements
const form = document.getElementById("portfolioForm");
const portfolioUrlInput = document.getElementById("portfolioUrl");
const keywordsInput = document.getElementById("keywords");
const experienceSlider = document.getElementById("experienceLevel");
const experienceLabel = document.getElementById("experienceLabel");
const analyzeBtn = document.getElementById("analyzeBtn");
const btnText = document.getElementById("btnText");
const loadingText = document.getElementById("loadingText");
const resultsSection = document.getElementById("resultsSection");
const analysisSummary = document.getElementById("analysisSummary");
const summaryContent = document.getElementById("summaryContent");
const portfoliosGrid = document.getElementById("portfoliosGrid");
const errorMessage = document.getElementById("errorMessage");
const errorText = document.getElementById("errorText");

// Experience level labels
const experienceLabels = {
  0: "Entry",
  25: "Junior",
  50: "Mid-level",
  75: "Senior",
  100: "Director",
};

// Update experience label when slider changes
experienceSlider.addEventListener("input", (e) => {
  const value = parseInt(e.target.value);
  const label = experienceLabels[Math.round(value / 25) * 25] || "Mid-level";
  experienceLabel.textContent = label;
});

// Form submission handler
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const portfolioUrl = portfolioUrlInput.value.trim();
  const keywords = keywordsInput.value.trim();
  const experienceLevel = parseInt(experienceSlider.value);

  if (!portfolioUrl) {
    showError("Please enter a portfolio URL");
    return;
  }

  // Show loading state
  setLoadingState(true);
  hideError();
  hideResults();

  try {
    // Step 1: Analyze the portfolio
    const analysis = await analyzePortfolio(
      portfolioUrl,
      keywords,
      experienceLevel
    );

    // Step 2: Search for similar portfolios
    const searchResults = await searchSimilarPortfolios(analysis.queries);

    // Step 3: Rank and filter results
    const rankedResults = await rankPortfolios(analysis, searchResults);

    // Display results
    displayResults(analysis, rankedResults);
  } catch (error) {
    console.error("Error:", error);
    showError(error.message || "Something went wrong. Please try again.");
  } finally {
    setLoadingState(false);
  }
});

// API Functions
async function analyzePortfolio(url, keywords, experienceLevel) {
  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        keywords,
        experienceLevel,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to analyze portfolio");
    }

    return await response.json();
  } catch (error) {
    console.error("Analysis error:", error);
    // Fallback to mock data for demo
    return {
      theme: ["minimal", "playful"],
      layout: ["single-page", "grid"],
      emphasis: ["design-systems", "motion"],
      queries: [
        "minimal portfolio design examples",
        "playful single page portfolio",
        "design systems portfolio showcase",
        "motion design portfolio",
        "creative developer portfolio",
      ],
      summary:
        "A clean, minimal portfolio with playful interactions and strong focus on design systems and motion design.",
    };
  }
}

async function searchSimilarPortfolios(queries) {
  try {
    const response = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ queries }),
    });

    if (!response.ok) {
      throw new Error("Failed to search portfolios");
    }

    const data = await response.json();
    return data.candidates;
  } catch (error) {
    console.error("Search error:", error);
    // Fallback to mock data for demo
    return [
      {
        url: "https://example-portfolio-1.com",
        title: "Sarah Chen - Creative Developer",
        snippet:
          "Minimal portfolio showcasing design systems and interactive experiences",
        score: 0.92,
      },
      {
        url: "https://example-portfolio-2.com",
        title: "Alex Rivera - Motion Designer",
        snippet:
          "Playful single-page portfolio with stunning motion design and clean aesthetics",
        score: 0.88,
      },
      {
        url: "https://example-portfolio-3.com",
        title: "Maya Patel - UX Designer",
        snippet:
          "Design systems focused portfolio with minimal approach and creative interactions",
        score: 0.85,
      },
      {
        url: "https://example-portfolio-4.com",
        title: "David Kim - Frontend Developer",
        snippet:
          "Clean, playful portfolio emphasizing motion design and user experience",
        score: 0.82,
      },
      {
        url: "https://example-portfolio-5.com",
        title: "Emma Wilson - Creative Technologist",
        snippet:
          "Minimal design systems portfolio with innovative motion and interaction design",
        score: 0.79,
      },
    ];
  }
}

async function rankPortfolios(analysis, candidates) {
  try {
    const response = await fetch("/api/rank", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        analysis,
        candidates,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to rank portfolios");
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Rank error:", error);
    // Fallback to simple ranking
    return candidates
      .map((candidate) => ({
        ...candidate,
        score: candidate.score || Math.random() * 0.3 + 0.7,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }
}

// UI Functions
function setLoadingState(loading) {
  if (loading) {
    btnText.classList.add("hidden");
    loadingText.classList.remove("hidden");
    analyzeBtn.disabled = true;
  } else {
    btnText.classList.remove("hidden");
    loadingText.classList.add("hidden");
    analyzeBtn.disabled = false;
  }
}

function showError(message) {
  errorText.textContent = message;
  errorMessage.classList.remove("hidden");
  errorMessage.scrollIntoView({ behavior: "smooth" });
}

function hideError() {
  errorMessage.classList.add("hidden");
}

function hideResults() {
  resultsSection.classList.add("hidden");
}

function displayResults(analysis, portfolios) {
  // Display analysis summary
  displayAnalysisSummary(analysis);

  // Display portfolio cards
  displayPortfolioCards(portfolios);

  // Show results section
  resultsSection.classList.remove("hidden");
  resultsSection.scrollIntoView({ behavior: "smooth" });
}

function displayAnalysisSummary(analysis) {
  summaryContent.innerHTML = `
        <div class="bg-gray-50 p-4 rounded-xl">
            <p class="text-gray-700">${analysis.summary}</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-main bg-opacity-10 p-3 rounded-lg">
                <h4 class="font-semibold text-sm mb-2">🎨 Theme</h4>
                <div class="flex flex-wrap gap-1">
                    ${analysis.theme
                      .map(
                        (tag) =>
                          `<span class="bg-main text-text px-2 py-1 rounded-full text-xs">${tag}</span>`
                      )
                      .join("")}
                </div>
            </div>
            
            <div class="bg-main bg-opacity-10 p-3 rounded-lg">
                <h4 class="font-semibold text-sm mb-2">📐 Layout</h4>
                <div class="flex flex-wrap gap-1">
                    ${analysis.layout
                      .map(
                        (tag) =>
                          `<span class="bg-main text-text px-2 py-1 rounded-full text-xs">${tag}</span>`
                      )
                      .join("")}
                </div>
            </div>
            
            <div class="bg-main bg-opacity-10 p-3 rounded-lg">
                <h4 class="font-semibold text-sm mb-2">✨ Emphasis</h4>
                <div class="flex flex-wrap gap-1">
                    ${analysis.emphasis
                      .map(
                        (tag) =>
                          `<span class="bg-main text-text px-2 py-1 rounded-full text-xs">${tag}</span>`
                      )
                      .join("")}
                </div>
            </div>
        </div>
    `;
}

function displayPortfolioCards(portfolios) {
  portfoliosGrid.innerHTML = portfolios
    .map(
      (portfolio, index) => `
        <div class="bg-white cute-border cute-shadow p-6 rounded-2xl card-hover bounce-in" style="animation-delay: ${
          index * 0.1
        }s">
            <div class="flex items-start justify-between mb-3">
                <h4 class="font-semibold text-lg text-text line-clamp-2">${
                  portfolio.title
                }</h4>
                <span class="bg-main text-text px-2 py-1 rounded-full text-xs font-medium">
                    ${Math.round(portfolio.score * 100)}% match
                </span>
            </div>
            
            <p class="text-gray-600 text-sm mb-4 line-clamp-3">${
              portfolio.snippet
            }</p>
            
            <div class="space-y-3">
                <!-- Preview iframe (simulated) -->
                <div class="bg-gray-100 rounded-lg h-32 flex items-center justify-center">
                    <div class="text-center text-gray-500">
                        <div class="text-2xl mb-2">🖼️</div>
                        <div class="text-xs">Live Preview</div>
                    </div>
                </div>
                
                <a 
                    href="${portfolio.url}" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="block w-full gradient-bg text-text text-center py-2 px-4 rounded-lg font-medium hover:shadow-md transition-shadow"
                >
                    Visit Portfolio →
                </a>
            </div>
        </div>
    `
    )
    .join("");
}

// Utility Functions
function simulateDelay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Add some CSS for line clamping
const style = document.createElement("style");
style.textContent = `
    .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    
    .line-clamp-3 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
`;
document.head.appendChild(style);

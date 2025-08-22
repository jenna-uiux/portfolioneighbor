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
    // Single API call to get everything
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: portfolioUrl,
        keywords,
        experienceLevel,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to analyze portfolio");
    }

    const data = await response.json();

    // Display results
    displayResults(data.analysis, data.portfolios, data.summary);
  } catch (error) {
    console.error("Error:", error);
    showError(error.message || "Something went wrong. Please try again.");
  } finally {
    setLoadingState(false);
  }
});

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

function displayResults(analysis, portfolios, summary) {
  // Display analysis summary
  displayAnalysisSummary(analysis, summary);

  // Display portfolio cards
  displayPortfolioCards(portfolios);

  // Show results section
  resultsSection.classList.remove("hidden");
  resultsSection.scrollIntoView({ behavior: "smooth" });
}

function displayAnalysisSummary(analysis, summary) {
  summaryContent.innerHTML = `
        <div class="bg-gray-50 p-4 rounded-xl">
            <p class="text-gray-700">${summary}</p>
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
            
            <p class="text-gray-600 text-sm mb-2 line-clamp-2">${
              portfolio.snippet
            }</p>
            
            <p class="text-xs text-gray-500 mb-4 italic">${
              portfolio.matchReason || "Similar portfolio style"
            }</p>
            
            <div class="space-y-3">
                <!-- Real iframe preview -->
                <div class="bg-gray-100 rounded-lg h-32 flex items-center justify-center">
                  <iframe 
                    src="${portfolio.url}" 
                    class="w-full h-full rounded-lg"
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                  ></iframe>
                  <div class="text-center text-gray-500" style="display: none;">
                    <div class="text-2xl mb-2">🖼️</div>
                    <div class="text-xs">Preview Unavailable</div>
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

# Portfolio Neighborhood 🏘️

A beautiful, AI-powered website that helps you discover similar portfolios by analyzing your own portfolio URL. Built with a minimal yet cute design using vanilla JavaScript and Tailwind CSS.

## ✨ Features

- **AI Portfolio Analysis**: Analyzes your portfolio to extract themes, layout patterns, and emphasis areas
- **Smart Search**: Uses AI-generated queries to find similar portfolios across the web
- **Intelligent Ranking**: Ranks results based on similarity to your portfolio
- **Beautiful UI**: Minimal, cute design with smooth animations and interactions
- **Live Previews**: Shows preview cards for each similar portfolio (iframe support planned)
- **Experience Level Filtering**: Adjust search based on your experience level

## 🎨 Design

- **Background**: `#f2f2f2` (light gray)
- **Main Color**: `#DBF227` (lime green)
- **Text Color**: `#0D0D0D` (near black)
- **Font**: Inter (clean, modern)
- **Style**: Minimal yet cute with rounded corners and subtle shadows

## 🚀 Quick Start

1. **Clone or download** this repository
2. **Open `index.html`** in your browser
3. **Enter a portfolio URL** and optional keywords
4. **Adjust experience level** if needed
5. **Click "Find Similar Portfolios"** to see the magic happen!

## 🛠️ Tech Stack

- **Frontend**: HTML5, Vanilla JavaScript, Tailwind CSS
- **Styling**: Custom CSS with animations and responsive design
- **Icons**: Emoji-based icons (easily replaceable with custom icons)
- **Font**: Google Fonts (Inter)

## 📁 Project Structure

```
Portfolio Neighborhood/
├── index.html          # Main HTML file
├── script.js           # JavaScript functionality
└── README.md          # This file
```

## 🔧 Customization

### Colors

The color scheme is defined in the Tailwind config within `index.html`:

```javascript
colors: {
    'main': '#DBF227',    // Main lime green
    'bg': '#f2f2f2',      // Background gray
    'text': '#0D0D0D'     // Text color
}
```

### Favicon

Currently uses an emoji favicon (🏘️). Replace the favicon link in `index.html` with your custom logo:

```html
<link rel="icon" href="path/to/your/favicon.ico" />
```

### API Integration

The current version uses a hybrid search system combining ChatGPT and Google Custom Search API. To set up the APIs:

#### Required Environment Variables

1. **OpenAI API Key** (Required):
   ```bash
   OPENAI_API_KEY=sk-your-openai-api-key
   ```

2. **Google Custom Search API** (Optional, for enhanced results):
   ```bash
   GOOGLE_API_KEY=your-google-api-key
   GOOGLE_SEARCH_ENGINE_ID=your-search-engine-id
   ```

#### Setting up Google Custom Search API

1. **Create a Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable the "Custom Search API"

2. **Get API Key**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key

3. **Create Custom Search Engine**:
   - Go to [Google Programmable Search Engine](https://programmablesearchengine.google.com/)
   - Click "Create a search engine"
   - Enter any site (e.g., `www.google.com`)
   - Get your Search Engine ID from the control panel

4. **Add Environment Variables**:
   - For Vercel: Add in Project Settings > Environment Variables
   - For local development: Create `.env.local` file

## 🔮 Future Enhancements

- [ ] **Real API Integration**: Connect to OpenAI and search APIs
- [ ] **Live Previews**: Implement iframe previews for portfolio websites
- [ ] **Custom Logo**: Replace emoji favicon with hand-drawn logo
- [ ] **Backend**: Add serverless functions (Cloudflare Workers/Vercel/Netlify)
- [ ] **Analytics**: Track usage and popular portfolios
- [ ] **User Accounts**: Save favorite portfolios and analysis history

## 🎯 API Endpoints (Planned)

```javascript
// Analyze portfolio
POST /api/analyze
{
  "url": "https://portfolio.com",
  "keywords": "design, frontend",
  "experienceLevel": 50
}

// Search similar portfolios
POST /api/search
{
  "queries": ["minimal portfolio", "design systems"]
}

// Rank results
POST /api/rank
{
  "analysis": {...},
  "candidates": [...]
}
```

## 🎨 Design Philosophy

- **Minimal**: Clean, uncluttered interface
- **Cute**: Rounded corners, playful animations, friendly colors
- **Accessible**: High contrast, readable fonts, keyboard navigation
- **Responsive**: Works beautifully on all device sizes
- **Fast**: Optimized animations and smooth interactions

## 🤝 Contributing

Feel free to contribute to this project! Some areas that could use help:

- Backend API integration
- Enhanced search algorithms
- Additional portfolio analysis features
- UI/UX improvements
- Performance optimizations

## 📄 License

This project is open source and available under the MIT License.

---

Made with 💚 and AI magic ✨

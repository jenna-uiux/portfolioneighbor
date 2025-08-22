# Deployment Guide 🚀

This guide will help you deploy Portfolio Neighborhood to various platforms.

## 🎯 Quick Deploy Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**:

   ```bash
   npm install -g vercel
   ```

2. **Deploy**:

   ```bash
   vercel
   ```

3. **Set Environment Variables** (if using real APIs):
   ```bash
   vercel env add OPENAI_API_KEY
   vercel env add BING_SEARCH_API_KEY
   ```

### Option 2: Netlify

1. **Drag & Drop**: Simply drag your project folder to [netlify.com](https://netlify.com)

2. **Or use CLI**:
   ```bash
   npm install -g netlify-cli
   netlify deploy
   ```

### Option 3: GitHub Pages

1. **Push to GitHub**:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/portfolio-neighborhood.git
   git push -u origin main
   ```

2. **Enable GitHub Pages** in your repository settings

## 🔧 Environment Variables

If you want to use real APIs instead of mock data, set these environment variables:

### For Vercel:

```bash
vercel env add OPENAI_API_KEY your_openai_key_here
vercel env add BING_SEARCH_API_KEY your_bing_key_here
```

### For Netlify:

Add in Site Settings → Environment Variables

### For Local Development:

Create a `.env.local` file:

```env
OPENAI_API_KEY=your_openai_key_here
BING_SEARCH_API_KEY=your_bing_key_here
```

## 🔌 API Integration

To enable real API calls:

1. **Uncomment the OpenAI code** in `api/analyze.js`
2. **Uncomment the Bing Search code** in `api/search.js`
3. **Uncomment the ranking code** in `api/rank.js`
4. **Add your API keys** as environment variables

## 📱 Custom Domain

### Vercel:

1. Go to your project dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain

### Netlify:

1. Go to Site Settings → Domain Management
2. Add your custom domain

## 🔍 Testing

After deployment:

1. **Test the form** with a real portfolio URL
2. **Check API responses** in browser dev tools
3. **Verify mobile responsiveness**
4. **Test loading states** and error handling

## 🐛 Troubleshooting

### Common Issues:

1. **API calls failing**: Check environment variables and API keys
2. **CORS errors**: Ensure your API endpoints are properly configured
3. **Styling issues**: Verify Tailwind CSS is loading correctly
4. **Slow loading**: Check API response times and optimize if needed

### Debug Mode:

Add `?debug=true` to your URL to see console logs and API responses.

## 📊 Analytics (Optional)

Add Google Analytics or Vercel Analytics:

### Google Analytics:

Add this to your `index.html` head:

```html
<!-- Google Analytics -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "GA_MEASUREMENT_ID");
</script>
```

### Vercel Analytics:

```bash
npm install @vercel/analytics
```

Then add to your HTML:

```html
<script>
  import { inject } from "@vercel/analytics";
  inject();
</script>
```

## 🎨 Customization After Deployment

1. **Update colors**: Modify the Tailwind config in `index.html`
2. **Add your logo**: Replace the emoji favicon with your custom logo
3. **Customize content**: Update text and descriptions
4. **Add features**: Extend functionality as needed

---

Happy deploying! 🎉

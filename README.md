# Austral Decants - Shopify Theme

Professional Shopify Dawn theme customized for fragrance decanting e-commerce with AI-powered product recommendations.

## 🎯 Project Overview

This is a customized version of Shopify's Dawn theme (v15.4.0) featuring:
- **AI-Powered Perfume Finder**: Intelligent product recommendations using Claude Haiku
- **Custom Sections**: Decant education, authenticity badges, savings calculators
- **Optimized Performance**: LCP 1424ms, INP 8ms (both "Good" ratings)
- **Multi-language Support**: 50+ locales

## 📁 Repository Structure

```
TiendaShopify/
├── assets/             # CSS, JavaScript, images, and static assets
├── config/             # Theme configuration and settings
├── layout/             # Global theme layouts (theme.liquid, password.liquid)
├── locales/            # Translation files (50+ languages)
├── sections/           # Modular, reusable theme sections
├── snippets/           # Reusable Liquid template partials
├── templates/          # Page templates (product, collection, etc.)
├── CLAUDE.md           # AI assistant context and guidelines
└── README.md           # This file
```

## 🚀 Quick Start

### Prerequisites

- [Shopify CLI](https://shopify.dev/docs/themes/tools/cli) installed
- Git configured
- Store admin access

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd TiendaShopify
   ```

2. **Authenticate with Shopify**
   ```bash
   shopify auth login
   ```

3. **Pull latest from Shopify (important!)**
   ```bash
   shopify theme pull --theme <YOUR_THEME_ID>
   ```

4. **Start development server**
   ```bash
   shopify theme dev
   ```

## 💻 Development Workflow

### ⚠️ CRITICAL: Always Pull Before Push

**Never deploy without pulling first** to avoid losing Theme Customizer settings.

```bash
# Safe workflow
shopify theme pull --theme <THEME_ID>    # 1. Pull latest
git add . && git commit -m "Sync"        # 2. Commit sync
# Make your changes locally
git add . && git commit -m "Your changes" # 3. Commit changes
shopify theme push --theme <THEME_ID>    # 4. Deploy
git push origin main                     # 5. Backup to GitHub
```

### Common Commands

```bash
# Development with live reload
shopify theme dev

# List themes
shopify theme list

# Deploy to production
shopify theme push --theme <THEME_ID>

# Deploy as unpublished (safer for testing)
shopify theme push --unpublished

# Check theme for issues
shopify theme check
```

## 🎨 Custom Features

### AI Perfume Finder

Interactive quiz and chat interface powered by AI to help customers find their perfect fragrance.

**Files:**
- `sections/perfume-finder-hero.liquid` - Hero section
- `sections/perfume-finder-quiz.liquid` - Initial questionnaire
- `sections/perfume-finder-chat.liquid` - AI chat interface
- `assets/perfume-finder.js` - Frontend logic
- `templates/page.perfume-finder.json` - Page template

**Setup:**
1. Create a page in Shopify Admin
2. Assign template: `page.perfume-finder`
3. Ensure backend API is deployed (see `VERCEL_API_SPEC.md`)

**Configuration:**
Update API URL in `assets/perfume-finder.js`:
```javascript
const API_CONFIG = {
  baseUrl: 'https://your-api.vercel.app/api',
  // ...
};
```

### Custom Sections

- **Decant Education** - Explains what decanting is
- **Authenticity Badge** - Trust signals for genuine products
- **Decant Savings** - Calculates savings vs full bottles

## 🛡️ Important Files

### config/settings_data.json
**Most critical file** - contains all Theme Customizer settings (colors, fonts, sections).
- Always pull before editing
- Never edit manually unless necessary
- Backup before major changes

### layout/theme.liquid
Global layout wrapper. Contains:
- Customer authentication token injection (lines 303-309)
- CSS variables from settings
- Global JavaScript objects

### sections/
Modular content blocks editable via Theme Customizer.
Each has a `{% schema %}` block for customization options.

## 🧪 Testing Checklist

Before deploying to production:

- [ ] Pull latest from Shopify
- [ ] Test locally with `shopify theme dev`
- [ ] Verify Theme Customizer settings
- [ ] Test Perfume Finder (if applicable)
- [ ] Check mobile responsiveness
- [ ] Run `shopify theme check`
- [ ] Commit to Git
- [ ] Push to GitHub
- [ ] Deploy to Shopify
- [ ] Verify in production

## 📚 Documentation

- **CLAUDE.md** - Comprehensive guide for AI assistants working on this codebase
- **README.md** - This file - setup and workflow documentation

## 🔧 Troubleshooting

### Lost Theme Customizer Settings
If you accidentally overwrote `config/settings_data.json`:

```bash
# Revert to last commit
git reset --hard HEAD~1
git checkout HEAD -- config/settings_data.json
shopify theme push --theme <THEME_ID>
```

### Perfume Finder Not Working
1. Check customer is logged in
2. Verify API URL in `assets/perfume-finder.js`
3. Check backend health: `https://your-api.vercel.app/api/perfume-finder/health`
4. Open browser console (F12) for error logs

### Theme Push Conflicts
```bash
# Force pull from Shopify (caution: overwrites local)
shopify theme pull --theme <THEME_ID>

# Or pull specific files
shopify theme pull --only config/settings_data.json
```

## 🏗️ Tech Stack

- **Theme**: Shopify Dawn v15.4.0
- **Templating**: Liquid
- **JavaScript**: Vanilla ES6+
- **CSS**: Custom CSS with BEM-like naming
- **AI Backend**: Vercel + Supabase + Anthropic Claude
- **Version Control**: Git + GitHub

## 📝 Commit Conventions

```bash
feat: Add new feature
fix: Bug fix
docs: Documentation changes
style: Formatting, CSS changes
refactor: Code restructuring
test: Testing updates
chore: Maintenance tasks
sync: Shopify theme sync
```

## 🔒 Security

- No API keys or secrets in this repository
- Customer tokens generated dynamically
- Environment variables in `.env` (gitignored)
- See `.gitignore` for excluded files

## 📊 Performance

Current metrics (as of latest):
- **LCP**: 1424ms (Good)
- **INP**: 8ms (Good)
- **CLS**: 0 (Good)

## 🤝 Contributing

1. Pull latest from Shopify
2. Create feature branch
3. Make changes
4. Test locally with `shopify theme dev`
5. Commit with descriptive message
6. Push to GitHub
7. Test in Shopify preview
8. Merge to main
9. Deploy to production

## 📞 Support

For questions about:
- **Theme development**: See `CLAUDE.md`
- **Perfume Finder**: See `SHOPIFY_PERFUME_FINDER.md` and `VERCEL_API_SPEC.md`
- **Shopify CLI**: [Official Documentation](https://shopify.dev/docs/themes/tools/cli)

---

Built with ❤️ for Austral Decants

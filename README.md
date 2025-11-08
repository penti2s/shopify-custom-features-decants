# Shopify Custom Features - Built with Claude Code

<div align="center">

[![Made with Claude Code](https://img.shields.io/badge/Built%20with-Claude%20Code-7B68EE?style=for-the-badge&logo=anthropic&logoColor=white)](https://claude.ai/code)
[![Shopify Dawn](https://img.shields.io/badge/Shopify-Dawn%2015.4.0-96BF48?style=for-the-badge&logo=shopify&logoColor=white)](https://github.com/Shopify/dawn)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

**Custom Shopify features that go beyond traditional themes.**
A growing collection of production-ready, AI-powered components for modern e-commerce.

[Features](#-custom-features) • [Quick Start](#-quick-start) • [Deployment](#-development-workflow) • [Contributing](#-contributing)

</div>

---

## 🎯 Project Overview

This repository extends Shopify's Dawn theme (v15.4.0) with custom features built entirely using **Claude Code**. While based on Dawn, it goes beyond traditional theme customization with intelligent, interactive components designed for modern e-commerce needs.

**Base**: Dawn v15.4.0
**Optimized Performance**: LCP 1424ms, INP 8ms (both "Good" ratings)
**Multi-language**: 50+ locales supported
**Production-Ready**: Battle-tested code with complete documentation

---

## ✨ Custom Features

### 🤖 AI Product Finder (Perfume Finder)
**Status**: ✅ Production-Ready | **Type**: Interactive Quiz + AI Chat

The flagship feature - an intelligent product recommendation system that helps customers find their perfect product through personalized questions and conversational AI.

**What it does**:
- Interactive quiz with 4 smart questions (gender, occasion, fragrance family, intensity)
- Real-time conversational AI powered by Anthropic Claude Haiku
- Personalized product recommendations with explanations
- Customer authentication & rate limiting
- Fully responsive mobile/desktop UI

**Files**:
- `sections/perfume-finder-hero.liquid` - Landing hero section
- `sections/perfume-finder-quiz.liquid` - Interactive questionnaire
- `sections/perfume-finder-chat.liquid` - AI chat interface
- `assets/perfume-finder.js` - Frontend logic (400+ lines)
- `templates/page.perfume-finder.json` - Page template
- `layout/theme.liquid` (lines 303-309) - Customer auth token injection

**Tech Stack**:
- Frontend: Vanilla JS + Liquid
- Backend: Vercel Edge Functions + Supabase PostgreSQL
- AI: Anthropic Claude Haiku
- Auth: Shopify Customer API

**Setup**: See [Perfume Finder Setup](#ai-perfume-finder)

---

### 🎓 Decant Education Section
**Status**: ✅ Ready | **Type**: Informational Section

Custom section explaining what decanting is and why it's valuable for customers unfamiliar with the concept.

**What it does**:
- Educates customers about fragrance decanting
- Builds trust and reduces purchase hesitation
- Fully customizable via Theme Editor

**Files**:
- `sections/decant-education.liquid`
- `assets/section-decant-education.css`

**Usage**: Add section to any page via Theme Customizer → "Add section" → "Decant Education"

---

### 🛡️ Authenticity Badge
**Status**: ✅ Ready | **Type**: Trust Signal Snippet

Reusable snippet that displays authenticity guarantees to build customer confidence.

**What it does**:
- Shows "100% Authentic" badge
- Configurable text and styling
- Can be included anywhere in theme

**Files**:
- `snippets/authenticity-badge.liquid`

**Usage**:
```liquid
{% render 'authenticity-badge' %}
```

---

### 💰 Decant Savings Calculator
**Status**: ✅ Ready | **Type**: Value Proposition Snippet

Shows customers how much they save buying decants vs full bottles.

**What it does**:
- Calculates savings percentage
- Displays compelling value proposition
- Encourages conversion

**Files**:
- `snippets/decant-savings.liquid`

**Usage**:
```liquid
{% render 'decant-savings',
  decant_price: product.price,
  bottle_price: 15000
%}
```

---

### 🔐 Enhanced Customer Authentication
**Status**: ✅ Integrated | **Type**: Infrastructure

Custom implementation for secure customer token generation and injection for API communication.

**What it does**:
- Generates secure customer tokens
- Enables frontend-to-backend authentication
- Required for AI Product Finder

**Files**:
- `layout/theme.liquid` (lines 303-309)

**Technical**: Base64-encoded `customer_id:shop_id` token injected as meta tag and window variable.

---

## 🚀 Coming Soon

- [ ] **Dynamic Bundle Builder** - AI-suggested product bundles
- [ ] **Smart Inventory Alerts** - Predictive restock notifications
- [ ] **Conversational Checkout** - AI-assisted checkout process
- [ ] **Visual Product Search** - Find products by image
- [ ] **Personalized Email Generator** - AI-powered marketing campaigns

**Have an idea?** Open an issue or contribute!

---

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

- ✅ No API keys or secrets in this repository
- ✅ Customer tokens generated dynamically
- ✅ Environment variables in `.env` (gitignored)
- ✅ Internal docs in `.internal/` (gitignored)
- ✅ Safe for public repositories

## 📊 Performance

Current metrics (as of latest):
- **LCP**: 1424ms (Good)
- **INP**: 8ms (Good)
- **CLS**: 0 (Good)

## 🤝 Contributing

We welcome contributions! Whether you're fixing bugs, adding features, or improving documentation.

### How to Contribute

1. **Fork** this repository
2. **Clone** your fork locally
3. **Pull** latest from Shopify: `shopify theme pull`
4. **Create** a feature branch: `git checkout -b feature/amazing-feature`
5. **Make** your changes
6. **Test** locally: `shopify theme dev`
7. **Commit**: `git commit -m "feat: Add amazing feature"`
8. **Push**: `git push origin feature/amazing-feature`
9. **Open** a Pull Request

### Contribution Ideas

- 🐛 Fix bugs or improve existing features
- ✨ Add new custom features
- 📚 Improve documentation
- 🎨 Enhance UI/UX
- 🧪 Add tests
- 🌍 Add more language support

### Guidelines

- Follow existing code style
- Test thoroughly before submitting
- Update documentation for new features
- Include clear commit messages
- One feature per PR

## 📞 Support & Community

- **Issues**: Found a bug? [Open an issue](../../issues)
- **Discussions**: Have questions? [Start a discussion](../../discussions)
- **Pull Requests**: Want to contribute? [Submit a PR](../../pulls)
- **Shopify CLI Docs**: [Official Documentation](https://shopify.dev/docs/themes/tools/cli)

## 🚀 Initial Setup (First Time)

If you're setting up this repository for the first time:

```bash
# Add remote
git remote add origin git@github.com:penti2s/shopify-custom-features-decants.git

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

## 📄 License

MIT License - feel free to use this code for your own projects!

## 🙏 Acknowledgments

- Built with [Claude Code](https://claude.ai/code) by Anthropic
- Based on [Shopify Dawn Theme](https://github.com/Shopify/dawn)
- Powered by [Vercel](https://vercel.com) + [Supabase](https://supabase.com)

---

<div align="center">

**⭐ If you find this useful, please consider starring the repo!**

Built with ❤️ using Claude Code

[Report Bug](../../issues) • [Request Feature](../../issues) • [Documentation](./CLAUDE.md)

</div>

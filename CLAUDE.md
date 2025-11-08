# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Shopify Dawn theme (v15.4.0) codebase. Dawn is Shopify's reference theme, built with modern web standards and optimized for performance. The theme uses Liquid templating language, vanilla JavaScript, and CSS for styling.

## Directory Structure

```
E:\TiendaShopify/
├── .shopify/           # Shopify CLI configuration (gitignored)
├── assets/             # CSS, JavaScript, and static assets
├── config/             # Theme settings and configuration
│   ├── settings_data.json       # Current theme settings
│   └── settings_schema.json     # Settings structure definition
├── layout/             # Theme layout files
│   ├── theme.liquid             # Main layout wrapper
│   └── password.liquid          # Password-protected store layout
├── locales/            # Translation files (50+ languages)
├── sections/           # Reusable theme sections
├── snippets/           # Reusable code snippets
└── templates/          # Page templates
```

## Key Architecture Concepts

### Liquid Templating

- **Sections**: Modular content blocks that can be added/removed via the theme editor. Located in `sections/`. Each section includes schema definitions for customization options.
- **Snippets**: Reusable template partials included via `{% render 'snippet-name' %}`. Located in `snippets/`.
- **Templates**: Define the structure for different page types (product, collection, etc.). Located in `templates/`.
- **Layouts**: Wrap templates and provide the overall HTML structure. The main layout is `layout/theme.liquid`.

### Asset Loading Pattern

Dawn uses a deferred loading pattern for CSS and JavaScript:
```liquid
<link rel="stylesheet" href="{{ 'component-name.css' | asset_url }}" media="print" onload="this.media='all'">
<script src="{{ 'component-name.js' | asset_url }}" defer="defer"></script>
```

### Component Architecture

Dawn follows a component-based approach:
- **CSS Components**: Named `component-*.css` (e.g., `component-cart.css`, `component-card.css`)
- **JavaScript Modules**: Web Components and vanilla JS modules in `assets/`
- **Sections**: Self-contained with their own schema, styles, and scripts

### Settings and Theming

- **CSS Variables**: Theme settings from `config/settings_schema.json` are converted to CSS custom properties in `layout/theme.liquid` (lines 50-223)
- **Color Schemes**: Supports multiple color schemes defined via `settings.color_schemes`
- **Section Settings**: Each section can have its own schema for customizable options

### Global JavaScript Objects

The theme exposes several global objects in `layout/theme.liquid:323-365`:
- `window.shopUrl` - Store URL
- `window.routes` - Cart and search API routes
- `window.cartStrings` - Cart error messages
- `window.variantStrings` - Product variant UI strings
- `window.quickOrderListStrings` - Quick order list messages
- `window.accessibilityStrings` - Accessibility labels

### Cart Implementation

Dawn supports two cart types (configured in settings):
- **Drawer Cart**: Slides in from the side (uses `cart-drawer.liquid` snippet)
- **Page Cart**: Traditional cart page

The cart type determines which stylesheets and scripts are loaded.

## Development Workflows

### Shopify CLI

This theme is designed to work with Shopify CLI. The `.shopify/` directory contains CLI configuration but is gitignored.

Common Shopify CLI commands (if CLI is installed):
```bash
shopify theme dev          # Start local development server
shopify theme push         # Push theme to Shopify
shopify theme pull         # Pull theme from Shopify
shopify theme check        # Run theme check linter
```

### File Editing

When editing files:
- **Sections**: Section files contain Liquid, CSS (in `{% style %}` tags), and JavaScript inline or via asset references
- **Snippets**: Keep snippets focused and reusable; they can accept parameters via the `render` tag
- **Assets**: JavaScript files should use ES6+ syntax; CSS should follow BEM-like naming conventions

### Localization

Translation files are in `locales/` directory. The theme supports 50+ languages with both `.json` (translations) and `.schema.json` (schema translations) files. The default locale is `en.default.json`.

Translations are referenced in Liquid via: `{{ 'path.to.translation' | t }}`

## Important Technical Details

### Product Pages

Product pages (`sections/main-product.liquid`) include:
- Product media gallery with zoom support (`magnify.js`)
- Variant picker for product options
- 3D model support via Shopify's Model Viewer
- Volume pricing for quantity price breaks
- Gift card recipient forms

### Reusable Components

Key snippets to understand:
- `card-product.liquid` - Product card used throughout collections
- `buy-buttons.liquid` - Add to cart functionality
- `product-media-gallery.liquid` - Product image/video display
- `price.liquid` - Price display with sale/compare pricing
- `facets.liquid` - Collection filtering

### Performance Optimizations

- Deferred CSS loading with `media="print" onload="this.media='all'"`
- Lazy loading images via `lazy_load` parameter
- Font preloading for custom fonts
- Conditional loading based on settings (e.g., predictive search, cart type)

### Theme Editor Integration

Sections include schema definitions that appear in the Shopify theme editor. When `Shopify.designMode` is true, additional functionality is loaded via `theme-editor.js`.

## Common Patterns

### Including Snippets
```liquid
{% render 'snippet-name', param: value %}
```

### Section Schema Structure
```liquid
{% schema %}
{
  "name": "Section Name",
  "settings": [...],
  "presets": [...]
}
{% endschema %}
```

### Asset URL Filter
```liquid
{{ 'filename.css' | asset_url | stylesheet_tag }}
{{ 'filename.js' | asset_url }}
```

### Translation Usage
```liquid
{{ 'sections.cart.title' | t }}
```

---

## Deployment and Version Control

### CRITICAL: Git Workflow for Shopify Themes

**ALWAYS follow this workflow to prevent data loss:**

#### 1. Before Making Changes
```bash
# Pull latest from Shopify FIRST
shopify theme pull --theme 186545668228

# Check what changed
git status
git diff

# Commit the current state
git add .
git commit -m "Sync: Pull latest from Shopify"
```

#### 2. Make Your Changes Locally
- Edit files in your IDE
- Test locally if possible with `shopify theme dev`

#### 3. Commit Changes Locally
```bash
git add .
git commit -m "feat: Description of your changes"
```

#### 4. Push to Shopify
```bash
# Option A: Push to live theme (PRODUCTION)
shopify theme push --theme 186545668228

# Option B: Push as unpublished (SAFER - for testing)
shopify theme push --unpublished

# Option C: Development mode (live reload)
shopify theme dev
```

#### 5. Push to GitHub
```bash
git push origin main
```

### ⚠️ CRITICAL WARNINGS

**NEVER do `shopify theme push` without pulling first!**
- This will overwrite `config/settings_data.json` and lose Theme Customizer settings
- Always run `shopify theme pull` before `push`

**Before deployment, verify:**
- [ ] You pulled latest changes from Shopify
- [ ] All changes are committed to Git
- [ ] You're pushing to the correct theme ID
- [ ] You have a recent backup (Git commit)

### Common Commands

```bash
# Safe workflow for changes
shopify theme pull --theme 186545668228  # Download current state
git add . && git commit -m "Sync from Shopify"
# Make your changes
git add . && git commit -m "Your changes"
shopify theme push --theme 186545668228  # Upload changes

# Check theme info
shopify theme list

# Development with live reload
shopify theme dev

# Push to GitHub
git push origin main
```

### File-Specific Guidelines

#### config/settings_data.json
- **Most fragile file** - contains all Theme Customizer settings
- Always pull before editing
- Never edit manually unless necessary
- Backup before major changes

#### Sections and Templates
- Safe to edit directly
- Always test in Theme Customizer after deployment
- Keep schema definitions updated

#### Assets
- Safe to add/modify
- Remember to reference in Liquid files
- Check file size (Shopify has limits)

### Recovery from Mistakes

If you accidentally overwrote settings:

```bash
# Revert to last commit
git reset --hard HEAD~1

# Or restore specific file
git checkout HEAD -- config/settings_data.json

# Push restored version
shopify theme push --theme 186545668228
```

### GitHub Integration

This repository is version controlled. When working with Claude Code:

1. **Pull latest** before starting work
2. **Commit frequently** with descriptive messages
3. **Push to GitHub** to backup your work
4. **Pull from Shopify** before any deployment

### Custom Features

#### Perfume Finder (AI-Powered Product Recommendations)
- **Files**: `sections/perfume-finder-*.liquid`, `assets/perfume-finder.js`, `templates/page.perfume-finder.json`
- **Backend**: Vercel API at `https://perfumes-puq.vercel.app/api`
- **Dependencies**: Customer must be logged in, requires Vercel backend
- **Configuration**: Update API URL in `assets/perfume-finder.js` line 12

#### Customer Authentication
- Customer token injected in `layout/theme.liquid` lines 303-309
- Used for Perfume Finder authentication
- Token format: `base64(customer_id:shop_id)`

### Testing Checklist

Before deploying to production:

- [ ] Pull latest from Shopify
- [ ] Test locally with `shopify theme dev`
- [ ] Check Theme Customizer settings
- [ ] Verify custom features (Perfume Finder, etc.)
- [ ] Test on mobile and desktop
- [ ] Commit all changes to Git
- [ ] Push to GitHub as backup
- [ ] Deploy to Shopify with `theme push`
- [ ] Verify in production
- [ ] Create Git tag for major releases

### Version Tagging

For major releases:
```bash
git tag -a v1.0.0 -m "Initial production release with Perfume Finder"
git push origin v1.0.0
```

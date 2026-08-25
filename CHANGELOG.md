# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-08-25

### Added
- Astro integration with `standard` and `advanced` modes
- `<GooglePreferredSourceButton />` component for the standard auto-render button
- `<GooglePreferredSourceDeeplink />` component with vector Google "G" icon, arbitrary text labels, and visual styles (`pill`, `button`, `outline`, `glow`, `badge`, `minimal`, `raw`, `image`)
- `<GooglePreferredSourceBadge />` component for standalone official badge images with retina 2x `srcset` support
- `<GoogleIcon />` component for crisp, scalable 4-color Google "G" SVG rendering
- Bundled 68 official Google translated badge assets for 17 languages
- Client module with callback-queue API (`init`, `addPreferredSource`)
- ESM client module (`@puralex/astro-google-preferred-source/client/esm`)
- Options validation, idempotency guard, and Astro logger integration
- TypeScript declarations and Node test suite (100% line coverage)
- Interactive documentation showcase with basic to exotic examples, and GitHub Pages deployment workflow
- Automated npm publish workflow via GitHub Releases


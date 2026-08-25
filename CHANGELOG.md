# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-08-25

### Added
- Astro integration with `standard` and `advanced` modes
- `<GooglePreferredSourceButton />` component for the standard auto-render button
- `<GooglePreferredSourceDeeplink />` component for no-JS deeplinks
- Client module with callback-queue API (`init`, `addPreferredSource`)
- ESM client module (`@puralex/astro-google-preferred-source/client/esm`)
- Options validation, idempotency guard, and Astro logger integration
- TypeScript declarations and Node test suite
- CI workflow and GitHub Pages docs deployment

# Evgenii Markitan — Portfolio

Personal portfolio built with Astro. Static output, no runtime backend, deployed
as plain files behind nginx.

## Local development

Requires Node.js 22.12 or newer.

```bash
npm install
npm run dev
```

Production build and preview:

```bash
npm run build
npm run preview
```

## Content

Project pages are generated from Markdown in `src/content/projects/`. The
frontmatter schema lives in `src/content.config.ts`: stack chain, architecture
layers and screenshots are structured data, the prose is the Markdown body.

Everything else — name, contacts, jobs — is in `src/data/site.ts`. Total years of
experience and the "updated" date are computed at build time so they never go
stale in the copy.

Project screenshots live in `src/assets/` and go through the Astro image
pipeline, which emits sized WebP per breakpoint.

Drop raw screenshots there and run `npm run shots:prepare` before committing: it
caps them at 1600px and converts to WebP. This matters because Astro also copies
the untouched original into `dist/`, even though no markup references it — a
4000px PNG would ship as several megabytes of dead weight on every deploy.

## Fonts

Onest (headings and body) and IBM Plex Mono (annotations) are self-hosted as
woff2 in `public/fonts/`, subset to Latin and Cyrillic. No requests to Google
Fonts in production. Only the Onest subsets are preloaded — they carry the first
screen.

## Checks

Both scripts need the site running (`npm run preview`) and Google Chrome
installed at the default macOS path.

```bash
npm run audit:layout   # horizontal overflow at 320/390/1440, full-page screenshots into .shots/
npm run audit:budget   # JS weight, view-transition names, no-JS render, reduced-motion, images
npx astro check        # types
```

`audit:budget` is the guard rail for the two rules that are easy to break by
accident: the JS budget and the requirement that the page stays readable with
JavaScript disabled.

## Related repositories

- [Letter Box](https://github.com/Squanbri/letter-box)
- [Screen Translator](https://github.com/Squanbri/screen-translator)

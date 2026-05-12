# Photostream AI media gallery

A Google Photos-style web gallery prototype for uploading, browsing, searching, previewing, and inspecting AI-enriched photos and videos.

## What is included

- Next.js + React + TypeScript + Tailwind UI prototype.
- Responsive masonry-style media grid with rounded cards, date grouping, multi-select, lazy thumbnails, hover actions, and lightbox detail view.
- Hover preview examples for images and videos.
- PostgreSQL + pgvector schema for metadata, keyword search, and vector search.
- FastAPI endpoint sketch and Python AI worker pipeline sketch.
- Architecture, search ranking, API, AI pipeline, and deployment documentation in `docs/architecture.md`.

## Run locally

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

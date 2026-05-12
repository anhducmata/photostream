# Photostream implementation gap analysis and task plan

## Summary

The repository is currently a runnable UI prototype plus backend and worker sketches, not a complete production application. The README explicitly describes the app as a prototype and says the FastAPI service and AI worker are sketches. The architecture document defines the target behavior, but multiple code paths still return placeholders, empty responses, or `501 Not Implemented` responses.

## Why parts are not implemented yet

| Area | Current evidence | Why it is incomplete |
| --- | --- | --- |
| Frontend data source | `MediaGallery` initializes state from `sampleMedia` and filters locally. | The UI is disconnected from the FastAPI media feed/search endpoints, so upload, pagination, server search, deletion, and download flows do not persist changes. |
| Upload UI | `UploadButton` exposes selected files through an optional callback, but `MediaGallery` renders it without a handler. | File selection currently has no upload session, progress, optimistic queued item, completion call, or error handling. |
| Upload API | `create_upload_target` validates MIME type, then raises `501`. | The endpoint still needs storage, database, and queue adapters before it can create a media row and return a presigned upload target. |
| Direct upload API | `direct_upload` raises `501`. | Small self-hosted uploads need server-side file validation, streaming storage writes, DB insertion, and queue enqueueing. |
| Feed/search API | `list_media` and `search_media` return empty `SearchResponse` objects. | The API does not yet query PostgreSQL, apply cursor pagination, generate text embeddings, or run hybrid keyword/vector search. |
| Detail/download/delete API | `get_media` always returns `404`, `download_media` returns a fixed example URL, and `delete_media` returns without doing any work. | These endpoints need repository methods, storage signing/deletion, and not-found/error handling. |
| Bulk delete API | The architecture lists `POST /api/media/bulk-delete`, but the FastAPI app does not define it. | Batch operations need an endpoint, request schema, authorization boundary, transaction behavior, and storage cleanup strategy. |
| AI worker | `process_media` documents the desired steps, then raises `NotImplementedError`. | The worker needs model, metadata, rendition, storage, and database adapters before queued uploads can become searchable ready media. |
| Database bootstrap | `db/schema.sql` uses `gen_random_uuid()` but only enables `vector` and `pg_trgm`. | PostgreSQL environments that do not already expose `gen_random_uuid()` need an explicit `pgcrypto` extension or an alternative UUID default. |
| Operational wiring | The architecture names S3-compatible storage, PostgreSQL, queueing, and model services, but there are no config/env contracts or dependency adapters. | Production behavior depends on provider-specific clients, credentials, retries, observability, and deployment configuration that have not been added. |

## Implementation tasks

### Milestone 1: Define runtime contracts

- [ ] Add `.env.example` with database URL, storage bucket/endpoint, queue backend, upload size limits, CDN base URL, and model configuration.
- [ ] Create typed configuration loaders for the FastAPI service and AI worker with validation and safe defaults for local development.
- [ ] Decide local development providers: Docker Compose for PostgreSQL + pgvector, MinIO/R2/S3-compatible storage, and Redis/SQS-compatible queue.
- [ ] Document setup, migration, and provider prerequisites in the README.

### Milestone 2: Database and repository layer

- [ ] Add the missing UUID extension or change the UUID generation strategy in `db/schema.sql`.
- [ ] Introduce database migration tooling and make `db/schema.sql` executable in a clean database.
- [ ] Implement a media repository with create, update status, list, search, get, delete, and bulk-delete operations.
- [ ] Add cursor pagination helpers that sort consistently by `created_at`, `uploaded_at`, and `id`.
- [ ] Add repository tests for queued, processing, ready, failed, deleted, and not-found scenarios.

### Milestone 3: Storage and queue adapters

- [ ] Implement an object storage adapter that can create presigned upload URLs, signed download URLs, and delete original/thumbnail/preview objects.
- [ ] Define deterministic object keys for originals and generated renditions.
- [ ] Implement a queue adapter for enqueueing media IDs and retrying failed processing jobs.
- [ ] Add upload validation for MIME type, extension, size limits, and duplicate filenames.
- [ ] Add integration tests with local storage and queue services.

### Milestone 4: Complete FastAPI endpoints

- [ ] Implement `POST /api/media/uploads` to create a queued row, return a presigned upload target, and persist the expected object key.
- [ ] Implement `POST /api/media/{id}/complete` to verify the uploaded object exists and enqueue the media item for AI processing.
- [ ] Implement `POST /api/media/direct` for small local deployments using streamed uploads and the same queue path.
- [ ] Implement `GET /api/media` using cursor pagination and include queued/processing/ready states for the gallery.
- [ ] Implement `GET /api/media/search` using keyword search first, then add vector search once query embeddings are available.
- [ ] Implement `GET /api/media/{id}`, `GET /api/media/{id}/download`, `DELETE /api/media/{id}`, and `POST /api/media/bulk-delete`.
- [ ] Add FastAPI tests for validation, status codes, pagination, search ranking, deletion, and storage/queue failures.

### Milestone 5: Complete the AI processing worker

- [ ] Implement metadata extraction for images and videos.
- [ ] Generate WebP/AVIF thumbnails for images and poster thumbnails for videos.
- [ ] Generate hover previews: low-resolution animated/image previews for images and short muted clips for videos.
- [ ] Add model adapters for embeddings, object labels, and captions.
- [ ] Persist labels, captions, dimensions, duration, generated URLs, embeddings, and final processing status.
- [ ] Persist partial results and `failed` status with `error_message` when any stage fails.
- [ ] Add worker unit tests for label normalization, metadata parsing, status transitions, and failure recovery.

### Milestone 6: Connect the frontend to the API

- [ ] Replace `sampleMedia` state with server-loaded gallery data from `GET /api/media`.
- [ ] Wire `UploadButton` to create upload targets, upload selected files, call completion, and show progress/error states.
- [ ] Replace local search filtering with debounced calls to `GET /api/media/search`, while keeping a local fallback for sample/demo mode.
- [ ] Add delete and bulk-delete actions that call the API and update UI state optimistically with rollback on failure.
- [ ] Add download action handling through signed download URLs.
- [ ] Add loading, empty, queued, processing, failed, and retry UI states.

### Milestone 7: Production hardening

- [ ] Add authentication/authorization boundaries for uploads, downloads, deletion, and user-owned media.
- [ ] Add request size limits, rate limits, virus/malware scanning hooks, and content-type sniffing.
- [ ] Add structured logging, metrics, tracing, and dashboards for API latency, upload failures, queue depth, and worker failures.
- [ ] Add CI checks for TypeScript, frontend build, Python linting/type checking, API tests, worker tests, and database migration validation.
- [ ] Add deployment manifests or infrastructure notes for the chosen frontend, API, database, storage, queue, and worker providers.

## Suggested implementation order

1. Fix database bootstrap and add configuration contracts.
2. Implement repository, storage, and queue adapters behind interfaces.
3. Complete upload and listing endpoints so the UI can persist real files.
4. Connect frontend upload/feed/search/delete/download flows to the API.
5. Implement the worker incrementally: metadata and thumbnails first, then previews, then AI labels/captions/embeddings.
6. Add hybrid vector search after embeddings are reliably produced.
7. Harden auth, validation, observability, and deployment after the core happy path works end to end.

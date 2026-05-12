CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TYPE media_type AS ENUM ('image', 'video');
CREATE TYPE processing_status AS ENUM ('queued', 'processing', 'ready', 'failed');

CREATE TABLE media_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  preview_url TEXT,
  media_type media_type NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,
  width INTEGER,
  height INTEGER,
  duration_seconds NUMERIC(10, 3),
  created_at TIMESTAMPTZ,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  caption TEXT,
  labels JSONB NOT NULL DEFAULT '[]'::jsonb,
  embedding VECTOR(768),
  processing_status processing_status NOT NULL DEFAULT 'queued',
  error_message TEXT,
  search_document TSVECTOR GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(caption, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(labels::text, '')), 'B')
  ) STORED
);

CREATE INDEX media_items_uploaded_at_idx ON media_items (uploaded_at DESC);
CREATE INDEX media_items_created_at_idx ON media_items (created_at DESC NULLS LAST);
CREATE INDEX media_items_status_idx ON media_items (processing_status);
CREATE INDEX media_items_labels_idx ON media_items USING GIN (labels jsonb_path_ops);
CREATE INDEX media_items_search_idx ON media_items USING GIN (search_document);
CREATE INDEX media_items_embedding_hnsw_idx ON media_items USING hnsw (embedding vector_cosine_ops);

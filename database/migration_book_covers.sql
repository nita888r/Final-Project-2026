CREATE TABLE IF NOT EXISTS book_covers (
  book_id BIGINT PRIMARY KEY REFERENCES books(id) ON DELETE CASCADE,
  mime_type VARCHAR(50) NOT NULL CHECK (mime_type IN ('image/jpeg','image/png','image/webp','image/gif')),
  data BYTEA NOT NULL CHECK (octet_length(data) <= 5242880),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

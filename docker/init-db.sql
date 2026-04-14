-- Create separate databases for Evolution API and n8n
-- Evolution API uses the default 'evolution' database (set in POSTGRES_DB)
-- n8n needs its own database

CREATE DATABASE n8n;

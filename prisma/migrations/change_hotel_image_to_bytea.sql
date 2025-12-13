-- Migration: Change hotel image field from VARCHAR to BYTEA for storing compressed images
-- This migration will convert existing image URLs to NULL
-- Make sure to backup any important image data before running

BEGIN;

-- Drop the existing image column (VARCHAR) and create a new one (BYTEA)
-- If you have important image URLs, export them first!
ALTER TABLE hotels 
  DROP COLUMN IF EXISTS image,
  ADD COLUMN image BYTEA NULL;

COMMIT;





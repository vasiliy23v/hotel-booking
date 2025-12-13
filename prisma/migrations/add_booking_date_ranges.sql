-- Create booking_date_ranges table
CREATE TABLE IF NOT EXISTS "booking_date_ranges" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "booking_date_ranges_start_date_idx" ON "booking_date_ranges"("start_date");
CREATE INDEX IF NOT EXISTS "booking_date_ranges_end_date_idx" ON "booking_date_ranges"("end_date");
CREATE INDEX IF NOT EXISTS "booking_date_ranges_is_active_idx" ON "booking_date_ranges"("is_active");





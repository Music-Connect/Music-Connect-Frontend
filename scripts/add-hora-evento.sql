-- Migration: Add hora_evento column to propostas table
-- Run this if your database was created before this column was added

-- Check if column exists before adding
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name='propostas' 
        AND column_name='hora_evento'
    ) THEN
        ALTER TABLE propostas ADD COLUMN hora_evento TIME;
        RAISE NOTICE 'Column hora_evento added successfully';
    ELSE
        RAISE NOTICE 'Column hora_evento already exists';
    END IF;
END $$;

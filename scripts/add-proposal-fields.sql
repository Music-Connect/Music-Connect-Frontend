-- Migration: Add additional fields to propostas table
-- Run this if your database was created before these columns were added

DO $$ 
BEGIN
    -- Add endereco_completo column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='propostas' AND column_name='endereco_completo'
    ) THEN
        ALTER TABLE propostas ADD COLUMN endereco_completo TEXT;
        RAISE NOTICE 'Column endereco_completo added successfully';
    END IF;

    -- Add tipo_evento column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='propostas' AND column_name='tipo_evento'
    ) THEN
        ALTER TABLE propostas ADD COLUMN tipo_evento VARCHAR(100);
        RAISE NOTICE 'Column tipo_evento added successfully';
    END IF;

    -- Add duracao_horas column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='propostas' AND column_name='duracao_horas'
    ) THEN
        ALTER TABLE propostas ADD COLUMN duracao_horas DECIMAL(3, 1);
        RAISE NOTICE 'Column duracao_horas added successfully';
    END IF;

    -- Add publico_esperado column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='propostas' AND column_name='publico_esperado'
    ) THEN
        ALTER TABLE propostas ADD COLUMN publico_esperado INTEGER;
        RAISE NOTICE 'Column publico_esperado added successfully';
    END IF;

    -- Add equipamento_incluso column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='propostas' AND column_name='equipamento_incluso'
    ) THEN
        ALTER TABLE propostas ADD COLUMN equipamento_incluso BOOLEAN DEFAULT false;
        RAISE NOTICE 'Column equipamento_incluso added successfully';
    END IF;

    -- Add nome_responsavel column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='propostas' AND column_name='nome_responsavel'
    ) THEN
        ALTER TABLE propostas ADD COLUMN nome_responsavel VARCHAR(255);
        RAISE NOTICE 'Column nome_responsavel added successfully';
    END IF;

    -- Add telefone_contato column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='propostas' AND column_name='telefone_contato'
    ) THEN
        ALTER TABLE propostas ADD COLUMN telefone_contato VARCHAR(20);
        RAISE NOTICE 'Column telefone_contato added successfully';
    END IF;

    -- Add observacoes column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='propostas' AND column_name='observacoes'
    ) THEN
        ALTER TABLE propostas ADD COLUMN observacoes TEXT;
        RAISE NOTICE 'Column observacoes added successfully';
    END IF;

    -- Add hora_evento column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='propostas' AND column_name='hora_evento'
    ) THEN
        ALTER TABLE propostas ADD COLUMN hora_evento TIME;
        RAISE NOTICE 'Column hora_evento added successfully';
    END IF;
END $$;

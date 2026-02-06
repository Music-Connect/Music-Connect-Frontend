-- Migration: Add password reset tokens table
-- This table stores tokens for password reset functionality

-- Create password reset tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id SERIAL PRIMARY KEY,
  id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for token lookup
CREATE INDEX IF NOT EXISTS idx_password_reset_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_user ON password_reset_tokens(id_usuario);
CREATE INDEX IF NOT EXISTS idx_password_reset_expires ON password_reset_tokens(expires_at);

-- Function to clean up expired tokens (optional, can run periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_password_tokens()
RETURNS void AS $$
BEGIN
  DELETE FROM password_reset_tokens WHERE expires_at < CURRENT_TIMESTAMP OR used = TRUE;
END;
$$ LANGUAGE plpgsql;

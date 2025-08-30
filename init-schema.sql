-- Initialize the database schema for Federal Register documents
-- This file runs automatically when PostgreSQL container starts

-- Create the federal_register_documents table
CREATE TABLE IF NOT EXISTS federal_register_documents (
    id SERIAL PRIMARY KEY,
    document_number VARCHAR(50) UNIQUE NOT NULL,
    title TEXT NOT NULL,
    abstract TEXT,
    html_url TEXT,
    pdf_url TEXT,
    publication_date DATE,
    agencies TEXT, -- JSON string format as returned by the code node
    document_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_document_number ON federal_register_documents(document_number);
CREATE INDEX IF NOT EXISTS idx_publication_date ON federal_register_documents(publication_date);
CREATE INDEX IF NOT EXISTS idx_document_type ON federal_register_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_title ON federal_register_documents(title);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updated_at
CREATE TRIGGER update_federal_register_documents_updated_at 
    BEFORE UPDATE ON federal_register_documents 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();


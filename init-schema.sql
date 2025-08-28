-- Initialize the database schema for Federal Register documents
-- This file runs automatically when PostgreSQL container starts

-- Create the federal_register_documents table
CREATE TABLE IF NOT EXISTS federal_register_documents (
    id SERIAL PRIMARY KEY,
    document_number VARCHAR(50) UNIQUE NOT NULL,
    title TEXT NOT NULL,
    abstract TEXT,
    document_type VARCHAR(20),
    publication_date DATE,
    effective_date DATE,
    agencies JSONB,
    body_html_url TEXT,
    pdf_url TEXT,
    html_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    processed BOOLEAN DEFAULT FALSE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_document_number ON federal_register_documents(document_number);
CREATE INDEX IF NOT EXISTS idx_publication_date ON federal_register_documents(publication_date);
CREATE INDEX IF NOT EXISTS idx_document_type ON federal_register_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_processed ON federal_register_documents(processed);
CREATE INDEX IF NOT EXISTS idx_agencies ON federal_register_documents USING GIN (agencies);

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

-- Insert a sample document for testing
INSERT INTO federal_register_documents (
    document_number, 
    title, 
    abstract, 
    document_type, 
    publication_date, 
    agencies, 
    pdf_url, 
    html_url
) VALUES (
    '2025-16452',
    'Removal of Obsolete Regulations for Crop Insurance Provisions',
    'Risk Management Agency (RMA), on behalf of the Federal Crop Insurance Corporation (FCIC), is in the process of reviewing all regulations within its purview to reduce regulatory burdens and costs.',
    'RULE',
    '2025-08-27',
    '[{"name": "Risk Management Agency", "slug": "risk-management-agency", "json_url": "https://www.federalregister.gov/api/v1/agencies/123", "parent_id": null}]',
    'https://www.govinfo.gov/content/pkg/FR-2025-08-27/pdf/2025-16452.pdf',
    'https://www.federalregister.gov/documents/2025/08/27/2025-16452/removal-of-obsolete-regulations-for-crop-insurance-provisions'
) ON CONFLICT (document_number) DO NOTHING; 
# PostgreSQL Integration Guide for Federal Register Data

## 🗄️ **Database Setup**

Your PostgreSQL database is already configured with the `federal_register_documents` table. The schema includes:

```sql
CREATE TABLE federal_register_documents (
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
```

## 🔧 **Step-by-Step n8n Workflow Setup**

### **Step 1: Create Your Workflow**

1. Open n8n at `http://localhost:5678`
2. Create a new workflow
3. Add these nodes in order:

### **Step 2: HTTP Request Node (Federal Register API)**

**Node Type:** HTTP Request

**Configuration:**
- **Method:** GET
- **URL:** `https://www.federalregister.gov/api/v1/documents`
- **Query Parameters:**
  - `conditions[publication_date][gte]`: `={{ $now.minus({days: 7}).format('yyyy-MM-dd') }}`
  - `per_page`: `100`
  - `order`: `newest`

### **Step 3: Code Node (Data Processor)**

**Node Type:** Code

**Copy the JavaScript code from:** `n8n-code-node-federal-register-processor.js`

This node processes the API response and extracts the required fields.

### **Step 4: PostgreSQL Node (Database Insert)**

**Node Type:** PostgreSQL

**Configuration:**
- **Operation:** Insert
- **Schema:** `public`
- **Table:** `federal_register_documents`
- **Columns Mapping:**
  - `document_number`: `={{ $json.document_number }}`
  - `title`: `={{ $json.title }}`
  - `abstract`: `={{ $json.abstract }}`
  - `html_url`: `={{ $json.html_url }}`
  - `pdf_url`: `={{ $json.pdf_url }}`
  - `publication_date`: `={{ $json.publication_date }}`
  - `agencies`: `={{ $json.agencies }}`
  - `document_type`: `={{ $json.document_type }}`

**Options:**
- **Query Batching:** `independently` (processes each document separately)

## 🔐 **Step 5: Configure PostgreSQL Credentials**

### **Option A: Using Environment Variables (Recommended)**

Your `docker-compose-postgres.yml` already has the credentials configured:

```yaml
POSTGRES_DB: n8n
POSTGRES_USER: postgres
POSTGRES_PASSWORD: postgres123
```

### **Option B: Manual Credential Setup**

1. In n8n, go to **Settings** → **Credentials**
2. Click **Add Credential**
3. Select **PostgreSQL**
4. Fill in:
   - **Host:** `localhost` (or `postgres` if running in Docker)
   - **Port:** `5432`
   - **Database:** `n8n`
   - **User:** `postgres`
   - **Password:** `postgres123`

## 🔗 **Step 6: Connect the Nodes**

Connect your nodes in this order:
```
HTTP Request → Code Node → PostgreSQL
```

## 🚀 **Step 7: Test Your Workflow**

1. **Test the HTTP Request:** Click the play button on the HTTP Request node
2. **Check the Response:** Verify you're getting Federal Register data
3. **Test the Code Node:** Check that it's processing the data correctly
4. **Test the Database Insert:** Run the full workflow

## 📊 **Step 8: Verify Data in Database**

You can verify the data is being inserted by connecting to your PostgreSQL database:

```bash
# Connect to the PostgreSQL container
docker exec -it n8n-postgres psql -U postgres -d n8n

# Check the data
SELECT document_number, title, publication_date, document_type 
FROM federal_register_documents 
ORDER BY created_at DESC 
LIMIT 10;
```

## 🔄 **Step 9: Schedule Your Workflow (Optional)**

To automatically run this workflow:

1. **Add a Trigger Node:**
   - **Node Type:** Cron
   - **Cron Expression:** `0 9 * * *` (runs daily at 9 AM)

2. **Connect it to your workflow:**
   ```
   Cron Trigger → HTTP Request → Code Node → PostgreSQL
   ```

## 🛠️ **Troubleshooting**

### **Common Issues:**

1. **Connection Error:**
   - Verify PostgreSQL is running: `docker ps`
   - Check credentials in n8n
   - Ensure ports are accessible

2. **Data Not Inserting:**
   - Check the Code Node output
   - Verify column mappings in PostgreSQL node
   - Check for duplicate document_number errors

3. **Permission Errors:**
   - Ensure the database user has INSERT permissions
   - Check if the table exists: `\dt federal_register_documents`

### **Debug Commands:**

```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# View PostgreSQL logs
docker logs n8n-postgres

# Connect to database
docker exec -it n8n-postgres psql -U postgres -d n8n

# Check table structure
\d federal_register_documents

# Check recent data
SELECT COUNT(*) FROM federal_register_documents;
```

## 📈 **Monitoring Your Data**

### **Useful Queries:**

```sql
-- Count documents by type
SELECT document_type, COUNT(*) 
FROM federal_register_documents 
GROUP BY document_type;

-- Recent documents
SELECT document_number, title, publication_date 
FROM federal_register_documents 
ORDER BY publication_date DESC 
LIMIT 20;

-- Documents by agency
SELECT agencies, COUNT(*) 
FROM federal_register_documents 
GROUP BY agencies;
```

## 🎯 **Next Steps**

Once your basic workflow is working:

1. **Add Error Handling:** Add error handling nodes
2. **Add Notifications:** Send email/Slack notifications on success/failure
3. **Add Data Validation:** Validate data before insertion
4. **Add Deduplication:** Handle duplicate documents more gracefully
5. **Add Monitoring:** Set up alerts for workflow failures

Your Federal Register data pipeline is now ready to automatically collect and store documents in your PostgreSQL database!

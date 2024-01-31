const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 5001;
const SUPABASE_URL = process.env.SUPABASE_URL || "https://xaoeqmpiblmgtzqqqhti.supabase.co";
const SUPABASE_ANONYMOUS_KEY =
    process.env.SUPABASE_ANONYMOUS_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhhb2VxbXBpYmxtZ3R6cXFxaHRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTM0MDk5OTgsImV4cCI6MjAwODk4NTk5OH0.0IlnkTD2DeoxlWHxpy2p8v9eq4nemrzCEpt6YxOz4Vg";

const STORAGE_BUCKET_NAME = "autosocial";

module.exports = {
    PORT,
    SUPABASE_URL,
    SUPABASE_ANONYMOUS_KEY,
    STORAGE_BUCKET_NAME,
};

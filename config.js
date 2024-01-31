const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 5001;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANONYMOUS_KEY = process.env.SUPABASE_ANONYMOUS_KEY;
const STORAGE_BUCKET_NAME = "autosocial";

module.exports = {
    PORT,
    SUPABASE_URL,
    SUPABASE_ANONYMOUS_KEY,
    STORAGE_BUCKET_NAME,
};

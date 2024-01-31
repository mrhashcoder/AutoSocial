const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const config = require("../config");
const path = require("path");

// Initialize Supabase client
const supabaseUrl = config.SUPABASE_URL;
const supabaseKey = config.SUPABASE_ANONYMOUS_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bihworugwnoqbtwkisnj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpaHdvcnVnd25vcWJ0d2tpc25qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMTc4OTYsImV4cCI6MjA3MTc5Mzg5Nn0.WNXtMeBfXzzc9K0J1cUdMdkPR7cQtQWSxzKA2SmxXG8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
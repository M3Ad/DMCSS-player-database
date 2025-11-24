// Quick test to verify Supabase connection
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ipgbdpjjnnubzuddholu.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwZ2JkcGpqbm51Ynp1ZGRob2x1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5OTAwNDAsImV4cCI6MjA3OTU2NjA0MH0.3-Sk_dyHI_lihCT6Ri1_dqNqSDMGJIis1193V-buTYk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...\n');
  console.log('URL:', supabaseUrl);
  console.log('Key:', supabaseKey.substring(0, 20) + '...\n');

  try {
    // Test 1: Check if we can connect
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.log('❌ Connection test failed:', error.message);
      if (error.message.includes('relation') || error.message.includes('does not exist')) {
        console.log('\n⚠️  The profiles table does not exist yet.');
        console.log('📝 You need to run the SQL migrations in Supabase.');
      }
    } else {
      console.log('✅ Successfully connected to Supabase!');
      console.log('✅ Profiles table exists');
    }

    // Test 2: Check auth
    const { data: { session } } = await supabase.auth.getSession();
    console.log('🔐 Auth status:', session ? 'Logged in' : 'Not logged in (expected)');

  } catch (err) {
    console.log('❌ Unexpected error:', err.message);
  }
}

testConnection();

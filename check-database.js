// Check which migrations have been applied
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ipgbdpjjnnubzuddholu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwZ2JkcGpqbm51Ynp1ZGRob2x1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5OTAwNDAsImV4cCI6MjA3OTU2NjA0MH0.3-Sk_dyHI_lihCT6Ri1_dqNqSDMGJIis1193V-buTYk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  console.log('🔍 Checking database setup...\n');

  const tables = ['profiles', 'player_card', 'training_program'];
  
  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ ${table}: NOT FOUND - ${error.message}`);
      } else {
        console.log(`✅ ${table}: EXISTS (${count} rows)`);
      }
    } catch (err) {
      console.log(`❌ ${table}: ERROR - ${err.message}`);
    }
  }

  // Check for role column in profiles
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .limit(1);
    
    if (error) {
      console.log('\n⚠️  role column: NOT FOUND in profiles table');
    } else {
      console.log('\n✅ role column: EXISTS in profiles table');
    }
  } catch (err) {
    console.log('\n⚠️  Could not check role column');
  }

  // Check storage bucket
  try {
    const { data, error } = await supabase
      .storage
      .getBucket('player-photos');
    
    if (error) {
      console.log('⚠️  player-photos bucket: NOT FOUND');
    } else {
      console.log('✅ player-photos bucket: EXISTS');
    }
  } catch (err) {
    console.log('⚠️  Could not check storage bucket');
  }

  console.log('\n📋 Summary:');
  console.log('If any items are missing, you need to run the corresponding migration in Supabase SQL Editor.');
}

checkDatabase();

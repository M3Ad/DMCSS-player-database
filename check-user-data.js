// Check what data exists for your user
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ipgbdpjjnnubzuddholu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwZ2JkcGpqbm51Ynp1ZGRob2x1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5OTAwNDAsImV4cCI6MjA3OTU2NjA0MH0.3-Sk_dyHI_lihCT6Ri1_dqNqSDMGJIis1193V-buTYk';

const supabase = createClient(supabaseUrl, supabaseKey);

const userId = 'a70eb4e7-267f-45cb-a4d1-853babc2cad4'; // Your user ID from the alert

async function checkUserData() {
  console.log('🔍 Checking data for user:', userId);
  console.log('');

  // Check profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  console.log('📋 Profile:', profile);
  if (profileError) console.log('❌ Profile error:', profileError.message);
  console.log('');

  // Check player_card
  const { data: card, error: cardError } = await supabase
    .from('player_card')
    .select('*')
    .eq('user_id', userId);

  console.log('⚽ Player Card:', card);
  if (cardError) console.log('❌ Card error:', cardError.message);
  console.log('');

  // Check training_program
  const { data: program, error: programError } = await supabase
    .from('training_program')
    .select('*')
    .eq('user_id', userId);

  console.log('💪 Training Program:', program);
  if (programError) console.log('❌ Program error:', programError.message);
  console.log('');

  // Summary
  console.log('📊 Summary:');
  console.log('- Profile exists:', !!profile);
  console.log('- Player card exists:', card && card.length > 0);
  console.log('- Training program exists:', program && program.length > 0);
}

checkUserData();

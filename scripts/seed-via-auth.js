const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bssaasbcxooihfjxbnzn.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzc2Fhc2JjeG9vaWhmanhibnpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2Nzg5NzMsImV4cCI6MjA5OTI1NDk3M30.B5D5dwvN0j4KSfl4Jqxzgln7F8fYDxHjQwObOQEJMDg';

async function createProfile(email, password, profile, extra) {
  console.log(`\n=== ${email} ===`);
  
  const supabase = createClient(supabaseUrl, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });

  let userId, accessToken;

  // Try sign in
  const { data: signIn, error: signInErr } = await supabase.auth.signInWithPassword({ email, password });

  if (signInErr) {
    console.log(`  Sign in failed, trying sign up...`);
    const { data: signUp, error: signUpErr } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: profile.firstname + ' ' + profile.lastname } }
    });
    if (signUpErr) { console.error(`  Sign up failed: ${signUpErr.message}`); return null; }
    userId = signUp.user?.id;
    accessToken = signUp.session?.access_token;
    console.log(`  Signed up: ${userId}`);
    await new Promise(r => setTimeout(r, 2000));
  } else {
    userId = signIn.user?.id;
    accessToken = signIn.session?.access_token;
    console.log(`  Signed in: ${userId}`);
  }

  if (!accessToken) {
    console.error('  No access token');
    return null;
  }

  // Create authed client with the user's access token
  const authedClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });

  const { error: profileErr } = await authedClient
    .from('users')
    .upsert({
      id: userId,
      email,
      firstname: profile.firstname,
      lastname: profile.lastname,
      role: profile.role,
      status: 1,
      ev: 1,
      sv: 1,
    }, { onConflict: 'id' });

  if (profileErr) {
    console.error(`  Profile error: ${profileErr.message}`);
    return null;
  }
  console.log(`  Profile OK`);

  if (extra?.hotel) {
    const { data: existing } = await authedClient
      .from('hotels').select('id').eq('user_id', userId).maybeSingle();

    if (!existing) {
      const { data: hotel, error: hotelErr } = await authedClient
        .from('hotels').insert({ user_id: userId, ...extra.hotel }).select('id').single();
      
      if (hotelErr) { console.error(`  Hotel error: ${hotelErr.message}`); }
      else {
        console.log(`  Hotel created: ${hotel.id}`);
        if (extra.service) {
          await authedClient.from('services').upsert({ user_id: userId, ...extra.service }, { onConflict: 'user_id' });
        }
        if (extra.rooms) {
          for (const room of extra.rooms) {
            await authedClient.from('rooms').upsert({ hotel_id: hotel.id, ...room }, { onConflict: 'hotel_id,room_number' });
          }
          console.log(`  ${extra.rooms.length} rooms`);
        }
      }
    } else { console.log(`  Hotel exists: ${existing.id}`); }
  }

  return userId;
}

async function run() {
  await createProfile('admin@twixhotel.com', 'Admin@123', {
    firstname: 'Super', lastname: 'Admin', role: 'super_admin',
  });

  await createProfile('hotel@twixhotel.com', 'Hotel@123', {
    firstname: 'Hotel', lastname: 'Manager', role: 'hotel_admin',
  }, {
    hotel: {
      name: 'Grand Luxury Hotel', email: 'hotel@twixhotel.com', phone: '+1-555-0100',
      address: '123 Main Street', city: 'New York', country: 'USA',
      currency: 'USD', currency_symbol: '$', check_in_time: '14:00', check_out_time: '12:00',
      timezone: 'America/New_York', status: 1,
    },
    service: { is_free_trial: 1, status: 1, subdomain: 'grandluxury' },
    rooms: [
      { room_number: '101', room_type: 'Standard', floor: '1', capacity: 2, price_per_night: 120, status: 'available', amenities: ['WiFi', 'TV'] },
      { room_number: '102', room_type: 'Standard', floor: '1', capacity: 2, price_per_night: 120, status: 'available', amenities: ['WiFi', 'TV'] },
      { room_number: '201', room_type: 'Deluxe', floor: '2', capacity: 3, price_per_night: 200, status: 'available', amenities: ['WiFi', 'TV', 'Mini Bar'] },
      { room_number: '301', room_type: 'Suite', floor: '3', capacity: 4, price_per_night: 350, status: 'available', amenities: ['WiFi', 'TV', 'Mini Bar', 'Jacuzzi'] },
    ],
  });

  await createProfile('staff@twixhotel.com', 'Staff@123', {
    firstname: 'Staff', lastname: 'Member', role: 'staff',
  });

  console.log('\nAll done!');
}

run().catch(err => { console.error('Failed:', err); process.exit(1); });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bssaasbcxooihfjxbnzn.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzc2Fhc2JjeG9vaWhmanhibnpuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzY3ODk3MywiZXhwOjIwOTkyNTQ5NzN9.rOMwZk-CPTdPuvNvE2-sGrrBFhLQOq82_4oDpP_kN5I';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function run() {
  // 1. Create user profiles
  console.log('Creating user profiles...');
  
  const users = [
    { id: 'd32c235f-0267-408e-a5d3-6da866f01fe6', email: 'admin@twixhotel.com', firstname: 'Super', lastname: 'Admin', role: 'super_admin', status: 1, ev: 1, sv: 1 },
    { id: 'f3158cab-5f65-4229-952a-54c5d2aa94c9', email: 'hotel@twixhotel.com', firstname: 'Hotel', lastname: 'Manager', role: 'hotel_admin', status: 1, ev: 1, sv: 1 },
    { id: '18547683-0d76-4ccf-be2a-b05fa721a2e2', email: 'staff@twixhotel.com', firstname: 'Staff', lastname: 'Member', role: 'staff', status: 1, ev: 1, sv: 1 },
  ];

  for (const u of users) {
    const { error } = await supabase.from('users').upsert(u, { onConflict: 'id' });
    if (error) {
      console.error(`Error inserting ${u.email}:`, error.message);
    } else {
      console.log(`  ${u.email} OK`);
    }
  }

  // 2. Create hotel
  console.log('\nCreating hotel...');
  const { data: existingHotel } = await supabase
    .from('hotels')
    .select('id')
    .eq('user_id', 'f3158cab-5f65-4229-952a-54c5d2aa94c9')
    .maybeSingle();

  let hotelId = existingHotel?.id;

  if (!hotelId) {
    const { data: hotel, error: hotelErr } = await supabase
      .from('hotels')
      .insert({
        user_id: 'f3158cab-5f65-4229-952a-54c5d2aa94c9',
        name: 'Grand Luxury Hotel',
        email: 'hotel@twixhotel.com',
        phone: '+1-555-0100',
        address: '123 Main Street',
        city: 'New York',
        country: 'USA',
        currency: 'USD',
        currency_symbol: '$',
        check_in_time: '14:00',
        check_out_time: '12:00',
        timezone: 'America/New_York',
        status: 1,
      })
      .select('id')
      .single();

    if (hotelErr) {
      console.error('Hotel error:', hotelErr.message);
      return;
    }
    hotelId = hotel.id;
    console.log('  Hotel created:', hotelId);
  } else {
    console.log('  Hotel already exists:', hotelId);
  }

  // 3. Create service
  console.log('\nCreating service...');
  const { error: svcErr } = await supabase
    .from('services')
    .upsert({ user_id: 'f3158cab-5f65-4229-952a-54c5d2aa94c9', is_free_trial: 1, status: 1, subdomain: 'grandluxury' }, { onConflict: 'user_id' });

  if (svcErr) {
    console.error('Service error:', svcErr.message);
  } else {
    console.log('  Service OK');
  }

  // 4. Create rooms
  console.log('\nCreating rooms...');
  const rooms = [
    { hotel_id: hotelId, room_number: '101', room_type: 'Standard', floor: '1', capacity: 2, price_per_night: 120, status: 'available', amenities: ['WiFi', 'TV'] },
    { hotel_id: hotelId, room_number: '102', room_type: 'Standard', floor: '1', capacity: 2, price_per_night: 120, status: 'available', amenities: ['WiFi', 'TV'] },
    { hotel_id: hotelId, room_number: '201', room_type: 'Deluxe', floor: '2', capacity: 3, price_per_night: 200, status: 'available', amenities: ['WiFi', 'TV', 'Mini Bar'] },
    { hotel_id: hotelId, room_number: '301', room_type: 'Suite', floor: '3', capacity: 4, price_per_night: 350, status: 'available', amenities: ['WiFi', 'TV', 'Mini Bar', 'Jacuzzi'] },
  ];

  for (const room of rooms) {
    const { error: rErr } = await supabase
      .from('rooms')
      .upsert(room, { onConflict: 'hotel_id,room_number' });
    if (rErr) console.error(`  Room ${room.room_number} error:`, rErr.message);
    else console.log(`  Room ${room.room_number} OK`);
  }

  console.log('\nAll done!');
}

run().catch(err => {
  console.error('Failed:', err);
  process.exit(1);
});

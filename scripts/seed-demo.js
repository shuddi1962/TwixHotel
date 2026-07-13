const { Client } = require('pg');

const client = new Client({
  host: 'db.bssaasbcxooihfjxbnzn.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: process.env.SUPABASE_DB_PASSWORD || '07039Suco2004$',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  console.log('Connected to DB');

  // Insert user profiles
  await client.query(`
    INSERT INTO public.users (id, email, firstname, lastname, role, status, ev, sv)
    VALUES 
      ('d32c235f-0267-408e-a5d3-6da866f01fe6', 'admin@twixhotel.com', 'Super', 'Admin', 'super_admin', 1, 1, 1),
      ('f3158cab-5f65-4229-952a-54c5d2aa94c9', 'hotel@twixhotel.com', 'Hotel', 'Manager', 'hotel_admin', 1, 1, 1),
      ('18547683-0d76-4ccf-be2a-b05fa721a2e2', 'staff@twixhotel.com', 'Staff', 'Member', 'staff', 1, 1, 1)
    ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role, status = EXCLUDED.status;
  `);
  console.log('Users inserted/updated');

  // Create hotel
  const hotelResult = await client.query(`
    INSERT INTO public.hotels (user_id, name, email, phone, address, city, country, currency, currency_symbol, check_in_time, check_out_time, timezone, status)
    VALUES ('f3158cab-5f65-4229-952a-54c5d2aa94c9', 'Grand Luxury Hotel', 'hotel@twixhotel.com', '+1-555-0100', '123 Main Street', 'New York', 'USA', 'USD', '$', '14:00', '12:00', 'America/New_York', 1)
    ON CONFLICT DO NOTHING
    RETURNING id;
  `);
  const hotelId = hotelResult.rows[0]?.id;
  console.log('Hotel created:', hotelId);

  if (hotelId) {
    await client.query(`
      INSERT INTO public.services (user_id, is_free_trial, status, subdomain)
      VALUES ('f3158cab-5f65-4229-952a-54c5d2aa94c9', 1, 1, 'grandluxury')
      ON CONFLICT DO NOTHING;
    `);
    console.log('Service created');

    await client.query(`
      INSERT INTO public.rooms (hotel_id, room_number, room_type, floor, capacity, price_per_night, status, amenities)
      VALUES
        ($1, '101', 'Standard', '1', 2, 120, 'available', ARRAY['WiFi', 'TV']),
        ($1, '102', 'Standard', '1', 2, 120, 'available', ARRAY['WiFi', 'TV']),
        ($1, '201', 'Deluxe', '2', 3, 200, 'available', ARRAY['WiFi', 'TV', 'Mini Bar']),
        ($1, '301', 'Suite', '3', 4, 350, 'available', ARRAY['WiFi', 'TV', 'Mini Bar', 'Jacuzzi'])
      ON CONFLICT DO NOTHING;
    `, [hotelId]);
    console.log('4 rooms created');
  }

  await client.end();
  console.log('All done!');
}

run().catch(err => {
  console.error('Failed:', err.message);
  process.exit(1);
});

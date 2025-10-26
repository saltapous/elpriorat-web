-- ==========================================
-- SEED DATA FOR EL PRIORAT PROJECT
-- ==========================================

-- Usuari genèric
insert into public.users (name, email, phone, role)
values ('Joan Serra', 'joan@example.com', '+34 600123456', 'user')
on conflict (email) do nothing;

-- Propietari
insert into public.owners (name, email, phone, payout_method)
values (
  'Maria Rovira',
  'maria@example.com',
  '+34 600654321',
  jsonb_build_object('iban', 'ES9820385778983000760236', 'method', 'bank_transfer')
)
on conflict (email) do nothing;

-- Establiment
insert into public.establishments (
  owner_id, name, description, address, town, region, map_location, phone, email, main_image
)
select
  o.id,
  'Casa del Montsant',
  'Casa rural acollidora envoltada de vinyes, ideal per gaudir del Montsant.',
  'Carrer Major 12',
  'La Morera de Montsant',
  'Priorat',
  jsonb_build_object('lat', 41.242, 'lng', 0.819, 'map_url', 'https://goo.gl/maps/example'),
  '+34 977123456',
  'info@casadelmontsant.cat',
  'https://elpriorat.cat/images/hero-priorat.jpg'
from public.owners o
where o.email = 'maria@example.com'
on conflict do nothing;

-- Traducció (Català)
insert into public.establishment_translations (establishment_id, lang, name, description)
select
  e.id, 'ca',
  'Casa del Montsant',
  'Casa rural amb encant, amb vistes al Parc Natural del Montsant i a tocar de les vinyes.'
from public.establishments e
where e.name = 'Casa del Montsant'
on conflict do nothing;

-- Allotjament
insert into public.accommodations (
  establishment_id, name, description, capacity, bedrooms, bathrooms, size_m2,
  base_price_per_night, images, features, house_rules
)
select
  e.id,
  'Habitació doble amb vistes',
  'Habitació confortable amb bany privat i vistes al Montsant.',
  2, 1, 1, 24,
  120.00,
  jsonb_build_array('https://elpriorat.cat/images/hero-priorat.jpg'),
  jsonb_build_object('wifi', true, 'pool', false, 'pets_allowed', true),
  'No fumar a l’interior. Es permeten mascotes educades.'
from public.establishments e
where e.name = 'Casa del Montsant'
on conflict do nothing;

-- Traducció de l’allotjament (Català)
insert into public.accommodation_translations (accommodation_id, lang, name, description, house_rules)
select
  a.id, 'ca',
  'Habitació doble amb vistes',
  'Habitació acollidora amb bany privat i vistes panoràmiques del Montsant.',
  'No fumar a l’interior. Es permeten mascotes educades.'
from public.accommodations a
where a.name = 'Habitació doble amb vistes'
on conflict do nothing;

-- Tarifa
insert into public.rates (accommodation_id, start_date, end_date, price_per_night, min_nights, notes)
select
  a.id, '2025-01-01', '2025-12-31', 120.00, 2, 'Temporada estàndard'
from public.accommodations a
where a.name = 'Habitació doble amb vistes'
on conflict do nothing;

-- Bloqueig de disponibilitat
insert into public.availability_blocks (accommodation_id, start_date, end_date, reason)
select
  a.id, '2025-08-10', '2025-08-15', 'Reservat per ús personal'
from public.accommodations a
where a.name = 'Habitació doble amb vistes'
on conflict do nothing;

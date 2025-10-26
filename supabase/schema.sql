-- Enable required extensions (Supabase normalment ja les té)
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- =========================
-- ENUM TYPES
-- =========================

create type user_role as enum ('admin', 'user', 'owner', 'manager', 'viewer');
create type booking_status as enum ('pending', 'confirmed', 'cancelled', 'refunded');
create type payment_status as enum ('pending', 'paid', 'refunded', 'failed');
create type refund_status as enum ('pending', 'done', 'denied');

-- =========================
-- USERS
-- =========================
create table public.users (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    email text not null unique,
    phone text,
    avatar_url text,
    role user_role not null default 'user',
    created_at timestamptz not null default now()
);

-- =========================
-- OWNERS
-- Propietari de l'establiment (pot ser o no ser també un user del sistema).
-- =========================
create table public.owners (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    email text not null,
    phone text,
    payout_method jsonb, -- IBAN, Stripe account ID, etc.
    created_at timestamptz not null default now()
);

-- =========================
-- ESTABLISHMENTS
-- Un hotel, una casa rural, un càmping, etc.
-- =========================
create table public.establishments (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid references public.owners(id) on delete set null,
    name text not null,
    description text,
    address text,
    town text,
    region text,
    map_location jsonb, -- { lat, lng, map_url }
    phone text,
    email text,
    main_image text,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Traduccions d'un establishment
-- Exemple: lang = 'ca', 'es', 'en'
create table public.establishment_translations (
    id uuid primary key default gen_random_uuid(),
    establishment_id uuid not null references public.establishments(id) on delete cascade,
    lang text not null, -- ISO code like 'ca', 'es', 'en'
    name text not null,
    description text,
    unique (establishment_id, lang)
);

-- =========================
-- ACCOMMODATIONS
-- Una unitat reservable dins l'establiment
-- (hab. doble, bungalow #3, casa sencera...)
-- =========================
create table public.accommodations (
    id uuid primary key default gen_random_uuid(),
    establishment_id uuid not null references public.establishments(id) on delete cascade,
    name text not null,
    description text,
    capacity integer not null,
    bedrooms integer,
    bathrooms numeric(3,1),
    size_m2 integer,
    base_price_per_night numeric(10,2) not null,
    cover_image text,          -- ✅ nova: imatge destacada
    images jsonb,              -- galeria de fotos
    features jsonb,            -- { wifi: true, pool: false, pets_allowed: true, ... }
    house_rules text,
    is_active boolean not null default true,
    created_at timestamptz not null default now()
);


-- Traduccions d'una accommodation
create table public.accommodation_translations (
    id uuid primary key default gen_random_uuid(),
    accommodation_id uuid not null references public.accommodations(id) on delete cascade,
    lang text not null,
    name text not null,
    description text,
    house_rules text,
    unique (accommodation_id, lang)
);

-- =========================
-- RATES
-- Preus i condicions per rangs de dates
-- =========================
create table public.rates (
    id uuid primary key default gen_random_uuid(),
    accommodation_id uuid not null references public.accommodations(id) on delete cascade,
    start_date date not null,
    end_date date not null,
    price_per_night numeric(10,2) not null,
    min_nights integer,
    max_guests integer,
    notes text,
    created_at timestamptz not null default now()
);

-- Opcionalment podem imposar que start_date <= end_date
alter table public.rates
    add constraint rates_valid_range check (start_date <= end_date);

-- =========================
-- AVAILABILITY_BLOCKS
-- Dates bloquejades manualment (manteniment, reserva externa...)
-- =========================
create table public.availability_blocks (
    id uuid primary key default gen_random_uuid(),
    accommodation_id uuid not null references public.accommodations(id) on delete cascade,
    start_date date not null,
    end_date date not null,
    reason text,
    created_at timestamptz not null default now()
);

alter table public.availability_blocks
    add constraint availability_valid_range check (start_date <= end_date);

-- =========================
-- BOOKINGS
-- Una reserva feta per un usuari
-- =========================
create table public.bookings (
    id uuid primary key default gen_random_uuid(),
    accommodation_id uuid not null references public.accommodations(id) on delete restrict,
    user_id uuid not null references public.users(id) on delete restrict,
    check_in date not null,
    check_out date not null,
    guests_count integer not null default 1,
    total_price numeric(10,2) not null,
    status booking_status not null default 'pending',
    created_at timestamptz not null default now()
);

alter table public.bookings
    add constraint booking_valid_range check (check_in < check_out);

-- =========================
-- PAYMENTS
-- Pagaments associats a una reserva
-- =========================
create table public.payments (
    id uuid primary key default gen_random_uuid(),
    booking_id uuid not null references public.bookings(id) on delete cascade,
    amount numeric(10,2) not null,
    currency text not null default 'EUR',
    payment_status payment_status not null default 'pending',
    payment_method text, -- 'card', 'bank_transfer', etc. or provider ref
    transaction_details jsonb, -- resposta del TPV / Stripe / etc.
    created_at timestamptz not null default now()
);

-- =========================
-- CANCELLATIONS
-- Informació de cancel·lació i (si toca) devolució
-- =========================
create table public.cancellations (
    id uuid primary key default gen_random_uuid(),
    booking_id uuid not null references public.bookings(id) on delete cascade,
    cancelled_at timestamptz not null default now(),
    refund_amount numeric(10,2),
    refund_status refund_status,
    reason text
);

-- =========================
-- REVIEWS
-- Valoracions que deixa un usuari sobre una accommodation
-- =========================
create table public.reviews (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.users(id) on delete cascade,
    accommodation_id uuid not null references public.accommodations(id) on delete cascade,
    rating integer not null,
    comment text,
    is_public boolean not null default true,
    created_at timestamptz not null default now(),
    constraint rating_range check (rating >= 1 and rating <= 5),
    unique (user_id, accommodation_id) -- 1 review per user per lloc
);

-- =========================
-- PERMISSIONS
-- Qui pot gestionar què al panell
-- =========================
create table public.permissions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.users(id) on delete cascade,
    establishment_id uuid not null references public.establishments(id) on delete cascade,
    role user_role not null,
    created_at timestamptz not null default now(),
    unique (user_id, establishment_id)
);

-- =========================
-- AUDIT_LOGS (opcional però molt útil)
-- Registre d'accions administratives
-- =========================
create table public.audit_logs (
    id uuid primary key default gen_random_uuid(),
    actor_user_id uuid references public.users(id) on delete set null,
    action text not null,         -- ex: 'UPDATE_RATE', 'BLOCK_DATES', 'CANCEL_BOOKING'
    target_type text not null,    -- ex: 'rate', 'booking', 'availability_block'
    target_id uuid not null,
    metadata jsonb,
    created_at timestamptz not null default now()
);

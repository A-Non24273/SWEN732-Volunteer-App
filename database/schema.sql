-- Listing status
CREATE TYPE listing_status AS ENUM (
    'open',
    'cancelled',
    'completed'
);

-- Application status
CREATE TYPE application_status AS ENUM (
    'pending',
    'approved',
    'rejected',
    'withdrawn'
);

-- Users table
CREATE TABLE users (
    id int PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Listings table
CREATE TABLE listings (
    id int PRIMARY KEY,
    requester_id INT NOT NULL,
    title VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255),
    event_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    status listing_status NOT NULL DEFAULT 'open',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
);

-- Volunteer to Listings join/junction table
CREATE TABLE volunteer_listings (
    user_id INT NOT NULL,
    listing_id INT NOT NULL,
    status application_status NOT NULL DEFAULT 'pending',
    applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (user_id, listing_id),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
);
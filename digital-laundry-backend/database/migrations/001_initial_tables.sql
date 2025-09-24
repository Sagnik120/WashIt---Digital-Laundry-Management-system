-- Create enum types
CREATE TYPE user_role AS ENUM ('student', 'staff', 'admin');
CREATE TYPE order_status AS ENUM ('in progress', 'completed');

-- Create tables
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    roll_number VARCHAR(50) UNIQUE,
    hostel_name VARCHAR(10),
    room_number VARCHAR(10),
    phone_number VARCHAR(15),
    department_name VARCHAR(100),
    passing_year INTEGER,
    profile_picture TEXT,
    laundry_id VARCHAR(50) UNIQUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS staff_codes (
    id SERIAL PRIMARY KEY,
    staff_code VARCHAR(20) UNIQUE NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS laundry_items (
    id SERIAL PRIMARY KEY,
    item_name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS laundry_orders (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(50) UNIQUE NOT NULL,
    student_id INTEGER REFERENCES users(id) NOT NULL,
    status order_status DEFAULT 'in progress',
    submission_date DATE NOT NULL,
    completed_at TIMESTAMP,
    completed_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES laundry_orders(id) ON DELETE CASCADE,
    item_id INTEGER REFERENCES laundry_items(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS otp_verifications (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user
INSERT INTO users (email, password, full_name, role, is_verified) 
VALUES (
    'admin@laundry.com', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: admin123
    'System Administrator', 
    'admin', 
    TRUE
) ON CONFLICT (email) DO NOTHING;

-- Insert laundry items
INSERT INTO laundry_items (item_name) VALUES 
('shirt'), ('pant'), ('t-shirt'), ('bedsheet'), ('towel'),
('jeans'), ('shorts'), ('dupatta'), ('kurta'), ('pyjama'),
('skirt'), ('pillow cover') 
ON CONFLICT (item_name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_laundry_id ON users(laundry_id);
CREATE INDEX IF NOT EXISTS idx_orders_student_id ON laundry_orders(student_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON laundry_orders(status);
CREATE INDEX IF NOT EXISTS idx_otp_email ON otp_verifications(email);
CREATE INDEX IF NOT EXISTS idx_otp_expires ON otp_verifications(expires_at);
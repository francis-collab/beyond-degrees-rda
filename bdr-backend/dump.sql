BEGIN;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL UNIQUE,
    hashed_password VARCHAR NOT NULL,
    full_name VARCHAR NOT NULL,
    phone VARCHAR,
    bio TEXT,
    avatar_url VARCHAR,
    role VARCHAR(12) NOT NULL,
    is_active BOOLEAN,
    is_verified BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

INSERT INTO users (id,email,hashed_password,full_name,phone,bio,avatar_url,role,is_active,is_verified,created_at,updated_at) VALUES
(1,'Francismutabazi96@gmail.com','$pbkdf2-sha256$29000$T0nJWeud8z7nnNN6bw0BgA$oBx9lgonQmTR2dVSUPP9ZDycqz8HrbG0F6qQsp8GLCY','Francis MUTABAZI',NULL,NULL,NULL,'entrepreneur',TRUE,NULL,'2025-11-22 08:49:46',NULL),
(2,'francismutabazi96@gmail.com','$pbkdf2-sha256$29000$P4fwPse4d27NWcvZu7d2Tg$d2eggPjN.q0hinyH5c/fsmufPRU3kcbSoU.ZvTIuszQ','Francis Mutabazi',NULL,NULL,NULL,'backer',TRUE,NULL,'2025-11-22 14:19:46',NULL),
(3,'hisexcellencyfrancis@gmail.com','$pbkdf2-sha256$29000$N8Z4j7EWwjgHgJAS4nxP6Q$9isA85EvLp6YEh/SGhDh2P5Hp1CiihJasCivioAI5IQ','Francis Schooten',NULL,NULL,NULL,'entrepreneur',TRUE,NULL,'2025-11-22 14:52:27',NULL),
(4,'francisschooten@gmail.com','$pbkdf2-sha256$29000$RUgppVRq7b23tlYqJcQYgw$hdlcrWz6qDrI0pHbLnDilBRazmR8GKJfIGuuiUJC9mU','Francis Mutabazi',NULL,NULL,NULL,'admin',TRUE,NULL,'2025-11-25 12:37:55',NULL);

-- Notifications table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(17) NOT NULL,
    data VARCHAR,
    is_read BOOLEAN DEFAULT FALSE,
    is_email_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- Projects table
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(220),
    description TEXT NOT NULL,
    sector VARCHAR(100) NOT NULL,
    funding_goal NUMERIC(12,2) NOT NULL,
    current_funding NUMERIC(12,2),
    job_goal INTEGER NOT NULL,
    image_url VARCHAR,
    video_url VARCHAR,
    status VARCHAR(8) NOT NULL,
    launched_at TIMESTAMP,
    ends_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    entrepreneur_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    jobs_to_create INTEGER NOT NULL DEFAULT 0,
    business_plan_pdf TEXT,
    backers_count INTEGER NOT NULL DEFAULT 0
);

INSERT INTO projects (id,title,slug,description,sector,funding_goal,current_funding,job_goal,image_url,video_url,status,launched_at,ends_at,created_at,updated_at,entrepreneur_id,jobs_to_create,business_plan_pdf,backers_count) VALUES
(1,'Francis Tours Africa','francis-tours-africa',
E'FrancisTours Africa is a dynamic travel and tourism initiative dedicated to showcasing the rich diversity, culture, and natural beauty of the African continent. The project focuses on providing authentic, community-centered travel experiences that empower local communities and promote sustainable tourism practices.\n\nFrancisTours Africa specializes in curated tours across East, Central, and Southern Africa—including wildlife safaris, cultural heritage trips, eco-tourism adventures, historical explorations, and personalized travel packages. The initiative emphasizes responsible tourism by partnering with local guides, small businesses, and conservation organizations to ensure that every trip contributes directly to community development and environmental protection.\n\nWith a strong commitment to customer experience, FrancisTours Africa offers seamless travel planning, including accommodation, transportation, guided tours, and immersive activities tailored to client interests. Whether travelers seek breathtaking landscapes, unforgettable wildlife encounters, or deep cultural experiences, the project delivers safe, enriching, and memorable journeys.\n\nUltimately, FrancisTours Africa stands as a bridge between travelers and the true heart of Africa—inviting the world to explore, learn, and connect with the continent’s unparalleled beauty and vibrant spirit. So please Join us!',
'Tourism & Hospitality',10000000,0,50,'/static/uploads/projects/3_francis-tours-africa_cover.png',NULL,'active','2025-11-23 14:25:23','2026-02-21 14:25:23','2025-11-23 14:25:23','2025-11-25 23:34:11',3,50,'/static/uploads/business_plans/3_francis-tours-africa_ClimateGuard_Initiative_Business_Plan.pdf',0);

-- Transactions table
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    amount NUMERIC(10,0) NOT NULL,
    jobs_created INTEGER,
    status VARCHAR(9),
    momo_ref VARCHAR UNIQUE,
    external_id VARCHAR,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    backer_id INTEGER REFERENCES users(id),
    project_id INTEGER REFERENCES projects(id)
);

-- Contact messages table
CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT INTO contact_messages (id,name,email,phone,subject,message,created_at,is_read) VALUES
(1,'Diane Ndayishimiye','hisexcellencyfrancis@gmail.com','+250 791 683 334','Partnership','Dear Beyond Degrees Rwanda Team. I like your initiative and I''d like to work with you.','2025-11-24 14:54:24',TRUE),
(2,'Diane Ndayishimiye','hisexcellencyfrancis@gmail.com','+250 791 683 334','Partnership reply','Have you gotten my message?','2025-11-24 15:02:48',TRUE),
(3,'Diane Ndayishimiye','francismutabazi96@gmail.com','+250 791 683 334','Feedback','I want to work with you','2025-11-25 14:28:37',TRUE);

-- Indexes
CREATE INDEX ix_notifications_type ON notifications(type);
CREATE INDEX ix_notifications_created_at ON notifications(created_at);
CREATE INDEX ix_notifications_user_id ON notifications(user_id);
CREATE INDEX ix_transactions_external_id ON transactions(momo_ref);
CREATE INDEX ix_contact_messages_created_at ON contact_messages(created_at);

COMMIT;

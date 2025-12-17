-- Création de la base de données (déjà créée par POSTGRES_DB)
-- CREATE DATABASE typescript_vue_db;

-- Connexion à la base de données
\c typescript_vue_db;

-- Création de la table users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table games (table principale des jeux)
CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    genre VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table intermédiaire user_games (relation many-to-many)
CREATE TABLE IF NOT EXISTS user_games (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    game_id INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    play_time_hours INTEGER DEFAULT 0,
    rating INTEGER CHECK (rating >= 1 AND rating <= 10),
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, game_id)
);

-- Création d'index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_games_name ON games(name);
CREATE INDEX IF NOT EXISTS idx_user_games_user_id ON user_games(user_id);
CREATE INDEX IF NOT EXISTS idx_user_games_game_id ON user_games(game_id);
CREATE INDEX IF NOT EXISTS idx_user_games_favorite ON user_games(is_favorite) WHERE is_favorite = TRUE;

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour mettre à jour automatiquement updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_games_updated_at 
    BEFORE UPDATE ON games 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_games_updated_at 
    BEFORE UPDATE ON user_games 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insertion de données de test (optionnel)
INSERT INTO users (name, email) VALUES 
    ('John Doe', 'john@doe.com'),
    ('Tony Truand', 'tonytruand@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- Insertion des jeux dans la table games
INSERT INTO games (name, description, genre) VALUES 
    ('The Witcher 3', 'RPG fantastique avec une histoire épique', 'RPG'),
    ('Darkest Dungeon', 'RPG tactique sombre et difficile', 'RPG'),
    ('Path of Exile', 'ARPG gratuit inspiré de Diablo', 'ARPG'),
    ('Terraria', 'Jeu de construction et d''exploration 2D', 'Sandbox'),
    ('Cyberpunk 2077', 'RPG futuriste en monde ouvert', 'RPG'),
    ('Stardew Valley', 'Simulation de ferme relaxante', 'Simulation')
ON CONFLICT (name) DO NOTHING;

-- Insertion des relations user_games
INSERT INTO user_games (user_id, game_id, play_time_hours, rating, is_favorite) VALUES 
    ((SELECT id FROM users WHERE email = 'john@doe.com'), (SELECT id FROM games WHERE name = 'The Witcher 3'), 120, 10, TRUE),
    ((SELECT id FROM users WHERE email = 'john@doe.com'), (SELECT id FROM games WHERE name = 'Darkest Dungeon'), 80, 8, FALSE),
    ((SELECT id FROM users WHERE email = 'john@doe.com'), (SELECT id FROM games WHERE name = 'Cyberpunk 2077'), 60, 7, FALSE),
    ((SELECT id FROM users WHERE email = 'tonytruand@gmail.com'), (SELECT id FROM games WHERE name = 'Path of Exile'), 200, 9, TRUE),
    ((SELECT id FROM users WHERE email = 'tonytruand@gmail.com'), (SELECT id FROM games WHERE name = 'Terraria'), 150, 8, FALSE),
    ((SELECT id FROM users WHERE email = 'tonytruand@gmail.com'), (SELECT id FROM games WHERE name = 'The Witcher 3'), 90, 9, FALSE)
ON CONFLICT (user_id, game_id) DO NOTHING;

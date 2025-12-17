-- Script de seed pour insérer des données de test
-- Ce script peut être exécuté après la création des tables

-- Nettoyage des données existantes (optionnel)
-- DELETE FROM games;
-- DELETE FROM users;

-- Insertion des utilisateurs de test
INSERT INTO users (name, email) VALUES 
    ('John Doe', 'john@doe.com'),
    ('Tony Truand', 'tonytruand@gmail.com'),
    ('Alice Martin', 'alice.martin@example.com'),
    ('Bob Wilson', 'bob.wilson@example.com')
ON CONFLICT (email) DO NOTHING;

-- Insertion des jeux dans la table games
INSERT INTO games (name, description, genre) VALUES 
    ('The Witcher 3', 'RPG fantastique avec une histoire épique', 'RPG'),
    ('Darkest Dungeon', 'RPG tactique sombre et difficile', 'RPG'),
    ('Path of Exile', 'ARPG gratuit inspiré de Diablo', 'ARPG'),
    ('Terraria', 'Jeu de construction et d''exploration 2D', 'Sandbox'),
    ('Cyberpunk 2077', 'RPG futuriste en monde ouvert', 'RPG'),
    ('Stardew Valley', 'Simulation de ferme relaxante', 'Simulation'),
    ('Diablo IV', 'ARPG sombre et violent', 'ARPG'),
    ('Animal Crossing', 'Simulation de vie relaxante', 'Simulation'),
    ('Call of Duty', 'FPS multijoueur compétitif', 'FPS'),
    ('FIFA 24', 'Simulation de football', 'Sports')
ON CONFLICT (name) DO NOTHING;

-- Insertion des relations user_games
INSERT INTO user_games (user_id, game_id, play_time_hours, rating, is_favorite) VALUES 
    -- John Doe
    ((SELECT id FROM users WHERE email = 'john@doe.com'), (SELECT id FROM games WHERE name = 'The Witcher 3'), 120, 10, TRUE),
    ((SELECT id FROM users WHERE email = 'john@doe.com'), (SELECT id FROM games WHERE name = 'Darkest Dungeon'), 80, 8, FALSE),
    ((SELECT id FROM users WHERE email = 'john@doe.com'), (SELECT id FROM games WHERE name = 'Cyberpunk 2077'), 60, 7, FALSE),
    -- Tony Truand
    ((SELECT id FROM users WHERE email = 'tonytruand@gmail.com'), (SELECT id FROM games WHERE name = 'Path of Exile'), 200, 9, TRUE),
    ((SELECT id FROM users WHERE email = 'tonytruand@gmail.com'), (SELECT id FROM games WHERE name = 'Terraria'), 150, 8, FALSE),
    ((SELECT id FROM users WHERE email = 'tonytruand@gmail.com'), (SELECT id FROM games WHERE name = 'The Witcher 3'), 90, 9, FALSE),
    -- Alice Martin
    ((SELECT id FROM users WHERE email = 'alice.martin@example.com'), (SELECT id FROM games WHERE name = 'Stardew Valley'), 100, 9, TRUE),
    ((SELECT id FROM users WHERE email = 'alice.martin@example.com'), (SELECT id FROM games WHERE name = 'Animal Crossing'), 80, 8, FALSE),
    -- Bob Wilson
    ((SELECT id FROM users WHERE email = 'bob.wilson@example.com'), (SELECT id FROM games WHERE name = 'Call of Duty'), 150, 7, FALSE),
    ((SELECT id FROM users WHERE email = 'bob.wilson@example.com'), (SELECT id FROM games WHERE name = 'FIFA 24'), 200, 8, TRUE)
ON CONFLICT (user_id, game_id) DO NOTHING;

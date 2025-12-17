-- Requêtes utiles pour la table user_games

-- 1. Récupérer tous les jeux d'un utilisateur avec leurs détails
SELECT 
    u.name as user_name,
    u.email,
    g.name as game_name,
    g.description,
    g.genre,
    ug.play_time_hours,
    ug.rating,
    ug.is_favorite,
    ug.created_at as user_started_playing
FROM users u
JOIN user_games ug ON u.id = ug.user_id
JOIN games g ON ug.game_id = g.id
WHERE u.email = 'john@doe.com'
ORDER BY ug.is_favorite DESC, ug.rating DESC;

-- 2. Récupérer les jeux favoris d'un utilisateur
SELECT 
    g.name,
    g.description,
    g.genre,
    ug.play_time_hours,
    ug.rating
FROM users u
JOIN user_games ug ON u.id = ug.user_id
JOIN games g ON ug.game_id = g.id
WHERE u.email = 'john@doe.com' AND ug.is_favorite = TRUE
ORDER BY ug.rating DESC;

-- 3. Statistiques des jeux par utilisateur
SELECT 
    u.name as user_name,
    COUNT(ug.game_id) as total_games,
    SUM(ug.play_time_hours) as total_play_time,
    AVG(ug.rating) as average_rating,
    COUNT(CASE WHEN ug.is_favorite = TRUE THEN 1 END) as favorite_games
FROM users u
LEFT JOIN user_games ug ON u.id = ug.user_id
GROUP BY u.id, u.name
ORDER BY total_play_time DESC;

-- 4. Top des jeux les plus joués
SELECT 
    g.name,
    g.genre,
    COUNT(ug.user_id) as players_count,
    AVG(ug.rating) as average_rating,
    SUM(ug.play_time_hours) as total_play_time
FROM games g
JOIN user_games ug ON g.id = ug.game_id
GROUP BY g.id, g.name, g.genre
ORDER BY total_play_time DESC
LIMIT 10;

-- 5. Utilisateurs qui jouent aux mêmes jeux
SELECT 
    g.name as game_name,
    u1.name as user1,
    u2.name as user2
FROM games g
JOIN user_games ug1 ON g.id = ug1.game_id
JOIN user_games ug2 ON g.id = ug2.game_id
JOIN users u1 ON ug1.user_id = u1.id
JOIN users u2 ON ug2.user_id = u2.id
WHERE ug1.user_id < ug2.user_id
ORDER BY g.name;

-- 6. Ajouter un jeu à un utilisateur
INSERT INTO user_games (user_id, game_id, play_time_hours, rating, is_favorite)
VALUES (
    (SELECT id FROM users WHERE email = 'john@doe.com'),
    (SELECT id FROM games WHERE name = 'New Game'),
    0,
    NULL,
    FALSE
);

-- 7. Mettre à jour les statistiques d'un jeu pour un utilisateur
UPDATE user_games 
SET 
    play_time_hours = 150,
    rating = 9,
    is_favorite = TRUE,
    updated_at = CURRENT_TIMESTAMP
WHERE user_id = (SELECT id FROM users WHERE email = 'john@doe.com')
  AND game_id = (SELECT id FROM games WHERE name = 'The Witcher 3');

-- 8. Supprimer un jeu d'un utilisateur
DELETE FROM user_games 
WHERE user_id = (SELECT id FROM users WHERE email = 'john@doe.com')
  AND game_id = (SELECT id FROM games WHERE name = 'Game Name');

-- 9. Rechercher des jeux par genre
SELECT 
    g.name,
    g.description,
    g.genre,
    COUNT(ug.user_id) as players_count,
    AVG(ug.rating) as average_rating
FROM games g
LEFT JOIN user_games ug ON g.id = ug.game_id
WHERE g.genre = 'RPG'
GROUP BY g.id, g.name, g.description, g.genre
ORDER BY average_rating DESC;

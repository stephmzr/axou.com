# Migration vers PostgreSQL

Ce projet a été migré de SQLite vers PostgreSQL avec une structure de base de données relationnelle complète.

## 🏗️ Architecture de la Base de Données

### Tables Principales

1. **`users`** - Utilisateurs
   - `id` (SERIAL PRIMARY KEY)
   - `name` (VARCHAR(255) NOT NULL)
   - `email` (VARCHAR(255) UNIQUE NOT NULL)
   - `created_at`, `updated_at` (TIMESTAMP)

2. **`games`** - Jeux
   - `id` (SERIAL PRIMARY KEY)
   - `name` (VARCHAR(255) UNIQUE NOT NULL)
   - `description` (TEXT)
   - `genre` (VARCHAR(100))
   - `created_at`, `updated_at` (TIMESTAMP)

3. **`user_games`** - Relation Many-to-Many
   - `id` (SERIAL PRIMARY KEY)
   - `user_id` (INTEGER REFERENCES users(id))
   - `game_id` (INTEGER REFERENCES games(id))
   - `play_time_hours` (INTEGER DEFAULT 0)
   - `rating` (INTEGER CHECK 1-10)
   - `is_favorite` (BOOLEAN DEFAULT FALSE)
   - `created_at`, `updated_at` (TIMESTAMP)
   - `UNIQUE(user_id, game_id)`

## 🚀 Démarrage

### 1. Démarrer la base de données
```bash
# Démarrer PostgreSQL
docker-compose up -d postgres

# Vérifier que tout fonctionne
docker-compose ps
```

### 2. Tester la connexion
```bash
# Test automatique
npx tsx scripts/test-database.ts

# Ou test manuel
docker-compose exec postgres psql -U postgres -d typescript_vue_db -c "SELECT COUNT(*) FROM users;"
```

## 📡 API Endpoints

### Utilisateurs
- `GET /api/users` - Liste tous les utilisateurs
- `GET /api/users/[id]` - Utilisateur par ID
- `GET /api/users/[id]?includeGames=true` - Utilisateur avec ses jeux
- `POST /api/users` - Créer un utilisateur
- `PUT /api/users/[id]` - Modifier un utilisateur
- `DELETE /api/users/[id]` - Supprimer un utilisateur

### Jeux
- `GET /api/games` - Liste tous les jeux
- `GET /api/games/top?limit=10` - Top des jeux par temps de jeu
- `POST /api/games` - Créer un jeu
- `PUT /api/games/[id]` - Modifier un jeu
- `DELETE /api/games/[id]` - Supprimer un jeu

### Relations User-Game
- `GET /api/users/[id]/games` - Jeux d'un utilisateur
- `POST /api/users/[id]/games` - Ajouter un jeu à un utilisateur
- `PUT /api/users/[id]/games/[gameId]` - Modifier les stats d'un jeu
- `DELETE /api/users/[id]/games/[gameId]` - Retirer un jeu d'un utilisateur

## 🔧 Services

### DatabaseService
Service singleton pour la connexion PostgreSQL avec pool de connexions.

```typescript
const db = DatabaseService.getInstance()
await db.query('SELECT * FROM users')
```

### UserServicePostgres
Service pour la gestion des utilisateurs avec PostgreSQL.

```typescript
const userService = UserServicePostgres.getInstance()
const users = await userService.getAllUsers()
const userWithGames = await userService.getUserWithGames(userId)
```

### GameService
Service pour la gestion des jeux et relations user-game.

```typescript
const gameService = GameService.getInstance()
const games = await gameService.getAllGames()
const userGames = await gameService.getUserGames(userId)
```

## 📊 Exemples d'Utilisation

### Récupérer un utilisateur avec ses jeux
```typescript
const userService = UserServicePostgres.getInstance()
const user = await userService.getUserWithGames(1)
console.log(`${user.name} a ${user.games.length} jeux`)
```

### Ajouter un jeu à un utilisateur
```typescript
const gameService = GameService.getInstance()
await gameService.addGameToUser({
  userId: 1,
  gameId: 2,
  playTimeHours: 50,
  rating: 8,
  isFavorite: true
})
```

### Statistiques d'un jeu
```typescript
const gameService = GameService.getInstance()
const stats = await gameService.getGameStats(gameId)
console.log(`${stats.playersCount} joueurs, note moyenne: ${stats.averageRating}`)
```

## 🔄 Migration depuis l'Ancien Système

### Ancien UserService (SQLite en mémoire)
```typescript
// Ancien code
const userService = UserService.getInstance()
const users = userService.getAllUsers()
```

### Nouveau UserServicePostgres
```typescript
// Nouveau code
const userService = UserServicePostgres.getInstance()
const users = await userService.getAllUsers() // Maintenant async
```

### Changements Principaux
1. **Async/Await** : Toutes les méthodes sont maintenant asynchrones
2. **Structure relationnelle** : Les jeux sont dans une table séparée
3. **Métadonnées enrichies** : Temps de jeu, notes, favoris
4. **Requêtes SQL** : Plus de logique en mémoire

## 🐛 Dépannage

### Erreur de connexion
```bash
# Vérifier que PostgreSQL est démarré
docker-compose ps

# Vérifier les logs
docker-compose logs postgres

# Redémarrer si nécessaire
docker-compose restart postgres
```

### Erreur de base de données
```bash
# Se connecter à la base
docker-compose exec postgres psql -U postgres -d typescript_vue_db

# Vérifier les tables
\dt

# Vérifier les données
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM games;
SELECT COUNT(*) FROM user_games;
```

### Variables d'environnement
Assurez-vous que votre fichier `.env` contient :
```env
DB_HOST=localhost
DB_PORT=5433
DB_NAME=typescript_vue_db
DB_USER=postgres
DB_PASSWORD=tagada123
```

## 📈 Avantages de PostgreSQL

1. **Relations complexes** : Many-to-many avec métadonnées
2. **Performance** : Index et requêtes optimisées
3. **Intégrité** : Contraintes et clés étrangères
4. **Évolutivité** : Support de millions d'enregistrements
5. **Fonctionnalités avancées** : Triggers, fonctions, vues

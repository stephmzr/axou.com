# Configuration de la Base de Données

Ce projet utilise PostgreSQL dockerisé pour la gestion des données.

## 🚀 Démarrage Rapide

### 1. Démarrer la base de données
```bash
# Démarrer PostgreSQL
docker-compose up -d postgres

# Ou utiliser le script automatisé
./scripts/db-setup.sh
```

### 2. Vérifier que tout fonctionne
```bash
# Vérifier les conteneurs
docker-compose ps

# Voir les logs
docker-compose logs postgres
```

## 📊 Structure de la Base de Données

### Table `users`
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR(255) NOT NULL)
- `email` (VARCHAR(255) UNIQUE NOT NULL)
- `created_at` (TIMESTAMP WITH TIME ZONE)
- `updated_at` (TIMESTAMP WITH TIME ZONE)

### Table `games`
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER REFERENCES users(id))
- `name` (VARCHAR(255) NOT NULL)
- `created_at` (TIMESTAMP WITH TIME ZONE)
- `updated_at` (TIMESTAMP WITH TIME ZONE)

## 🔧 Configuration

### Variables d'environnement
Copiez `env.example` vers `.env` et ajustez selon vos besoins :

```bash
cp env.example .env
```

### Connexion à la base de données
- **Host**: localhost
- **Port**: 5432
- **Database**: typescript_vue_db
- **User**: postgres
- **Password**: postgres123

## 🛠️ Commandes Utiles

### Gestion des conteneurs
```bash
# Démarrer tous les services
docker-compose up -d

# Arrêter tous les services
docker-compose down

# Redémarrer PostgreSQL
docker-compose restart postgres

# Voir les logs
docker-compose logs -f postgres
```

### Accès à la base de données
```bash
# Connexion via psql
docker-compose exec postgres psql -U postgres -d typescript_vue_db

# Exécuter un script SQL
docker-compose exec -T postgres psql -U postgres -d typescript_vue_db < database/seed.sql
```

### pgAdmin (Interface Web)
- **URL**: http://localhost:8080
- **Email**: admin@admin.com
- **Password**: admin123

## 📁 Structure des Fichiers

```
database/
├── init/
│   └── 01-create-tables.sql    # Script d'initialisation automatique
├── migrations/
│   └── 001_create_users_table.sql  # Migration manuelle
└── seed.sql                    # Données de test

scripts/
└── db-setup.sh                # Script d'installation

docker-compose.yml             # Configuration Docker
env.example                    # Variables d'environnement
```

## 🔄 Migrations

Les migrations sont automatiquement exécutées au démarrage du conteneur PostgreSQL grâce au dossier `database/init/`.

Pour exécuter manuellement une migration :
```bash
docker-compose exec postgres psql -U postgres -d typescript_vue_db -f database/migrations/001_create_users_table.sql
```

## 🧪 Données de Test

Pour insérer des données de test :
```bash
docker-compose exec postgres psql -U postgres -d typescript_vue_db -f database/seed.sql
```

## 🐛 Dépannage

### Problème de connexion
```bash
# Vérifier que PostgreSQL est démarré
docker-compose ps

# Vérifier les logs
docker-compose logs postgres

# Redémarrer si nécessaire
docker-compose restart postgres
```

### Réinitialiser la base de données
```bash
# Arrêter et supprimer les volumes
docker-compose down -v

# Redémarrer
docker-compose up -d postgres
```

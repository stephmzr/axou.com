#!/bin/bash

# Script pour configurer la base de données
# Usage: ./scripts/db-setup.sh

set -e

echo "🐳 Démarrage des conteneurs Docker..."
docker-compose up -d postgres

echo "⏳ Attente que PostgreSQL soit prêt..."
sleep 10

echo "📊 Vérification de la connexion à la base de données..."
docker-compose exec postgres psql -U postgres -d typescript_vue_db -c "SELECT version();"

echo "✅ Base de données configurée avec succès!"
echo ""
echo "🔗 Informations de connexion:"
echo "   Host: localhost"
echo "   Port: 5432"
echo "   Database: typescript_vue_db"
echo "   User: postgres"
echo "   Password: postgres123"
echo ""
echo "🌐 pgAdmin disponible sur: http://localhost:8080"
echo "   Email: admin@admin.com"
echo "   Password: admin123"
echo ""
echo "📝 Pour arrêter les conteneurs: docker-compose down"
echo "📝 Pour voir les logs: docker-compose logs postgres"

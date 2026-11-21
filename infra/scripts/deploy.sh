#!/usr/bin/env bash
# ==============================================================================
# ANVESH Production Deployment & Orchestration Script
# ==============================================================================
set -e

echo "🚀 [1/5] Initiating ANVESH Production Deployment..."

# Verify Docker daemon is responsive
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker daemon is not running. Please start Docker first."
    exit 1
fi

echo "📦 [2/5] Building and pulling production container images..."
docker compose pull postgres qdrant redis mlflow nginx || true
docker compose build --parallel

echo "🗄️ [3/5] Starting core persistence services (PostgreSQL, Redis, Qdrant)..."
docker compose up -d postgres redis qdrant mlflow

echo "⏳ Waiting for PostgreSQL to pass readiness health check..."
until docker compose exec -T postgres pg_isready -U anvesh_user -d anvesh_db > /dev/null 2>&1; do
    sleep 2
done
echo "✅ PostgreSQL is healthy and accepting connections."

echo "🌱 [4/5] Running database migrations and taxonomy seeding..."
docker compose run --rm backend npm run db:push
docker compose run --rm backend npm run db:seed

echo "🌐 [5/5] Launching API Gateway, ML Microservice, Frontend, and Nginx..."
docker compose up -d ml backend frontend nginx

echo ""
echo "================================================================================"
echo "🎉 ANVESH Production Platform Successfully Deployed!"
echo "================================================================================"
echo "  • Web Frontend:         http://localhost"
echo "  • API Gateway:          http://localhost/api/v1"
echo "  • Swagger OpenAPI:      http://localhost/api/docs"
echo "  • ML Microservice:      http://localhost/ml/health"
echo "  • Qdrant Console:       http://localhost:6333/dashboard"
echo "  • MLflow Registry:      http://localhost:5000"
echo "================================================================================"

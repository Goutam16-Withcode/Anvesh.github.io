#!/usr/bin/env bash
# ==============================================================================
# ANVESH PostgreSQL Schema Initialization & Seeder
# ==============================================================================
set -e

echo "🌱 Initializing ANVESH Database Schema via Prisma..."
cd "$(dirname "$0")/../../backend"

echo "1. Generating Prisma client bindings..."
npm run db:generate

echo "2. Pushing relational schema to PostgreSQL..."
npm run db:push

echo "3. Seeding taxonomy and demo entities..."
npm run db:seed

echo "✅ Database initialization successfully completed!"

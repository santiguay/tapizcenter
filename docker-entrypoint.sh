#!/bin/sh
set -e

# Copy latest schema, migrations, and seed files to ensure they are up to date in the volume
echo "Updating schema, migrations, and seed files in /app/prisma..."
cp /app/prisma_backup/schema.prisma /app/prisma/schema.prisma
cp /app/prisma_backup/seed.js /app/prisma/seed.js
mkdir -p /app/prisma/migrations
cp -r /app/prisma_backup/migrations/. /app/prisma/migrations/

DB_FILE="/app/prisma/dev.db"
FIRST_RUN=false
if [ ! -f "$DB_FILE" ]; then
  FIRST_RUN=true
fi

# Run migrations to ensure database matches schema
echo "Running prisma migrate deploy..."
npx prisma migrate deploy

# If it's the first run, seed the database
if [ "$FIRST_RUN" = true ]; then
  echo "Database not found. Seeding database..."
  node /app/prisma/seed.js
else
  echo "Database already exists. Skipping seeding to prevent overwriting existing data."
fi

# Start the application
echo "Starting application..."
exec "$@"


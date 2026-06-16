#!/bin/sh
set -e

# Copy latest schema and seed files to ensure they are up to date in the volume
echo "Updating schema and seed files in /app/prisma..."
cp /app/prisma_backup/schema.prisma /app/prisma/schema.prisma
cp /app/prisma_backup/seed.js /app/prisma/seed.js

DB_FILE="/app/prisma/dev.db"
FIRST_RUN=false
if [ ! -f "$DB_FILE" ]; then
  FIRST_RUN=true
fi

# Run schema push to ensure database matches schema
echo "Running prisma db push..."
prisma db push --accept-data-loss

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

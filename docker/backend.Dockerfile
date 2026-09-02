# Build context is the repo root. Dev-oriented: runs tsx with watch so the team
# can edit on the host and see changes without rebuilding the image.
FROM node:24-alpine

WORKDIR /app

# Workspace manifests first, so npm ci is cached across source edits.
COPY package.json package-lock.json* ./
COPY shared/package.json ./shared/
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

RUN npm install --workspaces --include-workspace-root

COPY shared ./shared
COPY backend ./backend
COPY data ./data

RUN npm run build --workspace @elimu/shared

WORKDIR /app/backend
EXPOSE 4000
CMD ["npm", "run", "dev"]

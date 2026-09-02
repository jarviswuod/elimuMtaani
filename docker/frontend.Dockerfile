# Build context is the repo root. Dev server with --host so it is reachable
# from outside the container (and from a phone on the same wifi — test on a real
# phone at least once today, that is the actual target device).
FROM node:24-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
COPY shared/package.json ./shared/
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

RUN npm install --workspaces --include-workspace-root

COPY shared ./shared
COPY frontend ./frontend

RUN npm run build --workspace @elimu/shared

WORKDIR /app/frontend
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

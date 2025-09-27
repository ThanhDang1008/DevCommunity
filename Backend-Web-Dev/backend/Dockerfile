FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5001

CMD ["npm","run", "start"]

# # Build Stage
# FROM node:20-alpine AS build
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# # Production Stage
# FROM node:20-alpine AS production
# WORKDIR /app
# COPY package*.json ./
# RUN npm install --only=production
# COPY --from=build /app/dist ./dist
# EXPOSE 5001
# CMD ["npm", "run", "start"]



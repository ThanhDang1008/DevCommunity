FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8888

CMD ["npm","run","start"]


# # Build Stage
# FROM node:20-alpine AS BUILD_IMAGE
# WORKDIR /app
# COPY package*.json ./
# RUN npm ci
# COPY . .
# RUN npm run build


# # Production Stage
# FROM node:20-alpine AS PRODUCTION_STAGE
# WORKDIR /app
# COPY --from=BUILD_IMAGE /app/package*.json ./
# COPY --from=BUILD_IMAGE /app/.next ./.next
# COPY --from=BUILD_IMAGE /app/public ./public
# COPY --from=BUILD_IMAGE /app/node_modules ./node_modules
# ENV NODE_ENV=production
# EXPOSE 8888
# CMD ["npm", "start"]

# docker build --no-cache -t quan586/web-news:1.0.0 .
# docker run -p 8888:8888 -d quan586/web-news:1.0.0
# docker image push quan586/web-news:1.0.0
# docker image rm quan586/web-news:1.0.0
# docker rmi <id>
# docker ps -a
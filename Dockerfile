# ======== Build Stage ========
FROM node:20-alpine AS builder
WORKDIR /app

ENV NODE_ENV=production

COPY yarn.lock ./
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn build

# ======== Production Stage ========
FROM nginx:1.25-alpine AS production
RUN apk --no-cache add curl gettext
COPY nginx.template.conf /etc/nginx/conf.d/default.template.conf
COPY --from=builder /app/build /usr/share/nginx/html
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
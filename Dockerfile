# ======== Build Stage ========
FROM node:20-alpine AS builder
WORKDIR /app

# KAKAO_SECRET_KEY는 빌드 시점에 ARG와 ENV를 통해 주입되어 React 빌드에 사용됨
ARG REACT_APP_KAKAO_SECRET_KEY
ENV REACT_APP_KAKAO_SECRET_KEY=$REACT_APP_KAKAO_SECRET_KEY

# 나머지 REACT_APP_* 변수들은 빌드 시 더미 값을 사용 (런타임에 config.json으로 실제 값 주입)
ARG REACT_APP_API_BASE_URL="__BUILD_TIME_DUMMY_API_URL__"
ARG REACT_APP_SERVICE_HOST_URL="__BUILD_TIME_DUMMY_SERVICE_HOST_URL__"
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL
ENV REACT_APP_SERVICE_HOST_URL=$REACT_APP_SERVICE_HOST_URL

ENV NODE_ENV=production

COPY yarn.lock ./
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn build

# ======== Production Stage ========
FROM nginx:1.25-alpine AS production
RUN apk --no-cache add curl
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
COPY public/config.template.json /usr/share/nginx/html/config.json
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
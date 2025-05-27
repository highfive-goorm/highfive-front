# ======== Build Stage ========
FROM node:20-alpine AS builder
# node:18-alpine 이미지를 빌드 환경으로 사용합니다.
# 'AS builder'는 이 스테이지에 'builder'라는 이름을 부여합니다.

WORKDIR /app
# 작업 디렉토리를 /app으로 설정합니다.

# --build-arg로 전달될 변수들을 선언합니다.
ARG REACT_APP_API_BASE_URL
ARG REACT_APP_KAKAO_SECRET_KEY
ARG REACT_APP_SERVICE_HOST_URL

# ARG로 받은 값을 ENV로 설정해야 RUN 명령어에서 process.env로 접근 가능합니다.
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL
ENV REACT_APP_KAKAO_SECRET_KEY=$REACT_APP_KAKAO_SECRET_KEY
ENV REACT_APP_SERVICE_HOST_URL=$REACT_APP_SERVICE_HOST_URL

# package.json과 package-lock.json (또는 yarn.lock)을 먼저 복사합니다.
# 이렇게 하면 의존성이 변경되지 않았을 경우 Docker가 이전 레이어 캐시를 활용할 수 있어 빌드 속도가 빨라집니다.
# COPY package*.json ./
# 만약 yarn을 사용한다면:
COPY yarn.lock ./
COPY package*.json ./

# 의존성을 설치합니다.
RUN yarn install
# 만약 yarn을 사용한다면:
# RUN yarn install

# 애플리케이션 소스 코드 전체를 /app 디렉토리로 복사합니다.
COPY . .

# React 앱을 프로덕션 모드로 빌드합니다.
# 이 단계에서 .env 파일이나 주입된 환경 변수 (REACT_APP_*)를 참조하여 빌드가 진행됩니다.
# 지금은 로컬 .env 파일이 있다면 그 값을 사용하거나, 아래에서 빌드 시 직접 주입할 수 있습니다.
RUN npm run build
# 결과물은 /app/build 디렉토리에 생성됩니다.

# ======== Production Stage ========
FROM nginx:1.25-alpine AS production
# nginx:1.25-alpine 이미지를 최종 실행 환경으로 사용합니다.

# (선택 사항) React Router 등을 사용할 경우 Nginx 설정을 커스터마이즈하기 위해
# 프로젝트 루트에 nginx.conf (또는 default.conf) 파일을 만들고 아래 주석을 해제하여 복사합니다.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드 스테이지('builder')의 /app/build 디렉토리에 있는 빌드 결과물(정적 파일들)을
# Nginx의 기본 웹 루트 디렉토리인 /usr/share/nginx/html로 복사합니다.
COPY --from=builder /app/build /usr/share/nginx/html

# Nginx는 기본적으로 80번 포트에서 요청을 수신 대기합니다.
EXPOSE 80

# 컨테이너가 시작될 때 Nginx를 포그라운드에서 실행하는 명령어입니다.
# (Docker 컨테이너는 주 프로세스가 종료되면 함께 종료되므로, 데몬 모드가 아닌 포그라운드 실행이 필요합니다.)
CMD ["nginx", "-g", "daemon off;"]
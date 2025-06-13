#!/bin/sh
set -e # 스크립트 실행 중 오류 발생 시 즉시 종료
# entrypoint.sh

export BACKEND_URL="${BACKEND_URL:-http://highfive-gateway-test:8000}"

# nginx.template.conf에서 환경 변수를 사용하여 nginx.conf 생성
envsubst '$BACKEND_URL' < /etc/nginx/conf.d/default.template.conf > /etc/nginx/conf.d/default.conf

rm /etc/nginx/conf.d/default.template.conf

exec "$@"

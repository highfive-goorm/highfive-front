#!/bin/sh

# entrypoint.sh

CONFIG_JSON_PATH="/usr/share/nginx/html/config.json"
TEMP_CONFIG_JSON="${CONFIG_JSON_PATH}.tmp"

# 원본 템플릿 파일을 작업용 임시 파일로 복사
cp "${CONFIG_JSON_PATH}" "${TEMP_CONFIG_JSON}"

# API_BASE_URL 업데이트
if [ -n "$API_BASE_URL" ]; then
  echo "Updating config.json with API_BASE_URL: ${API_BASE_URL}"
  sed -i "s|__API_BASE_URL_PLACEHOLDER__|${API_BASE_URL}|g" "${TEMP_CONFIG_JSON}"
else
  echo "Warning: API_BASE_URL environment variable is not set. Using placeholder."
fi

# SERVICE_HOST_URL 업데이트
if [ -n "$SERVICE_HOST_URL" ]; then
  echo "Updating config.json with SERVICE_HOST_URL: ${SERVICE_HOST_URL}"
  sed -i "s|__SERVICE_HOST_URL_PLACEHOLDER__|${SERVICE_HOST_URL}|g" "${TEMP_CONFIG_JSON}"
else
  echo "Warning: SERVICE_HOST_URL environment variable is not set. Using placeholder."
fi

# 최종적으로 임시 파일을 원본 위치로 이동
mv "${TEMP_CONFIG_JSON}" "${CONFIG_JSON_PATH}"
echo "Successfully updated ${CONFIG_JSON_PATH}"

# (디버깅용) 파일 내용 확인
# echo "Current config.json:"
# cat $CONFIG_JSON_PATH

echo "Starting Nginx..."
exec "$@"
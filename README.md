# highfive-front
## docker image 빌드(buildx builder 생성 -> os/arch를 linux/amd64,linux/arm64로 모두 해야 amd64 ec2에서도 해당 image 사용 가능)
docker buildx build --platform linux/amd64,linux/arm64 \
  --build-arg REACT_APP_KAKAO_SECRET_KEY="kakao api key" \
  -t [이미지명]:[tag] \
  --push .

## docker 컨테이너 가동
docker run -d --name highfive-front-test \
              -e API_BASE_URL='백엔드 주소' \
              -e SERVICE_HOST_URL='프론트 주소' \
              -p 3000:80 \
              [이미지명]:[tag]

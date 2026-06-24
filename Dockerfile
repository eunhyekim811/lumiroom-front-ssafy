# 1단계: 빌드 스테이지
FROM node:20-alpine AS build-stage

# 1. 빌드 인자(ARG) 정의
ARG VITE_KAKAO_MAP_API_KEY
ARG VITE_API_URL

# 2. 빌드 환경변수(ENV)로 등록 (pnpm build가 인식할 수 있도록 함)
ENV VITE_KAKAO_MAP_API_KEY=$VITE_KAKAO_MAP_API_KEY
ENV VITE_API_URL=$VITE_API_URL

RUN npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build  # 이 시점에 위에서 받아온 VITE_API_URL이 소스코드에 박힙니다.

# 2단계: 실행 스테이지 (Nginx)
FROM nginx:alpine AS production-stage
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
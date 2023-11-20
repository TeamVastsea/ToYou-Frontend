FROM node:21-alpine3.18 as builder

WORKDIR /usr/builder

ENV NEXT_PUBLIC_API_SERVER="http://127.0.0.1:8102"

ADD . .

RUN npm install -g pnpm && \
    pnpm install && \
    pnpm build

FROM nginx

COPY --from=builder /usr/builder/out /usr/share/nginx/html

EXPOSE 80
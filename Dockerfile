FROM nginx:stable-alpine
LABEL maintainer="Virgin Gates"
LABEL deploymentHints="disableProxyBuffer=no,scaleFactor=1,minRam=8M,maxRam=32M,minCpu=25m,maxCpu=100m"
LABEL routes="/consumer-assets,/consumer-ops,/call-center,/consumer-branch,/consumer-vendor"
COPY ./dist /web
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/conf.d /etc/nginx/conf.d
RUN mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.bak
EXPOSE 8080

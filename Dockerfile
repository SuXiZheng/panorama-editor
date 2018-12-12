FROM nginx
MAINTAINER freestyle.sago@outlook.com
WORKDIR /app
COPY ./build /app
COPY ./nginx.dev.conf /etc/nginx/nginx.conf
RUN cp -r /app/* /usr/share/nginx/html
RUN mkdir -p /var/logs
RUN cd /var/logs touch error.log
CMD ["nginx", "-g", "daemon off;"]
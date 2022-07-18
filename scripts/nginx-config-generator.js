const { apps, rootPath } = require('./projectConfig');
const { existsSync, rmdirSync, mkdirSync, writeFileSync } = require('fs');
const path = require('path');

const configDirectory = path.resolve(rootPath, 'nginx');
const serverSubdirectory = 'conf.d';
const generalConfigFilename = 'nginx.conf';
const serverConfigFilename = 'server.conf';

function generalConfig() {
  return `user  nginx;
worker_processes  1;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;


events {
  worker_connections  1024;
}


http {
  include       /etc/nginx/mime.types;
  default_type  application/octet-stream;

  log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
            '$status $body_bytes_sent "$http_referer" '
                '"$http_user_agent" "$http_x_forwarded_for"';

  access_log  /var/log/nginx/access.log  main;

  sendfile        on;
  tcp_nopush     	on;
  tcp_nodelay     on;

  server_tokens off;

  keepalive_timeout	65;

  gzip on;
  gzip_comp_level 5;
  gzip_min_length 1100;
  gzip_disable "msie6";
  gzip_proxied any;
  gzip_vary on;
  gzip_http_version 1.0;
  gzip_types
    application/atom+xml
    application/javascript
    application/json
    application/ld+json
    application/manifest+json
    application/rss+xml
    application/geo+json
    application/vnd.ms-fontobject
    application/x-font-ttf
    application/x-web-app-manifest+json
    application/xhtml+xml
    application/xml
    application/rdf+xml
    font/collection
    font/opentype
    font/otf
    font/ttf
    image/bmp
    image/svg+xml
    image/x-icon
    text/cache-manifest
    text/css
    text/javascript
    text/plain
    text/vcard
    text/vnd.rim.location.xloc
    text/vtt
    text/x-component
    text/x-cross-domain-policy;

  add_header Cache-Control "no-transform";

  include /etc/nginx/${serverSubdirectory}/*.conf;
}
`;
}

function serverConfig() {
  return `server {
  listen       8080;
  server_name  localhost;
  absolute_redirect off;
  root   /web;


  #charset koi8-r;
  #access_log  /var/log/nginx/host.access.log  main;


  location = / {
    return 200 'SURVV Web is running!\\n';
    default_type text/plain;
  }

  location /consumer-assets-health {
    return 200 '{"checks":[{"id":"fe-server","status":"UP"}],"outcome":"UP"}';
    default_type application/json;
  }

  location /consumer-assets-info {
    return 200 '{"version" : "1"}';
    default_type application/json;
  }

  location /consumer-assets {
    alias /web/consumer-assets;
    expires 30d;
  }

${apps
  .map(function generateAppRoute({ entryName, baseUrl, isPwa }) {
    let route = `
  location ${baseUrl} {
    try_files $uri $uri/ /${entryName}/index.html;
    expires epoch;
  }
`;
    if (isPwa) {
      route += `
  location ${baseUrl}/service-worker.js {
    try_files $uri $uri/ /${entryName}/service-worker.js;
    expires epoch;
  }

  location ${baseUrl}/manifest.json {
    try_files $uri $uri/ /${entryName}/manifest.json;
    expires epoch;
  }
`;
    }
    return route;
  })
  .join('')}

  error_page 404 /index.html;

  # redirect server error pages to the static page /50x.html
  #
  error_page   500 502 503 504  /index.html;
  location = /50x.html {
    root   /web;
  }

  # proxy the PHP scripts to Apache listening on 127.0.0.1:80
  #
  #location ~ \\.php$ {
  #    proxy_pass   http://127.0.0.1;
  #}

  # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
  #
  #location ~ \\.php$ {
  #    root           html;
  #    fastcgi_pass   127.0.0.1:9000;
  #    fastcgi_index  index.php;
  #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
  #    include        fastcgi_params;
  #}

  # deny access to .htaccess files, if Apache's document root
  # concurs with nginx's one
  #
  #location ~ /\\.ht {
  #    deny  all;
  #}
}
`;
}

function generateNginxConfig() {
  const serverSubdirectoryPath = path.resolve(
    configDirectory,
    serverSubdirectory
  );
  const generalConfigPath = path.resolve(
    configDirectory,
    generalConfigFilename
  );
  const serverConfigPath = path.resolve(
    serverSubdirectoryPath,
    serverConfigFilename
  );

  if (existsSync(configDirectory)) {
    console.log('>> Clearing old nginx config');
    rmdirSync(configDirectory, { recursive: true });
  }

  mkdirSync(configDirectory);
  mkdirSync(serverSubdirectoryPath);

  writeFileSync(generalConfigPath, generalConfig(), { encoding: 'utf-8' });
  writeFileSync(serverConfigPath, serverConfig(), { encoding: 'utf-8' });

  console.log('>> Generated new nginx config successfully!');
}

generateNginxConfig();

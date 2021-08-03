# build phase
FROM node:alpine
WORKDIR "/app"
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

# ---------------------------

# the "RUN" phase
FROM nginx
EXPOSE 3000 
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf


# copy from the first container that we made in the build phase that instead of my local filesystem
# anything inside /usr/share/nginx/html will be automatically served up by nginx
COPY --from=0 /app/build /usr/share/nginx/html 


# nginx will automatically start by itself
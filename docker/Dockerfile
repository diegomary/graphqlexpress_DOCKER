
FROM nginx:latest
WORKDIR /application
COPY ./core ./
COPY default.conf /etc/nginx/conf.d/
RUN apt update && apt-get install curl software-properties-common -y && curl -sL https://deb.nodesource.com/setup_13.x | bash - && apt-get install nodejs -y && apt install build-essential -y && npm install
#CMD ["sh","-c","touch diego.txt && nohup nginx -g 'daemon off;' > nginx.log & npm start"]
# ENTRYPOINT cannot be overridden
ENTRYPOINT ["sh","-c","nohup nginx -g 'daemon off;' > nginx.log & npm start"]
EXPOSE 8080 
#build with the following:  docker build -t authschema .
#run the container interactively to see if all is good
#docker run --rm -it -p 8080:8080/tcp authschema:latest
#or:not interactively
#docker run --rm -d -p 8080:8080/tcp authschema:latest








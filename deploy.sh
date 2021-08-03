docker build -t lauferdaniel/flashcard-app-front-end:latest -t lauferdaniel/flashcard-app-front-end:$SHA -f ./front-end/Dockerfile ./front-end
docker build -t lauferdaniel/flashcard-app-api-gateway:latest -t lauferdaniel/flashcard-app-api-gateway:$SHA -f ./api-gateway/Dockerfile ./api-gateway
docker build -t lauferdaniel/flashcard-app-rest-api-server:latest -t lauferdaniel/flashcard-app-rest-api-server:$SHA -f ./rest-api-server/Dockerfile ./rest-api-server
docker build -t lauferdaniel/flashcard-app-auth-server:latest -t lauferdaniel/flashcard-app-auth-server:$SHA -f ./auth-server/Dockerfile ./auth-server


docker push lauferdaniel/flashcard-app-front-end:latest
docker push lauferdaniel/flashcard-app-api-gateway:latest
docker push lauferdaniel/flashcard-app-rest-api-server:latest
docker push lauferdaniel/flashcard-app-auth-server:latest:latest

docker push lauferdaniel/flashcard-app-front-end:$SHA
docker push lauferdaniel/flashcard-app-api-gateway:$SHA
docker push lauferdaniel/flashcard-app-rest-api-server:$SHA
docker push lauferdaniel/flashcard-app-auth-server:$SHA
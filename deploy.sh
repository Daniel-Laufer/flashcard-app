docker build -t lauferdaniel/flashcard-app-front-end:latest -t lauferdaniel/flashcard-app-front-end:$SHA -f ./front-end/Dockerfile ./front-end
docker build -t lauferdaniel/flashcard-app-api-gateway:latest -t lauferdaniel/flashcard-app-api-gateway:$SHA -f ./api-gateway/Dockerfile ./api-gateway
docker build -t lauferdaniel/flashcard-app-rest-api-server:latest -t lauferdaniel/flashcard-app-rest-api-server:$SHA -f ./rest-api-server/Dockerfile ./rest-api-server
docker build -t lauferdaniel/flashcard-app-auth-server:latest -t lauferdaniel/flashcard-app-auth-server:$SHA -f ./auth-server/Dockerfile ./auth-server


docker push lauferdaniel/flashcard-app-front-end:latest
docker push lauferdaniel/flashcard-app-api-gateway:latest
docker push lauferdaniel/flashcard-app-rest-api-server:latest
docker push lauferdaniel/flashcard-app-auth-server:latest

docker push lauferdaniel/flashcard-app-front-end:$SHA
docker push lauferdaniel/flashcard-app-api-gateway:$SHA
docker push lauferdaniel/flashcard-app-rest-api-server:$SHA
docker push lauferdaniel/flashcard-app-auth-server:$SHA


kubectl apply -f k8s


# imperatively updating all the container images in the gcp cluster to the latest ones
kubectl set image deployments/front-end-server-deployment client=lauferdaniel/flashcard-app-front-end:$SHA
kubectl set image deployments/api-gateway-deployment api-gateway=lauferdaniel/flashcard-app-api-gateway:$SHA
kubectl set image deployments/rest-api-server-deployment rest-api-server=lauferdaniel/flashcard-app-rest-api-server:$SHA
kubectl set image deployments/auth-server-deployment auth-server=lauferdaniel/flashcard-app-auth-server:$SHA
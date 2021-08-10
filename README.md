
# Flashcard App

A web application that allows users to create personalized collections of flashcards to assist them in studying for assessments, learning new languages, and much more! Users also have the option of sharing their creations for others to use. 


## Demo

Click [here](https://youtu.be/7zHnE4n661M) to view the demo! It is important to note that this app is no longer being hosted on Google's Kubernetes Engine as shown in the demo due to the relatively high cost of hosting this app on this service.  

  
## Tech Stack

**Front-end:** React.js, Material-UI 

**Back-end:** Kubernetes, Docker, PostgreSQL, Node.js, Express.js, aws-sdk for Node.js, JWT, Swagger API Documentation

**Local Development:** Skaffold, Docker Desktop

**Deployment:**  Travis CI, Google Kubernetes Engine (GKE), AWS Relational Database Service (RDS), AWS Simple Storage Service (S3)

  
## API Reference


The entirety of the documentation for the back-end APIs used in this project are written using
[Swagger](https://swagger.io/). It can be viewed at **<base_url>/api/api-docs** (the "base_url"
varies depending on where the application is actually running whether it be locally, on Google's servers, etc.).
I attached a gif below to show off this documentation.


![Swagger Docs Gif](https://github-readme-media.s3.amazonaws.com/swagger_docs.gif)
&nbsp;


## Development & Production Kubernetes Cluster Architecture Diagrams

### Here is an overview of the cluster that I used for development. (this is what is created each time I run the command *skaffold dev*)
![Local Development Cluster](https://github-readme-media.s3.amazonaws.com/local_cluster.png)
&nbsp;
&nbsp;
&nbsp;
&nbsp;
### Here is an overview of the cluster on GKE (please click the image to zoom in)
![Production GKE Cluster](https://github-readme-media.s3.amazonaws.com/prod_cluster.png)

  
## CI/CD Pipeline

I developed a CI/CD pipeline for this project using [Travis CI](https://travis-ci.org/). You can see everything involved with
this process in the *.travis.yaml* file in the root project directory, but I will give a high level overview of it 
and how the development workflow would look like using it.


&nbsp;1. On some branch, let's say for example "dev" on my local machine, I make some changes to the source code of the project.\
&nbsp;2. I add, commit, these changes and push this branch to GitHub. \
&nbsp;3. I make a pull request to this branch and merge it with the main/master branch on GitHub. \
&nbsp;4. Travis runs a set of tests on this new version of the project. \
&nbsp;5. If successful, Travis re-builds all the images and pushes them to Docker Hub. \
&nbsp;6. Travis then imperatively updates all pods running on the cluster hosted on GKE to use the most recently updated images that Travis just pushed to Docker Hub. \
&nbsp;7. Done! The changes are now live in production.







  
## Run Locally

This project wasn't meant to be run locally by other people, but you can definetely get it running on your computer with some effort on your behalf.
 Note that it will require you to set up a PostgreSQL RDS DB on AWS and an IAM policy that will grant this app programatic access to this aforementioned DB.

First, clone the project.
```bash
  git clone https://github.com/Daniel-Laufer/flashcard-app.git
```

Go to the project directory

```bash
  cd flashcard-app
```

This app requires various environment variables in order 
to function properly. The way I to define these environment
variables is through using Kubernetes "secrets". Here are all the commands
to imperatively create these secret objects in your kubernetes cluster 
(this is of course assuming that you have a kubernetes cluster running on your local machine. \
*Remember to remove the "<>" brackets in all the commands below, I just used them to explain what values should exist in each field.*


```bash
kubectl create secret generic postgres-secret \
    --from-literal=PG_USER=<the user to login as inside the database> \
    --from-literal=PG_HOST=<the endpoint AWS gives you for this db> \
    --from-literal=PG_PASSWORD=<password you defined for this db> \
    --from-literal=PG_DB=<the databse name>\
    --from-literal=PG_PORT=<the port the database is running on at that particular endpoint>

kubectl create secret generic aws-user-credentials \
    --from-literal=AWS_BUCKET_REGION=<the region your S3 bucket is hosted in, ex. us-east-1>\
    --from-literal=AWS_BUCKET_NAME=<your S3 bucket name> \
    --from-literal=ACCESS_KEY=<an access key to an AWS IAM policy that has read/write permissions to this particular s3 bucket> \
    --from-literal=SECRET_ACCESS_KEY=<a secret access key to an AWS IAM policy that has read/write permissions to this particular s3 bucket>

kubectl create secret generic jwt-secret \
    --from-literal=JWT_SECRET_KEY=<some random key to encrypt/decrypt the JWT auth tokens that the auth-server service uses>

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.47.0/deploy/static/provider/cloud/deploy.yaml
```
This last command above there is to create the ingress-nginx controller in your cluster.


Now to create all the necessary tables in the AWS RDS database, simply run the following:
```bash
cd sql
psql -h <your rds endpoint> -p <your rds port> -U <user name> <database name>

```
type in your password and then run this command inside the posrgres CLI:
```bash
\i re-create_tables.sql;

```
\
Exit out of that postgres CLI and go back to your root project directory

```bash
cd ..
```
Starting up all the services/deployments can now be done with one simple command:

```bash
  skaffold dev
```
This will handle applying all the kubernetes .yaml files to the kubernetes cluster. 
It will also automatically remove all the objects that it creates once 
 you kill/interrupt the running skaffold process. 


\
A great thing about skaffold is it's ability to sync your files in your local file system to the file systems on
the running containers. This allows you to for example make modications to your javascript files in the "front-end" directory of 
your project, and without having to completely rebuild the image used by the front-end pods, the files get quickly synced across to the running containers and the create-react-app server  running in those containers
acknowledges these changes and recompiles the react project (a very similar happens with the rest-api-server and auth-server using nodemon). 
This *dramatically* speeds up the developement process as you don't need to constantly rebuild images for every tiny modification you make! 

  

After all of this, you will be able to access the app at **https://localhost/**

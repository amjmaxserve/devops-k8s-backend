pipeline {

agent any

environment {

REGISTRY="192.168.29.4:8088"
PROJECT="devops-production"
IMAGE_NAME="devops-backend"
IMAGE_TAG="${BUILD_NUMBER}"

K8S_NAMESPACE="devops-app-production"

}

stages {

stage('Checkout Source Code') {

steps {

git branch: 'main',
url: 'git@github.com:amjmaxserve/devops-k8s-backend.git'

}

}

stage('Build Docker Image') {

steps {

sh '''
docker build -t $IMAGE_NAME .
'''

}

}

stage('Tag Docker Image') {

steps {

sh '''
docker tag $IMAGE_NAME $REGISTRY/$PROJECT/$IMAGE_NAME:$IMAGE_TAG
'''

}

}

stage('Login to Harbor') {

steps {

sh '''
docker login $REGISTRY -u admin -p Harbor12345
'''

}

}

stage('Push Image to Harbor') {

steps {

sh '''
docker push $REGISTRY/$PROJECT/$IMAGE_NAME:$IMAGE_TAG
'''

}

}

stage('Verify MongoDB in Kubernetes') {

steps {

sh '''
kubectl get pods -n $K8S_NAMESPACE | grep mongodb
'''

}

}

stage('Deploy Backend to Kubernetes') {

steps {

sh '''
kubectl set image deployment/backend \
backend=$REGISTRY/$PROJECT/$IMAGE_NAME:$IMAGE_TAG \
-n $K8S_NAMESPACE
'''

}

}

stage('Verify Deployment') {

steps {

sh '''
kubectl rollout status deployment/backend -n $K8S_NAMESPACE
kubectl get pods -n $K8S_NAMESPACE
'''

}

}

}

}

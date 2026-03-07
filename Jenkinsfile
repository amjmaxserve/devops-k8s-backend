pipeline {

agent any

environment {

REGISTRY="192.168.29.4:8088"
PROJECT="devops-production"
IMAGE_NAME="devops-backend"
IMAGE_TAG="${BUILD_NUMBER}"

CONTROL_PLANE="master@192.168.29.63"
NAMESPACE="devops-app-production"

}

stages {

stage('Checkout Source Code') {

steps {

git branch: 'master',
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
docker login $REGISTRY -u admin -p Harbor@123
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

stage('Deploy Backend on Kubernetes Control Plane') {

steps {

sh """

ssh -o StrictHostKeyChecking=no $CONTROL_PLANE '

echo "Checking MongoDB pod..."

kubectl get pods -n $NAMESPACE | grep mongodb

echo "Updating backend image..."

kubectl set image deployment/backend \
backend=$REGISTRY/$PROJECT/$IMAGE_NAME:$IMAGE_TAG \
-n $NAMESPACE

echo "Waiting for rollout..."

kubectl rollout status deployment/backend -n $NAMESPACE

echo "Current running pods:"

kubectl get pods -n $NAMESPACE

'

"""

}

}

}

}

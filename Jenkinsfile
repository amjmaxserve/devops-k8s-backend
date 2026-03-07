pipeline {

agent any

environment {

REGISTRY = "192.168.29.4:8088"
PROJECT = "devops-production"
IMAGE_NAME = "devops-backend"
IMAGE_TAG = "${BUILD_NUMBER}"

CONTROL_PLANE = "192.168.29.63"
K8S_NAMESPACE = "devops-app-production"

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

sh '''
ssh -o StrictHostKeyChecking=no master@$CONTROL_PLANE << EOF

echo "----- Checking Namespace -----"

if kubectl get ns $K8S_NAMESPACE >/dev/null 2>&1
then
    echo "Namespace exists"
else
    echo "Namespace missing → creating namespace"
    kubectl create ns $K8S_NAMESPACE
fi


echo "----- Checking MongoDB Pod -----"

if kubectl get pods -n $K8S_NAMESPACE | grep mongodb-0 | grep Running >/dev/null
then
    echo "MongoDB is running"
else
    echo "MongoDB pod not running → deployment stopped"
    exit 1
fi


echo "----- Checking Backend Deployment -----"

if kubectl get deployment backend -n $K8S_NAMESPACE >/dev/null 2>&1
then
    echo "Backend exists → updating image"

    kubectl set image deployment/backend \
    backend=$REGISTRY/$PROJECT/$IMAGE_NAME:$IMAGE_TAG \
    -n $K8S_NAMESPACE

else
    echo "Backend deployment not found → applying deployment YAML"

    kubectl apply -f /home/master/devops-production/backend-production/

fi


echo "----- Waiting for Rollout -----"

kubectl rollout status deployment/backend -n $K8S_NAMESPACE


echo "----- Current Pods -----"

kubectl get pods -n $K8S_NAMESPACE


echo "----- Current Services -----"

kubectl get svc -n $K8S_NAMESPACE

EOF
'''

}

}

}

post {

success {

echo "Backend Deployment Completed Successfully"

}

failure {

echo "Pipeline Failed - Check Logs"

}

}

}

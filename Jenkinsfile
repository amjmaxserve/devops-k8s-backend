pipeline {

agent any

environment {

REGISTRY = "192.168.29.4:8088"
PROJECT = "devops-production"
IMAGE_NAME = "devops-backend"
IMAGE_TAG = "${BUILD_NUMBER}"

CONTROL_PLANE = "192.168.29.111"
NAMESPACE = "devops-app"

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

withCredentials([usernamePassword(
credentialsId: 'harbor-creds',
usernameVariable: 'HARBOR_USER',
passwordVariable: 'HARBOR_PASS'
)]) {

sh '''
docker login $REGISTRY -u $HARBOR_USER -p $HARBOR_PASS
'''

}

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
ssh -o StrictHostKeyChecking=no master@$CONTROL_PLANE << EOF

echo "----- Checking Namespace -----"

if kubectl get ns $NAMESPACE >/dev/null 2>&1
then
    echo "Namespace exists"
else
    echo "Namespace missing → creating namespace"
    kubectl create ns $NAMESPACE
fi


echo "----- Checking MongoDB Pod -----"

if kubectl get pods -n $NAMESPACE | grep mongodb-0 | grep Running >/dev/null
then
    echo "MongoDB is running"
else
    echo "MongoDB pod not running → stopping deployment"
    exit 1
fi


echo "----- Checking Backend Deployment -----"

if kubectl get deployment backend -n $NAMESPACE >/dev/null 2>&1
then
    echo "Backend exists → performing rolling update"

    kubectl set image deployment/backend \
    backend=$REGISTRY/$PROJECT/$IMAGE_NAME:$IMAGE_TAG \
    -n $NAMESPACE

else
    echo "Backend not found → applying deployment YAML"

    kubectl apply -f /home/master/devops-app-production/backend/

fi


echo "----- Waiting for Rollout -----"

kubectl rollout status deployment/backend -n $NAMESPACE

if [ \$? -ne 0 ]; then
    echo "Deployment failed → rolling back"

    kubectl rollout undo deployment/backend -n $NAMESPACE
    exit 1
fi


echo "----- Current Pods -----"

kubectl get pods -n $NAMESPACE


echo "----- Current Services -----"

kubectl get svc -n $NAMESPACE

EOF
"""

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

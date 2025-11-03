pipeline {
    agent any

    environment {
        // Jenkins credentials IDs
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-id')       // Docker Hub login
        DOCKERHUB_USER = 'architjain04'                            // Your Docker Hub username
        GITHUB_CREDENTIALS = 'github-pat'                          // GitHub personal access token
        EC2_CREDENTIALS = 'ec2-ssh-key'                            // SSH key ID in Jenkins
        EC2_HOST = 'ec2-34-227-194-181.compute-1.amazonaws.com'  // Replace with your EC2 public DNS
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    credentialsId: "${GITHUB_CREDENTIALS}",
                    url: 'https://github.com/ArchitJain2004/Task-Management-System.git'
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                dir('server') {
                    sh "docker build -t ${DOCKERHUB_USER}/taskmanager-backend:latest ."
                }
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                dir('client') {
                    sh "docker build --no-cache --build-arg REACT_APP_API_URL=http://taskmanager-backend:8800 -t ${DOCKERHUB_USER}/taskmanager-frontend:latest ."
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-id',
                                                 usernameVariable: 'DOCKER_USER',
                                                 passwordVariable: 'DOCKER_PSW')]) {
                    sh """
                        echo \$DOCKER_PSW | docker login -u \$DOCKER_USER --password-stdin
                        docker push ${DOCKERHUB_USER}/taskmanager-backend:latest
                        docker push ${DOCKERHUB_USER}/taskmanager-frontend:latest
                    """
                }
            }
        }

        stage('Deploy to AWS EC2') {
            steps {
                sshagent(['ec2-ssh-key']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ubuntu@${EC2_HOST} '
                        # Stop & remove old containers
                        docker stop taskmanager-backend || true
                        docker rm taskmanager-backend || true
                        docker stop taskmanager-frontend || true
                        docker rm taskmanager-frontend || true
                        # Remove old images to ensure a fresh pull
                        docker rmi ${DOCKERHUB_USER}/taskmanager-backend:latest || true
                        docker rmi ${DOCKERHUB_USER}/taskmanager-frontend:latest || true
                        # Create a docker network if it does not exist
                        docker network create taskmanager-net || true
                        # Pull new images
                        docker pull ${DOCKERHUB_USER}/taskmanager-backend:latest
                        docker pull ${DOCKERHUB_USER}/taskmanager-frontend:latest
                        # Run backend on the network, exposing port 8800 to the host.
                        docker run -d -p 8800:8800 --network taskmanager-net --name taskmanager-backend ${DOCKERHUB_USER}/taskmanager-backend:latest
                        # Run frontend on the network, exposing its port 80 to the host.
                        docker run -d -p 80:80 --network taskmanager-net --name taskmanager-frontend ${DOCKERHUB_USER}/taskmanager-frontend:latest
                    '
                    """
                }
            }
        }
    }

    post {
        success {
            echo '✅ Deployment completed successfully! Backend on :5000, Frontend on :80'
        }
        failure {
            echo '❌ Deployment failed! Check Jenkins logs.'
        }
    }
}

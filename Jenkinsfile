pipeline {
    agent any 

    environment {
        JWT_SECRET = "${JWT_SECRET}"
        TMDB_API_KEY = "${TMDB_API_KEY}"
        POSTGRES_URL = "${POSTGRES_URL}"
        POSTGRES_USERNAME = "${POSTGRES_USERNAME}"
        POSTGRES_PASSWORD = "${POSTGRES_PASSWORD}"
        POSTGRES_DB = "${POSTGRES_DB}"
        REDIS_HOST = "${REDIS_HOST}"
        REDIS_PORT = "${REDIS_PORT}"

        //env variable for tests
        POSTGRES_URL_TEST = "${POSTGRES_URL_TEST}"
        POSTGRES_USERNAME_TEST = "${POSTGRES_USERNAME_TEST}"
        POSTGRES_PASSWORD_TEST = "${POSTGRES_PASSWORD_TEST}"
        POSTGRES_DB_TEST = "${POSTGRES_DB_TEST}"
    }

    stages {
        stage('Build test images') {
            steps {
                script {
                    echo 'Building Docker images for testing...'
                    sh 'docker-compose -f docker-compose.test.yml build'
                }
            }
        }
        stage('Test') {
            steps {
                script {
                    echo 'Testing...'
                    sh 'docker-compose -f docker-compose.test.yml up --exit-code-from backend'
                }
            }
        }
        stage('Build production images') {
            steps {
                script {
                    echo 'Building docker images for production ...'
                    sh 'docker-compose -f docker-compose.prod.yml build'
                }
            }
        }
        stage('Push images') {
            steps {
                script {
                    echo 'Pushing docker images...'
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-id', 
                                                        usernameVariable: 'DOCKER_USER', 
                                                        passwordVariable: 'DOCKER_PW')]) {
                        sh 'echo $DOCKER_PW | docker login --username $DOCKER_USER --password-stdin'
                        // sh 'docker push aj09/movie-client' //using netlify
                        sh 'docker push aj09/movie-server'
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    echo 'Deploying...'
                }
            }
        }
    }
    post {
        always {  
            sh 'docker-compose down'
            // sh 'docker logout'           
        }   
    }
}

pipeline {
    agent any
    
    // GitHub Webhook 트리거 설정
    triggers {
        githubPush()  // main 브랜치에 push되면 자동 실행
    }
    
    environment {
        // Jenkins Credentials에서 환경 변수 가져오기
        DOCKER_IMAGE = "comatching-fe"
        DOCKER_TAG = "${BUILD_NUMBER}"
        
        // Jenkins Credentials Manager에 저장된 환경 변수들
        BACKEND_LOCATION = credentials('BACKEND_LOCATION')
        NEXT_PUBLIC_API_URL = credentials('NEXT_PUBLIC_API_URL')
        NEXT_PUBLIC_FIREBASE_API_KEY = credentials('NEXT_PUBLIC_FIREBASE_API_KEY')
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = credentials('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN')
        NEXT_PUBLIC_FIREBASE_PROJECT_ID = credentials('NEXT_PUBLIC_FIREBASE_PROJECT_ID')
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = credentials('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET')
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = credentials('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID')
        NEXT_PUBLIC_FIREBASE_APP_ID = credentials('NEXT_PUBLIC_FIREBASE_APP_ID')
        NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID = credentials('NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID')
        NEXT_PUBLIC_FIREBASE_VAPID_KEY = credentials('NEXT_PUBLIC_FIREBASE_VAPID_KEY')
    }
    
    stages {
        // main 브랜치만 배포
        stage('Check Branch') {
            steps {
                script {
                    if (env.BRANCH_NAME != 'main') {
                        echo "Skipping deployment for branch: ${env.BRANCH_NAME}"
                        currentBuild.result = 'SUCCESS'
                        return
                    }
                }
            }
        }
        
        stage('Checkout') {
            when {
                branch 'main'
            }
            steps {
                checkout scm
            }
        }
        
        stage('Build Docker Image') {
            when {
                branch 'main'
            }
            steps {
                script {
                    // Docker 이미지 빌드
                    sh """
                        docker build \\
                        --build-arg NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} \\
                        --build-arg NEXT_PUBLIC_FIREBASE_API_KEY=${NEXT_PUBLIC_FIREBASE_API_KEY} \\
                        --build-arg NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN} \\
                        --build-arg NEXT_PUBLIC_FIREBASE_PROJECT_ID=${NEXT_PUBLIC_FIREBASE_PROJECT_ID} \\
                        --build-arg NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET} \\
                        --build-arg NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID} \\
                        --build-arg NEXT_PUBLIC_FIREBASE_APP_ID=${NEXT_PUBLIC_FIREBASE_APP_ID} \\
                        --build-arg NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=${NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID} \\
                        --build-arg NEXT_PUBLIC_FIREBASE_VAPID_KEY=${NEXT_PUBLIC_FIREBASE_VAPID_KEY} \\
                        -t ${DOCKER_IMAGE}:${DOCKER_TAG} \\
                        -t ${DOCKER_IMAGE}:latest .
                    """
                }
            }
        }
        
        stage('Stop Old Container') {
            when {
                branch 'main'
            }
            steps {
                script {
                    sh '''
                        docker stop comatching-fe || true
                        docker rm comatching-fe || true
                    '''
                }
            }
        }
        
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                script {
                    // 컨테이너 실행
                    sh """
                        docker run -d \\
                        --name comatching-fe \\
                        -p 3000:3000 \\
                        -e BACKEND_LOCATION=${BACKEND_LOCATION} \\
                        -e NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} \\
                        -e NEXT_PUBLIC_FIREBASE_API_KEY=${NEXT_PUBLIC_FIREBASE_API_KEY} \\
                        -e NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN} \\
                        -e NEXT_PUBLIC_FIREBASE_PROJECT_ID=${NEXT_PUBLIC_FIREBASE_PROJECT_ID} \\
                        -e NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET} \\
                        -e NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID} \\
                        -e NEXT_PUBLIC_FIREBASE_APP_ID=${NEXT_PUBLIC_FIREBASE_APP_ID} \\
                        -e NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=${NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID} \\
                        -e NEXT_PUBLIC_FIREBASE_VAPID_KEY=${NEXT_PUBLIC_FIREBASE_VAPID_KEY} \\
                        --restart unless-stopped \\
                        ${DOCKER_IMAGE}:${DOCKER_TAG}
                    """
                }
            }
        }
        
        stage('Clean Up') {
            when {
                branch 'main'
            }
            steps {
                script {
                    // 오래된 이미지 정리 (최근 3개만 유지)
                    sh '''
                        docker images ${DOCKER_IMAGE} --format "{{.Tag}}" | \\
                        grep -v latest | \\
                        tail -n +4 | \\
                        xargs -I {} docker rmi ${DOCKER_IMAGE}:{} || true
                    '''
                }
            }
        }
    }
    
    post {
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed!'
        }
    }
}

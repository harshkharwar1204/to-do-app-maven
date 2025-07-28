// Declarative Pipeline
pipeline {
    // No global agent; each stage will define its own.
    agent none

    // Environment variables can be defined for the entire pipeline.
    environment {
        // Set the path to the Maven tool configured in Jenkins Global Tool Configuration
        MAVEN_HOME = tool 'Maven3'
        PATH = "${env.MAVEN_HOME}/bin:${env.PATH}"
    }

    stages {
        // ========== STAGE 1: BUILD & PACKAGE ==========
        // This stage compiles the code and packages the rest-api module into a JAR file.
        stage('Build & Package') {
            agent {
                // Runs on a Jenkins slave configured with the 'build-node' label.
                label 'build-node'
            }
            steps {
                // 1. Check out the source code from your SCM (e.g., Git)
                echo "Checking out source code on agent: ${env.NODE_NAME}"
                checkout scm

                // 2. Run the Maven package command.
                // 'clean' deletes previous builds, 'package' compiles and creates the JAR.
                echo "Compiling and packaging the project..."
                sh 'mvn clean package'

                // 3. Stash the packaged JAR file separately for archiving later.
                // We find the JAR in the target directory of the rest-api module.
                echo "Stashing the JAR artifact..."
                stash name: 'jar-artifact', includes: 'rest-api/target/*.jar'

                // 4. Stash the entire workspace (source + compiled classes) for the test stage.
                echo "Stashing the full workspace for the test stage..."
                stash name: 'workspace-for-testing', includes: '**/**'
            }
        }

        // ========== STAGE 2: TEST ==========
        // This stage runs the unit and integration tests on a different slave node.
        stage('Test') {
            agent {
                // Runs on a Jenkins slave configured with the 'test-node' label.
                label 'test-node'
            }
            steps {
                // 1. Retrieve the complete workspace from the 'Build & Package' stage.
                echo "Unstashing workspace on agent: ${env.NODE_NAME}"
                unstash 'workspace-for-testing'

                // 2. Run the Maven test command.
                // This will execute all tests in the project.
                echo "Running tests..."
                sh 'mvn test'
            }
        }

        // ========== STAGE 3: ARCHIVE ARTIFACT ==========
        // This stage archives the build artifact (the JAR file) for long-term storage and deployment.
        stage('Archive Artifact') {
            agent {
                // This can run on any agent, but using the build-node is common.
                label 'build-node'
            }
            steps {
                // 1. Retrieve only the stashed JAR file.
                echo "Unstashing the JAR artifact on agent: ${env.NODE_NAME}"
                unstash 'jar-artifact'

                // 2. Archive the artifact. This makes it available on the Jenkins job page.
                // 'fingerprint: true' allows Jenkins to track where this artifact is used.
                echo "Archiving the JAR file..."
                archiveArtifacts artifacts: 'rest-api/target/*.jar', fingerprint: true
            }
        }
    }

    post {
        // This block runs after all stages are complete, regardless of the outcome.
        always {
            echo 'Pipeline finished. Cleaning up workspace.'
            // cleanWs() is a built-in step to delete the workspace contents.
            // This is good practice to ensure a clean environment for the next run.
            cleanWs()
        }
        // You can also have blocks for 'success', 'failure', 'unstable', etc.
        success {
            echo 'Pipeline executed successfully!'
        }
        failure {
            echo 'Pipeline failed. Please check the logs.'
        }
    }
}

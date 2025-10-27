// Este Jenkinsfile está configurado para un agente 'any'
// y utiliza comandos 'bat' (Windows/cmd) para ejecutar Docker Compose.
pipeline {
    agent any

    stages {
        // Parar los servicios que ya existen o en todo caso hacer caso omiso.
        // Se usa '-p sgu-aiag-10a' para especificar el proyecto.
        stage('Parando los servicios...') {
            steps {
                bat '''
                    docker compose -p sgu-aiag-10a down || exit /b 0
                '''
            }
        }

        // Eliminar las imágenes creadas por ese proyecto
        stage('Eliminando imágenes anteriores...') {
            steps {
                bat '''
                    for /f "tokens=*" %%i in ('docker images --filter "label=com.docker.compose.project=sgu-aiag-10a" -q') do (
                        docker rmi -f %%i
                    )
                    if errorlevel 1 (
                        echo No hay imagenes por eliminar
                    ) else (
                        echo Imagenes eliminadas correctamente
                    )
                '''
            }
        }

        // Del recurso SCM configurado en el job, jala el repo (checkout)
        stage('Obteniendo actualización...') {
            steps {
                // Descarga el código fuente del repositorio Git
                checkout scm
            }
        }

        // Construir y levantar los servicios
        // Incluir '-p sgu-aiag-10a' aquí es opcional pero mantiene la coherencia.
        stage('Construyendo y desplegando servicios...') {
            steps {
                bat '''
                    docker compose -p sgu-aiag-10a up --build -d
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline ejecutado con éxito'
        }

        failure {
            echo 'Hubo un error al ejecutar el pipeline'
        }

        always {
            echo 'Pipeline finalizado'
        }
    }
}
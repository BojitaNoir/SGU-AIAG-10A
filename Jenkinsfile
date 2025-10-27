// Este Jenkinsfile está configurado para un agente 'any'
// y utiliza comandos 'bat' (Windows/cmd) para ejecutar Docker Compose.
pipeline {
    agent any

    stages {
        // [MODIFICACIÓN CLAVE]
        // Parar, eliminar contenedores y volúmenes (flag -v) para garantizar
        // que no haya conflictos de nombres al crear la DB.
        stage('Parando y Limpiando Servicios...') {
            steps {
                bat '''
                    // Los flags -v y --remove-orphans aseguran una limpieza completa de contenedores y volúmenes.
                    docker compose -p sgu-aiag-10a down -v --remove-orphans || exit /b 0
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
        // Incluir '-p sgu-aiag-10a' para mantener la coherencia.
        stage('Construyendo y Desplegando Servicios...') {
            steps {
                bat '''
                    // Docker Compose up con --build para recrear si es necesario y -d para correr en background.
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

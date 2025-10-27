// Este Jenkinsfile está configurado para un agente 'any'
// y utiliza comandos 'bat' (Windows/cmd) para ejecutar Docker Compose.
pipeline {
    agent any

    stages {
        // [NUEVA ETAPA DE LIMPIEZA]
        // Intenta detener y eliminar cualquier contenedor llamado "sgu-database"
        // que pudiera haber quedado de ejecuciones manuales o previas, sin importar
        // el nombre del proyecto. Esto resuelve el error "Conflict".
        stage('Pre-limpieza Forzada (Conflicto DB)') {
            steps {
                bat '''
                    echo Intentando eliminar contenedor sgu-database conflictivo...
                    docker rm -f sgu-database || exit /b 0
                '''
            }
        }

        // Parar, eliminar contenedores y volúmenes (-v y --remove-orphans)
        // Esto limpia los recursos creados por el proyecto actual 'sgu-aiag-10a'.
        stage('Limpiando Recursos del Proyecto...') {
            steps {
                bat '''
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
        stage('Construyendo y Desplegando Servicios...') {
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

# Manual Técnico de Despliegue - AmuletsOfSiam

Este documento detalla los pasos necesarios para desplegar la aplicación **AmuletsOfSiam** en Oracle Cloud Free Tier utilizando Docker y GitHub.

## 1. Requisitos Previos

*   **Cuenta de Oracle Cloud**: Una cuenta activa con acceso a instancias Compute.
*   **Instancia**: Se recomienda `VM.Standard.A1.Flex` (ARM, 4 OCPU, 24GB RAM) o `VM.Standard.E2.1.Micro`.
*   **Sistema Operativo**: Ubuntu 22.04 o Oracle Linux 8/9.
*   **Git**: Instalado localmente para subir el código.

## 2. Preparación del Repositorio (Local)

El proyecto ya está configurado con Docker. Asegúrese de subir los cambios al repositorio remoto:

```bash
# Agregar todos los cambios
git add .
git commit -m "chore: Configuración de despliegue y manual técnico"

# Subir a la rama principal (master o main)
git push -u origin master
```

## 3. Preparación del Servidor (Oracle Cloud)

Conéctese a su instancia vía SSH:

```bash
ssh -i /camino/a/su/clave-privada.key ubuntu@<IP-PUBLICA>
```

### 3.1 Actualizar e Instalar Dependencias

Ejecute los siguientes comandos en el servidor para instalar Docker y Git:

```bash
# Actualizar paquetes
sudo apt update && sudo apt upgrade -y

# Instalar Docker y Docker Compose
sudo apt install docker.io docker-compose -y

# Configurar permisos de Docker (para no usar sudo siempre)
sudo usermod -aG docker $USER
newgrp docker

# Verificar instalación
docker --version
docker-compose --version
```

## 4. Despliegue de la Aplicación

### 4.1 Clonar el Repositorio

```bash
# Clonar el proyecto
git clone https://github.com/frannivan/siam-amulets.git

# Entrar al directorio
cd siam-amulets
```

### 4.2 Iniciar con Docker Compose

La aplicación utiliza `docker-compose.yml` para orquestar los contenedores. Para iniciarla en segundo plano:

```bash
docker-compose up -d --build
```

Esto construirá la imagen del backend (compilando el Java con Maven dentro del contenedor) e iniciará el servicio en el puerto **8081**.

## 5. Configuración de Red (Firewall)

Para acceder a la aplicación desde internet, debe abrir el puerto `8081` en dos niveles:

### 5.1 Oracle Cloud Console (Security List)

1.  Vaya a **Compute > Instances** y haga clic en su instancia.
2.  Haga clic en el enlace de **Virtual Cloud Network (VCN)**.
3.  Vaya a **Security Lists** y seleccione la lista por defecto.
4.  Agregue una **Ingress Rule**:
    *   **Source CIDR**: `0.0.0.0/0`
    *   **IP Protocol**: TCP
    *   **Destination Port Range**: `8081`

### 5.2 Firewall del Sistema Operativo (Ubuntu)

Oracle Cloud usa `iptables` por defecto que puede bloquear conexiones.

```bash
# Permitir tráfico TCP en el puerto 8081
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 8081 -j ACCEPT

# Guardar la regla para que persista tras reiniciar
sudo netfilter-persistent save
```

## 6. Verificación

Abra su navegador y acceda a:

`http://<IP-PUBLICA>:8081`

Si ve la aplicación o la respuesta de la API, el despliegue ha sido exitoso.

---
**Notas Adicionales:**
*   Para ver los logs del contenedor: `docker-compose logs -f`
*   Para detener la aplicación: `docker-compose down`
*   Para actualizar tras un `git push`: `git pull && docker-compose up -d --build`

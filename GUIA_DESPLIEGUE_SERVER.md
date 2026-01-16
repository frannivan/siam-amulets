# Guía Maestra de Despliegue en Oracle Cloud
*(Actualizada 16 Enero 2026 - Probada y Funcionando)*

Esta guía cubre el despliegue de **BarberShop** (Puerto 8080) y **AmuletsOfSiam** (Puerto 8081) en la misma instancia de Oracle Cloud.

---

## 1. Preparación Local (CRÍTICO)

Antes de subir nada, asegúrate de que tu configuración local sea correcta.

### A. Configurar URLs (http vs https)
El servidor NO tiene SSL configurado aún. Debes usar `http://` (sin S) en tus archivos de entorno.

**BarberShop (`frontend/src/environments/environment.prod.ts`):**
```typescript
export const environment = {
  production: true,
  apiUrl: 'http://143.47.101.209/api', // IMPORTANTE: http
  tenantId: 'barbershop'
};
```

**AmuletsOfSiam (`frontend/src/environments/environment.prod.ts`):**
```typescript
export const environment = {
  production: true,
  apiUrl: 'http://143.47.101.209/api/amulets' // IMPORTANTE: http
};
```

### B. Compilar Frontends (Localmente)
El servidor tiene poca RAM, así que compilamos en tu Mac y subimos los archivos listos.

**Terminal Local (Mac):**
```bash
# 1. Compilar BarberShop
cd /Users/franivan/Documents/ProyectosWeb/BarberShop/frontend
npm install --legacy-peer-deps
rm -rf dist/ # Limpiar anterior
ng build --configuration production

# 2. Compilar AmuletsOfSiam
cd /Users/franivan/Documents/ProyectosWeb/GigAmulets/AmuletsOfSiam/frontend
npm install
rm -rf dist/ # Limpiar anterior
ng build --configuration production
```

---

## 2. Subir Archivos al Servidor

Usamos `scp` para subir las carpetas `dist`.

**Terminal Local (Mac):**
```bash
# Sube BarberShop (Crear carpeta temporal primero)
ssh -i ~/Downloads/ssh-key-2026-01-09.key ubuntu@143.47.101.209 "mkdir -p ~/barbershop-files"
scp -r -i ~/Downloads/ssh-key-2026-01-09.key /Users/franivan/Documents/ProyectosWeb/BarberShop/frontend/dist/barbershop-frontend/* ubuntu@143.47.101.209:~/barbershop-files

# Sube AmuletsOfSiam
ssh -i ~/Downloads/ssh-key-2026-01-09.key ubuntu@143.47.101.209 "mkdir -p ~/amulets-files"
scp -r -i ~/Downloads/ssh-key-2026-01-09.key /Users/franivan/Documents/ProyectosWeb/GigAmulets/AmuletsOfSiam/frontend/dist/frontend/* ubuntu@143.47.101.209:~/amulets-files
```

---

## 3. Instalación en el Servidor

Conéctate por SSH:
```bash
ssh -i ~/Downloads/ssh-key-2026-01-09.key ubuntu@143.47.101.209
```

### A. Mover Frontends a /var/www
Aquí corregimos el problema común de la carpeta "browser" anidada.

**En el Servidor:**
```bash
# 1. BarberShop
sudo rm -rf /var/www/barbershop/* # Limpiar viejo
sudo mkdir -p /var/www/barbershop
sudo mv ~/barbershop-files/* /var/www/barbershop/
# CORRECCIÓN DE CARPETA 'BROWSER' (Angular 17+)
if [ -d "/var/www/barbershop/browser" ]; then
    sudo mv /var/www/barbershop/browser/* /var/www/barbershop/
    sudo rm -rf /var/www/barbershop/browser
fi

# 2. AmuletsOfSiam
sudo rm -rf /var/www/amulets/* # Limpiar viejo
sudo mkdir -p /var/www/amulets
sudo mv ~/amulets-files/* /var/www/amulets/
# CORRECCIÓN DE CARPETA 'BROWSER'
if [ -d "/var/www/amulets/browser" ]; then
    sudo mv /var/www/amulets/browser/* /var/www/amulets/
    sudo rm -rf /var/www/amulets/browser
fi

# 3. Permisos
sudo chown -R ubuntu:ubuntu /var/www
sudo chmod -R 755 /var/www
```

### B. Iniciar Backends
Asegurarse de que no haya procesos zombis ocupando los puertos.

**En el Servidor:**
```bash
# 1. Matar procesos viejos (si existen)
pkill -f "BarberShopUAT"
pkill -f "siam-amulets"

# 2. Iniciar BarberShop (Puerto 8080)
cd ~
nohup java -jar ~/proyects/BarberShopUAT/backend/target/backend-0.0.1-SNAPSHOT.jar > barbershop.log 2>&1 &

# 3. Iniciar Amulets (Puerto 8081)
cd ~
nohup java -jar ~/proyects/siam-amulets/backend/target/backend-0.0.1-SNAPSHOT.jar > amulets.log 2>&1 &
```

---

## 4. Configuración Nginx (Definitiva)

Si necesitas resetear la configuración de Nginx:

```bash
sudo nano /etc/nginx/conf.d/default.conf
```
*(Contenido recomendado):*
```nginx
server {
    listen 80;
    server_name _;

    # --- BARBERSHOP ---
    location / {
        root /var/www/barbershop;
        try_files $uri $uri/ /index.html;
    }
    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        add_header 'Access-Control-Allow-Origin' '*';
    }

    # --- AMULETS ---
    location /amulets/ {
        alias /var/www/amulets/;
        try_files $uri $uri/ /amulets/index.html;
    }
    location /api/amulets/ {
        proxy_pass http://localhost:8081/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        add_header 'Access-Control-Allow-Origin' '*';
    }
}
```

Reiniciar Nginx:
```bash
sudo nginx -t
sudo systemctl restart nginx
```

---

## ✅ URLs Finales
- **BarberShop:** http://143.47.101.209/
- **Amulets:** http://143.47.101.209/amulets/

# Guía Paso a Paso para Despliegue en Oracle Cloud

Esta guía te explicará exactamente qué comandos ejecutar en tu servidor para poner a funcionar **BarberShop** (Puerto 8080) y **AmuletsOfSiam** (Puerto 8081).

---

## 🚀 Paso 1: Conectarse al Servidor
Abre tu terminal en tu computadora y conéctate por SSH (usa tu comando habitual):
```bash
ssh opc@143.47.101.209
# (O el usuario que uses normalmente, ej. ubuntu, root)
```

---

## 📦 Paso 2: Actualizar el Código
Ve a la carpeta de cada proyecto y descarga los últimos cambios que acabamos de subir.

### BarberShop
```bash
cd ~/proyects/BarberShop  # Ruta de tu servidor
git pull origin main
```

### AmuletsOfSiam
```bash
cd ~/proyects/siam-amulets # Ruta de tu servidor
git pull origin main
```

*(Si te pide credenciales y no las tienes configuradas, tendrás que usar un token o clave SSH).*

---

## 🛠 Paso 3: Compilar los Backends (Java)
**IMPORTANTE:** Si tienes problemas de red en el servidor (errores SSL, tiempos de espera), **compila en TU computadora y sube el archivo (Opción B)**.

### Opción A: Compilar en el Servidor (Si la red funciona bien)

**BarberShop (Backend)**
```bash
cd ~/proyects/BarberShop/backend
chmod +x mvnw
./mvnw clean package -DskipTests
```

**AmuletsOfSiam (Backend)**
```bash
cd ~/proyects/siam-amulets/backend
chmod +x mvnw
./mvnw clean package -DskipTests
```

### Opción B: Compilar Localmente y Subir (RECOMENDADO si falla el servidor)

1. En tu computadora (no en el servidor), compila el proyecto:
   ```bash
   cd /Users/franivan/Documents/ProyectosWeb/GigAmulets/AmuletsOfSiam/backend
   ./mvnw clean package -DskipTests
   ```

2. Sube el archivo `.jar` al servidor usando `scp`:
   ```bash
   scp -i ~/Downloads/ssh-key-2026-01-09.key target/backend-0.0.1-SNAPSHOT.jar ubuntu@143.47.101.209:~/proyects/siam-amulets/backend/target/
   ```
   *(Ajusta la ruta de la llave si es diferente y el usuario `ubuntu` por `opc` si usas Oracle Linux).*

---

## 🎨 Paso 4: Compilar los Frontends (Angular)
Vamos a generar los archivos estáticos para la web.

### BarberShop (Frontend)
```bash
cd ~/proyects/BarberShopUAT/frontend
npm install --legacy-peer-deps
npx ng build --configuration production
```
*Los archivos quedarán en `dist/barbershop-frontend`.*

### AmuletsOfSiam (Frontend)
```bash
cd ~/proyects/siam-amulets/frontend
npm install
npx ng build --configuration production
```
*Los archivos quedarán en `dist/amulets-frontend` (o nombre similar).*

---

## ⚙️ Paso 5: Configurar Nginx (Servidor Web)
Necesitamos decirle a Nginx cómo manejar ambos proyectos.

1. **Copiar archivos del frontend al directorio web:**
   
   **BarberShop:**
   ```bash
   sudo mkdir -p /var/www/barbershop
   sudo cp -r ~/proyects/BarberShop/frontend/dist/barbershop-frontend/* /var/www/barbershop/
   ```

   **AmuletsOfSiam:**
   ```bash
   sudo mkdir -p /var/www/amulets
   sudo cp -r ~/proyects/siam-amulets/frontend/dist/siam-amulets/* /var/www/amulets/
   # (Verifica el nombre exacto de la carpeta dentro de dist/ si es diferente)
   ```

2. **Configurar Nginx:**
   Edita el archivo de configuración:
   ```bash
   sudo nano /etc/nginx/sites-available/default
   # O si usas conf.d: sudo nano /etc/nginx/conf.d/default.conf
   ```

   **Borra todo y pega esto (es una versión simplificada del archivo que te mostré antes):**

   ```nginx
   server {
       listen 80;
       server_name _;

       # --- PROYECTO 1: BARBERSHOP ---
       # Frontend
       location / {
           root /var/www/barbershop;
           try_files $uri $uri/ /index.html;
       }
       # Backend (API)
       location /api/ {
           proxy_pass http://localhost:8080/api/;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           add_header 'Access-Control-Allow-Origin' '*';
       }

       # --- PROYECTO 2: AMULETS OF SIAM ---
       # Frontend (Accesible en /amulets)
       location /amulets/ {
           alias /var/www/amulets/;
           try_files $uri $uri/ /amulets/index.html;
       }
       # Backend (API)
       location /api/amulets/ {
           proxy_pass http://localhost:8081/api/;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           add_header 'Access-Control-Allow-Origin' '*';
       }
   }
   ```

3. **Guardar y Reiniciar Nginx:**
   - Presiona `Ctrl + O`, `Enter` para guardar.
   - Presiona `Ctrl + X` para salir.
   - Ejecuta:
     ```bash
     sudo nginx -t  # Para verificar errores
     sudo systemctl restart nginx
     ```

---

## 🔌 Paso 6: Iniciar los Servicios Java
Finalmente, encendemos los backends.

### BarberShop (Puerto 8080)
Si ya tienes un servicio creado:
```bash
sudo systemctl restart barbershop
```
*Si no tienes servicio, ejecútalo manualmente (temporal):*
```bash
nohup java -jar ~/proyects/BarberShop/backend/target/backend-0.0.1-SNAPSHOT.jar > barbershop.log 2>&1 &
```

### AmuletsOfSiam (Puerto 8081)
Si ya tienes un servicio creado:
```bash
sudo systemctl restart amulets
```
*Si no tienes servicio, ejecútalo manualmente (temporal):*
```bash
nohup java -jar ~/proyects/siam-amulets/backend/target/backend-0.0.1-SNAPSHOT.jar > amulets.log 2>&1 &
```

---

## ✅ Verificación
Abre en tu navegador:
- **BarberShop:** `http://143.47.101.209/`
- **AmuletsOfSiam:** `http://143.47.101.209/amulets/`

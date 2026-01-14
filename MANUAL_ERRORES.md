# GUÍA DE SOLUCIÓN DE ERRORES - AMULETS OF SIAM

## 1. Backend (Java / Spring Boot)

Hemos realizado una **limpieza profunda de Lombok** para evitar errores de compilación en Eclipse. Ahora el código usa constructores y POJOs estándar de Java.

### Pasos para limpiar el Backend:
1.  **Actualizar Proyecto Maven:** En Eclipse, haz clic derecho sobre el proyecto `amulets-backend` -> `Maven` -> `Update Project...` -> Marca `Force Update of Snapshots/Releases` -> `OK`.
2.  **Limpiar y Compilar:** `Project` -> `Clean...` -> Selecciona el proyecto y dale a `Clean`.
3.  **Verificar Errores:** Si aún ves errores en `User.java` o `Product.java`, asegúrate de que los Getters/Setters generados por mí están presentes.
4.  **Ejecutar:** Ejecuta `AmuletsApplication.java` como "Java Application".

**Nota sobre Puertos:**
El backend ahora corre en el puerto **8081** para evitar conflictos con el 8080.
- URL Base: `http://localhost:8081/api`
- H2 Console: `http://localhost:8081/h2-console` (User: `sa`, Pass: `password`)

---

## 2. Frontend (Angular)

Si el compilador de Angular dice que "no puede encontrar módulos" (`Could not resolve`), sigue estos pasos:

### Limpieza de Cache de Angular:
1.  **Detén el servidor:** Presiona `Ctrl + C` en la terminal donde corre `npm start`.
2.  **Borra la cache:** Ejecuta los siguientes comandos en la carpeta `frontend`:
    ```bash
    rm -rf .angular
    rm -rf dist
    ```
3.  **Reinicia:**
    ```bash
    npm start
    ```

### Error de Conexión (CORS/Proxy):
- El archivo `proxy.conf.json` ya está configurado para apuntar a `localhost:8081`.
- Si el backend no está corriendo, verás errores de conexión en la consola del navegador.

---

## 3. Credenciales de Prueba
- **Admin:** `admin@amulets.siam` / `admin123`
- **Usuario:** `user@amulets.siam` / `user123`

---

## 4. Error de "Segunda Carga" (Second Click)

### Problema:
Los datos (como productos o listas) no aparecen en pantalla en la primera carga. El usuario tiene que hacer clic de nuevo en el botón de "Inicio" o navegar a otra ruta para que la información se visualice.

### Causas Identificadas:
1.  **Dependencia Circular en Interceptores:** El `AuthInterceptor` dependía directamente de `AuthService`, el cual depende de `HttpClient`. Esto creaba un bucle que detacaba las peticiones del ciclo de vida normal de Angular.
2.  **Desincronización de Zone.js:** En aplicaciones standalone modernas, los eventos asíncronos distribuidos a veces ocurren "fuera de la zona", por lo que Angular no detecta la llegada de datos automáticamente.

### Soluciones Aplicadas:
1.  **Lazy Injection en Interceptores:** Usar `Injector` para obtener el servicio de autenticación de forma tardía:
    ```typescript
    const injector = inject(Injector);
    const authService = injector.get(AuthService);
    ```
2.  **Detección de Cambios Manual:** Inyectar `ChangeDetectorRef` en el componente y llamar a `detectChanges()` después de que los datos lleguen:
    ```typescript
    this.productService.getProducts().subscribe(page => {
      this.products = page.content;
      this.cdr.detectChanges(); // <-- Forzar refresco
    });
    ```

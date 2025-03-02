<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Car Dealership 🚗

## 📌 Configuración inicial

1. **Clonar el repositorio**  
   ```sh
   git clone <URL_DEL_REPO>
   cd car-dealership
   ```

2. **Copiar el archivo de variables de entorno**  
   ```sh
   cp .env.example .env
   ```

3. **Modificar el archivo `.env`** con las credenciales necesarias.

---

## 🚀 Ejecutar la aplicación

### 🛠️ Levantar la base de datos con Docker  
```sh
docker-compose up -d
```

Esto iniciará los servicios de **MongoDB** y **Mongo Express** en segundo plano.

---

### 🔄 Poblar la base de datos  
```
http://localhost:${PORT}/api/seed
```

---

### 🌍 Acceder a Mongo Express  
```
http://localhost:${MONGO_EXPRESS_PORT}
```

---

## 📜 Notas adicionales  
- **Asegúrate de tener Docker instalado** antes de ejecutar `docker-compose up -d`.  
- Si cambias algún valor en `.env`, reinicia la aplicación para aplicar los cambios.  

🚀 ¡Listo para empezar a desarrollar!



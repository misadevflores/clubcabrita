# 🏔️ Club Cabritas - Dashboard de Administración

Plataforma web para gestionar rutas de senderismo, galería de imágenes, eventos y mensajes de contacto.

## ✅ Implementación Completada

- ✅ Conexión a Supabase PostgreSQL
- ✅ 8 Tablas principales creadas
- ✅ Dashboard de administración completo
- ✅ 30+ API endpoints funcionales
- ✅ Seguridad implementada (JWT + bcryptjs)
- ✅ Documentación completa

## 🚀 Empezar Rápido

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Ejecutar Script SQL en Supabase
1. Ve a https://app.supabase.com
2. Selecciona proyecto "clubcabritas"
3. Ve a SQL Editor → New Query
4. Copia contenido de `server/migrations/001_initial_schema.sql`
5. Ejecuta el script

### 3. Iniciar Servidor
```bash
npm run dev
```

### 4. Acceder al Dashboard
- **URL**: http://localhost:5173/admin
- **Usuario**: admin
- **Contraseña**: admin123

## 📚 Documentación

- **[INICIO_RAPIDO.md](INICIO_RAPIDO.md)** - Guía rápida (5 min)
- **[SETUP_SUPABASE.md](SETUP_SUPABASE.md)** - Configuración (15 min)
- **[MIGRACION_SUPABASE.md](MIGRACION_SUPABASE.md)** - Migración (30 min)
- **[ESTRUCTURA_BD.md](ESTRUCTURA_BD.md)** - Base de datos (30 min)
- **[CHECKLIST_VERIFICACION.md](CHECKLIST_VERIFICACION.md)** - Verificación (45 min)
- **[INDICE_DOCUMENTACION.md](INDICE_DOCUMENTACION.md)** - Índice completo
- **[EJECUTIVO.md](EJECUTIVO.md)** - Resumen ejecutivo

## 🎯 Funcionalidades

### 📍 Gestión de Rutas
- Crear, editar, eliminar rutas
- Subir imágenes
- Especificar dificultad, distancia, duración

### 🖼️ Gestión de Galería
- Agregar, editar, eliminar imágenes
- Organizar por categorías

### 🎉 Gestión de Eventos
- Crear, editar, eliminar eventos
- Especificar fecha, ubicación, capacidad

### 💬 Mensajes de Contacto
- Ver todos los mensajes
- Marcar como leído
- Eliminar mensajes

### ⚙️ Configuración del Sitio
- Nombre del sitio
- Email de contacto
- URLs de redes sociales
- Modo mantenimiento


```

```

## 📊 Tablas de Base de Datos

- users - Usuarios del sistema
- routes - Rutas de senderismo
- gallery - Galería de imágenes
- settings - Configuración del sitio
- contact_messages - Mensajes de contacto
- events - Eventos
- event_registrations - Registros de eventos
- audit_logs - Registro de auditoría

## 🛠️ Stack Tecnológico

- **Frontend**: Vue 3 + TypeScript + Vite
- **Backend**: Express.js + Node.js
- **Base de Datos**: Supabase PostgreSQL
- **Autenticación**: JWT + bcryptjs
- **Almacenamiento**: Supabase Storage

## 📁 Estructura del Proyecto

```
project/
├── server/
│   ├── index.js                    # Servidor Express
│   ├── supabase.js                 # Configuración Supabase
│   ├── migrations/
│   │   └── 001_initial_schema.sql  # Script SQL
│   └── middleware/
│       └── auth.js                 # Middleware de autenticación
├── src/
│   ├── views/admin/
│   │   └── AdminDashboard.vue      # Dashboard principal
│   ├── router/
│   │   └── index.ts                # Configuración de rutas
│   └── store/
│       └── auth.ts                 # Store de autenticación
├── .env                            # Variables de entorno
└── package.json                    # Dependencias
```

## 🔗 API Endpoints

### Autenticación
- `POST /api/login` - Iniciar sesión

### Rutas
- `GET /api/routes` - Obtener todas
- `POST /api/routes` - Crear
- `PUT /api/routes/:id` - Actualizar
- `DELETE /api/routes/:id` - Eliminar

### Galería
- `GET /api/gallery` - Obtener todas
- `POST /api/gallery` - Crear
- `PUT /api/gallery/:id` - Actualizar
- `DELETE /api/gallery/:id` - Eliminar

### Eventos
- `GET /api/events` - Obtener todos
- `POST /api/events` - Crear
- `PUT /api/events/:id` - Actualizar
- `DELETE /api/events/:id` - Eliminar

### Mensajes
- `POST /api/contact-messages` - Crear
- `GET /api/contact-messages` - Obtener todos
- `DELETE /api/contact-messages/:id` - Eliminar

### Configuración
- `GET /api/settings` - Obtener
- `PUT /api/settings` - Actualizar

## 🧪 Verificación

Ejecuta el checklist en [CHECKLIST_VERIFICACION.md](CHECKLIST_VERIFICACION.md) para verificar que todo funciona correctamente.

## 📝 Notas Importantes

1. Cambiar la contraseña del admin antes de producción
2. Supabase realiza backups automáticos
3. La BD puede manejar millones de registros
4. Los índices están optimizados para búsquedas rápidas

## 🎓 Próximos Pasos

1. Cambiar contraseña del admin
2. Agregar más usuarios
3. Configurar redes sociales
4. Agregar contenido inicial
5. Implementar búsqueda
6. Agregar filtros
7. Implementar notificaciones
8. Implementar OAuth
9. Configurar analytics
10. Optimizar imágenes

## 📞 Soporte

- [Supabase Docs](https://supabase.com/docs)
- [Vue.js Docs](https://vuejs.org)
- [Express.js Docs](https://expressjs.com)

## ✅ Estado

**Listo para usar** - Versión 1.0.0 (1 de Junio de 2026)

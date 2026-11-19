# Gestión de Productos — CRUD con Angular y Cloud Firestore

## Propósito de la Aplicación
Aplicación web interactiva desarrollada con **Angular** y **Firebase (Cloud Firestore)** que permite administrar un inventario de productos en la nube en tiempo real, garantizando la persistencia de datos y aplicando validaciones estrictas en el cliente.

## Funciones del CRUD Implementadas
Todas las operaciones de acceso a datos están centralizadas en `ProductoService`:
- **Crear (`crearProducto`):** Registra nuevos productos en la colección `productos` mediante `addDoc()`, validando previamente que el nombre y la categoría no estén vacíos, que el precio sea numérico $\ge 0$ y que el stock sea un número entero $\ge 0$.
- **Consultar (`obtenerProductos`):** Recupera todos los documentos almacenados en Cloud Firestore mediante `getDocs()` ordenados alfabéticamente por nombre, conservando el `id` único de cada documento y mostrándolos en una tabla dinámica.
- **Actualizar (`actualizarProducto`):** Carga los datos del producto seleccionado en el formulario y guarda las modificaciones directamente sobre el documento correspondiente en Firestore usando `updateDoc()` y su identificador.
- **Eliminar (`eliminarProducto`):** Solicita confirmación explícita al usuario antes de borrar el documento mediante `deleteDoc()`. Si el usuario cancela, el registro se conserva intacto.

## Modelo de Datos (`Producto`)
La aplicación trabaja sobre la colección **`productos`** en Cloud Firestore con la siguiente estructura tipada (`src/app/models/producto.model.ts`):
- `id` (`string`, opcional): Identificador único autogenerado por Cloud Firestore.
- `nombre` (`string`): Nombre descriptivo del producto.
- `precio` (`number`): Precio unitario del producto ($\ge 0$).
- `stock` (`number`): Cantidad entera disponible en inventario ($\ge 0$).
- `categoria` (`string`): Categoría a la que pertenece el producto.

## Configuración de Firebase e Instalación Local
1. Clonar el repositorio:
   ```bash
   git clone [https://github.com/FelipePhipe/crud-productos-firebase.git](https://github.com/FelipePhipe/crud-productos-firebase.git)
   ```
2. Entrar al directorio del proyecto e instalar dependencias:
   ```bash
   cd crud-productos-firebase
   npm install
   ```
3. Configurar las credenciales de Firebase:
   - Crear un proyecto en [Firebase Console](https://console.firebase.google.com/) y habilitar **Cloud Firestore**.
   - Registrar una aplicación web y copiar el objeto `firebaseConfig`.
   - Crear el archivo `src/environments/environment.development.ts` (excluido de Git por seguridad) o completar `src/environments/environment.ts` con las credenciales propias de `firebaseConfig`.
4. Iniciar el servidor de desarrollo local:
   ```bash
   ng serve -o
   ```
5. Abrir el navegador en `http://localhost:4200`.

## Despliegue en Producción (Vercel)
- **URL de la aplicación desplegada:** https://crud-productos-firebase.vercel.app
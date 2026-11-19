import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductoService } from './services/producto'; // <-- Ajusta si tu archivo es producto.service
import { Producto } from './models/producto.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  productos = signal<Producto[]>([]);
  cargando = signal<boolean>(false);
  guardando = signal<boolean>(false);
  mensajeError = signal<string>('');
  mensajeExito = signal<string>('');

  // Campos del formulario
  idEditando = signal<string | null>(null);
  nombre: string = '';
  precio: number | null = null;
  stock: number | null = null;
  categoria: string = '';

  // Errores específicos de validación del formulario
  erroresValidacion = signal<string[]>([]);

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  async cargarProductos(): Promise<void> {
    this.cargando.set(true);
    this.mensajeError.set('');
    try {
      const lista = await this.productoService.obtenerProductos();
      this.productos.set(lista);
    } catch (error) {
      console.error(error);
      this.mensajeError.set(
        'Error al consultar Cloud Firestore. Verifica tu conexión o las reglas de seguridad.'
      );
    } finally {
      this.cargando.set(false);
    }
  }

  // Validaciones estrictas exigidas por la rúbrica (Requisito 2.5)
  validarFormulario(): boolean {
    const errores: string[] = [];

    if (!this.nombre || this.nombre.trim().length === 0) {
      errores.push('El nombre del producto es obligatorio y no puede estar vacío.');
    }

    if (!this.categoria || this.categoria.trim().length === 0) {
      errores.push('La categoría es obligatoria y no puede estar vacía.');
    }

    if (this.precio === null || isNaN(this.precio) || this.precio < 0) {
      errores.push('El precio debe ser un valor numérico mayor o igual a 0.');
    }

    if (
      this.stock === null ||
      isNaN(this.stock) ||
      this.stock < 0 ||
      !Number.isInteger(Number(this.stock))
    ) {
      errores.push('El stock debe ser un número entero mayor o igual a 0 (no se permiten decimales).');
    }

    this.erroresValidacion.set(errores);
    return errores.length === 0;
  }

  async guardarProducto(): Promise<void> {
    this.mensajeExito.set('');
    this.mensajeError.set('');

    if (!this.validarFormulario()) {
      return; // Impide el envío si hay datos inválidos
    }

    this.guardando.set(true);
    const datosProducto: Omit<Producto, 'id'> = {
      nombre: this.nombre.trim(),
      precio: Number(this.precio),
      stock: Number(this.stock),
      categoria: this.categoria.trim()
    };

    try {
      const idActual = this.idEditando();
      if (idActual) {
        // MODO ACTUALIZAR
        await this.productoService.actualizarProducto(idActual, datosProducto);
        this.mensajeExito.set('Producto actualizado correctamente en Firestore.');
      } else {
        // MODO CREAR
        await this.productoService.crearProducto(datosProducto);
        this.mensajeExito.set('Producto registrado correctamente en Firestore.');
      }

      this.limpiarFormulario();
      await this.cargarProductos(); // Actualiza la tabla inmediatamente
    } catch (error) {
      console.error(error);
      this.mensajeError.set('Ocurrió un error al guardar el producto en Cloud Firestore.');
    } finally {
      this.guardando.set(false);
    }
  }

  seleccionarParaEditar(producto: Producto): void {
    this.erroresValidacion.set([]);
    this.mensajeExito.set('');
    this.mensajeError.set('');

    this.idEditando.set(producto.id || null);
    this.nombre = producto.nombre;
    this.precio = producto.precio;
    this.stock = producto.stock;
    this.categoria = producto.categoria;
  }

  cancelarEdicion(): void {
    this.limpiarFormulario();
  }

  limpiarFormulario(): void {
    this.idEditando.set(null);
    this.nombre = '';
    this.precio = null;
    this.stock = null;
    this.categoria = '';
    this.erroresValidacion.set([]);
  }

  async confirmarYEliminar(producto: Producto): Promise<void> {
    if (!producto.id) return;

    const confirmado = window.confirm(
      `¿Estás seguro de que deseas eliminar "${producto.nombre}" de Firestore?`
    );

    if (!confirmado) {
      return; // Al cancelar, conserva el producto
    }

    this.mensajeExito.set('');
    this.mensajeError.set('');

    try {
      await this.productoService.eliminarProducto(producto.id);
      if (this.idEditando() === producto.id) {
        this.limpiarFormulario();
      }
      this.mensajeExito.set(`Producto "${producto.nombre}" eliminado correctamente.`);
      await this.cargarProductos();
    } catch (error) {
      console.error(error);
      this.mensajeError.set('No se pudo eliminar el producto en Firestore.');
    }
  }
}
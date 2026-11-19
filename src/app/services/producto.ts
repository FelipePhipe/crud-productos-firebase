import { Injectable } from '@angular/core';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase.config'; // <-- Ajusta esta ruta al archivo donde exportaste 'db'
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private coleccionRef = collection(db, 'productos');

  // 1. CONSULTAR (Read): Recupera todos los documentos conservando su ID
  async obtenerProductos(): Promise<Producto[]> {
    const q = query(this.coleccionRef, orderBy('nombre', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((documento) => ({
      id: documento.id,
      ...(documento.data() as Omit<Producto, 'id'>)
    }));
  }

  // 2. CREAR (Create): Agrega un nuevo documento a la colección 'productos'
  async crearProducto(producto: Omit<Producto, 'id'>): Promise<string> {
    const docRef = await addDoc(this.coleccionRef, {
      nombre: producto.nombre.trim(),
      precio: Number(producto.precio),
      stock: Number(producto.stock),
      categoria: producto.categoria.trim()
    });
    return docRef.id;
  }

  // 3. ACTUALIZAR (Update): Modifica un documento existente usando su ID
  async actualizarProducto(id: string, producto: Omit<Producto, 'id'>): Promise<void> {
    const docRef = doc(db, 'productos', id);
    await updateDoc(docRef, {
      nombre: producto.nombre.trim(),
      precio: Number(producto.precio),
      stock: Number(producto.stock),
      categoria: producto.categoria.trim()
    });
  }

  // 4. ELIMINAR (Delete): Borra el documento por su ID
  async eliminarProducto(id: string): Promise<void> {
    const docRef = doc(db, 'productos', id);
    await deleteDoc(docRef);
  }
}
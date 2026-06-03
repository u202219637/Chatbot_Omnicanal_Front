export interface ProductoList {
  id: number;
  nombre: string;
  categoriaNombre: string;
  marcaNombre: string;
  especResumen: string;
  precio: number;
  stock: number;
  urlImagen: string;
  estado: boolean;
}

export interface ProductoDetalle extends ProductoList {
  codigoProducto: string;
  descripcion: string;
  especificaciones: string;
  recomendacionIa: string;
}

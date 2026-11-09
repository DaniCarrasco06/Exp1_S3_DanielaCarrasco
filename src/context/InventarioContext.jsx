import { createContext, useContext, useEffect, useReducer } from 'react';

const STORAGE_KEY = 'inventario-supermercado-v3';

export const TIPOS_PRODUCTO = [
  'Abarrotes',
  'Bebidas',
  'Carnes',
  'Congelados',
  'Frutas y verduras',
  'Lácteos',
  'Limpieza',
  'Panadería',
  'Otros',
];

const articulosIniciales = [
  { id: 1, nombre: 'Leche entera 1L', marca: 'Colun', tipo: 'Lácteos', precio: 1190, cantidad: 24 },
  { id: 2, nombre: 'Arroz grado 1 1kg', marca: 'Tucapel', tipo: 'Abarrotes', precio: 1590, cantidad: 40 },
  { id: 3, nombre: 'Bebida cola 2L', marca: 'Coca-Cola', tipo: 'Bebidas', precio: 2290, cantidad: 30 },
  { id: 4, nombre: 'Detergente líquido 3L', marca: 'Omo', tipo: 'Limpieza', precio: 8990, cantidad: 12 },
  { id: 5, nombre: 'Yogurt frutilla 150g', marca: 'Soprole', tipo: 'Lácteos', precio: 490, cantidad: 50 },
  { id: 6, nombre: 'Pan de molde blanco', marca: 'Ideal', tipo: 'Panadería', precio: 2490, cantidad: 15 },
  { id: 7, nombre: 'Pechuga de pollo 1kg', marca: 'Super Pollo', tipo: 'Carnes', precio: 5990, cantidad: 10 },
  { id: 8, nombre: 'Plátanos 1kg', marca: 'Campo Fresco', tipo: 'Frutas y verduras', precio: 1490, cantidad: 20 },
];

const estadoVacio = { articulos: articulosIniciales, carrito: [] };

function reducer(state, action) {
  switch (action.type) {
    case 'AGREGAR_ARTICULO':
      return { ...state, articulos: [...state.articulos, action.payload] };

    case 'ELIMINAR_ARTICULO':
      return {
        articulos: state.articulos.filter((a) => a.id !== action.payload),
        carrito: state.carrito.filter((c) => c.id !== action.payload),
      };

    case 'AGREGAR_AL_CARRITO': {
      const { id, cantidad } = action.payload;
      const articulo = state.articulos.find((a) => a.id === id);
      if (!articulo || cantidad < 1 || cantidad > articulo.cantidad) return state;

      const articulos = state.articulos.map((a) =>
        a.id === id ? { ...a, cantidad: a.cantidad - cantidad } : a
      );
      const existe = state.carrito.some((c) => c.id === id);
      const carrito = existe
        ? state.carrito.map((c) =>
            c.id === id ? { ...c, cantidad: c.cantidad + cantidad } : c
          )
        : [...state.carrito, { id, cantidad }];
      return { articulos, carrito };
    }

    case 'AUMENTAR_CANTIDAD': {
      const id = action.payload;
      const articulo = state.articulos.find((a) => a.id === id);
      if (!articulo || articulo.cantidad < 1) return state;
      return {
        articulos: state.articulos.map((a) =>
          a.id === id ? { ...a, cantidad: a.cantidad - 1 } : a
        ),
        carrito: state.carrito.map((c) =>
          c.id === id ? { ...c, cantidad: c.cantidad + 1 } : c
        ),
      };
    }

    case 'DISMINUIR_CANTIDAD': {
      const id = action.payload;
      const item = state.carrito.find((c) => c.id === id);
      if (!item) return state;
      const articulos = state.articulos.map((a) =>
        a.id === id ? { ...a, cantidad: a.cantidad + 1 } : a
      );
      const carrito =
        item.cantidad <= 1
          ? state.carrito.filter((c) => c.id !== id)
          : state.carrito.map((c) =>
              c.id === id ? { ...c, cantidad: c.cantidad - 1 } : c
            );
      return { articulos, carrito };
    }

    case 'QUITAR_DEL_CARRITO': {
      const id = action.payload;
      const item = state.carrito.find((c) => c.id === id);
      if (!item) return state;
      return {
        articulos: state.articulos.map((a) =>
          a.id === id ? { ...a, cantidad: a.cantidad + item.cantidad } : a
        ),
        carrito: state.carrito.filter((c) => c.id !== id),
      };
    }

    case 'VACIAR_CARRITO': {
      const articulos = state.articulos.map((a) => {
        const item = state.carrito.find((c) => c.id === a.id);
        return item ? { ...a, cantidad: a.cantidad + item.cantidad } : a;
      });
      return { articulos, carrito: [] };
    }

    case 'FINALIZAR_COMPRA':
      return { ...state, carrito: [] };

    default:
      return state;
  }
}

function cargarEstadoInicial() {
  try {
    const guardado = localStorage.getItem(STORAGE_KEY);
    if (guardado) {
      const datos = JSON.parse(guardado);
      if (Array.isArray(datos.articulos) && Array.isArray(datos.carrito)) {
        return datos;
      }
    }
  } catch {
  }
  return estadoVacio;
}

export function filtrarPorCategoria(articulos, categoria) {
  if (!categoria || categoria === 'Todas') return articulos;
  return articulos.filter((a) => a.tipo === categoria);
}

export const formatoPrecio = (valor) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(valor);

const InventarioContext = createContext(null);

export function InventarioProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, cargarEstadoInicial);
  const { articulos, carrito } = state;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
    }
  }, [state]);

  const agregarArticulo = ({ nombre, marca, tipo, precio, cantidad }) =>
    dispatch({
      type: 'AGREGAR_ARTICULO',
      payload: {
        id: Date.now(),
        nombre: nombre.trim(),
        marca: marca.trim(),
        tipo,
        precio: Number(precio),
        cantidad: Number(cantidad),
      },
    });

  const eliminarArticulo = (id) =>
    dispatch({ type: 'ELIMINAR_ARTICULO', payload: id });

  const agregarAlCarrito = (id, cantidad = 1) =>
    dispatch({ type: 'AGREGAR_AL_CARRITO', payload: { id, cantidad } });

  const aumentarCantidad = (id) =>
    dispatch({ type: 'AUMENTAR_CANTIDAD', payload: id });

  const disminuirCantidad = (id) =>
    dispatch({ type: 'DISMINUIR_CANTIDAD', payload: id });

  const quitarDelCarrito = (id) =>
    dispatch({ type: 'QUITAR_DEL_CARRITO', payload: id });

  const vaciarCarrito = () => dispatch({ type: 'VACIAR_CARRITO' });

  const finalizarCompra = () => dispatch({ type: 'FINALIZAR_COMPRA' });

  const itemsCarrito = carrito
    .map((c) => {
      const articulo = articulos.find((a) => a.id === c.id);
      return articulo ? { ...articulo, cantidadCarrito: c.cantidad } : null;
    })
    .filter(Boolean);

  const totalUnidades = carrito.reduce((suma, c) => suma + c.cantidad, 0);
  const totalPrecio = itemsCarrito.reduce(
    (suma, i) => suma + i.precio * i.cantidadCarrito,
    0
  );

  return (
    <InventarioContext.Provider
      value={{
        articulos,
        carrito,
        itemsCarrito,
        totalUnidades,
        totalPrecio,
        agregarArticulo,
        eliminarArticulo,
        agregarAlCarrito,
        aumentarCantidad,
        disminuirCantidad,
        quitarDelCarrito,
        vaciarCarrito,
        finalizarCompra,
      }}
    >
      {children}
    </InventarioContext.Provider>
  );
}

export function useInventario() {
  const contexto = useContext(InventarioContext);
  if (!contexto) {
    throw new Error('useInventario debe usarse dentro de <InventarioProvider>');
  }
  return contexto;
}

import { Link } from 'react-router-dom';
import { useInventario, formatoPrecio } from '../context/InventarioContext.jsx';
import { useState } from 'react';

export default function Carrito() {
  const {
    itemsCarrito,
    totalUnidades,
    totalPrecio,
    aumentarCantidad,
    disminuirCantidad,
    quitarDelCarrito,
    vaciarCarrito,
    finalizarCompra,
  } = useInventario();
  const [compraOk, setCompraOk] = useState(false);

  const handleFinalizar = () => {
    finalizarCompra();
    setCompraOk(true);
  };

  if (itemsCarrito.length === 0) {
    return (
      <section className="mx-auto max-w-lg text-center">
        {compraOk ? (
          <div
            role="status"
            className="mb-4 rounded-lg bg-emerald-100 px-4 py-3 text-emerald-800"
          >
            ¡Compra realizada con éxito! Gracias por tu compra.
          </div>
        ) : (
          <p className="mb-4 text-lg text-slate-600">Tu carrito está vacío.</p>
        )}
        <Link
          to="/inventario"
          onClick={() => setCompraOk(false)}
          className="inline-block rounded-lg bg-emerald-600 px-5 py-2.5 font-medium text-white hover:bg-emerald-700"
        >
          Ir al inventario
        </Link>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-emerald-800">
          Carrito ({totalUnidades} {totalUnidades === 1 ? 'unidad' : 'unidades'})
        </h1>
        <button
          type="button"
          onClick={vaciarCarrito}
          className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Vaciar carrito
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow">
        <table className="w-full text-left text-sm">
          <thead className="bg-emerald-700 text-white">
            <tr>
              <th className="px-4 py-3 font-semibold">Artículo</th>
              <th className="px-4 py-3 text-right font-semibold">Precio</th>
              <th className="px-4 py-3 text-center font-semibold">Cantidad</th>
              <th className="px-4 py-3 text-right font-semibold">Subtotal</th>
              <th className="px-4 py-3 text-right font-semibold"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {itemsCarrito.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3">
                  <Link
                    to={`/inventario/${item.id}`}
                    className="font-medium text-emerald-800 hover:underline"
                  >
                    {item.nombre}
                  </Link>
                  <p className="text-xs text-slate-500">
                    {item.marca} · Disponibles: {item.cantidad}
                  </p>
                </td>
                <td className="px-4 py-3 text-right">
                  {formatoPrecio(item.precio)}
                </td>
                <td className="px-4 py-3">
                  <div className="mx-auto flex w-fit items-center rounded-lg border border-slate-300">
                    <button
                      type="button"
                      aria-label={`Disminuir ${item.nombre}`}
                      onClick={() => disminuirCantidad(item.id)}
                      className="px-3 py-1.5 hover:bg-slate-50"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-medium">
                      {item.cantidadCarrito}
                    </span>
                    <button
                      type="button"
                      aria-label={`Aumentar ${item.nombre}`}
                      disabled={item.cantidad < 1}
                      onClick={() => aumentarCantidad(item.id)}
                      className="px-3 py-1.5 hover:bg-slate-50 disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-medium">
                  {formatoPrecio(item.precio * item.cantidadCarrito)}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => quitarDelCarrito(item.id)}
                    className="rounded-md px-3 py-1 text-red-600 hover:bg-red-50"
                  >
                    Quitar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-6 shadow">
        <p className="text-lg">
          Total:{' '}
          <span className="text-2xl font-bold text-emerald-700">
            {formatoPrecio(totalPrecio)}
          </span>
        </p>
        <button
          type="button"
          onClick={handleFinalizar}
          className="rounded-lg bg-emerald-600 px-5 py-2.5 font-medium text-white hover:bg-emerald-700"
        >
          Finalizar compra
        </button>
      </div>
    </section>
  );
}

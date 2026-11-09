import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useInventario, formatoPrecio } from '../context/InventarioContext.jsx';

export default function DetalleArticulo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { articulos, carrito, agregarAlCarrito } = useInventario();
  const [cantidad, setCantidad] = useState(1);
  const [mensaje, setMensaje] = useState('');

  const articulo = articulos.find((a) => a.id === Number(id));

  if (!articulo) {
    return (
      <section className="mx-auto max-w-lg text-center">
        <p className="mb-4 text-lg">El artículo no existe.</p>
        <Link to="/inventario" className="text-emerald-700 underline">
          Volver al inventario
        </Link>
      </section>
    );
  }

  const enCarrito = carrito.find((c) => c.id === articulo.id)?.cantidad ?? 0;
  const agotado = articulo.cantidad < 1;
  const cantidadValida = Math.min(Math.max(cantidad, 1), Math.max(articulo.cantidad, 1));

  const handleAgregar = () => {
    if (agotado) return;
    agregarAlCarrito(articulo.id, cantidadValida);
    setMensaje(
      `Se agregaron ${cantidadValida} unidad${cantidadValida > 1 ? 'es' : ''} al carrito.`
    );
    setCantidad(1);
  };

  return (
    <section className="mx-auto max-w-lg">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-4 text-sm text-emerald-700 hover:underline"
      >
        ← Volver
      </button>

      <div className="space-y-5 rounded-xl bg-white p-6 shadow">
        <div>
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
            {articulo.tipo}
          </span>
          <h1 className="mt-2 text-2xl font-bold text-emerald-800">
            {articulo.nombre}
          </h1>
          <p className="text-slate-600">Marca: {articulo.marca}</p>
        </div>

        <dl className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-slate-50 p-4">
            <dt className="text-sm text-slate-500">Precio</dt>
            <dd className="text-2xl font-bold text-emerald-700">
              {formatoPrecio(articulo.precio)}
            </dd>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <dt className="text-sm text-slate-500">Disponible</dt>
            <dd
              className={`text-2xl font-bold ${
                agotado ? 'text-red-600' : 'text-emerald-700'
              }`}
            >
              {agotado ? 'Agotado' : articulo.cantidad}
            </dd>
          </div>
        </dl>

        {enCarrito > 0 && (
          <p className="text-sm text-slate-600">
            Tienes <strong>{enCarrito}</strong> en tu carrito.
          </p>
        )}

        {mensaje && (
          <div
            role="status"
            className="rounded-lg bg-emerald-100 px-4 py-3 text-sm text-emerald-800"
          >
            {mensaje}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-lg border border-slate-300">
            <button
              type="button"
              aria-label="Disminuir cantidad"
              disabled={agotado || cantidadValida <= 1}
              onClick={() => setCantidad(cantidadValida - 1)}
              className="px-3 py-2 hover:bg-slate-50 disabled:opacity-40"
            >
              −
            </button>
            <span className="w-10 text-center font-medium">
              {agotado ? 0 : cantidadValida}
            </span>
            <button
              type="button"
              aria-label="Aumentar cantidad"
              disabled={agotado || cantidadValida >= articulo.cantidad}
              onClick={() => setCantidad(cantidadValida + 1)}
              className="px-3 py-2 hover:bg-slate-50 disabled:opacity-40"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={handleAgregar}
            disabled={agotado}
            className="rounded-lg bg-emerald-600 px-5 py-2.5 font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Agregar al carrito
          </button>

          {enCarrito > 0 && (
            <Link
              to="/carrito"
              className="rounded-lg border border-emerald-600 px-5 py-2.5 font-medium text-emerald-700 hover:bg-emerald-50"
            >
              Ir al carrito
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

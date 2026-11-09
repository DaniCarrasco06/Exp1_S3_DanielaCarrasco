import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  useInventario,
  filtrarPorCategoria,
  formatoPrecio,
  TIPOS_PRODUCTO,
} from '../context/InventarioContext.jsx';

export default function ListaArticulos() {
  const { articulos, eliminarArticulo } = useInventario();
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('Todas');

  const porCategoria = filtrarPorCategoria(articulos, categoria);

  const texto = busqueda.trim().toLowerCase();
  const filtrados = porCategoria.filter(
    (a) =>
      a.nombre.toLowerCase().includes(texto) ||
      a.marca.toLowerCase().includes(texto)
  );

  const claseChip = (activa) =>
    `rounded-full border px-3 py-1 text-sm font-medium transition ${
      activa
        ? 'border-emerald-600 bg-emerald-600 text-white'
        : 'border-slate-300 bg-white text-slate-700 hover:bg-emerald-50'
    }`;

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-emerald-800">
          Inventario ({filtrados.length}
          {filtrados.length !== articulos.length && ` de ${articulos.length}`})
        </h1>
        <Link
          to="/agregar"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          + Agregar artículo
        </Link>
      </div>

      <input
        type="search"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar por nombre o marca…"
        className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
      />

      <div className="mb-4">
        <label htmlFor="categoria" className="text-sm font-medium">
          Filtrar por categoría
        </label>
        <select
          id="categoria"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500 sm:hidden"
        >
          <option value="Todas">Todas</option>
          {TIPOS_PRODUCTO.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <div className="mt-2 hidden flex-wrap gap-2 sm:flex">
          {['Todas', ...TIPOS_PRODUCTO].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setCategoria(t)}
              aria-pressed={categoria === t}
              className={claseChip(categoria === t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow">
        <table className="w-full text-left text-sm">
          <thead className="bg-emerald-700 text-white">
            <tr>
              <th className="px-4 py-3 font-semibold">#</th>
              <th className="px-4 py-3 font-semibold">Nombre</th>
              <th className="px-4 py-3 font-semibold">Marca</th>
              <th className="px-4 py-3 font-semibold">Categoría</th>
              <th className="px-4 py-3 text-right font-semibold">Precio</th>
              <th className="px-4 py-3 text-right font-semibold">Disponible</th>
              <th className="px-4 py-3 text-right font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtrados.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  No hay artículos que mostrar.
                </td>
              </tr>
            ) : (
              filtrados.map((articulo, i) => (
                <tr
                  key={articulo.id}
                  onClick={() => navigate(`/inventario/${articulo.id}`)}
                  className="cursor-pointer hover:bg-emerald-50"
                >
                  <td className="px-4 py-3 text-slate-500">{i + 1}</td>
                  <td className="px-4 py-3 font-medium">
                    <Link
                      to={`/inventario/${articulo.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-emerald-800 hover:underline"
                    >
                      {articulo.nombre}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{articulo.marca}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                      {articulo.tipo}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {formatoPrecio(articulo.precio)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {articulo.cantidad > 0 ? (
                      articulo.cantidad
                    ) : (
                      <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
                        Agotado
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        eliminarArticulo(articulo.id);
                      }}
                      className="rounded-md px-3 py-1 text-red-600 hover:bg-red-50"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

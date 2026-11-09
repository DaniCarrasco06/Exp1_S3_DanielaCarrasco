import { Link } from 'react-router-dom';
import { useInventario } from '../context/InventarioContext.jsx';

export default function Inicio() {
  const { articulos, totalUnidades } = useInventario();
  const tipos = new Set(articulos.map((a) => a.tipo)).size;

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-emerald-800">
          Gestión de inventario
        </h1>
        <p className="mt-2 text-slate-600">
          Administra los artículos disponibles en el supermercado.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">Artículos en inventario</p>
          <p className="text-4xl font-bold text-emerald-700">
            {articulos.length}
          </p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">Tipos de producto</p>
          <p className="text-4xl font-bold text-emerald-700">{tipos}</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">Unidades en el carrito</p>
          <p className="text-4xl font-bold text-emerald-700">{totalUnidades}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/agregar"
          className="rounded-lg bg-emerald-600 px-5 py-2.5 font-medium text-white hover:bg-emerald-700"
        >
          Agregar artículo
        </Link>
        <Link
          to="/inventario"
          className="rounded-lg border border-emerald-600 px-5 py-2.5 font-medium text-emerald-700 hover:bg-emerald-50"
        >
          Ver inventario
        </Link>
        <Link
          to="/carrito"
          className="rounded-lg border border-emerald-600 px-5 py-2.5 font-medium text-emerald-700 hover:bg-emerald-50"
        >
          Ver carrito
        </Link>
      </div>
    </section>
  );
}

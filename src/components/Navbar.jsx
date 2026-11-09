import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useInventario } from '../context/InventarioContext.jsx';

const enlaces = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/agregar', label: 'Agregar artículo' },
  { to: '/inventario', label: 'Inventario' },
  { to: '/carrito', label: 'Carrito', carrito: true },
];

const claseEnlace = ({ isActive }) =>
  `block rounded-md px-3 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-white text-emerald-700'
      : 'text-emerald-50 hover:bg-emerald-600'
  }`;

export default function Navbar() {
  const [abierto, setAbierto] = useState(false);
  const { totalUnidades } = useInventario();

  const etiqueta = ({ label, carrito }) =>
    carrito && totalUnidades > 0 ? (
      <>
        {label}
        <span className="ml-2 rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-emerald-900">
          {totalUnidades}
        </span>
      </>
    ) : (
      label
    );

  return (
    <header className="bg-emerald-700 shadow">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <span className="text-lg font-bold text-white">🛒 Supermercado</span>

        <button
          type="button"
          className="rounded-md px-3 py-2 text-white hover:bg-emerald-600 md:hidden"
          aria-label="Abrir menú"
          aria-expanded={abierto}
          onClick={() => setAbierto(!abierto)}
        >
          ☰
        </button>

        <ul className="hidden gap-2 md:flex">
          {enlaces.map((enlace) => (
            <li key={enlace.to}>
              <NavLink to={enlace.to} end={enlace.end} className={claseEnlace}>
                {etiqueta(enlace)}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {abierto && (
        <ul className="space-y-1 px-4 pb-3 md:hidden">
          {enlaces.map((enlace) => (
            <li key={enlace.to}>
              <NavLink
                to={enlace.to}
                end={enlace.end}
                className={claseEnlace}
                onClick={() => setAbierto(false)}
              >
                {etiqueta(enlace)}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}

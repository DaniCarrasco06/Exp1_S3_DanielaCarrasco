import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useInventario,
  TIPOS_PRODUCTO,
} from '../context/InventarioContext.jsx';

const formularioVacio = { nombre: '', marca: '', tipo: '', precio: '', cantidad: '' };

export default function AgregarArticulo() {
  const { articulos, agregarArticulo } = useInventario();
  const navigate = useNavigate();
  const [form, setForm] = useState(formularioVacio);
  const [errores, setErrores] = useState({});
  const [exito, setExito] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: '' }));
    setExito('');
  };

  const validar = () => {
    const nuevos = {};
    if (!form.nombre.trim()) nuevos.nombre = 'El nombre es obligatorio.';
    if (!form.marca.trim()) nuevos.marca = 'La marca es obligatoria.';
    if (!form.tipo) nuevos.tipo = 'Selecciona un tipo de producto.';
    if (form.precio === '' || Number(form.precio) <= 0)
      nuevos.precio = 'Ingresa un precio mayor a 0.';
    if (
      form.cantidad === '' ||
      !Number.isInteger(Number(form.cantidad)) ||
      Number(form.cantidad) < 0
    )
      nuevos.cantidad = 'Ingresa una cantidad entera (0 o más).';

    const duplicado = articulos.some(
      (a) =>
        a.nombre.toLowerCase() === form.nombre.trim().toLowerCase() &&
        a.marca.toLowerCase() === form.marca.trim().toLowerCase()
    );
    if (!nuevos.nombre && !nuevos.marca && duplicado) {
      nuevos.nombre = 'Ya existe un artículo con ese nombre y marca.';
    }
    return nuevos;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevos = validar();
    if (Object.keys(nuevos).length > 0) {
      setErrores(nuevos);
      return;
    }
    agregarArticulo(form);
    setForm(formularioVacio);
    setExito(`"${form.nombre.trim()}" se agregó al inventario.`);
  };

  const claseInput = (campo) =>
    `mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500 ${
      errores[campo] ? 'border-red-500' : 'border-slate-300'
    }`;

  return (
    <section className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-bold text-emerald-800">
        Agregar artículo
      </h1>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-5 rounded-xl bg-white p-6 shadow"
      >
        {exito && (
          <div
            role="status"
            className="rounded-lg bg-emerald-100 px-4 py-3 text-sm text-emerald-800"
          >
            {exito}
          </div>
        )}

        <div>
          <label htmlFor="nombre" className="text-sm font-medium">
            Nombre
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Ej: Fideos spaghetti 400g"
            className={claseInput('nombre')}
          />
          {errores.nombre && (
            <p className="mt-1 text-sm text-red-600">{errores.nombre}</p>
          )}
        </div>

        <div>
          <label htmlFor="marca" className="text-sm font-medium">
            Marca
          </label>
          <input
            id="marca"
            name="marca"
            type="text"
            value={form.marca}
            onChange={handleChange}
            placeholder="Ej: Carozzi"
            className={claseInput('marca')}
          />
          {errores.marca && (
            <p className="mt-1 text-sm text-red-600">{errores.marca}</p>
          )}
        </div>

        <div>
          <label htmlFor="tipo" className="text-sm font-medium">
            Tipo de producto
          </label>
          <select
            id="tipo"
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            className={claseInput('tipo')}
          >
            <option value="">Selecciona un tipo…</option>
            {TIPOS_PRODUCTO.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
          {errores.tipo && (
            <p className="mt-1 text-sm text-red-600">{errores.tipo}</p>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="precio" className="text-sm font-medium">
              Precio (CLP)
            </label>
            <input
              id="precio"
              name="precio"
              type="number"
              min="1"
              value={form.precio}
              onChange={handleChange}
              placeholder="Ej: 1990"
              className={claseInput('precio')}
            />
            {errores.precio && (
              <p className="mt-1 text-sm text-red-600">{errores.precio}</p>
            )}
          </div>
          <div>
            <label htmlFor="cantidad" className="text-sm font-medium">
              Cantidad disponible
            </label>
            <input
              id="cantidad"
              name="cantidad"
              type="number"
              min="0"
              step="1"
              value={form.cantidad}
              onChange={handleChange}
              placeholder="Ej: 20"
              className={claseInput('cantidad')}
            />
            {errores.cantidad && (
              <p className="mt-1 text-sm text-red-600">{errores.cantidad}</p>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-lg bg-emerald-600 px-5 py-2.5 font-medium text-white hover:bg-emerald-700"
          >
            Agregar
          </button>
          <button
            type="button"
            onClick={() => navigate('/inventario')}
            className="rounded-lg border border-slate-300 px-5 py-2.5 font-medium hover:bg-slate-50"
          >
            Ver inventario
          </button>
        </div>
      </form>
    </section>
  );
}

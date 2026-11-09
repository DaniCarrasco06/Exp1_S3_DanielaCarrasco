import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Inicio from './pages/Inicio.jsx';
import AgregarArticulo from './pages/AgregarArticulo.jsx';
import ListaArticulos from './pages/ListaArticulos.jsx';
import DetalleArticulo from './pages/DetalleArticulo.jsx';
import Carrito from './pages/Carrito.jsx';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/agregar" element={<AgregarArticulo />} />
          <Route path="/inventario" element={<ListaArticulos />} />
          <Route path="/inventario/:id" element={<DetalleArticulo />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route
            path="*"
            element={<p className="text-center text-lg">Página no encontrada.</p>}
          />
        </Routes>
      </main>
    </div>
  );
}

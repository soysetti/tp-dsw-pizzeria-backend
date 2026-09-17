import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import IngredientesList from './views/ingrediente/IngredientesList';
import RepartidorList from './views/repartidor/repartidorList';
import PizzaList from './views/pizza/pizzaList';
import PizzaDetalle from './views/pizza/pizzaDetalle';
import CrearPedidoForm from './views/pedido/crearPedidoForm';
import PedidoList from './views/pedido/pedidoList';
import PedidoDetalle from './views/pedido/pedidoDetalle';
import ClienteList from './views/cliente/clienteList';
import logo from './assets/logo.png';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <NavLink to="/" className="navbar-logo">
          <img src={logo} alt="Pizzería Due Paffutelli" className="navbar-logo-img" />
          Due Paffutelli
        </NavLink>
        <div className="navbar-links">
          <NavLink to="/ingredientes" className={({ isActive }) => (isActive ? 'active' : '')}>
            Ingredientes
          </NavLink>
          <NavLink to="/repartidores" className={({ isActive }) => (isActive ? 'active' : '')}>
            Repartidores
          </NavLink>
          <NavLink to="/pizzas" className={({ isActive }) => (isActive ? 'active' : '')}>
            Pizzas
          </NavLink>
          <NavLink to="/clientes" className={({ isActive }) => (isActive ? 'active' : '')}>
            Clientes
          </NavLink>
          <NavLink to="/pedidos/nuevo" className={({ isActive }) => (isActive ? 'active' : '')}>
            Nuevo Pedido
          </NavLink>
          <NavLink to="/pedidos" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Pedidos
          </NavLink>
        </div>
      </nav>

      <main className="app-container">
        <section>
          <Routes>
            <Route path="/" element={<IngredientesList />} />
            <Route path="/ingredientes" element={<IngredientesList />} />
            <Route path="/repartidores" element={<RepartidorList />} />
            <Route path="/pizzas" element={<PizzaList />} />
            <Route path="/pizzas/:id" element={<PizzaDetalle />} />
            <Route path="/pedidos/nuevo" element={<CrearPedidoForm />} />
            <Route path="/pedidos" element={<PedidoList />} />
            <Route path="/pedidos/:id" element={<PedidoDetalle />} />
            <Route path="/clientes" element={<ClienteList />} />
          </Routes>
        </section>
      </main>
    </BrowserRouter>
  );
}

export default App;
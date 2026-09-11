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
      <main className="app-container">
        <header className="app-header">
          <img src={logo} alt="Pizzería Due Paffutelli" className="app-logo" />
        </header>

        <nav className="app-nav">
          <NavLink
            to="/ingredientes"
            className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}
          >
            Ingredientes
          </NavLink>
          <NavLink
            to="/repartidores"
            className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}
          >
            Repartidores
          </NavLink>
          <NavLink
            to="/pizzas"
            className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}
          >
            Pizzas
          </NavLink>
          <NavLink
            to="/clientes"
            className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}
          >
            Clientes
          </NavLink>
          <NavLink
            to="/pedidos/nuevo"
            className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}
          >
            Nuevo Pedido
          </NavLink>
          <NavLink
            to="/pedidos"
            end
            className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}
          >
            Pedidos
          </NavLink>
        </nav>

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
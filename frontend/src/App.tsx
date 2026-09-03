import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import IngredientesList from './views/IngredientesList';
import RepartidorList from './views/repartidorList';
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
        </nav>

        <section>
          <Routes>
            <Route path="/" element={<IngredientesList />} />
            <Route path="/ingredientes" element={<IngredientesList />} />
            <Route path="/repartidores" element={<RepartidorList />} />
          </Routes>
        </section>
      </main>
    </BrowserRouter>
  );
}

export default App;
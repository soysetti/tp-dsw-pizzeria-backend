import IngredientesList from './views/ingredienteList';

function App() {
  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ borderBottom: '2px solid #eee', marginBottom: '20px', paddingBottom: '10px' }}>
        <h1>🍕 Pizzería "Due paffutelli"</h1>
      </header>

      <section>
        <IngredientesList />
      </section>
    </main>
  );
}

export default App;

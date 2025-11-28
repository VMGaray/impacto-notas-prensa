import { useState } from 'react';
import { Navigation } from './components/NavBar';
import { Footer } from './components/Footer';
import { Inicio } from './components/Inicio';
import { Precios } from './components/Precios';
import { Nosotros } from './components/Nosotros';

function App() {
  const [currentPage, setCurrentPage] = useState('inicio');

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
        onOpenAuth={() => {}} // si no usás auth desde App, podés dejarlo vacío
        remainingQueries={0}  // si lo manejás desde Inicio, podés dejarlo fijo
      />

      <div className="flex-grow">
        {currentPage === 'inicio' && <Inicio />}
        {currentPage === 'precios' && <Precios />}
        {currentPage === 'nosotros' && <Nosotros />}
      </div>

      <Footer />
    </div>
  );
}

export default App;

import { useState, useEffect } from 'react';
import { Navigation } from './components/NavBar';
import { Footer } from './components/Footer';
import { Inicio } from './components/Inicio';
import { Precios } from './components/Precios';
import { Nosotros } from './components/Nosotros';
import { AuthModal } from './components/AuthModal';
import { useAuth } from './contexts/AuthContext';
import { checkAnonymousQueryLimit, checkAuthenticatedQueryLimit } from './lib/fingerprintService';

function App() {
  const [currentPage, setCurrentPage] = useState('inicio');
  const [modalAuth, setModalAuth] = useState(false);
  const [remainingQueries, setRemainingQueries] = useState(3);
  const { user } = useAuth();

  // Actualizar consultas restantes cuando cambie el usuario
  useEffect(() => {
    const updateRemainingQueries = async () => {
      try {
        if (user) {
          const limit = await checkAuthenticatedQueryLimit(user.id);
          setRemainingQueries(limit.remainingQueries);
        } else {
          const limit = await checkAnonymousQueryLimit();
          setRemainingQueries(limit.remainingQueries);
        }
      } catch (error) {
        console.error('Error al verificar límite de consultas:', error);
      }
    };

    updateRemainingQueries();
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
        onOpenAuth={() => setModalAuth(true)}
        remainingQueries={remainingQueries}
      />

      <div className="flex-grow">
        {currentPage === 'inicio' && <Inicio onOpenAuth={() => setModalAuth(true)} onUpdateQueries={setRemainingQueries} />}
        {currentPage === 'precios' && <Precios onOpenAuth={() => setModalAuth(true)} />}
        {currentPage === 'nosotros' && <Nosotros />}
      </div>

      <Footer />

      {/* Modal de autenticación global */}
      <AuthModal
        isOpen={modalAuth}
        onClose={() => setModalAuth(false)}
        onAuthSuccess={() => setModalAuth(false)}
      />
    </div>
  );
}

export default App;

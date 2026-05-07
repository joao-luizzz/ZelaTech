import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/sindico/Dashboard";
import Mural from "./pages/sindico/Mural";
import ChamadoDetalhe from "./pages/sindico/ChamadoDetalhe";

/**
 * Componente Principal App
 * Aqui configuramos o Roteamento (React Router) para navegar entre as telas do Síndico.
 */
function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#0f172a]">
        
        {/* Barra de Navegação Simples (Navbar) */}
        <nav className="bg-[#1e293b] border-b border-slate-700 p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/sindico/dashboard" className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-purple-500">Zela</span>Tech
            </Link>
            
            <div className="flex gap-6">
              <Link 
                to="/sindico/dashboard" 
                className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
              >
                📊 Dashboard
              </Link>
              <Link 
                to="/sindico/mural" 
                className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
              >
                📢 Mural de Avisos
              </Link>
            </div>
          </div>
        </nav>

        {/* Área de Conteúdo (Onde as páginas serão renderizadas) */}
        <main className="flex-1">
          <Routes>
            {/* Rota inicial redireciona para o Dashboard */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/sindico/dashboard" element={<Dashboard />} />
            <Route path="/sindico/mural" element={<Mural />} />
            <Route path="/sindico/chamados/:id" element={<ChamadoDetalhe />} />
          </Routes>
        </main>

        {/* Rodapé Simples */}
        <footer className="bg-[#1e293b] border-t border-slate-800 p-4 text-center">
          <p className="text-slate-500 text-xs">
            © 2026 ZelaTech - Projeto Acadêmico FATEC Praia Grande
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;

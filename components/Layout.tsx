
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { label: 'Início', path: '/' },
    { label: 'Agendar', path: '/agendar' },
    { label: 'Meus Agendamentos', path: '/meus-agendamentos' },
    { label: 'Privacidade', path: '/privacidade' },
    { label: 'Admin', path: '/admin' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl">
              <span className="bg-white text-blue-600 px-2 py-1 rounded">UPA</span>
              <span>Saúde Digital</span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`hover:text-blue-200 transition-colors ${
                    location.pathname === item.path ? 'border-b-2 border-white' : ''
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <button className="md:hidden p-2 rounded-md hover:bg-blue-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-slate-800 text-slate-300 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-bold mb-4">UPA Saúde Digital</h3>
              <p className="text-sm">
                Facilitando o acesso à saúde pública através da tecnologia.
                Agendamentos rápidos e eficientes.
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Links Úteis</h3>
              <ul className="text-sm space-y-2">
                <li><Link to="/privacidade" className="hover:text-white">Política de Privacidade</Link></li>
                <li><Link to="/agendar" className="hover:text-white">Novo Agendamento</Link></li>
                <li><a href="https://saude.gov.br" target="_blank" className="hover:text-white">Ministério da Saúde</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Suporte</h3>
              <p className="text-sm">Em caso de emergência grave, ligue 192 (SAMU).</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-700 text-center text-xs">
            &copy; {new Date().getFullYear()} UPA Agendamentos. Sistema fictício para demonstração LGPD.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

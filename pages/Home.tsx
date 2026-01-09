
import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Seu atendimento na UPA, agendado em minutos.
          </h1>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Evite filas presenciais. Escolha a unidade mais próxima, selecione o horário e receba seu comprovante digital na hora.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/agendar" 
              className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg"
            >
              Agendar Agora
            </Link>
            <Link 
              to="/meus-agendamentos" 
              className="bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-800 transition-colors border border-blue-500"
            >
              Minhas Consultas
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-800">Por que usar o agendamento digital?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-4">Menos Tempo de Espera</h3>
            <p className="text-slate-600">Chegue próximo ao horário agendado e reduza sua exposição a ambientes hospitalares.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-4">Conformidade LGPD</h3>
            <p className="text-slate-600">Seus dados são coletados com transparência e protegidos conforme a legislação vigente.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-4">Acesso Localizado</h3>
            <p className="text-slate-600">Encontre as UPAs mais próximas de sua residência em qualquer estado participante.</p>
          </div>
        </div>
      </section>

      {/* Info Banner */}
      <section className="bg-slate-100 py-12 px-4">
        <div className="max-w-4xl mx-auto flex items-center gap-6 bg-white p-6 rounded-xl shadow-sm">
          <div className="text-red-500 shrink-0">
             <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
          </div>
          <div>
            <h4 className="font-bold text-slate-800">Atenção!</h4>
            <p className="text-slate-600 text-sm">Este sistema é para consultas eletivas de baixa complexidade. Em casos de dor no peito, falta de ar grave ou traumas graves, ligue para o 192 imediatamente.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

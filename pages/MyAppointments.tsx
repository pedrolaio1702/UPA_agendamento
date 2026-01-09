
import React, { useState, useEffect } from 'react';
import { Appointment } from '../types';

const MyAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchCpf, setSearchCpf] = useState('');
  const [filtered, setFiltered] = useState<Appointment[]>([]);
  const [searched, setSearched] = useState(false);
  const [ratingTarget, setRatingTarget] = useState<string | null>(null);
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = () => {
    const data = JSON.parse(localStorage.getItem('upa_appointments') || '[]');
    setAppointments(data);
    if (searchCpf) {
      const result = data.filter((a: Appointment) => a.cpf.replace(/\D/g, '') === searchCpf.replace(/\D/g, ''));
      setFiltered(result);
    }
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    // Limit to 11 digits
    if (value.length > 11) value = value.slice(0, 11);

    // Apply Mask: 000.000.000-00
    if (value.length > 9) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
      value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (value.length > 3) {
      value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }
    
    setSearchCpf(value);
  };

  const handleSearch = () => {
    const result = appointments.filter(a => a.cpf.replace(/\D/g, '') === searchCpf.replace(/\D/g, ''));
    setFiltered(result);
    setSearched(true);
  };

  const cancelAppointment = (id: string) => {
    if (window.confirm("Deseja realmente cancelar este agendamento?")) {
      const updated = appointments.map(a => a.id === id ? { ...a, status: 'canceled' as const } : a);
      saveAndRefresh(updated);
    }
  };

  const completeAppointment = (id: string) => {
    const updated = appointments.map(a => a.id === id ? { ...a, status: 'completed' as const } : a);
    saveAndRefresh(updated);
  };

  const submitRating = () => {
    if (stars === 0) {
      alert("Por favor, selecione uma nota de 1 a 5 estrelas.");
      return;
    }
    const updated = appointments.map(a => a.id === ratingTarget ? { ...a, rating: stars, comment } : a);
    saveAndRefresh(updated);
    setRatingTarget(null);
    setStars(0);
    setComment('');
    alert("Obrigado pela sua avaliação!");
  };

  const saveAndRefresh = (updated: Appointment[]) => {
    setAppointments(updated);
    localStorage.setItem('upa_appointments', JSON.stringify(updated));
    const result = updated.filter(a => a.cpf.replace(/\D/g, '') === searchCpf.replace(/\D/g, ''));
    setFiltered(result);
  };

  const requestDataExclusion = () => {
    if (window.confirm("Você tem certeza que deseja solicitar o Direito ao Esquecimento? Todos os seus dados de agendamento serão removidos do sistema permanentemente.")) {
      const remaining = appointments.filter(a => a.cpf.replace(/\D/g, '') !== searchCpf.replace(/\D/g, ''));
      setAppointments(remaining);
      localStorage.setItem('upa_appointments', JSON.stringify(remaining));
      setFiltered([]);
      setSearched(false);
      setSearchCpf('');
      alert("Seus dados foram excluídos conforme solicitado.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-slate-800">Meus Agendamentos</h1>
        <p className="text-slate-600 mt-2">Consulte, cancele ou avalie seu atendimento.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <input 
            type="text" 
            placeholder="Informe seu CPF para consultar (000.000.000-00)"
            className="flex-grow p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={searchCpf}
            onChange={handleCpfChange}
            maxLength={14}
          />
          <button 
            onClick={handleSearch}
            className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            Buscar
          </button>
        </div>
      </div>

      {searched && (
        <div className="space-y-6">
          {filtered.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filtered.map(app => (
                  <div key={app.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
                    <div className={`absolute top-0 right-0 px-4 py-1 text-xs font-bold rounded-bl-lg ${
                      app.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 
                      app.status === 'canceled' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {app.status === 'scheduled' ? 'AGENDADO' : 
                       app.status === 'canceled' ? 'CANCELADO' : 'REALIZADO'}
                    </div>
                    
                    <h3 className="font-bold text-xl mb-1">{app.upaName}</h3>
                    <p className="text-sm text-slate-500 mb-4">{app.specialty}</p>
                    
                    <div className="flex items-center gap-4 text-sm font-medium text-slate-700 mb-6">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {app.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {app.time}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {app.status === 'scheduled' && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => cancelAppointment(app.id)}
                            className="flex-1 py-3 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors"
                          >
                            Cancelar
                          </button>
                          <button 
                            onClick={() => completeAppointment(app.id)}
                            className="flex-1 py-3 bg-green-50 text-green-600 rounded-lg text-sm font-bold hover:bg-green-100 transition-colors"
                            title="Simular que a consulta já aconteceu"
                          >
                            Concluir
                          </button>
                        </div>
                      )}

                      {app.status === 'completed' && !app.rating && (
                        <button 
                          onClick={() => setRatingTarget(app.id)}
                          className="w-full py-3 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                          Avaliar Consulta
                        </button>
                      )}

                      {app.rating && (
                        <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="flex text-yellow-400 mb-1">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`w-4 h-4 ${i < (app.rating || 0) ? 'fill-current' : 'text-slate-300'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            ))}
                          </div>
                          <p className="text-sm text-slate-600 italic">"{app.comment || 'Sem comentários'}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Rating Modal */}
              {ratingTarget && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                    <h3 className="text-2xl font-bold mb-2">Avalie sua Consulta</h3>
                    <p className="text-slate-500 mb-6 text-sm">Sua opinião é fundamental para melhorarmos o atendimento das UPAs.</p>
                    
                    <div className="flex justify-center gap-2 mb-8">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button 
                          key={num} 
                          onClick={() => setStars(num)}
                          className={`w-12 h-12 rounded-full transition-all flex items-center justify-center ${stars >= num ? 'text-yellow-400' : 'text-slate-300 hover:text-yellow-200'}`}
                        >
                          <svg className="w-10 h-10 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        </button>
                      ))}
                    </div>

                    <div className="mb-8">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Seu comentário (opcional)</label>
                      <textarea 
                        className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                        rows={3}
                        placeholder="Como foi seu atendimento?"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                    </div>

                    <div className="flex gap-3">
                      <button 
                        onClick={() => setRatingTarget(null)}
                        className="flex-1 py-4 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                      >
                        Pular
                      </button>
                      <button 
                        onClick={submitRating}
                        className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg"
                      >
                        Enviar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-8 border-t border-slate-200">
                 <div className="bg-slate-50 p-6 rounded-2xl flex items-center justify-between gap-4">
                   <div>
                     <h4 className="font-bold text-slate-800">Direito ao Esquecimento</h4>
                     <p className="text-sm text-slate-500">A LGPD garante que você possa solicitar a remoção total de seus dados pessoais deste sistema.</p>
                   </div>
                   <button 
                    onClick={requestDataExclusion}
                    className="bg-white border border-red-200 text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-red-50 transition-colors whitespace-nowrap"
                   >
                     Excluir meus dados
                   </button>
                 </div>
              </div>
            </>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-slate-500">Nenhum agendamento encontrado para este CPF.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;

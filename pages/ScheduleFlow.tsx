
import React, { useState, useEffect } from 'react';
import { Step, UPA, Location, Appointment } from '../types';
import { LOCATIONS, UPAS, SPECIALTIES, TIMES } from '../constants';
import { geminiService } from '../services/geminiService';

const ScheduleFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.CONSENT);
  const [consent, setConsent] = useState(false);
  
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedUpa, setSelectedUpa] = useState<UPA | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  
  const [patientName, setPatientName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notificationChannel, setNotificationChannel] = useState<'sms' | 'whatsapp' | 'both'>('whatsapp');
  const [symptoms, setSymptoms] = useState('');
  const [triageAdvice, setTriageAdvice] = useState('');
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const [appointmentResult, setAppointmentResult] = useState<Appointment | null>(null);

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      setCpf(value);
    }
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  const requestTriageHelp = async () => {
    if (!symptoms.trim()) return;
    setLoadingAdvice(true);
    const advice = await geminiService.assistTriage(symptoms);
    setTriageAdvice(advice);
    setLoadingAdvice(false);
  };

  const finishScheduling = () => {
    const newAppointment: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      patientName,
      cpf,
      email,
      phone,
      upaId: selectedUpa?.id || '',
      upaName: selectedUpa?.name || '',
      specialty: selectedSpecialty,
      date: selectedDate,
      time: selectedTime,
      status: 'scheduled',
      notificationChannel
    };

    const existing = JSON.parse(localStorage.getItem('upa_appointments') || '[]');
    localStorage.setItem('upa_appointments', JSON.stringify([...existing, newAppointment]));
    
    setAppointmentResult(newAppointment);
    nextStep();
  };

  const renderStep = () => {
    switch (currentStep) {
      case Step.CONSENT:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Termo de Consentimento</h2>
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 h-64 overflow-y-auto text-sm text-slate-700 space-y-4">
              <p>Ao utilizar este sistema, você concorda com a coleta e processamento dos seus dados pessoais (Nome, CPF, E-mail, Telefone e Dados de Saúde) para fins exclusivos de agendamento de consultas nas Unidades de Pronto Atendimento (UPA).</p>
              <p>Garantimos a segurança dos dados conforme a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018). Seus dados não serão compartilhados com terceiros para fins comerciais.</p>
              <p><strong>Notificações:</strong> Você autoriza o envio de mensagens de confirmação e lembretes (24h antes) via SMS e/ou WhatsApp para o número informado.</p>
              <p>Você tem o direito de solicitar a exclusão definitiva dos seus dados a qualquer momento através da opção "Direito ao Esquecimento" em nosso portal.</p>
            </div>
            <label className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
              <input 
                type="checkbox" 
                checked={consent} 
                onChange={(e) => setConsent(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded"
              />
              <span className="text-slate-700">Li e aceito os termos de privacidade e proteção de dados.</span>
            </label>
            <button 
              disabled={!consent}
              onClick={nextStep}
              className={`w-full py-4 rounded-xl font-bold transition-all ${consent ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
            >
              Continuar
            </button>
          </div>
        );

      case Step.LOCATION:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Selecione sua Localização</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
                <select 
                  className="w-full p-3 border border-slate-300 rounded-lg"
                  value={selectedState}
                  onChange={(e) => { setSelectedState(e.target.value); setSelectedCity(''); }}
                >
                  <option value="">Selecione um Estado</option>
                  {LOCATIONS.map(l => <option key={l.state} value={l.state}>{l.state}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cidade</label>
                <select 
                  className="w-full p-3 border border-slate-300 rounded-lg"
                  value={selectedCity}
                  disabled={!selectedState}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  <option value="">Selecione uma Cidade</option>
                  {LOCATIONS.find(l => l.state === selectedState)?.cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={prevStep} className="flex-1 py-4 border border-slate-300 rounded-xl font-bold">Voltar</button>
              <button 
                disabled={!selectedCity}
                onClick={nextStep}
                className={`flex-1 py-4 rounded-xl font-bold ${selectedCity ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
              >
                Buscar Unidades
              </button>
            </div>
          </div>
        );

      case Step.UPA_SELECTION:
        const filteredUpas = UPAS.filter(u => u.city === selectedCity);
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Escolha a Unidade</h2>
            <div className="space-y-4">
              {filteredUpas.map(upa => (
                <div 
                  key={upa.id}
                  onClick={() => setSelectedUpa(upa)}
                  className={`p-4 border rounded-xl cursor-pointer transition-all ${selectedUpa?.id === upa.id ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg">{upa.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                      upa.waitingTime === 'Baixo' ? 'bg-green-100 text-green-700' :
                      upa.waitingTime === 'Médio' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                      Espera: {upa.waitingTime}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{upa.address}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {upa.specialties.map(s => <span key={s} className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded uppercase">{s}</span>)}
                  </div>
                </div>
              ))}
              {filteredUpas.length === 0 && <p className="text-center text-slate-500 py-10">Nenhuma UPA encontrada nesta região.</p>}
            </div>
            <div className="flex gap-4">
              <button onClick={prevStep} className="flex-1 py-4 border border-slate-300 rounded-xl font-bold">Voltar</button>
              <button 
                disabled={!selectedUpa}
                onClick={nextStep}
                className={`flex-1 py-4 rounded-xl font-bold ${selectedUpa ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
              >
                Avançar
              </button>
            </div>
          </div>
        );

      case Step.SPECIALTY_TIME:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Especialidade e Horário</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Especialidade</label>
                <select 
                  className="w-full p-3 border border-slate-300 rounded-lg"
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                >
                  <option value="">Selecione...</option>
                  {selectedUpa?.specialties.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Data</label>
                <input 
                  type="date" 
                  className="w-full p-3 border border-slate-300 rounded-lg"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Horários Disponíveis</label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {TIMES.map(t => (
                  <button
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={`p-2 text-sm border rounded-lg transition-all ${selectedTime === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={prevStep} className="flex-1 py-4 border border-slate-300 rounded-xl font-bold">Voltar</button>
              <button 
                disabled={!selectedTime || !selectedSpecialty || !selectedDate}
                onClick={nextStep}
                className={`flex-1 py-4 rounded-xl font-bold ${selectedTime && selectedSpecialty && selectedDate ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
              >
                Próximo Passo
              </button>
            </div>
          </div>
        );

      case Step.PATIENT_INFO:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Dados do Paciente</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                 <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   Ajuda na Triagem (IA)
                 </h4>
                 <p className="text-xs text-blue-700 mb-3">Descreva brevemente o que está sentindo para receber uma orientação prévia.</p>
                 <textarea 
                  className="w-full p-3 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  rows={3}
                  placeholder="Ex: Dor de cabeça forte há 2 dias, febre e coriza..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                 />
                 <button 
                  onClick={requestTriageHelp}
                  className="mt-2 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                  disabled={loadingAdvice || !symptoms.trim()}
                 >
                   {loadingAdvice ? 'Analisando...' : 'Pedir Orientação'}
                 </button>
                 {triageAdvice && (
                   <div className="mt-4 p-3 bg-white border border-blue-200 rounded-lg text-sm italic text-blue-800">
                     <strong>Orientação UPA:</strong> {triageAdvice}
                   </div>
                 )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-slate-300 rounded-lg"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Nome do Paciente"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">CPF</label>
                  <input 
                    type="text" 
                    className="w-full p-3 border border-slate-300 rounded-lg"
                    value={cpf}
                    onChange={handleCpfChange}
                    placeholder="000.000.000-00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Telefone / WhatsApp</label>
                  <input 
                    type="tel" 
                    className="w-full p-3 border border-slate-300 rounded-lg"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Canal de Notificação (Confirmação e Lembretes)</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setNotificationChannel('whatsapp')}
                    className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-xl transition-all ${notificationChannel === 'whatsapp' ? 'bg-green-50 border-green-500 text-green-700 ring-2 ring-green-100' : 'bg-white border-slate-200 text-slate-600'}`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                    WhatsApp
                  </button>
                  <button 
                    onClick={() => setNotificationChannel('sms')}
                    className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-xl transition-all ${notificationChannel === 'sms' ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-100' : 'bg-white border-slate-200 text-slate-600'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                    SMS
                  </button>
                  <button 
                    onClick={() => setNotificationChannel('both')}
                    className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-xl transition-all ${notificationChannel === 'both' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-2 ring-indigo-100' : 'bg-white border-slate-200 text-slate-600'}`}
                  >
                    Ambos
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
                <input 
                  type="email" 
                  className="w-full p-3 border border-slate-300 rounded-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={prevStep} className="flex-1 py-4 border border-slate-300 rounded-xl font-bold">Voltar</button>
              <button 
                disabled={!patientName || cpf.length < 14 || !phone}
                onClick={finishScheduling}
                className={`flex-1 py-4 rounded-xl font-bold ${patientName && cpf.length === 14 && phone ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
              >
                Confirmar Agendamento
              </button>
            </div>
          </div>
        );

      case Step.CONFIRMATION:
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800">Agendamento Confirmado!</h2>
            <div className="bg-green-50 text-green-800 p-4 rounded-xl text-sm border border-green-100 flex items-center gap-3">
              <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>Uma confirmação foi enviada para seu <strong>{notificationChannel === 'both' ? 'WhatsApp e SMS' : notificationChannel === 'whatsapp' ? 'WhatsApp' : 'SMS'}</strong>. Um lembrete será enviado 24h antes da consulta.</span>
            </div>
            
            <div className="bg-white border-2 border-dashed border-slate-200 p-6 rounded-2xl text-left max-w-sm mx-auto shadow-sm">
              <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-400">PROTOCOLO</span>
                <span className="text-sm font-mono font-bold text-blue-600">#{appointmentResult?.id.toUpperCase()}</span>
              </div>
              <div className="space-y-3">
                <div><p className="text-[10px] text-slate-400 uppercase">Paciente</p><p className="font-bold text-slate-700">{appointmentResult?.patientName}</p></div>
                <div><p className="text-[10px] text-slate-400 uppercase">Unidade</p><p className="font-bold text-slate-700">{appointmentResult?.upaName}</p></div>
                <div className="grid grid-cols-2 gap-2">
                   <div><p className="text-[10px] text-slate-400 uppercase">Data</p><p className="font-bold text-slate-700">{appointmentResult?.date}</p></div>
                   <div><p className="text-[10px] text-slate-400 uppercase">Hora</p><p className="font-bold text-slate-700">{appointmentResult?.time}</p></div>
                </div>
                <div><p className="text-[10px] text-slate-400 uppercase">Especialidade</p><p className="font-bold text-slate-700">{appointmentResult?.specialty}</p></div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => window.print()}
                className="w-full py-4 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-colors"
              >
                Imprimir Comprovante
              </button>
              <button 
                onClick={() => window.location.hash = '/'}
                className="w-full py-4 border border-slate-300 rounded-xl font-bold hover:bg-slate-50 transition-colors"
              >
                Voltar ao Início
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Progress Stepper */}
      {currentStep < Step.CONFIRMATION && (
        <div className="flex justify-between items-center mb-10">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center flex-1 relative">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10 ${
                currentStep === i ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 
                currentStep > i ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                {currentStep > i ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> : i + 1}
              </div>
              {i < 4 && <div className={`absolute left-1/2 w-full h-1 top-4 -translate-y-1/2 z-0 ${currentStep > i ? 'bg-green-500' : 'bg-slate-200'}`}></div>}
            </div>
          ))}
        </div>
      )}

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        {renderStep()}
      </div>
    </div>
  );
};

export default ScheduleFlow;

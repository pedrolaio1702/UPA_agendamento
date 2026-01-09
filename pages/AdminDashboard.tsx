
import React, { useState, useEffect } from 'react';
import { Appointment, UPA, AdminRole, AdminUser, Doctor } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { UPAS as INITIAL_UPAS, LOCATIONS, SPECIALTIES } from '../constants';

const AdminDashboard: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [upas, setUpas] = useState<UPA[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  
  // Filters
  const [doctorSpecialtyFilter, setDoctorSpecialtyFilter] = useState('');
  
  // Mock current logged in user (simulated)
  const [currentUser, setCurrentUser] = useState<AdminUser>({ role: 'GLOBAL' });
  const [activeTab, setActiveTab] = useState<'dashboard' | 'management' | 'doctors'>('dashboard');

  // UPA Management Modal State
  const [isUpaModalOpen, setIsUpaModalOpen] = useState(false);
  const [editingUpaId, setEditingUpaId] = useState<string | null>(null);
  const [upaFormData, setUpaFormData] = useState<Partial<UPA>>({
    name: '', city: '', state: '', address: '', specialties: ['Clínico Geral'], waitingTime: 'Médio'
  });

  // Doctor Registration Form State
  const [isAddingDoctor, setIsAddingDoctor] = useState(false);
  const [newDoctor, setNewDoctor] = useState<Partial<Doctor>>({
    name: '', crm: '', specialty: '', upaId: '', active: true
  });

  useEffect(() => {
    const storedAppointments = JSON.parse(localStorage.getItem('upa_appointments') || '[]');
    setAppointments(storedAppointments);

    const storedUpas = JSON.parse(localStorage.getItem('upa_list') || JSON.stringify(INITIAL_UPAS));
    setUpas(storedUpas);
    if (!localStorage.getItem('upa_list')) {
      localStorage.setItem('upa_list', JSON.stringify(INITIAL_UPAS));
    }

    const storedDoctors = JSON.parse(localStorage.getItem('doctor_list') || '[]');
    setDoctors(storedDoctors);
  }, []);

  const openUpaModal = (upa?: UPA) => {
    if (upa) {
      setEditingUpaId(upa.id);
      setUpaFormData({ ...upa });
    } else {
      setEditingUpaId(null);
      setUpaFormData({ name: '', city: '', state: '', address: '', specialties: ['Clínico Geral'], waitingTime: 'Médio' });
    }
    setIsUpaModalOpen(true);
  };

  const handleSaveUpa = () => {
    if (!upaFormData.name || !upaFormData.city || !upaFormData.state) return;

    let updatedUpas: UPA[];
    if (editingUpaId) {
      updatedUpas = upas.map(u => u.id === editingUpaId ? { ...u, ...upaFormData as UPA } : u);
    } else {
      const upaToAdd: UPA = {
        ...upaFormData as UPA,
        id: Math.random().toString(36).substr(2, 9)
      };
      updatedUpas = [...upas, upaToAdd];
    }

    setUpas(updatedUpas);
    localStorage.setItem('upa_list', JSON.stringify(updatedUpas));
    setIsUpaModalOpen(false);
  };

  const handleToggleSpecialty = (specialty: string) => {
    const currentSpecs = upaFormData.specialties || [];
    if (currentSpecs.includes(specialty)) {
      setUpaFormData({ ...upaFormData, specialties: currentSpecs.filter(s => s !== specialty) });
    } else {
      setUpaFormData({ ...upaFormData, specialties: [...currentSpecs, specialty] });
    }
  };

  const handleAddDoctor = () => {
    if (!newDoctor.name || !newDoctor.crm || !newDoctor.upaId || !newDoctor.specialty) return;
    const doctorToAdd: Doctor = {
      ...newDoctor as Doctor,
      id: Math.random().toString(36).substr(2, 9),
      active: true
    };
    const updatedDoctors = [...doctors, doctorToAdd];
    setDoctors(updatedDoctors);
    localStorage.setItem('doctor_list', JSON.stringify(updatedDoctors));
    setIsAddingDoctor(false);
    setNewDoctor({ name: '', crm: '', specialty: '', upaId: '', active: true });
  };

  const toggleDoctorStatus = (doctorId: string) => {
    const updatedDoctors = doctors.map(d => d.id === doctorId ? { ...d, active: !d.active } : d);
    setDoctors(updatedDoctors);
    localStorage.setItem('doctor_list', JSON.stringify(updatedDoctors));
  };

  // Filtering Logic based on Role and selected Filters
  const filteredAppointments = appointments.filter(a => {
    if (currentUser.role === 'GLOBAL') return true;
    const upa = upas.find(u => u.id === a.upaId);
    if (currentUser.role === 'STATE') return upa?.state === currentUser.state;
    if (currentUser.role === 'UPA') return a.upaId === currentUser.upaId;
    return false;
  });

  const filteredUpas = upas.filter(u => {
    if (currentUser.role === 'GLOBAL') return true;
    if (currentUser.role === 'STATE') return u.state === currentUser.state;
    if (currentUser.role === 'UPA') return u.id === currentUser.upaId;
    return false;
  });

  const filteredDoctors = doctors.filter(d => {
    // Role filtering
    let matchesRole = false;
    if (currentUser.role === 'GLOBAL') matchesRole = true;
    else {
      const upa = upas.find(u => u.id === d.upaId);
      if (currentUser.role === 'STATE') matchesRole = upa?.state === currentUser.state;
      else if (currentUser.role === 'UPA') matchesRole = d.upaId === currentUser.upaId;
    }

    // Specialty filtering
    const matchesSpecialty = !doctorSpecialtyFilter || d.specialty === doctorSpecialtyFilter;

    return matchesRole && matchesSpecialty;
  });

  // Chart Data Preparation
  const statusData = [
    { name: 'Agendados', value: filteredAppointments.filter(a => a.status === 'scheduled').length },
    { name: 'Cancelados', value: filteredAppointments.filter(a => a.status === 'canceled').length },
    { name: 'Realizados', value: filteredAppointments.filter(a => a.status === 'completed').length },
  ];

  const upaCounts = filteredAppointments.reduce((acc: any, curr) => {
    acc[curr.upaName] = (acc[curr.upaName] || 0) + 1;
    return acc;
  }, {});
  const barData = Object.keys(upaCounts).map(name => ({ name, total: upaCounts[name] }));

  const ratings = filteredAppointments.filter(a => a.rating !== undefined).map(a => a.rating as number);
  const avgRating = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : "0.0";
  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Role Switcher (Simulator) */}
      <div className="bg-slate-800 text-white p-4 rounded-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold">
            {currentUser.role[0]}
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase">Visão Atual</p>
            <p className="font-bold">
              {currentUser.role === 'GLOBAL' && 'Administrador Federal (SUS)'}
              {currentUser.role === 'STATE' && `Secretaria Estadual de Saúde (${currentUser.state})`}
              {currentUser.role === 'UPA' && `Gestor: ${upas.find(u => u.id === currentUser.upaId)?.name || 'Unidade'}`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentUser({ role: 'GLOBAL' })}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${currentUser.role === 'GLOBAL' ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'}`}
          >
            Global
          </button>
          <button 
            onClick={() => setCurrentUser({ role: 'STATE', state: 'SP' })}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${currentUser.role === 'STATE' && currentUser.state === 'SP' ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'}`}
          >
            Secr. SP
          </button>
          <button 
            onClick={() => setCurrentUser({ role: 'UPA', upaId: '1' })}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${currentUser.role === 'UPA' ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'}`}
          >
            UPA Central
          </button>
        </div>
      </div>

      <div className="flex border-b border-slate-200 mb-8 overflow-x-auto whitespace-nowrap">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`px-6 py-3 font-bold border-b-2 transition-all ${activeTab === 'dashboard' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Monitoramento (BI)
        </button>
        <button 
          onClick={() => setActiveTab('management')}
          className={`px-6 py-3 font-bold border-b-2 transition-all ${activeTab === 'management' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Gestão de Unidades
        </button>
        <button 
          onClick={() => setActiveTab('doctors')}
          className={`px-6 py-3 font-bold border-b-2 transition-all ${activeTab === 'doctors' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Médicos por UPA
        </button>
      </div>

      {activeTab === 'dashboard' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-xs text-slate-500 font-bold uppercase mb-1">Satisfação Média</p>
              <div className="flex items-center gap-2">
                <p className="text-4xl font-extrabold text-yellow-500">{avgRating}</p>
                <div className="text-yellow-400">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-xs text-slate-500 font-bold uppercase mb-1">Total de Agendamentos</p>
              <p className="text-4xl font-extrabold text-blue-600">{filteredAppointments.length}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-xs text-slate-500 font-bold uppercase mb-1">Consultas Realizadas</p>
              <p className="text-4xl font-extrabold text-green-600">
                {filteredAppointments.filter(a => a.status === 'completed').length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-xs text-slate-500 font-bold uppercase mb-1">Unidades no Escopo</p>
              <p className="text-4xl font-extrabold text-slate-800">{filteredUpas.length}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold mb-6">Produtividade por Unidade</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" fontSize={10} interval={0} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold mb-6">Taxa de Ocupação/Status</h3>
              <div className="h-64 w-full flex items-center justify-center">
                <div className="flex-grow h-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 ml-4 min-w-[120px] shrink-0">
                  {statusData.map((s, i) => (
                    <div key={s.name} className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i]}}></div>
                      <span className="text-slate-600">{s.name}: {s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'management' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Unidades de Pronto Atendimento</h2>
              <p className="text-sm text-slate-500">Gestão cadastral e operacional das UPAs em seu território.</p>
            </div>
            {currentUser.role !== 'UPA' && (
              <button 
                onClick={() => openUpaModal()}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                Nova Unidade
              </button>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Nome da Unidade</th>
                  <th className="px-6 py-4">Localização</th>
                  <th className="px-6 py-4">Status Espera</th>
                  <th className="px-6 py-4">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredUpas.map(upa => (
                  <tr key={upa.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-400">#{upa.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{upa.name}</div>
                      <div className="text-xs text-slate-500">{upa.address}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-800">{upa.city}</div>
                      <div className="text-xs font-bold text-blue-600">{upa.state}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                        upa.waitingTime === 'Baixo' ? 'bg-green-100 text-green-700' :
                        upa.waitingTime === 'Médio' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {upa.waitingTime.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex gap-2">
                        <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors" title="Ver Médicos desta UPA" onClick={() => { setActiveTab('doctors'); setNewDoctor({...newDoctor, upaId: upa.id}); }}>
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </button>
                        <button 
                          className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                          onClick={() => openUpaModal(upa)}
                          title="Editar Unidade"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'doctors' && (
        <div className="space-y-8 animate-in fade-in duration-300">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Equipe Médica por UPA</h2>
              <p className="text-sm text-slate-500">Cadastro e escala de profissionais ativos em cada unidade.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
               <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm">
                 <span className="text-xs font-bold text-slate-400 uppercase">Especialidade:</span>
                 <select 
                  className="text-sm font-bold text-slate-700 outline-none bg-transparent"
                  value={doctorSpecialtyFilter}
                  onChange={(e) => setDoctorSpecialtyFilter(e.target.value)}
                 >
                   <option value="">Todas</option>
                   {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                 </select>
               </div>
              <button 
                onClick={() => setIsAddingDoctor(true)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                Novo Médico
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                <tr>
                  <th className="px-6 py-4">Médico</th>
                  <th className="px-6 py-4">CRM</th>
                  <th className="px-6 py-4">Especialidade</th>
                  <th className="px-6 py-4">Unidade Vinculada</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredDoctors.map(doctor => {
                  const upa = upas.find(u => u.id === doctor.upaId);
                  return (
                    <tr key={doctor.id} className={`hover:bg-slate-50 transition-colors ${!doctor.active ? 'bg-slate-50/50 grayscale-[0.5]' : ''}`}>
                      <td className="px-6 py-4 font-bold text-slate-800">{doctor.name}</td>
                      <td className="px-6 py-4 text-slate-600 font-mono">{doctor.crm}</td>
                      <td className="px-6 py-4">
                        <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-medium uppercase">
                          {doctor.specialty}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {upa?.name || 'Não vinculada'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <button 
                            onClick={() => toggleDoctorStatus(doctor.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all shadow-sm ${
                              doctor.active 
                              ? 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200' 
                              : 'bg-red-100 text-red-700 border border-red-200 hover:bg-red-200'
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full ${doctor.active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            {doctor.active ? 'ATIVO' : 'INATIVO'}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                           <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors" title="Editar Médico">
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                           </button>
                           <button className="p-2 text-slate-400 hover:text-red-600 transition-colors" title="Remover Médico">
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                           </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredDoctors.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-slate-400 italic">Nenhum médico encontrado para esta unidade/especialidade.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* UPA Management Modal Overlay (Add/Edit) */}
      {isUpaModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6">{editingUpaId ? 'Editar Unidade' : 'Cadastrar Nova UPA'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome da Unidade</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ex: UPA Bom Jesus"
                  value={upaFormData.name}
                  onChange={e => setUpaFormData({...upaFormData, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
                  <select 
                    className="w-full p-3 border border-slate-300 rounded-lg"
                    value={upaFormData.state}
                    onChange={e => setUpaFormData({...upaFormData, state: e.target.value})}
                  >
                    <option value="">Selecione</option>
                    {LOCATIONS.map(l => <option key={l.state} value={l.state}>{l.state}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cidade</label>
                  <input 
                    type="text" 
                    className="w-full p-3 border border-slate-300 rounded-lg"
                    placeholder="Ex: Porto Alegre"
                    value={upaFormData.city}
                    onChange={e => setUpaFormData({...upaFormData, city: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Endereço Completo</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-slate-300 rounded-lg"
                  placeholder="Logradouro, número, bairro..."
                  value={upaFormData.address}
                  onChange={e => setUpaFormData({...upaFormData, address: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Especialidades Disponíveis</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {SPECIALTIES.map(s => (
                    <button
                      key={s}
                      onClick={() => handleToggleSpecialty(s)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                        upaFormData.specialties?.includes(s) 
                        ? 'bg-blue-100 border-blue-500 text-blue-700' 
                        : 'border-slate-200 text-slate-500'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tempo de Espera</label>
                <div className="flex gap-2">
                  {['Baixo', 'Médio', 'Alto'].map(lvl => (
                    <button 
                      key={lvl}
                      onClick={() => setUpaFormData({...upaFormData, waitingTime: lvl})}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${upaFormData.waitingTime === lvl ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 text-slate-600'}`}
                    >
                      {lvl.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setIsUpaModalOpen(false)} className="flex-1 py-4 border border-slate-200 rounded-xl font-bold">Cancelar</button>
              <button onClick={handleSaveUpa} className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200">
                {editingUpaId ? 'Atualizar Unidade' : 'Salvar Unidade'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Doctor Registration Modal Overlay */}
      {isAddingDoctor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-in zoom-in duration-200">
            <h3 className="text-2xl font-bold mb-6">Cadastrar Médico</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Profissional</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Nome completo"
                  value={newDoctor.name}
                  onChange={e => setNewDoctor({...newDoctor, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">CRM</label>
                  <input 
                    type="text" 
                    className="w-full p-3 border border-slate-300 rounded-lg"
                    placeholder="Número do Registro"
                    value={newDoctor.crm}
                    onChange={e => setNewDoctor({...newDoctor, crm: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Especialidade</label>
                  <select 
                    className="w-full p-3 border border-slate-300 rounded-lg"
                    value={newDoctor.specialty}
                    onChange={e => setNewDoctor({...newDoctor, specialty: e.target.value})}
                  >
                    <option value="">Selecione</option>
                    {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Unidade de Lotação</label>
                <select 
                  className="w-full p-3 border border-slate-300 rounded-lg"
                  value={newDoctor.upaId}
                  onChange={e => setNewDoctor({...newDoctor, upaId: e.target.value})}
                >
                  <option value="">Selecione uma UPA</option>
                  {filteredUpas.map(u => <option key={u.id} value={u.id}>{u.name} ({u.city})</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setIsAddingDoctor(false)} className="flex-1 py-4 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-colors">Cancelar</button>
              <button onClick={handleAddDoctor} className="flex-1 py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200">Vincular Médico</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

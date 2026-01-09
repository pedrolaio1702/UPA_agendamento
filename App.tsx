
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ScheduleFlow from './pages/ScheduleFlow';
import MyAppointments from './pages/MyAppointments';
import AdminDashboard from './pages/AdminDashboard';
import Privacy from './pages/Privacy';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/agendar" element={<ScheduleFlow />} />
          <Route path="/meus-agendamentos" element={<MyAppointments />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/privacidade" element={<Privacy />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;

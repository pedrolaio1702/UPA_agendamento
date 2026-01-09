
import React from 'react';

const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200">
        <h1 className="text-3xl font-bold text-slate-800 mb-8 border-b border-slate-100 pb-4">Política de Privacidade (LGPD)</h1>
        
        <div className="prose prose-slate max-w-none space-y-6 text-slate-600">
          <section>
            <h2 className="text-xl font-bold text-slate-800">1. Introdução</h2>
            <p>Este sistema de agendamento de Unidades de Pronto Atendimento (UPA) está comprometido com a transparência e a segurança dos dados dos cidadãos, operando em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800">2. Dados Coletados</h2>
            <p>Coletamos apenas o estritamente necessário para a finalidade de agendamento em saúde:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Nome Completo: Identificação do paciente na unidade.</li>
              <li>CPF: Validação junto ao sistema SUS e prevenção de fraudes.</li>
              <li>Telefone e E-mail: Comunicação de confirmação, avisos ou cancelamentos.</li>
              <li>Sintomas/Especialidade: Direcionamento para o serviço de saúde adequado.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800">3. Finalidade e Uso</h2>
            <p>Seus dados são utilizados exclusivamente para gerenciar sua fila de espera digital e garantir que a UPA escolhida tenha as informações básicas para o seu pré-atendimento. Não comercializamos nem compartilhamos seus dados com entidades privadas.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800">4. Segurança</h2>
            <p>Utilizamos protocolos criptografados (HTTPS), controle rigoroso de logs de acesso e armazenamento seguro para proteger suas informações contra acessos não autorizados.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800">5. Seus Direitos</h2>
            <p>Você possui o direito de:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Confirmar a existência de tratamento de dados.</li>
              <li>Acessar seus dados agendados.</li>
              <li>Corrigir dados incompletos ou inexatos.</li>
              <li><strong>Direito ao Esquecimento:</strong> Solicitar a eliminação dos seus dados pessoais coletados após a conclusão ou cancelamento do atendimento.</li>
            </ul>
          </section>

          <section className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
            <h2 className="text-lg font-bold text-blue-900 mb-2">Contato do Encarregado (DPO)</h2>
            <p className="text-blue-800 text-sm">Para questões relativas à proteção de dados, entre em contato via dpo@saudedigital.gov.br.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;

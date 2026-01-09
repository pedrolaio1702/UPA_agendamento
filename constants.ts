
import { Location, UPA } from './types';

export const LOCATIONS: Location[] = [
  { state: 'SP', cities: ['São Paulo', 'Campinas', 'Santos', 'Ribeirão Preto'] },
  { state: 'RJ', cities: ['Rio de Janeiro', 'Niterói', 'Duque de Caxias'] },
  { state: 'MG', cities: ['Belo Horizonte', 'Uberlândia', 'Contagem'] },
  { state: 'RS', cities: ['Porto Alegre', 'Caxias do Sul'] },
  { state: 'BA', cities: ['Salvador', 'Feira de Santana'] }
];

export const UPAS: UPA[] = [
  { 
    id: '1', 
    name: 'UPA 24h Central', 
    city: 'São Paulo', 
    state: 'SP', 
    address: 'Av. Ipiranga, 1234', 
    specialties: ['Clínico Geral', 'Pediatria', 'Ortopedia'],
    waitingTime: 'Médio'
  },
  { 
    id: '2', 
    name: 'UPA Norte', 
    city: 'São Paulo', 
    state: 'SP', 
    address: 'Rua das Flores, 500', 
    specialties: ['Clínico Geral', 'Pediatria'],
    waitingTime: 'Baixo'
  },
  { 
    id: '3', 
    name: 'UPA Copacabana', 
    city: 'Rio de Janeiro', 
    state: 'RJ', 
    address: 'Av. Atlântica, 99', 
    specialties: ['Clínico Geral', 'Cardiologia'],
    waitingTime: 'Alto'
  },
  { 
    id: '4', 
    name: 'UPA Pampulha', 
    city: 'Belo Horizonte', 
    state: 'MG', 
    address: 'Av. Fleming, 202', 
    specialties: ['Clínico Geral', 'Pediatria', 'Odontologia'],
    waitingTime: 'Baixo'
  },
  { 
    id: '5', 
    name: 'UPA Moacyr Scliar', 
    city: 'Porto Alegre', 
    state: 'RS', 
    address: 'Rua Jerônimo de Ornelas, 100', 
    specialties: ['Clínico Geral', 'Pediatria', 'Traumatologia'],
    waitingTime: 'Médio'
  },
  { 
    id: '6', 
    name: 'UPA Bom Jesus', 
    city: 'Porto Alegre', 
    state: 'RS', 
    address: 'Rua Bom Jesus, 410', 
    specialties: ['Clínico Geral', 'Enfermagem'],
    waitingTime: 'Baixo'
  }
];

export const SPECIALTIES = [
  'Clínico Geral',
  'Pediatria',
  'Ortopedia',
  'Cardiologia',
  'Odontologia de Emergência',
  'Enfermagem'
];

export const TIMES = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30'
];

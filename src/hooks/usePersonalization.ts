import { useState, useEffect } from 'react';

export interface PersonalizationData {
  name: string;
  tableNumber: string;
  showRegistry: boolean;
  isAdmin: boolean;
  greeting: string; // Добавляем новое поле для обращения
}

export function usePersonalization(): PersonalizationData {
  const [data, setData] = useState<PersonalizationData>({
    name: 'Дорогой гость',
    tableNumber: '1',
    showRegistry: false,
    isAdmin: false,
    greeting: 'Дорогие' // Значение по умолчанию
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name') || 'Дорогой гость';
    const tableNumber = urlParams.get('table') || '1';
    const showRegistry = urlParams.get('registry') === 'true';
    const isAdmin = urlParams.get('admin') === 'true';
    const gender = urlParams.get('gender'); // Получаем параметр gender

    let currentGreeting = 'Дорогие';
    if (gender === 'male') {
      currentGreeting = 'Дорогой';
    } else if (gender === 'female') {
      currentGreeting = 'Дорогая';
    }

    setData({ name, tableNumber, showRegistry, isAdmin, greeting: currentGreeting });
  }, []);

  return data;
}

export function createPersonalizedUrl(name: string, tableNumber: string, showRegistry: boolean = false, isAdmin: boolean = false, gender?: 'male' | 'female' | 'plural'): string {
  const baseUrl = window.location.origin + window.location.pathname;
  let url = `${baseUrl}?name=${encodeURIComponent(name)}&table=${encodeURIComponent(tableNumber)}&registry=${showRegistry}&admin=${isAdmin}`;
  if (gender) {
    url += `&gender=${gender}`;
  }
  return url;
}


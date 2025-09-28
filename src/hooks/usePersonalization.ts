import { useState, useEffect } from 'react';

export interface PersonalizationData {
  name: string;
  tableNumber: string;
  gender: 'male' | 'female' | 'plural';
  showRegistration: boolean;
  isAdmin: boolean;
}

export function usePersonalization(): PersonalizationData {
  const [data, setData] = useState<PersonalizationData>({
    name: 'Дорогой гость',
    tableNumber: '1',
    gender: 'male',
    showRegistration: true,
    isAdmin: false
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name') || 'Дорогой гость';
    const tableNumber = urlParams.get('table') || '1';
    const gender = (urlParams.get('gender') as 'male' | 'female' | 'plural') || 'male';
    const showRegistration = urlParams.get('registration') !== 'false';
    const isAdmin = urlParams.get('admin') === 'true';

    setData({ name, tableNumber, gender, showRegistration, isAdmin });
  }, []);

  return data;
}

export function createPersonalizedUrl(
  name: string, 
  tableNumber: string, 
  gender: 'male' | 'female' | 'plural' = 'male',
  showRegistration: boolean = true
): string {
  const baseUrl = window.location.origin + window.location.pathname;
  const params = new URLSearchParams({
    name,
    table: tableNumber,
    gender,
    registration: showRegistration.toString()
  });
  return `${baseUrl}?${params.toString()}`;
}
import { useState, useEffect } from 'react';

export interface PersonalizationData {
  name: string;
  tableNumber: string;
  gender: 'male' | 'female' | 'plural';
  showRegistration: boolean;
  isAdmin: boolean;
  salutationStyle: 'respectful' | 'dear';
}

export function usePersonalization(): PersonalizationData {
  const [data, setData] = useState<PersonalizationData>({
    name: 'Уважаемый гость',
    tableNumber: '1',
    gender: 'male',
    showRegistration: true,
    isAdmin: false,
    salutationStyle: 'respectful'
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name') || 'Уважаемый гость';
    const tableNumber = urlParams.get('table') || '1';
    const gender = (urlParams.get('gender') as 'male' | 'female' | 'plural') || 'male';
    const showRegistration = urlParams.get('registration') !== 'false';
    const isAdmin = urlParams.get('admin') === 'true';
    const salutationParam = urlParams.get('salutation');
    const salutationStyle: 'respectful' | 'dear' = salutationParam === 'dear' ? 'dear' : 'respectful';

    setData({ name, tableNumber, gender, showRegistration, isAdmin, salutationStyle });
  }, []);

  return data;
}

export function createPersonalizedUrl(
  name: string, 
  tableNumber: string, 
  gender: 'male' | 'female' | 'plural' = 'male',
  showRegistration: boolean = true,
  salutationStyle: 'respectful' | 'dear' = 'respectful'
): string {
  const baseUrl = window.location.origin + window.location.pathname;
  const params = new URLSearchParams({
    name,
    table: tableNumber,
    gender,
    registration: showRegistration.toString(),
    salutation: salutationStyle
  });
  return `${baseUrl}?${params.toString()}`;
}
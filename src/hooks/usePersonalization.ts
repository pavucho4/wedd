import { useState, useEffect } from 'react';

export interface PersonalizationData {
  name: string;
  tableNumber: string;
  showRegistry: boolean;
  isAdmin: boolean;
}

export function usePersonalization(): PersonalizationData {
  const [data, setData] = useState<PersonalizationData>({
    name: 'Дорогой гость',
    tableNumber: '1',
    showRegistry: false,
    isAdmin: false
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name') || 'Дорогой гость';
    const tableNumber = urlParams.get('table') || '1';
    const showRegistry = urlParams.get('registry') === 'true';
    const isAdmin = urlParams.get('admin') === 'true';

    setData({ name, tableNumber, showRegistry, isAdmin });
  }, []);

  return data;
}

export function createPersonalizedUrl(name: string, tableNumber: string, showRegistry: boolean = false, isAdmin: boolean = false): string {
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}?name=${encodeURIComponent(name)}&table=${encodeURIComponent(tableNumber)}&registry=${showRegistry}&admin=${isAdmin}`;
}
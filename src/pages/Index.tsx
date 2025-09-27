import { usePersonalization } from '@/hooks/usePersonalization';
import { useState } from 'react';

const Index = () => {
  const { name, tableNumber } = usePersonalization();
  const [apiStatus, setApiStatus] = useState('Не проверено');

  const testAPI = async () => {
    try {
      const response = await fetch('/api/test');
      const data = await response.json();
      setApiStatus(`✅ API работает: ${data.message}`);
    } catch (error) {
      setApiStatus(`❌ API ошибка: ${error.message}`);
    }
  };

  return (
    <main style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f0f0f0', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Простой тест для проверки работы React */}
      <div style={{ 
        padding: '20px', 
        backgroundColor: 'lightgreen', 
        color: 'black',
        textAlign: 'center',
        margin: '10px',
        borderRadius: '10px'
      }}>
        <h1>🎉 React работает! 🎉</h1>
        <p>Гость: {name}</p>
        <p>Стол: {tableNumber}</p>
        <p>Время: {new Date().toLocaleString()}</p>
      </div>

      {/* Тест API */}
      <div style={{ 
        padding: '20px', 
        backgroundColor: 'lightblue', 
        margin: '20px',
        borderRadius: '10px',
        textAlign: 'center'
      }}>
        <h3>🔧 Тест API</h3>
        <p>Статус: {apiStatus}</p>
        <button 
          onClick={testAPI}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Тестировать API
        </button>
      </div>
      
      {/* Простой свадебный контент */}
      <div style={{ 
        padding: '20px', 
        backgroundColor: 'white', 
        margin: '20px',
        borderRadius: '10px',
        textAlign: 'center'
      }}>
        <h2>💒 Свадьба Даниила и Алины 💒</h2>
        <p>15 ноября 2025 года</p>
        <p>Ставрополь</p>
        <p>Мы рады пригласить вас на наш особенный день!</p>
      </div>
    </main>
  );
};

export default Index;

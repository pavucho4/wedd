import { usePersonalization } from '@/hooks/usePersonalization';
import { useState, useEffect } from 'react';
import { WeddingHero } from '@/components/wedding/WeddingHero';
import { WeddingRSVP } from '@/components/wedding/WeddingRSVP';

const Index = () => {
  const { name, tableNumber, greeting } = usePersonalization();
  const [guests, setGuests] = useState([]);

  useEffect(() => {
    // Загружаем данные о гостях из JSON файла
    fetch('/guests.json')
      .then(response => response.json())
      .then(data => setGuests(data))
      .catch(error => console.error('Ошибка загрузки гостей:', error));
  }, []);

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#f0f0f0',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* WeddingHero component */}
      <WeddingHero guestName={name} greeting={greeting} />

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
        <p>{greeting}: {name}</p>
        <p>Стол: {tableNumber}</p>
        <p>Время: {new Date().toLocaleString()}</p>
      </div>

      {/* Информация о гостях */}
      <div style={{
        padding: '20px',
        backgroundColor: 'lightblue',
        margin: '20px',
        borderRadius: '10px',
        textAlign: 'center'
      }}>
        <h3>👥 Список гостей</h3>
        <p>Всего гостей: {guests.length}</p>
        <p>Загружено из JSON файла</p>
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

      {/* WeddingRSVP component */}
      <WeddingRSVP guestName={name} tableNumber={tableNumber} greeting={greeting} />
    </main>
  );
};

export default Index;


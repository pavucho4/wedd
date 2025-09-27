const Test = () => {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: 'lightblue', 
      color: 'black',
      fontSize: '24px',
      textAlign: 'center'
    }}>
      <h1>Тест работает!</h1>
      <p>Если вы видите этот текст, React приложение загружается.</p>
      <p>Время: {new Date().toLocaleString()}</p>
    </div>
  );
};

export default Test;

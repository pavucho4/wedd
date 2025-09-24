# 📋 Полная инструкция по развертыванию сайта-приглашения

## 🚀 Быстрый запуск для проверки

### Требования
- Node.js версии 18 или выше
- npm (устанавливается вместе с Node.js)

### Шаги для запуска:

1. **Установите Node.js**
   - Скачайте с официального сайта: https://nodejs.org/
   - Выберите LTS версию

2. **Клонируйте или скачайте проект**
   ```bash
   # Если есть git
   git clone <URL_ВАШЕГО_РЕПОЗИТОРИЯ>
   cd wedding-invitation

   # Или просто скачайте архивом и разархивируйте
   ```

3. **Установите зависимости**
   ```bash
   npm install
   ```

4. **Запустите сервер разработки**
   ```bash
   npm run dev
   ```

5. **Откройте в браузере**
   - Перейдите по адресу: http://localhost:8080
   - Для тестирования персонализации: http://localhost:8080?name=Иван Иванов&table=5

## 🌐 Развертывание на бесплатном хостинге

### Вариант 1: Netlify (Рекомендуется)

1. **Подготовка проекта**
   ```bash
   npm run build
   ```

2. **Регистрация на Netlify**
   - Перейдите на https://netlify.com
   - Зарегистрируйтесь через GitHub/GitLab/Email

3. **Деплой через интерфейс**
   - Войдите в панель Netlify
   - Нажмите "Add new site" → "Deploy manually"
   - Перетащите папку `dist` в область загрузки
   - Дождитесь завершения деплоя

4. **Настройка домена (опционально)**
   - В настройках сайта найдите "Domain settings"
   - Можете изменить поддомен на что-то вроде `daniil-alina-wedding.netlify.app`

### Вариант 2: Vercel

1. **Подготовка**
   ```bash
   npm run build
   ```

2. **Регистрация на Vercel**
   - Перейдите на https://vercel.com
   - Зарегистрируйтесь

3. **Деплой**
   - Нажмите "Add New Project"
   - Выберите "Import from Git" или загрузите папку `dist`
   - Следуйте инструкциям

### Вариант 3: GitHub Pages

1. **Создайте репозиторий на GitHub**
   - Загрузите все файлы проекта

2. **Настройте GitHub Actions**
   Создайте файл `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
             
         - name: Install dependencies
           run: npm install
           
         - name: Build
           run: npm run build
           
         - name: Deploy to GitHub Pages
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

3. **Активируйте GitHub Pages**
   - Перейдите в Settings → Pages
   - Выберите источник "GitHub Actions"

## 🎯 Персонализация приглашений

### Создание персональных ссылок

Для каждого гостя создайте ссылку с параметрами:

```
https://ваш-домен.com?name=Иван Петров&table=3
https://ваш-домен.com?name=Мария Сидорова&table=7
```

### Автоматизация создания ссылок

Создайте Excel/Google Sheets таблицу:

| Имя гостя | Номер стола | Персональная ссылка |
|-----------|-------------|-------------------|
| Иван Петров | 3 | `=CONCATENATE("https://ваш-домен.com?name=", ENCODEURL(A2), "&table=", B2)` |

### Пример списка гостей

```javascript
const guests = [
  { name: "Иван Петров", table: "3" },
  { name: "Мария Сидорова", table: "7" },
  { name: "Алексей Кузнецов", table: "1" },
  // ... остальные гости
];

// Генерация ссылок
guests.forEach(guest => {
  const url = `https://ваш-домен.com?name=${encodeURIComponent(guest.name)}&table=${guest.table}`;
  console.log(`${guest.name}: ${url}`);
});
```

## 📱 Проверка адаптивности

Обязательно проверьте сайт на разных устройствах:

1. **Десктоп** (1920x1080)
2. **Планшет** (768x1024)  
3. **Мобильный** (375x667)

Используйте инструменты разработчика в браузере (F12 → Toggle Device Toolbar).

## 🔧 Настройка и кастомизация

### Изменение цветов

Отредактируйте файл `src/index.css`, раздел `:root`:

```css
:root {
  --primary: 35 25% 45%; /* Основной цвет */
  --secondary: 42 35% 88%; /* Вторичный цвет */
  --accent: 45 40% 82%; /* Акцентный цвет */
}
```

### Изменение текстов

Все тексты находятся в компонентах в папке `src/components/wedding/`.

### Изменение дат и адресов

Отредактируйте соответствующие компоненты:
- `WeddingHero.tsx` - даты знакомства и помолвки
- `WeddingTimeline.tsx` - расписание дня
- `WeddingLocations.tsx` - адреса мероприятий

## 📊 Аналитика и отслеживание

### Добавление Google Analytics

В `index.html` добавьте перед `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Отслеживание RSVP

В файле `WeddingRSVP.tsx` уже есть заглушка для отправки данных. Замените на реальный API:

```javascript
// Вместо setTimeout добавьте:
fetch('/api/rsvp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: guestName, table: tableNumber, attending })
});
```

## 🎨 Дополнительные возможности

### Добавление фотографий

1. Разместите фото в папке `public/images/`
2. Импортируйте в компонент:
   ```javascript
   import photoUrl from '/images/photo.jpg';
   ```

### Добавление музыки (опционально)

```javascript
// В компоненте
const audio = new Audio('/music/wedding-song.mp3');
audio.loop = true;
audio.volume = 0.3;

// Запуск после взаимодействия пользователя
const handlePlayMusic = () => {
  audio.play().catch(console.error);
};
```

## 🔒 Безопасность и производительность

### Оптимизация изображений

Используйте современные форматы:
- WebP для фотографий
- SVG для иконок
- Сжимайте изображения (TinyPNG, ImageOptim)

### Кеширование

Добавьте в `public/_headers` (для Netlify):

```
/*
  Cache-Control: public, max-age=31536000, immutable

/*.html
  Cache-Control: public, max-age=0, must-revalidate
```

## 🆘 Решение проблем

### Частые ошибки

1. **"Command not found: npm"**
   - Установите Node.js заново
   - Перезапустите терминал

2. **Ошибки при установке зависимостей**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Сайт не открывается после деплоя**
   - Проверьте настройки хостинга
   - Убедитесь что файлы загружены в правильную папку

4. **Персонализация не работает**
   - Проверьте URL параметры
   - Откройте консоль разработчика (F12) для ошибок

### Контакты для поддержки

При возникновении проблем:
1. Проверьте данную инструкцию
2. Найдите ошибку в консоли браузера (F12)
3. Обратитесь к разработчику с описанием проблемы

---

## 💝 Финальные рекомендации

1. **Тестируйте** перед отправкой гостям
2. **Делайте резервные копии** проекта
3. **Проверяйте ссылки** на всех устройствах
4. **Отправляйте приглашения заранее** (за 2-3 недели до свадьбы)

Удачи с вашим особенным днем! 💕
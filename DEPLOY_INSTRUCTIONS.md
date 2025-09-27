# Инструкции по деплою на Vercel

## Проблемы, которые были исправлены:

1. **Конфигурация Vercel** - исправлен конфликт между `functions` и `builds` свойствами
2. **API URL** - исправлены базовые URL для API вызовов (убрана проверка development режима)
3. **Runtime конфигурация** - добавлена конфигурация runtime во все API файлы
4. **Vercel builds** - runtime теперь указан в конфигурации builds вместо отдельного functions блока
5. **Команда сборки** - добавлена `buildCommand: "npm run build"` в конфигурацию static-build

## Шаги для деплоя:

### 1. Подготовка переменных окружения
В настройках проекта Vercel добавьте следующие переменные окружения:

```
GOOGLE_SHEET_ID=your_google_sheet_id_here
GOOGLE_SERVICE_EMAIL=your_service_account_email@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```

### 2. Деплой
1. Загрузите код в GitHub репозиторий
2. Подключите репозиторий к Vercel
3. Vercel автоматически определит настройки из `vercel.json`
4. Убедитесь, что переменные окружения добавлены в настройках проекта

### 3. Проверка работы
После деплоя проверьте:
- Основная страница: `https://your-domain.vercel.app/`
- API тест: `https://your-domain.vercel.app/api/test`
- API ping: `https://your-domain.vercel.app/api/ping`

## Структура проекта:

- `dist/` - собранные файлы для статического хостинга
- `api/` - серверные функции для Vercel
- `src/` - исходный код React приложения

## API эндпоинты:

- `GET /api/ping` - проверка работы API
- `GET /api/test` - тестовый эндпоинт
- `GET /api/guests` - получение списка гостей
- `POST /api/guests` - добавление гостя
- `GET /api/rsvp` - получение RSVP ответов
- `POST /api/rsvp` - отправка RSVP ответа

## Возможные проблемы:

1. **Пустая страница** - обычно связано с неправильной конфигурацией сборки
2. **API не работает** - проверьте переменные окружения
3. **CORS ошибки** - уже настроены в API файлах

## Локальная разработка:

```bash
npm run dev
```

Приложение будет доступно на `http://localhost:8080`

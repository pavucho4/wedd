# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/2c733a37-eaf0-458c-b0df-78edb28fe12e

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/2c733a37-eaf0-458c-b0df-78edb28fe12e) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/2c733a37-eaf0-458c-b0df-78edb28fe12e) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)



## Доработки проекта

Этот проект был доработан для хранения данных о гостях и их ответах в Google Таблицах, а также для динамического изменения обращения на сайте в зависимости от URL-параметров.

### 1. Настройка Google Cloud Platform и Google Таблиц

Для корректной работы приложения необходимо настроить Google Sheets API и учетную запись службы:

1.  **Создайте новую Google Таблицу:**
    *   Создайте новую Google Таблицу, которая будет использоваться для хранения данных RSVP и списка гостей.
    *   Запишите **ID вашей Google Таблицы** (его можно найти в URL таблицы, например, `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit`).
    *   Создайте два листа в этой таблице: один с названием `RSVP Responses` (для ответов гостей) и другой с названием `Guests` (для списка гостей).
    *   Для листа `RSVP Responses` убедитесь, что первая строка содержит заголовки столбцов: `guestName`, `tableNumber`, `attending`, `timestamp`, `userAgent`, `url`.
    *   Для листа `Guests` убедитесь, что первая строка содержит заголовки столбцов: `id`, `names`, `tableNumber`, `attending`, `timestamp`.

2.  **Создайте проект в Google Cloud Platform (GCP):**
    *   Перейдите на [Google Cloud Console](https://console.cloud.google.com/).
    *   Создайте новый проект.

3.  **Включите Google Sheets API:**
    *   В созданном проекте перейдите в раздел "API и сервисы" -> "Библиотека API".
    *   Найдите "Google Sheets API" и включите его.

4.  **Создайте учетную запись службы (Service Account):**
    *   В разделе "API и сервисы" перейдите в "Учетные данные".
    *   Нажмите "Создать учетные данные" -> "Учетная запись службы".
    *   Присвойте ей имя и предоставьте ей роль "Редактор" (или более специфичную, если хотите ограничить доступ) для Google Таблиц.
    *   После создания учетной записи службы, нажмите на неё, перейдите во вкладку "Ключи" и создайте новый ключ в формате JSON. Этот JSON-файл будет скачан на ваш компьютер.

5.  **Поделитесь Google Таблицей с учетной записью службы:**
    *   Откройте вашу Google Таблицу.
    *   Нажмите "Поделиться" и вставьте адрес электронной почты вашей учетной записи службы (он будет в формате `[имя-учетной-записи-службы]@[ваш-проект-id].iam.gserviceaccount.com`).
    *   Предоставьте этой учетной записи права "Редактора".

### 2. Переменные окружения Vercel

Для развертывания на Vercel вам необходимо установить следующие переменные окружения (Environment Variables) в настройках вашего проекта Vercel:

*   `GOOGLE_SHEET_ID`: ID вашей Google Таблицы.
*   `GOOGLE_SERVICE_ACCOUNT_EMAIL`: Адрес электронной почты вашей учетной записи службы (из JSON-ключа).
*   `GOOGLE_PRIVATE_KEY`: Приватный ключ из вашего JSON-ключа. **Важно:** При вставке приватного ключа в Vercel, убедитесь, что все символы `\n` заменены на реальные переносы строк. Некоторые платформы могут автоматически обрабатывать это, но лучше проверить. Если Vercel не поддерживает многострочные переменные окружения, вам может потребоваться удалить `\n` и использовать ключ в одну строку, а затем в коде заменить `\n` обратно на переносы строк (это уже реализовано в `googleSheetService.ts`).

### 3. Развертывание на Vercel

1.  **Клонируйте проект:**
    ```bash
    git clone <ваш_репозиторий>
    cd aline-danils-wedding-main
    ```
2.  **Установите зависимости:**
    ```bash
    npm install
    ```
3.  **Разверните проект:**
    *   Подключите ваш репозиторий к Vercel.
    *   Убедитесь, что переменные окружения, указанные выше, настроены в проекте Vercel.
    *   Vercel автоматически обнаружит и развернет приложение, включая Serverless Functions в директории `api`.

### 4. Динамическое обращение

Для изменения обращения в шапке и блоке с согласием используйте параметр `gender` в URL:

*   `https://your-domain.com/?gender=male` -> "Дорогой"
*   `https://your-domain.com/?gender=female` -> "Дорогая"
*   `https://your-domain.com/?gender=plural` (или любой другой, или отсутствие параметра) -> "Дорогие"

Например, для гостя мужского пола ссылка будет выглядеть так: `https://your-domain.com/?name=Иван&table=5&gender=male`.

### 5. Структура проекта

*   `src/services/googleSheetService.ts`: Содержит логику для взаимодействия с Google Sheets API.
*   `src/services/rsvpService.ts`: Обновлен для использования Vercel API для отправки и получения RSVP данных.
*   `src/services/guestService.ts`: Обновлен для использования Vercel API для управления данными гостей.
*   `api/rsvp.ts`: Vercel Serverless Function для обработки запросов RSVP (POST для отправки, GET для получения).
*   `api/guests.ts`: Vercel Serverless Function для обработки запросов гостей (POST, GET, PATCH, DELETE).
*   `src/hooks/usePersonalization.ts`: Обновлен для чтения параметра `gender` из URL и определения соответствующего обращения.
*   `src/pages/Index.tsx` и `src/components/wedding/WeddingHero.tsx`, `src/components/wedding/WeddingRSVP.tsx`: Обновлены для использования динамического обращения.
*   `vercel.json`: Обновлен для корректной работы Serverless Functions.

Если у вас возникнут вопросы или потребуется дополнительная помощь, не стесняйтесь обращаться!

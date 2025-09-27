#!/bin/bash

# Установка зависимостей
npm install

# Сборка проекта
npm run build

# Проверка, что dist папка создана
if [ ! -d "dist" ]; then
  echo "Ошибка: папка dist не создана"
  exit 1
fi

echo "Сборка завершена успешно"

@echo off
echo Создание простой версии для развертывания...

REM Создаем папку dist если её нет
if not exist "dist" mkdir dist

REM Копируем основные файлы
copy index.html dist\
copy public\*.* dist\

echo Сборка завершена! Папка dist готова для загрузки на Netlify.
pause



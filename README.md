# 🌍 env-editor


<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="License">
  <img src="https://img.shields.io/badge/dependencies-0-success" alt="Zero deps">
</p>
Веб-инструмент для редактирования `.env` файлов с удобным графическим интерфейсом.

## 🚀 Запуск

```bash
npm start
```

Сервер запускается на `http://localhost:3462`.

## ✨ Возможности

- **Загрузка файла** — выберите `.env` файл через интерфейс
- **Вставка текста** — вставьте содержимое `.env` в текстовое поле
- **Табличный просмотр** — все переменные отображаются в виде таблицы
- **Редактирование** — изменяйте ключи и значения прямо в таблице
- **Добавление** — добавляйте новые переменные через форму
- **Удаление** — удаляйте ненужные переменные
- **Экспорт** — скачивайте результат как `.env` файл
- **Скрытие значений** — скрывайте чувствительные данные (секреты)
- **Валидация** — проверка на пробелы в ключах и дубликаты
- **Тёмная/светлая тема** — переключение по кнопке в шапке

## 📡 API

### `GET /`
Главная страница приложения.

### `POST /api/parse`
Разбор содержимого `.env`.

**Тело запроса:**
```json
{ "content": "DB_HOST=localhost\nDB_PORT=5432" }
```

**Ответ:**
```json
{
  "parsed": [{ "key": "DB_HOST", "value": "localhost" }],
  "errors": []
}
```

### `POST /api/generate`
Генерация `.env` из пар ключ/значение.

**Тело запроса:**
```json
{ "pairs": [{ "key": "DB_HOST", "value": "localhost" }] }
```

**Ответ:**
```json
{ "content": "DB_HOST=localhost\n" }
```

## 📁 Структура проекта

```
env-editor/
├── index.html      # фронтенд
├── server.js       # сервер на Node.js
├── package.json
├── README.md
└── .gitignore
```

## 📄 Лицензия

MIT

## 💛 Support

If you find this project useful, consider supporting:

```
USDT TRC-20: TYVN7HLcb5nrLVee9k8DBMZofxJur7ZgLB
USDT TON:    UQD4mGTxZsIWXx1bNXJ1fsyN0XKvogr34TGSxB7D4nPzOozF
USDT ERC-20: 0xa79f0713ab132eae54002c9c34fbb837272590c0
```

---


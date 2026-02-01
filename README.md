# MAX Mini App (интеграция с WatBot)

Данное веб-приложение представляет собой MAX Mini App, которое интегрировано с системой WatBot для обработки регистраций пользователей.

## Описание

Проект позволяет пользователям регистрироваться через MAX Mini App, заполняя форму с именем, фамилией и номером телефона. После отправки данные направляются в систему WatBot через специальный вебхук.

## Особенности

- Интеграция с MAX Mini App API
- Валидация данных формы
- Маска для ввода номера телефона
- Отправка данных в WatBot с идентификацией по telegram_id
- Адаптивный дизайн

## Структура проекта

- `index.html` - основная страница с формой регистрации
- `api/submit.js` - серверная функция для обработки отправки формы и интеграции с WatBot
- `vercel.json` - конфигурационный файл для Vercel
- `WATBOT_INTEGRATION.md` - инструкция по интеграции с WatBot
- `TESTING_INSTRUCTIONS.md` - инструкция по тестированию интеграции

## Интеграция с WatBot

Проект настроен на отправку данных в WatBot по следующему вебхуку:
`https://api.watbot.ru/hook/4325587:oAbD2q949K3SGmOKvZXF2gjtO4d1LHrTnHNWX4T2h8dB6DO8`

Данные отправляются в формате:
```json
{
  "contact_by": "telegram_id",
  "search": "telegram_id_пользователя",
  "variables": {
    "customer_name": "Имя Фамилия",
    "customer_phone": "+7XXXXXXXXXX",
    "telegram_user_name": "Имя Фамилия",
    "telegram_id": "telegram_id_пользователя",
    "source": "telegram-webapp-registration",
    "ts": "timestamp",
    "first_name": "Имя",
    "last_name": "Фамилия",
    "registration_date": "YYYY-MM-DD",
    "registration_source": "telegram_mini_app"
  }
}
```

## Требования

- Пользователь должен сначала написать команду `/start` боту, чтобы его контакт был создан в WatBot с соответствующим telegram_id
- После этого при регистрации через Mini App система сможет сопоставить данные с существующим контактом

## Тестирование

Для тестирования интеграции см. файл `TESTING_INSTRUCTIONS.md`.

## Документация

Для подробного ознакомления с проектом и инструкций по клонированию для других аккаунтов WatBot, смотрите:
- [Полное руководство по проекту](PROJECT_GUIDE.md)

## Деплой

Проект готов для деплоя на Vercel. Для корректной работы необходимо убедиться, что вебхук в Leadteh настроен правильно.

## Ссылки

- [GitHub](https://github.com/Roman72-186/telegram-webapp)
- [Vercel](https://telegram-webapp.vercel.app)
# Документация MAX Mini App

## Обзор

MAX Mini App - это веб-приложение, которое работает внутри мессенджера MAX. Для интеграции с мессенджером используется SDK, предоставляемый MAX.

## Подключение SDK

Для подключения SDK используйте следующий URL:

```html
<script src="https://st.max.ru/js/max-web-app.js"></script>
```

**Важно**: Используйте именно этот URL, а не `https://apps.max.ru/static/bridge.js`, как указано в некоторых устаревших источниках.

## Основные методы

### WebApp.ready()

Этот метод **обязательно** нужно вызвать после загрузки страницы, чтобы сообщить мессенджеру, что приложение готово к работе. Без этого вызова пользователь будет видеть экран загрузки ("скелетон").

```javascript
WebApp.ready();
```

### WebApp.getUserData()

Получает данные пользователя из мессенджера MAX.

```javascript
WebApp.getUserData().then(function(user) {
    console.log('User data:', user);
    // user.id - уникальный ID пользователя
    // user.first_name - имя пользователя
    // user.last_name - фамилия пользователя
    // user.username - никнейм пользователя
    // user.language_code - язык пользователя
});
```

### WebApp.close()

Закрывает приложение.

```javascript
WebApp.close();
```

## Системные кнопки

### WebApp.BackButton

#### WebApp.BackButton.show()

Показывает системную кнопку "Назад" в интерфейсе мессенджера.

```javascript
WebApp.BackButton.show();
```

#### WebApp.BackButton.onClick(callback)

Назначает обработчик клика по кнопке "Назад".

```javascript
WebApp.BackButton.onClick(function() {
    // Обработка нажатия на кнопку "Назад"
    WebApp.close(); // Например, закрыть приложение
});
```

### WebApp.MainButton

#### WebApp.MainButton.show(options)

Показывает главную кнопку в интерфейсе мессенджера. Опционально можно передать параметры стилизации.

```javascript
WebApp.MainButton.show({
    text: 'Отправить',
    color: '#3390ec',      // Цвет фона кнопки
    text_color: '#ffffff'  // Цвет текста кнопки
});
```

#### WebApp.MainButton.hide()

Скрывает главную кнопку.

```javascript
WebApp.MainButton.hide();
```

#### WebApp.MainButton.onClick(callback)

Назначает обработчик клика по главной кнопке.

```javascript
WebApp.MainButton.onClick(function() {
    // Обработка нажатия на главную кнопку
});
```

## Хранилище

### WebApp.Storage

#### WebApp.Storage.setItem(key, value)

Сохраняет пару "ключ-значение" в локальном хранилище.

```javascript
WebApp.Storage.setItem('my_key', 'my_value');
```

#### WebApp.Storage.getItem(key)

Получает значение по ключу из локального хранилища.

```javascript
WebApp.Storage.getItem('my_key').then(function(value) {
    console.log('Stored value:', value);
});
```

#### WebApp.Storage.removeItem(key)

Удаляет значение по ключу из локального хранилища.

```javascript
WebApp.Storage.removeItem('my_key');
```

#### WebApp.Storage.clear()

Очищает всё локальное хранилище.

```javascript
WebApp.Storage.clear();
```

## Пример использования

```html
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MAX Mini App</title>
    <script src="https://st.max.ru/js/max-web-app.js"></script>
</head>
<body>
    <h1>MAX Mini App</h1>
    <script>
        window.onload = function() {
            if (typeof WebApp !== 'undefined') {
                
                // Обязательно сообщаем мессенджеру, что приложение готово
                WebApp.ready();
                
                // Получаем данные пользователя
                WebApp.getUserData().then(function(userData) {
                    console.log('User data:', userData);
                    
                    // Автозаполняем поля формы, если доступны
                    if (userData.first_name) {
                        document.getElementById('firstName').value = userData.first_name;
                    }
                    if (userData.last_name) {
                        document.getElementById('lastName').value = userData.last_name;
                    }
                });
                
                // Настраиваем кнопку "Назад"
                WebApp.BackButton.show();
                WebApp.BackButton.onClick(function() {
                    WebApp.close();
                });
                
                // Настраиваем главную кнопку
                WebApp.MainButton.show({
                    text: 'Отправить',
                    color: '#3390ec',
                    text_color: '#ffffff'
                });
                WebApp.MainButton.onClick(function() {
                    // Отправляем данные
                    sendData();
                });
                
            } else {
                console.error('WebApp SDK не загружен');
            }
        };
        
        function sendData() {
            // Ваш код отправки данных
        }
    </script>
</body>
</html>
```

## Важные замечания

1. **WebApp.ready()** - критически важный вызов. Без него приложение не будет отображаться.
2. **URL SDK** - используйте `https://st.max.ru/js/max-web-app.js`, а не устаревшие адреса.
3. **Работа в браузере** - SDK работает только внутри мессенджера MAX. В обычном браузере объект `WebApp` не будет определён.
4. **Проверка наличия методов** - всегда проверяйте наличие методов перед их вызовом, так как SDK может обновляться.

## Доступ к данным

Доступ к данным можно получить как через объект `WebApp`, так и путем парсинга `window.location.search`. Например, для получения параметров запуска:

```javascript
// Способ 1: через объект WebApp
if (WebApp.initDataUnsafe && WebApp.initDataUnsafe.start_param) {
    const startParam = WebApp.initDataUnsafe.start_param;
}

// Способ 2: через window.location.search
const urlParams = new URLSearchParams(window.location.search);
const startParam = urlParams.get('start');
```

## initData и безопасность

При открытии Mini App в мессенджере MAX, в URL передается строка `initData`. Эта строка содержит информацию о пользователе и времени запуска приложения.

### Структура initData

`initData` представляет собой строку в формате `query_string`, содержащую следующие параметры:

*   `id` - уникальный ID пользователя.
*   `first_name` - имя пользователя.
*   `last_name` - фамилия пользователя.
*   `username` - никнейм пользователя (если есть).
*   `language_code` - код языка пользователя (например, "ru").
*   `auth_date` - время авторизации в формате Unix timestamp.
*   `hash` - подпись, которая используется для проверки подлинности данных.

### Валидация initData на сервере

Для обеспечения безопасности, **все важные действия**, совершаемые в приложении, должны сопровождаться **проверкой `initData` на сервере**. Это позволяет удостовериться, что запрос действительно был отправлен пользователем, а не злоумышленником.

#### Алгоритм валидации

1.  Получите строку `initData` из URL.
2.  Извлеките параметр `hash` и удалите его из строки `initData`.
3.  Отсортируйте оставшиеся параметры по алфавиту.
4.  Объедините отсортированные параметры в формате `key1=value1\nkey2=value2` (каждая пара на новой строке).
5.  Создайте секретный ключ, вычислив HMAC-SHA256 от токена бота, используя соль `"WebAppData"`.
6.  Вычислите HMAC-SHA256 хэш от строки из п.4, используя в качестве ключа секретный ключ из п.5.
7.  Преобразуйте полученный хэш в шестнадцатеричное представление.
8.  Сравните получившееся значение с `hash`, извлеченным в п.2. Если они совпадают, данные действительны.

#### Пример валидации (Node.js)

```javascript
const crypto = require('crypto');

function validateInitData(initData, botToken) {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    urlParams.delete('hash');

    const sortedEntries = [...urlParams.entries()].sort(([a], [b]) => a.localeCompare(b));
    const dataCheckString = sortedEntries.map(([key, value]) => `${key}=${value}`).join('\n');

    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
    const signature = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    return signature === hash;
}

// Пример использования
const initData = 'query_id=...&user=%7B%22id%22%3A...%7D&auth_date=...&hash=...'; // initData из URL
const botToken = 'your_bot_token';

if (validateInitData(initData, botToken)) {
    console.log('Данные действительны');
    // Разрешить выполнение действия
} else {
    console.log('Недействительные данные');
    // Отказать в выполнении действия
}
```

## Параметры запуска (Deep Link)

При открытии Mini App можно передавать дополнительные параметры через строку запроса URL. Один из наиболее часто используемых параметров - `start` (или `start_param`), который позволяет передавать полезную нагрузку (payload) в приложение при его запуске.

### Формат ссылки

Формат ссылки для запуска Mini App с параметрами:

```
https://max.ru/<botName>?start=<payload>
```

Где:
- `<botName>` - имя бота, связанного с Mini App
- `<payload>` - произвольная строка полезной нагрузки, которая будет передана в приложение

### Использование параметров

Параметры запуска можно использовать для различных целей:

1. **Диплинки (Deep Links)**: Направление пользователей к определенным частям приложения при запуске
2. **Отслеживание трафика**: Идентификация источников переходов и кампаний
3. **Реферальные системы**: Передача реферальных кодов или идентификаторов приглашающего пользователя

### Получение параметров в приложении

Доступ к параметрам запуска можно получить двумя способами:

1. Через объект `WebApp` (если поддерживается):
```javascript
if (WebApp.initDataUnsafe && WebApp.initDataUnsafe.start_param) {
    const startParam = WebApp.initDataUnsafe.start_param;
    console.log('Параметр start:', startParam);
}
```

2. Путем парсинга `window.location.search`:
```javascript
const urlParams = new URLSearchParams(window.location.search);
const startParam = urlParams.get('start');
console.log('Параметр start:', startParam);
```
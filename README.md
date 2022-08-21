# WebSocket-Chat
<img src="https://st.depositphotos.com/1008768/4671/i/950/depositphotos_46719647-stock-photo-live-chat.jpg" alt="drawing" width="100"/>

## Инструкции по запуску сервера Django

#### 1. Установить в систему redis и запустить его
```
$ sudo apt-get update
$ sudo apt-get install redis
$ redis-server
```
если вы используете ос Windows, то предпочтительно пользоваться Redis средствами Docker либо WSL2!
```
docker run --name redis-server -d redis
```

#### 2. Создать виртуальное окружение внутри папки WebSocket-Chat и активировать его
```
python -m venv venv
.\venv\Scripts\activate
```
#### 3. Установить необходимые пакеты для работы приложения:
```
pip install -r requirements.txt
```
Дождитесь окончания установки всех зависимостей.

#### 4. Перейти в каталог ChatRoom, где находиться файл manage.py и запустить сервер:
```
python manage.py runserver
```
#### 4. На этом сервер запущен и готов к работе, нужно перейти по адресу:
```
http://127.0.0.1:8000/
```
# Внимание! 
### Eсли приложение не работает корректно, значит не правильно установлен redis-server

## Описание работы приложения:
#### На главной странице отображен список всех пользователей. В общий чат могут отправлять сообщения все пользователи, даже не авторизованные. 
#### На время теста организовано авто заполнения данных профиля при регистрации. Но вы в любой момент можете изменить их личном кабинете. 
#### Также на время тестирования организовано имитация бурного общения в общем чате. Бот по очереди выбирает одного пользователя среди всех пользователей и от его имени отправляет рандомную фразу в общий чат.
#### Чтобы начать приватный чат с определенным пользователем, необходимо выбрать его в списке на главной странице. Чтобы протестировать работоспособность чата, нужно зарегистрироваться через  два разных браузера и выбрать друг друга в списке. История переписки сохраняется и подгружается при повторном открытии приватного чата.
#### На вкладке комнаты, имеются общедоступные комнаты пользователей. Отличие таких комнат от приватных: на такую комнату может присоединяться несколько пользователей одновременно. История этих чатов также сохраняется и подгружается при повторном входе в комнату.
#### Все файлы касающиеся frontend части, находятся в папке Client. Почти все функции выполняются через javascript, django лишь предоставляет и сохраняет данные в базу данных через API запросы.




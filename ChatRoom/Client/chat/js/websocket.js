import { host } from '/static/js/const.js'

window.addEventListener('load', () => {

    // Открыть канал websocket для общего чата
    const chatSocket = new WebSocket(
        'ws://'
        + window.location.host
        + '/ws/chat_with/common/'
    );

    let flag = false //флаг нужен для определения кто пишет в чат, сам юзер или бот

    // Поведение при получении сообщении из сервера
    chatSocket.onmessage = function (e) {
        const data = JSON.parse(e.data);
        let newMessage = JSON.parse(data.message)
        if (flag) {
            document.querySelector('#chat-log').value += (newMessage.name + ':\n' + newMessage.message + '\n\n');
        } else {
            document.querySelector('#chat-log').value += (newMessage.fake_user + ':\n' + newMessage.message + '\n\n');
        }
        flag = false
    };

    // Отправить сообщение на сервер
    document.querySelector('#chat-message-submit').onclick = function (e) {
        const messageInput = document.querySelector('#chat-message-input');
        const message = messageInput.value;
        chatSocket.send(JSON.stringify({
            'message': message,
            'fake_user': 'bung'
        }));
        messageInput.value = '';
        flag = true
    };

    // Enter работает как отправить сообщение в чат
    document.querySelector('#chat-message-input').onkeyup = function (e) {
        if (e.keyCode === 13) {  // enter, return
            document.querySelector('#chat-message-submit').click();
        }
    };

    // Поведение при закрытии websocket
    // chatSocket.onclose = function (e) {
    //     console.error('Chat socket closed unexpectedly');
    // };


    // Поведение при открытии соединения
    chatSocket.onopen = function (e) {
        runInterval(fakeChat)
        
    }

    // Описание функции имитации бурного общения в общем чате_____________________________________________________

    // Возвращает рандомное число в заданном промежутке
    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Повторяет переданную функцию через рандомное время в заданном промежутке 30 раз
    let count = 0
    function runInterval(func) {
        let interval = getRndInteger(5000, 15000)
        setTimeout(() => {
            func()
            if (count < 30){
                runInterval(func)
                count++
            }
        }, interval);

    }
    // Функция запроса за данными пользователя, возвращает массив объектов с данными пользователей
    const allProfileData = async () => {
        return await fetch(`${host}all_users/`)
            .then((response) => { return response.json(); })
            .then((data) => { return data; })
            .catch(() => { console.log('error') });
    }

    // Функция имитации бурного общения в общем чате
    async function fakeChat() {
        const months = [
            "Всем привет. Меня зовут Bekmurat. Я из Казахстана.",
            "Я Антон,с г.Санкт-Петербург.Мне 24 года.",
            "Всем здрасьте. Дмитрий из.... Калгари. 20+ лет в ИТ/Телеком, но времена меняются и хочется попробовать что-то новое",
            "Привет. Я Илья и мне 25. Работаю в Сбере экспертом централизованного контроля качества",
            "Занимаюсь аналитикой в фармацевтической индустрии, в сфере supply planning.",
            "Работаю в гимназии, очень давно была мечта стать программистом...",
            "Из Екатеринбурга (Урал). 10 лет работал в строительстве",
            "Всем привет! Сколько тут разносторонних людей, очень круто :)",
            "Работаю инженером автоматических систем контроля производства.",
            "Хочу вспомнить как это писать код и подтянуть знания по разработке и соседним процессам",
        ];
        const randomMess = Math.floor(Math.random() * months.length);
        let message = months[randomMess];

        let userList
        await allProfileData().then(data => userList = data)

        let array = []
        userList.forEach(element => {
            array.push(element.name)
        })

        const randomUser = Math.floor(Math.random() * array.length);
        let fake_user = array[randomUser];

        chatSocket.send(JSON.stringify({
            'message': message,
            'fake_user': fake_user
        }));

        document.getElementById("chat-log").scrollTop = document.getElementById("chat-log").scrollHeight
    }

})
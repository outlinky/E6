import { host } from '/static/js/const.js'
import { csrftoken } from '/static/js/const.js'

/*Алгоритм входа в комнату:
1. Сделать запрос на проверку комнаты со своим именем, если такая комната уже существует, то  
    название комнаты будет та же, иначе создаем новую комнату из адреса
2. Открыть websocket с названием комнаты и сразу загрузить историю чата
3. Получить и вывести данные собеседника*/

// Пункт 1____________________________________________________________________________________________

// Название и владелец комнаты присвоить из URL
let roomName = JSON.parse(document.getElementById('room-name').textContent);
const owner = JSON.parse(document.getElementById('room-name').textContent);

// Функция поиска комнаты в БД
const getRoom = async (name) => {
    return await fetch(`${host}room_get/?room=${name}`)
        .then((response) => { return response.json(); })
        .then((data) => { return data; })
        .catch(() => {
            console.log('------')
        });
}

// Функция получения своего своего профиля для имени
const getMyName = async () => {
    return await fetch(`${host}profile_data/`)
        .then((response) => { return response.json(); })
        .then((data) => { return data; })
        .catch(() => { console.log('error profile_data') });
}

// Функция создания приватной комнаты чата в бд
const createRoom = (roomName) => {
    let body = JSON.stringify({
        room: roomName,
        owner: 1
    });
    const options = {
        method: 'POST',
        // Добавим тело запроса
        body: body,
        headers: {
            "Content-type": "application/json",
            "X-CSRFToken": csrftoken
        }
    }
    // Отправить post запрос
    fetch(`${host}create_room/`, options)
        .then(response => response.json())
        .then(json => console.log(json))
        .catch(() => { console.log('такая комната уже существует') });
}

// Функция проверки комнаты
async function checkRoom(getRoom) {
    let myName;
    await getMyName().then(data => { myName = data.name })

    let searchRoom1 = `${myName + '_' + roomName}` // Название комнаты
    let searchRoom2 = `${roomName + '_' + myName}` // Название комнаты

    let roomsArray = [];
    await getRoom(searchRoom1).then(data => {
        roomsArray.push(data.room)
    })
    await getRoom(searchRoom2).then(data => {
        roomsArray.push(data.room)
    })
    roomsArray = roomsArray.filter(item => item !== undefined)
    console.log('roomsArray.length', roomsArray.length)

    if (roomName == myName) {// Если пользователь зашел к себе, то проверить наличие общественной комнаты
        let myRoom
        await getRoom(myName).then(data => myRoom = data)
        if (myRoom.room == undefined) { // если комнаты нет, то перенаправить
            window.location.href = `${host}all_rooms/`;
        }
    } else { // Если в базе нет подходящей комнаты, то создать и передать ее для websocket
        if (roomsArray.length == 0) {
            console.log('Создать комнату')
            createRoom(searchRoom1)
            roomName = searchRoom1
        }
        if (roomsArray.length > 0) { // если есть такая комната, то зайти в нее
            console.log('roomsArray[0]', roomsArray[0])
            roomName = roomsArray[0]
        }
    }
}

// Пункт 2____________________________________________________________________________________________

// Функция создания сообщения в БД
async function createMessage(message, room) {
    let author;
    await getMyName().then(data => author = data.name)

    let body = JSON.stringify({
        author: author,
        message: message,
        room: 1,
        room_blank: room
    });
    const options = {
        method: 'POST',
        // Добавим тело запроса
        body: body,
        headers: {
            "Content-type": "application/json",
            "X-CSRFToken": csrftoken
        }
    }
    // Сделать post запрос
    await fetch(`${host}message_create/`, options)
        .then(response => response.json())
        .then(json => console.log(json))
        .catch(() => { console.log('не удалось создать сообщение') });
}

// Функция открытия соединения websocket
function startWebsocket() {
    const chatSocket = new WebSocket(
        'ws://'
        + window.location.host
        + '/ws/chat_with/'
        + roomName
        + '/'
    );
    console.log('chatSocket', chatSocket)

    // Поведение при открытии соединения
    chatSocket.onopen = function (e) {
        // Получить все сообщения данной комнаты из бд и показать их как историю
        const getMessages = (roomName) => {
            let messages;
            fetch(`${host}message_get/?room=${roomName}`)
                .then((response) => { return response.json(); })
                .then((data) => {
                    messages = data;
                    messages.forEach(element => {
                        let newMessageContent = element
                        // Создать новый div и добавить туда класс
                        let div = document.createElement('div');
                        div.classList.add('chat_log')
                        // Собрать html сообщения и вставить его в div
                        let message = `
                                <div class="name">
                                    <p>${newMessageContent.author}</p>
                                </div>
                                <div class="new_message">
                                    <p>${newMessageContent.message}</p>
                                </div>
                                `
                        div.innerHTML = message
                        // Вставить готовую сборку в поле чата
                        const chat = document.querySelector('.chat')
                        chat.appendChild(div)
                    });
                })
                .catch(() => { console.log('сообщении нет') })
        }
        getMessages(roomName)
    }

    // Поведение при входящем сообщении
    chatSocket.onmessage = function (e) {
        const data = JSON.parse(e.data);
        // Распарсить полученное сообщение
        let newMessageContent = JSON.parse(data.message)
        // Создать новый div и добавить туда класс
        let div = document.createElement('div');
        div.classList.add('chat_log')
        // Собрать html сообщения и вставить его в div
        let message = `
            <div class="name">
                <p>${newMessageContent.name}</p>
            </div>
            <div class="new_message">
                <p>${newMessageContent.message}</p>
            </div>
            `
        div.innerHTML = message
        // Вставить готовую сборку в поле чата
        const chat = document.querySelector('.chat')
        chat.appendChild(div)
    };


    // Поведение при закрытии соединения
    chatSocket.onclose = function (e) {
        console.error('Chat socket closed unexpectedly');
    };

    // Enter работает как отправить сообщение в чат
    document.querySelector('.message').focus();
    document.querySelector('.message').onkeyup = function (e) {
        if (e.keyCode === 13) {  // enter, return
            document.querySelector('.jbtn').click();
        }
    };

    // отправить сообщение на сервер
    document.querySelector('.jbtn').onclick = function (e) {
        const messageInput = document.querySelector('.message');
        let message = messageInput.value;
        chatSocket.send(JSON.stringify({
            'message': message,
            'fake_user': 'bung'
        }));
        // Создать копию сообщения в бд
        createMessage(messageInput.value, roomName)
        messageInput.value = ''; // очистить поле
    };
}

// Пункт 3____________________________________________________________________________________________

// Функция запроса профиля собеседника
const profileData = async () => {
    const currentLocation = window.location.pathname;
    const companion = currentLocation.split('/')[2] //имя собеседника есть в URL
    return await fetch(`${host}get_user/?companion=${companion}`)
        .then((response) => { return response.json(); })
        .then((data) => { return data; })
        .catch(() => { console.log('error') });
}

// Отобразить данные собеседника
async function displayResult() {
    let user;
    await profileData().then(data => user = data);

    document.getElementById("name").textContent = user.name
    document.getElementById("age").textContent = `${user.age} лет`
    document.getElementById("location").textContent = user.location
    document.getElementById("description").textContent = user.description
    let ava;
    if (user.avatar) {
        ava = user.avatar
    } else {
        ava = '/static/img/256x256/256_1.png'
    }
    document.getElementById("ava").src = ava
}

// Собрать все в одну функцию
window.addEventListener('load', () => {
    async function start() {
        await checkRoom(getRoom)
        await displayResult()
        await startWebsocket()
    }

    start()// Выполнить    
})

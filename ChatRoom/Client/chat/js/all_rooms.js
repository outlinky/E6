import { host } from '/static/js/const.js'
import { csrftoken } from '/static/js/const.js'

/*Алгоритм:
1. Сделать запрос на все комнаты и положить их в слайдер по отдельности
2. Организовать слайдер для показа комнат
3. Описать кнопку создания комнаты 
4. Описать кнопку присоединения к комнате
5. Описать кнопку удаления для комнаты*/

window.addEventListener('load', () => {

  let resultNode = document.querySelector('.slaider')
  let myRoom  // переменная для пункта 5

  // Пункт 1, 4_________________________________________________________________________________________

  // Функция запроса за данными авторизованного пользователя
  const profileData = async () => {
    return await fetch(`${host}profile_data/`)
      .then((response) => { return response.json(); })
      .then((data) => { return data; })
      .catch(() => { console.log('error') });
  }

  // Функция запроса всех комнат
  const allRooms = async () => {
    return await fetch(`${host}get_all_rooms/`)
      .then((response) => { return response.json(); })
      .then((data) => { return data; })
      .catch(() => { console.log('error') });
  }


  // Функция показа полученного результата
  async function displayResult(allRooms, profileData) {
    // Получить все комнаты
    let rooms;
    await allRooms().then(data => {
      rooms = data;
      if (rooms.length <= 3) { // если комнат нет или мало, то заполнить слайдер заглушками
        for (i = data.length; i < 3; i++) {
          let card = document.createElement('div');
          card.classList.add('card');
          resultNode.prepend(card);
        };
      }
    });

    // получить авторизованного пользователя
    let user;
    await profileData().then(data => user = data);

    // каждую комнату положить в свою карту
    rooms.forEach(room => {
      let card = document.createElement('div')
      card.classList.add('card')
      card.innerHTML = `
          <h2>Комната пользователя: </h2>
          <div class="owner">
              <img src="${host + room.my_field}" alt="ava" width="120">
              <h2>${room.room}</h2>
          </div>
          <div class="btns">
          <button class="bt enter" type="submit"><a href="${host}common_room/${room.room}/">Войти</a></button>
          </div>
        `
      // если карта принадлежит юзеру, то вставить кнопку удаления     
      if (room.room == user.name) {
        myRoom = user.name
        let delBtn = document.createElement('div')
        delBtn.innerHTML = '<button class="bt delete" type="button">Удалить</button>'
        let child = card.lastElementChild
        child.append(delBtn)
      }

      resultNode.prepend(card); //Вставить результат

      if (myRoom) { // если есть комната юзера, тогда также описать кнопку удаления
        dell(myRoom);
      }
    })
  }

  // Пункт 2_____________________________________________________________________________________________

  async function slaider() {
    // Слайдеру требуется div из displayResult, поэтому нужно ждать ее выполнения
    await displayResult(allRooms, profileData);

    const btnLeft = document.querySelector('.btn_left')
    const btnRight = document.querySelector('.btn_right')

    // Find cards
    const slaider = document.querySelector('.slaider')
    const images = document.querySelectorAll('.card')

    // Calculate image width for step
    const stepSize = images[0].clientWidth

    // Move card
    let counter = 0; // счетчик
    btnRight.addEventListener('click', () => {
      // Если counter равен длине картинок, то обнуляем счетчик.
      if (counter >= images.length - 3) { counter = -1 }
      counter++;
      slaider.style.transform = 'translateX(' + `${-(stepSize) * counter - 10 * counter}px)`;
    })

    btnLeft.addEventListener('click', () => {
      if (counter <= 0) { counter = images.length - 2 }
      counter--;
      slaider.style.transform = 'translateX(' + `${-stepSize * counter - 10 * counter}px)`;
    })
  };

  // Пункт 3___________________________________________________________________________________________

  const createBtn = document.querySelector('.create')
  // Функция создания своей комнаты в бд
  function createRoom() {
    let body = JSON.stringify({
      room: 'roomName', //название комнаты сервер обработает сам, любое значение
      is_common: true // не приватная комната
    });
    const options = {
      method: 'POST',
      // Добавить тело запроса
      body: body,
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken
      }
    }
    // Отправить post запрос серверу
    fetch(`${host}create_common_room/`, options)
      .then(response => response.json())
      .then(json => {
        console.log(json);
        displayResult(allRooms, profileData);
      })
      .catch(() => { alert('Вы уже создали себе публичную комнату') });
  }

  createBtn.addEventListener('click', () => { // повесить обработчик на кнопку
    createRoom()
  })

  // Пункт 4___________________________________________________________________________________________

  // Функция удаления своей комнаты
  function dell(myRoom) {
    let dellBtn = document.querySelector('.delete');

    const deleteRoom = async () => {
      const options = {
        method: 'DELETE',
        headers: {
          "X-CSRFToken": csrftoken
        }
      }
      await fetch(`${host}room_get/?room=${myRoom}`, options)
        .then(response => console.log(response.status))

      window.location.reload(); // после удаления проще перезагрузить страницу для обновления шаблона
    }

    dellBtn.addEventListener('click', () => { //повесить обработчик на кнопку
      deleteRoom()
    });
  }

  slaider(); //пункты 1,2 
})
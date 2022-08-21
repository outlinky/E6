import { host } from '/static/js/const.js'
import { csrftoken } from '/static/js/const.js'


const resultNode = document.querySelector('.profile');
const ava_image = document.getElementById('ava_image')
let image = false // флаг нужен для формирования formData

// обработчик события 'change' (происходит после выбора файла) 
file_attach.addEventListener('change', () => {
  console.log(file_attach.files[0])
  image = true
});

// Функция запроса за данными пользователя
const profileData = async () => {
  return await fetch(`${host}profile_data/`)
    .then((response) => { return response.json(); })
    .then((data) => { return data; })
    .catch(() => { console.log('error') });
}

// Функция показа аватарки пользователя
async function getAvaImage() {
  let profile
  await profileData().then(data => profile = data);
  if (profile.avatar == null) {
    ava_image.src = "/static/img/256x256/256_1.png"
  } else {
    let imgUrl = profile.avatar
    ava_image.src = imgUrl
  }
}

// Функция показа данных пользователя
async function displayResult(profileData) {
  let user;
  await profileData().then(data => user = data);
  let card = `
    <form class="js-form" method="PUT">
        <p><b>Ваш логин:</b><br>
        <input name="name" readonly="readonly" type="text" value="${user.name}" size="40" id="name">
        </p>
        <p><b>Возраст:</b><br>
        <input name="age" id="age" type="text" value="${user.age}" size="40" required placeholder="Только цифры">
        </p>
        <p><b>Локация:</b><br>
        <input name="location" type="text" value="${user.location}" size="40" required>
        </p>
        <p><b>О себе:</b><br>
        <textarea name="description">${user.description}</textarea>
        </p>
        <p><button type="button" class="bt j-btn">Изменить</button></p>
     </form>

  `;
  resultNode.insertAdjacentHTML('beforeend', card)

  // Поле имени можно вводить только латиницей
  document.getElementById('name').addEventListener('keyup', function () {
    this.value = this.value.replace(/[^[a-zA-Z\s]/g, '');
  });

  // Поле имени можно вводить только латиницей
  document.getElementById('age').addEventListener('keyup', function () {
    this.value = this.value.replace(/[^0-9+]/g, '');
  });

  //Получить аватарку
  getAvaImage()
};

// Функция отправки измененных данных профиля
async function sendNewData() {
  const img_attach = document.getElementById('file_attach')
  const form = document.querySelector('.js-form');

  // Настроить запрос
  const formData = new FormData();
  formData.append('name', form.name.value,);
  formData.append('description', form.description.value,);
  formData.append('location', form.location.value,);
  formData.append('age', form.age.value,);
  if (image) {
    formData.append('avatar', img_attach.files[0]);
    image = false
  }

  const options = {
    method: 'PUT',
    body: formData,
    headers: {
      "X-CSRFToken": csrftoken
    }
  }
  // Сделать запрос
  await fetch('http://127.0.0.1:8000/profile_update/', options)
    .then(response => response.json())
    .then(json => {
      console.log('json', json)
      // Вывод уведомления после успешного запроса
      const elem = document.querySelector('.title');
      let alert1 = document.createElement('div');
      alert1.classList.add('toast', 'toast_show')
      alert1.innerHTML = `<h3>Успешно сохранено</h3>`;
      elem.after(alert1)

      setTimeout(() => { // удалить сообщение
        alert1.classList.remove('toast_show');
      }, 4000)
    })
    .catch(() => { console.error(response) });

  getAvaImage() // Обновить аватарку
}

// обработчик на кнопку 'изменить'
async function editProfile() {
  const btn = document.querySelector('.j-btn');

  btn.addEventListener('click', () => {
    sendNewData() // отправить данные


  })
}

// Собрать все в одну функцию
window.addEventListener('load', () => {
  async function start() {
    await displayResult(profileData)
    await editProfile()
  }

  start()// Выполнить    
})
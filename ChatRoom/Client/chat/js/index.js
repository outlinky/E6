
import { host } from '/static/js/const.js'


// Функция запроса за данными пользователя, возвращает массив объектов с данными пользователей
const allProfileData = async () => {
    return await fetch(`${host}all_users/`)
        .then((response) => { return response.json(); })
        .then((data) => { return data; })
        .catch(() => { console.log('error') });
    }


// Функция показа полученного результата
async function displayResult(allProfileData) {
    let arr;
    await allProfileData().then(data => arr = data);

    // Каждого пользователя положить в свою карточку и вставить в шаблон
    await arr.forEach(user => {
        let card = document.createElement('div');
        card.innerHTML = `
        <div class="user_card">
        <div class="image">
            <img src="${user.avatar}" width="50" alt="avatar" id="ava">
        </div>
        <div>
            <a href="${host}chat_with/${user.name}/"><h3>${user.name}</h3></a>           
        </div>
        </div><hr>
        `;
        
        // Найти нод для вставки результата запроса
        const resultNode = document.querySelector('.users');
        resultNode.appendChild(card);   
        });
    }


window.addEventListener('load', () => {
    displayResult(allProfileData) // Выполнить
})
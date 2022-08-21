// тестовый файл, не участвует в проекте
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  
var csrftoken = getCookie('csrftoken');
/*___________________________________________________________________________*/

const btn = document.querySelector('.btn');
const form = document.querySelector('.js-form');
const btn_test = document.querySelector('.btn_test');
const file_attach  = document.getElementById('file_attach');

/*___________________________________________________________________________*/
btn.addEventListener('click', () => {
    // Настраиваем запрос

    const formData = new FormData();
    formData.append('text', form.text.value);
    formData.append('img', file_attach.files[0]);
    const options = {
      // метод PUT
      method: 'POST',
      // Добавим тело запроса
      body: formData,
      headers: {
        "X-CSRFToken": csrftoken
      }
    }

    // Делаем запрос за данными
    fetch('http://127.0.0.1:8000/photo_create/', options)
      .then(response => response.json())
      .then(json => console.log(json))
})
/*___________________________________________________________________________*/


// обработчик события 'change' (происходит после выбора файла) 
file_attach.addEventListener('change', () => {
    console.log(file_attach.files[0])
});

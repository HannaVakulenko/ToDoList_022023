import { v4 as uuidv4 } from 'uuid'; //додавання бібліотеки створення ідентифікаторів
import * as basicLightbox from 'basicLightbox'; //додавання бібліотеки для створення модалки
import 'basiclightbox/dist/basicLightbox.min.css'; //додавання бібліотеки стилів для створення модалки
import './styles.css';

//Шаблонізатор документу. Для чекбоксу використали умову через тернарний оператор, якщо присутній/відсутній checked
const getTodo = ({ id, value, checked }) => `
    <li data-id=${id}>
        <input data-action="check" type="checkbox" ${
          checked ? 'checked' : ''
        } />
        <span>${value}</span>
        <button data-action="delete">x</button>
        <button data-action="view">view</button>
    </li>`;

const modal = basicLightbox.create(
  `
  <div class="modal">
    <h4 class="title">Lorem ipsum</h4>
    <p class="text">test modal text</p>
    <button>ok</button>
  </div>
`,
); //шаблон для створення модалки на view

const refs = {
  form: document.querySelector('.form'),
  list: document.querySelector('.todo-list'),
  modalButton: modal.element().querySelector('button'),
}; //отримання посилань на елементи в документі

let todos = [
  { id: '1', value: 'lorem ipsum 1', checked: true },
  { id: '2', value: 'lorem ipsum 2', checked: false },
]; // створення массиву об'єктів елементів списку на початку

const render = () => {
  const itemList = todos.map(todo => getTodo(todo)).join('');

  refs.list.innerHTML = ''; //очищає список
  refs.list.insertAdjacentHTML('beforeend', itemList); //додає в документ розмітку нового елемента
};

const loadTodos = () => {
  try {
    todos = JSON.parse(localStorage.getItem('todos')) || []; //дістає дані рядком і парсить їх в JS об'єкт, якщо не знайде дані запише пустий масив
    //throw new Error('loddsad');
  } catch (error) {
    console.log('error happened', error.message);
    todos = []; //при знайденій помилці запише пустий масив
  }
}; //функція завантажує дані зі сховища на старті

const saveTodos = () => {
  localStorage.setItem('todos', JSON.stringify(todos)); //функція зберігає дані в сховище у вигляді рядку
};

const handleSubmit = event => {
  const input = event.target.elements.text; //змінна для текстового поля інпуту
  const { value } = input; //деструктуризація значення
  const newTodo = { id: uuidv4(), value, checked: false }; //створення нового об'єту,
  // де через бібліотеку uuid генереється унікальний ідентефікатор,
  // записується з текстового поля інпуту одноіменні ключ / значення та властивість чекбоксу

  event.preventDefault(); //відміняє перезавантаження сторінки за замовчуванням при події сабміт
  todos.push(newTodo); //пушить створений об'єкт в масив
  input.value = ''; //очищає поле інпуту після додавання об'єкту в массив

  saveTodos(); //функція зберігає дані в сховище
  render(); //функція рендерить новій елемент в списку
};

const deleteTodo = id => {
  todos = todos.filter(todo => todo.id !== id); //повертає тільки ті елементи де id елементу, на який кликнули по кнопкам

  saveTodos(); //функція зберігає дані в сховище
  render(); //рендер розмітки після видалення елемнтів
}; //функція видаляє елемент списку по кліку на кнопку "х"

const viewTodo = id => {
  const title = modal.element().querySelector('.title');
  const text = modal.element().querySelector('.text'); //modal.element() повертає наш лайтбокс, з нього ми відшукуємо елемент з классом
  text.textContent = id;
  modal.show();
}; //функція показує деталі елементу списку

const toggleCheckbox = id => {
  todos = todos.map(
    item =>
      item.id === id
        ? {
            ...item, //розпиляє попередній об'єкт
            checked: !item.checked, //та змінює стан checked на протилежний
          }
        : item, // або залишає елемент не зміненим
  );

  saveTodos(); //функція зберігає дані в сховище
  render(); //рендер розмітки після видалення елемнтів
}; //перебираємо масив, якщо якщо ід елемента дорівнює ід, то додаємо новий об'єкт та записуємо в нього нові дані, в інакшому випадку залишаєм елемент

//функція виясняє місце кліку і визначає ідентифікатор
const handleTodoClick = event => {
  const { action } = event.target.dataset; //визначає елементи з датасетами data-action="delete" data-action="view"
  const parent = event.target.closest('li'); //визначає найвищий батьківський елемент таргету
  const { id } = parent?.dataset || {}; //визначає значення ід. Якщо не знайдений елемент списку, повертає пустий об'єкт

  switch (action) {
    case 'delete':
      deleteTodo(id); //аргументом функції видалення буде id
      break;

    case 'view':
      viewTodo(id); //аргументом функції показу деталів буде id
      break;

    case 'check':
      toggleCheckbox(id); //аргументом функції показу деталів буде id
      break;
  }
};

loadTodos(); //функція завантажує дані зі сховища на старті перед першим рендером
render(); //функція рендерить елементи в списку при старті

refs.form.addEventListener('submit', handleSubmit); //слухач на клік сабміт
refs.list.addEventListener('click', handleTodoClick); //слухач на клік
refs.modalButton.addEventListener('click', modal.close);
// window.addEventListener('keydown', () => {
//   if (modal.visible()) {
//     modal.close();
//   }
// });

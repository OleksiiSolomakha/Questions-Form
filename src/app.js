import {Question} from './questions';
import { isValid, createModalWindow } from './utils';
import './styles.css'
import { getAuthForm, authWithEmailAndPassword } from './auth';

const form = document.querySelector('#form');
const input = form.querySelector('#question-input');
const askBtn = form.querySelector('#ask-btn');
const allBtn = document.querySelector('#all-btn');

window.addEventListener('load', Question.renderList);
form.addEventListener('submit', submitFormHandler);
allBtn.addEventListener('click', openModalWindow);
input.addEventListener('input', () => {
  askBtn.disabled = !isValid(input.value);
})

function submitFormHandler(event){
  event.preventDefault();

  if (isValid(input.value)){
    const question = {
      text: input.value.trim(),
      date: new Date().toJSON()
    }

    askBtn.disabled = true;
    Question.create(question).then(()=> {
       input.value = '';
       input.className = '';
       askBtn.disabled = false;
    });
  }
}

function openModalWindow() {
  createModalWindow('Authorization', getAuthForm());
  document
  .querySelector('#auth-form')
  .addEventListener('submit', authFormHandler, {once: true})
}

function authFormHandler(event) {
  event.preventDefault();

  const btn = event.target.querySelector('button');
  const email = event.target.querySelector('#email').value;
  const password = event.target.querySelector('#password').value;

  btn.disabled = true;
  authWithEmailAndPassword(email, password)
  .then(token => {
    return Question.fetch(token);
  })
  .then(renderModalErr)
  .then(() => btn.disabled = false)
  
}

function renderModalErr(content) {
  if(typeof content === 'string'){
    createModalWindow('Error', content);
  } else {
    createModalWindow('Questions list', Question.listToHtml(content))
  }  
}
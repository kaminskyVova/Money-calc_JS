'use strict';

// random generate id for object 
const generateId = () => {
  return `genId${Math.round(Math.random() * 1e8).toString(16)}`;
};


// getting items from a HTML DOM
const totalBalance = document.querySelector('.total__balance'),
  totalMoneyIncome = document.querySelector('.total__money-income'),
  totalMoneyExpenses = document.querySelector('.total__money-expenses'),
  historyList = document.querySelector('.history__list'),
  form = document.getElementById('form'),
  operationName = document.querySelector('.operation__name'),
  operationAmount = document.querySelector('.operation__amount');


// create Array for push data-base
// if have data ==> array else array = [];
let dbOperation = JSON.parse(localStorage.getItem('calc')) || [];


// Send to localStorage
// if (localStorage.getItem('calc')) {
//   dbOperation = JSON.parse(localStorage.getItem('calc'));
// }


// create new elements in html 
const renderOperation = (operation) => {
  const className = operation.amount < 0 ?
    'history__item-minus' :
    'history__item-plus';

  const listItem = document.createElement('li');

  listItem.classList.add('history__item');
  listItem.classList.add(className);

  listItem.innerHTML = `${operation.description}
      <span class="history__money">${operation.amount} $</span>
      <button class="history_delete" data-id="${operation.id}">x</button>
    `;

  historyList.append(listItem);
};


// calculating the remainder
const updateBalance = () => {
  const resultIncome = dbOperation
    .filter((item) => item.amount > 0)
    .reduce((result, item) => result + item.amount, 0);

  const resultExpenses = dbOperation
    .filter((item) => item.amount < 0)
    .reduce((result, item) => result + item.amount, 0);

  totalMoneyIncome.textContent = resultIncome + ' $';
  totalMoneyExpenses.textContent = resultExpenses + ' $';
  totalBalance.textContent = (resultIncome + resultExpenses) + ' $';
};


// add income expense item
const addOperation = (event) => {
  event.preventDefault();

  const operationNameValue = operationName.value,
    operationAmountValue = operationAmount.value;

  operationName.style.borderColor = '';
  operationAmount.style.borderColor = '';

  if (operationNameValue && operationAmountValue) {
    const operation = {
      id: generateId(),
      description: operationNameValue,
      amount: +operationAmountValue,
    };
    dbOperation.push(operation);
    init();
  } else {
    if (!operationNameValue) operationName.style.borderColor = 'red';
    if (!operationAmountValue) operationAmount.style.borderColor = 'red';
  }

  operationName.value = '';
  operationAmount.value = '';
};


// удаляет статью расходов доходов со страницы 
const deleteOperation = (event) => {
  let target = event.target;
  // console.log(target)

  if (target.classList.contains('history_delete')) {
    dbOperation = dbOperation
      .filter(operation => operation.id !== target.dataset.id);
    init();
  }

};

historyList.addEventListener('click', deleteOperation);

const init = () => {
  historyList.textContent = '';
  dbOperation.forEach((renderOperation));
  updateBalance();
  localStorage.setItem('calc', JSON.stringify(dbOperation));

  // for (let i = 0; i < dbOperation.length; i++) {
  //   renderOperation(dbOperation[i]);
  // }

};

form.addEventListener('submit', addOperation);

init();
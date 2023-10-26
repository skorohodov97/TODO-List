
const task = {
  NUMBER: 10, //отрисовываемые задачи
  count: 100, // новые задачи
}


//Получение задач и пользователей с сервера.
async function getListTasks() {
  try {
    let request = await fetch('https://jsonplaceholder.typicode.com/todos');
    let result = await request.json();
    for (let i=0; i < task.NUMBER; i++) {
      result[i].user = 'Leanne Graham';
      visualization(result[i]);
    }
  }
  catch (error) {
    alert('List of tasks don`t loaded!');
  }
}
//Отрисовать задачи на странице.
function visualization(newTaskJson) {    
  const icon = document.createElement("i");
  if (newTaskJson.completed) {
    icon.innerText = 'check_box';
  } else icon.innerText = 'check_box_outline_blank';
  icon.className = 'material-icons';
  icon.style.float = 'left';
  icon.style.marginRight = '10px';
  icon.style.color = 'blue';
  icon.onclick = async function () {    
    let request = await checkBox(newTaskJson);
    if (request) {
        newTaskJson.completed = request.completed; 
        if (newTaskJson.completed) {
            icon.innerText = 'check_box';
        } else {
            icon.innerText = 'check_box_outline_blank';
        }
    }
  } 

  const x = document.createElement("div")
  x.className = 'material-icons';
  x.innerText = 'close';
  x.style.float = 'right';
  x.style.color = 'red'; 
  x.onclick = async function () {   
    let request = await deleteTask(newTaskJson);
    if (request === 0) return;
    else {      
      el.removeChild(icon);
      el.removeChild(x);
      list.removeChild(el);
    }  
  }

  const text = document.createElement("p");
  text.innerText = newTaskJson.title + ' by ' + newTaskJson.user;
  text.style.marginLeft = '34px';
  text.style.maxWidth = '430px'

  const el = document.createElement("li"); 
  el.appendChild(icon);
  el.appendChild(x);
  el.appendChild(text);

  const list = document.getElementById('todo-list');
  list.prepend(el);
  task.count++;
}
//Добавить пользователей в выпадающий список.
function getListUser() {     
  let users = document.getElementById('user-todo');
  fetch('https://jsonplaceholder.typicode.com/users')
  .then(function(result) {
    return result.json();
  })
  .then(function(usersJson) {
    usersJson.forEach(element => {
      let el = document.createElement('option');
      el.innerText = element.name;
      users.appendChild(el);
    });
  })
}

// Логика добавление задачи.
function addTasks() {      
  let input = document.querySelector('input');
  const button = document.querySelector('button');
  let select = document.querySelector('select');
  button.onclick = function () {
    if (input.value !== '' && select.value !== 'select user') {
      fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        body: JSON.stringify({
          userId: 1,
          id: task.count,
          title: input.value,
          complited: false,
          user: select.value
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      .then(function (result) {
        return result.json();
      })
      .then(function (newTaskJson) {
        input.value = '';
        select.value = 'select user';
        visualization(newTaskJson);            
      })
      .catch(function(error) {
        alert('Task not added!')            
      })
    }
  }
}
//Логика изменения статуса.
async function checkBox(TaskJson) {
  let status;
  (TaskJson.completed === true) ? status = false : status = true;

  try {
    let response = await fetch('https://jsonplaceholder.typicode.com/todos/'+TaskJson.id, {
    method: 'PATCH',
    body: JSON.stringify({
      userId: TaskJson.userId,
      id: TaskJson.id,
      title: TaskJson.title,
      completed: status,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
    });

    let result = await response.json();
    if (result.completed === status) {
      return result;
    } 
  }
  catch {
    alert('Task don`t changed status!');
  }
}
// Логика удаления.
async function deleteTask(TaskJson) {
  try {
    let response = await fetch('https://jsonplaceholder.typicode.com/todos/'+TaskJson.id, {
      method: 'DELETE',
    });

    let result = await response.json();
    if (empty(result)) {
      return result;
    } else return 0;
  }
  catch {
    alert('Task don`t deleted!');
    return 0;
  }
}
function empty(obj) {
  for (let key in obj) {
    return false;
  }
  return true;
}


getListUser();
getListTasks();
addTasks();
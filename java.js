const dateNumber = document.getElementById('dateNumber');
const dateText = document.getElementById('dateText');
const dateMonth = document.getElementById('dateMonth');
const dateYear = document.getElementById('dateYear');
const tasksContainer = document.getElementById('tasksContainer');

const setDate = () => {
    const date = new Date();
    dateNumber.textContent = date.toLocaleString('es', { day: 'numeric' });
    dateText.textContent = date.toLocaleString('es', { weekday: 'long' });
    dateMonth.textContent = date.toLocaleString('es', { month: 'short' });
    dateYear.textContent = date.toLocaleString('es', { year: 'numeric' });
};

const addNewTask = event => {
    event.preventDefault();
    const { value } = event.target.taskText;
    if (!value) return;
    const task = createTaskElement(value);
    tasksContainer.prepend(task);
    saveTasksToLocalStorage();
    event.target.reset();
};

const createTaskElement = (description, done = false) => {
    const taskElement = document.createElement('div');
    taskElement.textContent = description;
    taskElement.classList.add('task', 'roundBorder');
    if (done) {
        taskElement.classList.add('done');
    }
    taskElement.addEventListener('click', changeTaskState);
    return taskElement;
};

const changeTaskState = event => {
    event.target.classList.toggle('done');
    saveTasksToLocalStorage();
};

const saveTasksToLocalStorage = () => {
    const tasks = [];
    tasksContainer.childNodes.forEach(taskElement => {
        const description = taskElement.textContent;
        const done = taskElement.classList.contains('done');
        tasks.push({ description, done });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

const loadTasksFromLocalStorage = () => {
    const tasksData = JSON.parse(localStorage.getItem('tasks')) || [];
    tasksData.forEach(task => {
        const taskElement = createTaskElement(task.description, task.done);
        tasksContainer.appendChild(taskElement);
    });
};

const orderTasks = () => {
    const done = [];
    const toDo = [];
    tasksContainer.childNodes.forEach(el => {
        el.classList.contains('done') ? done.push(el) : toDo.push(el);
    });
    return [...toDo, ...done];
};

const renderOrderedTasks = () => {
    const orderedTasks = orderTasks();
    tasksContainer.innerHTML = '';
    orderedTasks.forEach(task => tasksContainer.appendChild(task));
};

const fetchQuote = async () => {
    try {
        const response = await fetch('http://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        return data.quoteText;
    } catch (error) {
        console.error('Error fetching quote:', error.message);
    }
};

const displayQuote = async () => {
    const quoteContainer = document.getElementById('quoteContainer');
    const quote = await fetchQuote();
    if (quote) {
        quoteContainer.textContent = quote;
    }
};

document.getElementById('addTaskForm').addEventListener('submit', addNewTask);

setDate();
loadTasksFromLocalStorage();
displayQuote();

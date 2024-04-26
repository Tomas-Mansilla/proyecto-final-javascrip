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
    const task = document.createElement('div');
    task.classList.add('task', 'roundBorder');
    task.textContent = value;
    task.addEventListener('click', changeTaskState);
    tasksContainer.prepend(task);
    event.target.reset();
};


const changeTaskState = event => {
    event.target.classList.toggle('done');
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


const loadTasksFromJSON = async () => {
    try {
        const response = await fetch('tasks.json');
        const tasksData = await response.json();
        tasksData.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.textContent = task.description;
            if (task.done) {
                taskElement.classList.add('task', 'roundBorder', 'done');
            } else {
                taskElement.classList.add('task', 'roundBorder');
            }
            taskElement.addEventListener('click', changeTaskState);
            tasksContainer.appendChild(taskElement);
        });
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
};


document.getElementById('addTaskForm').addEventListener('submit', addNewTask);


setDate();
loadTasksFromJSON();
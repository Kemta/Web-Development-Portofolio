class Task {
    constructor(text) {
        this.text = text;
        this.done = false;
    }
}

let tasks = [];
const input = document.getElementById('taskInput');
const list = document.getElementById('list');
const addButton = document.getElementById('addButton');
addButton.onclick = addTask;
function addTask() {
    let text = input.value;   
    tasks.push(new Task(text));
    input.value = '';
    showTasks();
}
function toggleTask(index) {
    tasks[index].done = !tasks[index].done;
    showTasks();
}
function deleteTask(index) {
    tasks.splice(index, 1);
    showTasks();
}
function showTasks() {
    list.innerHTML = '';
    for (let i = 0; i < tasks.length; i++) {
        let t = tasks[i];
        let li = document.createElement('li');
        if (t.done) li.classList.add('done');
        li.innerHTML = `<span onclick="toggleTask(${i})">${t.text}</span>
            <button class="delete-btn" onclick="deleteTask(${i})">x</button>`;
        list.appendChild(li);
    }
}

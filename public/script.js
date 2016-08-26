var taskName = document.getElementById('task-name');
var taskNameEditor = document.getElementById('task-name-editor');


function showTaskNameEditor() {
  taskName.style.display = 'none';
  taskNameEditor.style.display = 'block';
}

taskNameEditor.onkeypress = function (event) {
  if (event.keyCode === 13) {
    taskNameEditor.style.display = 'none';
    taskName.textContent = taskNameEditor.value;
    taskName.style.display = 'block';
  }
};

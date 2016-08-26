var taskName = document.getElementById('task-name');
var taskNameEditor = document.getElementById('task-name-editor');

taskName.onclick = function (event) {
  taskName.style.display = 'none';
  taskNameEditor.style.display = 'block';
  taskNameEditor.focus();

  // Put cursor at the end
  var value = taskNameEditor.value;
  taskNameEditor.setSelectionRange(value.length, value.length);
}

taskNameEditor.onkeydown = function (event) {
  console.log(event.key);
  if (event.key === 'Enter') {
    taskNameEditor.style.display = 'none';
    taskName.textContent = taskNameEditor.value;
    taskName.style.display = 'block';
  }
  if (event.key === 'Escape') {
    taskNameEditor.style.display = 'none';
    taskName.style.display = 'block';
  }
};

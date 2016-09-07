var containers = document.getElementsByClassName('container');
var i;
var tasksElements = [];
for (i = 0; i < containers.length; i++) {
  var taskName = document.getElementsByClassName('task-name')[i];
  var taskNameEditor = document.getElementsByClassName('task-name-editor')[i];
  var stateEditor = document.getElementsByClassName('state-editor')[i];
  var state = document.getElementsByClassName('state')[i];
  var nextSteps = document.getElementsByClassName('next-steps')[i];
  var nextStepsEditor = document.getElementsByClassName('next-steps-editor')[i];
  tasksElements[i] = {
    taskName: taskName,
    taskNameEditor: taskNameEditor,
    state: state,
    stateEditor: stateEditor,
    nextSteps: nextSteps,
    nextStepsEditor: nextStepsEditor
  }
  connectLabelWithEditor(taskName, taskNameEditor);
  connectLabelWithEditor(state, stateEditor);
  connectLabelWithEditor(nextSteps, nextStepsEditor);
  taskNameEditor.addEventListener('keydown', blurAndClick(taskNameEditor, state));
  stateEditor.addEventListener('keydown', blurAndClick(stateEditor, nextSteps));
}

function blurAndClick(elementToBlur, elementToClick) {
  return function (event) {
    if (event.key === 'Tab') {
      elementToBlur.blur();
      setTimeout(function () {
        elementToClick.click();
      }, 100);
    }
  }
}

var reminder = document.getElementById('reminder');
var linkToHideReminder = document.getElementById('link-to-hide-reminder');
linkToHideReminder.onclick = setShowReminder(false);
var linkToShowReminder = document.getElementById('link-to-show-reminder');
linkToShowReminder.onclick = setShowReminder(true);

function connectLabelWithEditor (label, editor) {
  label.onclick = function (event) {
    // Hide label and show editor
    editor.style.height = label.offsetHeight + 'px';
    editor.style.width = label.offsetWidth + 'px';
    label.style.display = 'none';
    editor.style.display = 'block';
    editor.focus();

    // Put cursor at the end
    var value = editor.value;
    editor.setSelectionRange(value.length, value.length);
  }

  editor.onkeydown = function (event) {
    console.log(event.key);
    if (event.key === 'Enter') {
      saveAndExitEditMode();
    }
    if (event.key === 'Escape') {
      // Remove the onblur callback, otherwise we will save.
      editor.onblur = function () {};
      exitEditMode();
    }
  };

  editor.onblur = saveAndExitEditMode;

  function saveAndExitEditMode() {
    label.textContent = editor.value; // Optimistically update UI
    exitEditMode();
    var xhr = new XMLHttpRequest();
    xhr.open('POST', window.location.pathname, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var savedTasks = JSON.parse(xhr.responseText).tasks;
        // Re-render tasks
        var i;
        for (i = 0; i < savedTasks.length; i++) {
          tasksElements[i].taskName.textContent = savedTasks[i].name;
          tasksElements[i].state.textContent = savedTasks[i].state;
          tasksElements[i].nextSteps.textContent = savedTasks[i].nextSteps;
        }
      }
    };
    xhr.setRequestHeader('Content-Type', 'application/json');
    var tasks = [];
    var i;
    for (i = 0; i < tasksElements.length; i++) {
      tasks[i] = {
        name: tasksElements[i].taskName.textContent,
        state: tasksElements[i].state.textContent,
        nextSteps: tasksElements[i].nextSteps.textContent
      }
    }
    // Send all tasks to DB to be saved
    xhr.send(JSON.stringify({updatedTasks: tasks}));
  }

  function exitEditMode() {
    editor.style.display = 'none';
    label.style.display = 'block';
  }
}

function setShowReminder(showReminder) {
  return function () {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', window.location.pathname, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        reminder.style.visibility = showReminder ? 'visible' : 'hidden'; // Optimistically show/hide reminder
      }
    };
    xhr.setRequestHeader('Content-Type', 'application/json');
    var tasks = [];
    var i;
    for (i = 0; i < tasksElements.length; i++) {
      tasks[i] = {
        name: tasksElements[i].taskName.textContent,
        state: tasksElements[i].state.textContent,
        nextSteps: tasksElements[i].nextSteps.textContent
      }
    }
    // Send entire task to DB to be saved
    xhr.send(JSON.stringify({updatedTasks: tasks, showReminder: showReminder}));
  }
}

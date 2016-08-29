var taskName = document.getElementById('task-name');
var taskNameEditor = document.getElementById('task-name-editor');
var state = document.getElementById('state');
var stateEditor = document.getElementById('state-editor');
var nextSteps = document.getElementById('next-steps');
var nextStepsEditor = document.getElementById('next-steps-editor');

connectLabelWithEditor(taskName, taskNameEditor);
connectLabelWithEditor(state, stateEditor);
connectLabelWithEditor(nextSteps, nextStepsEditor);

function connectLabelWithEditor (label, editor) {
  label.onclick = function (event) {
    // Hide label and show editor
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
      // Remove the onblur callback, otherwiwe we will save. 
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
        console.info('Task \'saved\'.');
        var savedTask = JSON.parse(xhr.responseText);
        console.dir(savedTask);
        // Re-render task
        taskName.textContent = savedTask.name;
        state.textContent = savedTask.state;
        nextSteps.textContent = savedTask.nextSteps;
      }
    };
    xhr.setRequestHeader('Content-Type', 'application/json');
    var task = {
      name: taskName.textContent,
      state: state.textContent,
      nextSteps: nextSteps.textContent
    };
    // Send entire task to DB to be saved
    xhr.send(JSON.stringify({updatedTask: task}));
  }

  function exitEditMode() {
    editor.style.display = 'none';
    label.style.display = 'block';
  }
}

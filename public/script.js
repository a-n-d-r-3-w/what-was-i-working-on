var taskName = document.getElementById('task-name');
var taskNameEditor = document.getElementById('task-name-editor');
var state = document.getElementById('state');
var stateEditor = document.getElementById('state-editor');

connectLabelWithEditor(taskName, taskNameEditor);
connectLabelWithEditor(state, stateEditor);

function connectLabelWithEditor (label, editor) {
  label.onclick = function (event) {
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
      label.textContent = editor.value; // Optimistically update UI
      exitEditMode();
      var xhr = new XMLHttpRequest();
      xhr.open('POST', window.location.pathname, true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
          console.info('Task \'saved\'.');
          var responseAsJson = JSON.parse(xhr.responseText);
          var savedTask = responseAsJson.updatedTask;
          // Re-render task
          taskName.textContent = savedTask.name;
          state.textContent = savedTask.state;
        }
      };
      xhr.setRequestHeader('Content-Type', 'application/json');
      var task = {
        name: taskName.textContent,
        state: state.textContent,
        nextSteps: [
          'Step 1',
          'Step 2'
        ]
      };
      // Send entire task to DB to be saved
      xhr.send(JSON.stringify({updatedTask: task}));
    }
    if (event.key === 'Escape') {
      exitEditMode();
    }
  };

  editor.onblur = function (event) {
    exitEditMode();
  }

  function exitEditMode() {
    editor.style.display = 'none';
    label.style.display = 'block';
  }
}

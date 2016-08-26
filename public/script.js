var taskName = document.getElementById('task-name');
var taskNameEditor = document.getElementById('task-name-editor');
var state = document.getElementById('state');
var stateEditor = document.getElementById('state-editor');

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
      label.textContent = editor.value;
      exitEditMode();
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

connectLabelWithEditor(taskName, taskNameEditor);
connectLabelWithEditor(state, stateEditor);

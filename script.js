const canvas = new fabric.Canvas('mainCanvas');
const previewCanvas = new fabric.StaticCanvas('previewCanvas');
const toolbar = document.getElementById('toolbar');
const deleteBtn = document.getElementById('deleteBtn');
const copyBtn = document.getElementById('copyBtn');
const forwardBtn = document.getElementById('forwardBtn');
const backwardBtn = document.getElementById('backwardBtn');
const colorPicker = document.getElementById('colorPicker');
const layerList = document.getElementById('layerList');



// Update Layers
function updateLayers() {
  layerList.innerHTML = '';
  canvas.getObjects().forEach((obj, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${obj.type} ${index + 1}`;
    listItem.addEventListener('click', () => {
      canvas.setActiveObject(obj);
      canvas.renderAll();
    });
    layerList.appendChild(listItem);
  });
}

// Add Text
document.getElementById('addTextBtn').addEventListener('click', () => {
  const text = new fabric.Textbox('Enter Text', {
    left: 50,
    top: 50,
    fontSize: 24,
    fill: colorPicker.value,
  });
  canvas.add(text);
  canvas.setActiveObject(text);
  updateLayers();
  updatePreview();
});

// Upload Image
document.getElementById('uploadImageBtn').addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = (e) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      fabric.Image.fromURL(event.target.result, (img) => {
        img.scaleToWidth(200);
        canvas.add(img);
        canvas.setActiveObject(img);
        updateLayers();
        updatePreview();
      });
    };
    reader.readAsDataURL(e.target.files[0]);
  };
  input.click();
});

// Toolbar Visibility
canvas.on('selection:created', (e) => {
  showToolbar(canvas.getActiveObject());
});
canvas.on('selection:updated', (e) => {
  showToolbar(canvas.getActiveObject());
});
canvas.on('selection:cleared', hideToolbar);

function showToolbar(activeObject) {
  if (!activeObject) return;
  const bounds = activeObject.getBoundingRect();
  const canvasOffset = canvas._offset || { left: 0, top: 0 };

  toolbar.style.left = `${bounds.left + canvasOffset.left}px`;
  toolbar.style.top = `${bounds.top - 50 + canvasOffset.top}px`;
  toolbar.style.display = 'flex';
}

function hideToolbar() {
  toolbar.style.display = 'none';
}

// Toolbar Actions
deleteBtn.addEventListener('click', () => {
  const activeObject = canvas.getActiveObject();
  if (activeObject) {
    canvas.remove(activeObject);
    hideToolbar();
    updateLayers();
    updatePreview();
  }
});

copyBtn.addEventListener('click', () => {
  const activeObject = canvas.getActiveObject();
  if (activeObject) {
    activeObject.clone((cloned) => {
      cloned.left += 20;
      cloned.top += 20;
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      updateLayers();
      updatePreview();
    });
  }
});

forwardBtn.addEventListener('click', () => {
  const activeObject = canvas.getActiveObject();
  if (activeObject) {
    canvas.bringForward(activeObject);
    updateLayers();
    updatePreview();
  }
});

backwardBtn.addEventListener('click', () => {
  const activeObject = canvas.getActiveObject();
  if (activeObject) {
    canvas.sendBackwards(activeObject);
    updateLayers();
    updatePreview();
  }
});


// Real-time Text Edit
canvas.on('object:modified', updatePreview);
canvas.on('text:changed', updatePreview);


// Real-time Color Update
colorPicker.addEventListener('input', () => {
  const activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === 'textbox') {
    activeObject.set('fill', colorPicker.value);
    canvas.renderAll();
    updatePreview();
  }
});

// Real-time Preview Alignment
function updatePreview() {
  previewCanvas.clear();
  canvas.getObjects().forEach((obj) => {
    const clone = fabric.util.object.clone(obj);
    previewCanvas.add(clone);
  });
  previewCanvas.renderAll();
}

function updatePreview() {
  previewCanvas.clear();
  canvas.getObjects().forEach((obj) => {
    previewCanvas.add(fabric.util.object.clone(obj));
  });
  previewCanvas.renderAll();
}


// Add Fonts Option
document.getElementById('textFontBtn').addEventListener('click', () => {
  const activeObject = canvas.getActiveObject();

  if (activeObject && activeObject.type === 'textbox') {
    // Show a predefined list of fonts
    const availableFonts = ['Arial', 'Times New Roman', 'Georgia', 'Courier New', 'Verdana'];
    const fontPrompt = `Choose a font:\n${availableFonts.map((font, index) => `${index + 1}: ${font}`).join('\n')}`;

    // Prompt the user to pick a font
    const fontChoice = parseInt(prompt(fontPrompt, '1'), 10);

    if (fontChoice > 0 && fontChoice <= availableFonts.length) {
      activeObject.set('fontFamily', availableFonts[fontChoice - 1]);
      canvas.renderAll();
      updatePreview();
    } else {
      alert('Invalid font choice. Please try again.');
    }
  } else {
    alert('Please select a text object to change the font.');
  }
});


// Update Layers
function updateLayers() {
  layerList.innerHTML = '';
  canvas.getObjects().forEach((obj, index) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `${obj.type} ${index + 1} <i class="fas fa-pencil-alt editLayer"></i>`;
    listItem.querySelector('.editLayer').addEventListener('click', () => {
      canvas.setActiveObject(obj);
      showToolbar(obj);
    });
    layerList.appendChild(listItem);
  });
}



// Other functions (addText, uploadImage, toolbar actions, real-time preview, etc.)
// Copy-paste all these from the previous JavaScript, with `updateLayers()` where needed.


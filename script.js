const htmlTextarea = document.getElementById('html-code');
const cssTextarea = document.getElementById('css-code');
const jsTextarea = document.getElementById('js-code');
const previewFrame = document.getElementById('preview');
const themeSelect = document.getElementById('theme');
const fontSizeRange = document.getElementById('fontSize');
const runButton = document.getElementById('run-button');
const saveButton = document.getElementById('save-button');

let htmlEditor = CodeMirror.fromTextArea(htmlTextarea, {
  mode: "htmlmixed",
  lineNumbers: true,
  theme: "default"
});

let cssEditor = CodeMirror.fromTextArea(cssTextarea, {
  mode: "css",
  lineNumbers: true,
  theme: "default"
});

let jsEditor = CodeMirror.fromTextArea(jsTextarea, {
  mode: "javascript",
  lineNumbers: true,
  theme: "default"
});

function updatePreview() {
  const htmlCode = htmlEditor.getValue();
  const cssCode = `<style>${cssEditor.getValue()}</style>`;
  const jsCode = `<script>${jsEditor.getValue()}<\/script>`;
  const combinedCode = htmlCode + cssCode + jsCode;

  const doc = previewFrame.contentDocument || previewFrame.contentWindow.document;
  doc.open();
  doc.write(combinedCode);
  doc.close();
}

themeSelect.addEventListener('change', function() {
  const theme = themeSelect.value;
  htmlEditor.setOption('theme', theme);
  cssEditor.setOption('theme', theme);
  jsEditor.setOption('theme', theme);
});

fontSizeRange.addEventListener('input', function() {
  const size = fontSizeRange.value + 'px';
  document.querySelectorAll('.CodeMirror').forEach(cm => {
    cm.style.fontSize = size;
  });
  htmlEditor.refresh();
  cssEditor.refresh();
  jsEditor.refresh();
});

runButton.addEventListener('click', updatePreview);

saveButton.addEventListener('click', function() {
  const zip = new JSZip();
  zip.file("index.html", htmlEditor.getValue());
  zip.file("styles.css", cssEditor.getValue());
  zip.file("script.js", jsEditor.getValue());

  zip.generateAsync({type:"blob"}).then(function(content) {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = "code.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
});

// Initialize editor with default content
htmlEditor.setValue(`<!DOCTYPE html>
<html>
<head>
  <title>Live Preview</title>
</head>
<body>
  <h1>Hello, world!</h1>
  <p>Edit the code to see live changes.</p>
</body>
</html>`);
cssEditor.setValue(`body {
  font-family: Arial, sans-serif;
  font-size: 16px;
}
h1 {
  color: blue;
}`);
jsEditor.setValue(`console.log("Hello, world!");`);

updatePreview();



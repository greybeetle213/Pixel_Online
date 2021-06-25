//taken from: https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }

//taken from: https://www.javascripture.com/FileReader
var openFile = function(event) {
  var input = event.target;

  var reader = new FileReader();
  reader.onload = function(){
    var text = reader.result;
    popup.confirm("Ovewrite current drawing?", "importing this file will replace the current drawing with the new one!", "Overwrite", "Cancel",
    function(){
      drawing = JSON.parse(text)
      reloadDrawing()
    })
  };
  reader.readAsText(input.files[0]);
};
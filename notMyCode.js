// taken from: https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
function download (filename, text) {
  const element = document.createElement('a')
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
  element.setAttribute('download', filename)

  element.style.display = 'none'
  document.body.appendChild(element)

  element.click()

  document.body.removeChild(element)
}

// taken from: https://www.javascripture.com/FileReader
const openFile = function (event) {
  const input = event.target

  const reader = new FileReader()
  reader.onload = function () {
    const text = reader.result
    popup.confirm('Ovewrite current drawing?', 'importing this file will replace the current drawing with the new one!', 'Overwrite', 'Cancel',
      function () {
        drawing = JSON.parse(text)
        reloadDrawing()
      })
  }
  reader.readAsText(input.files[0])
}
// taken from https://stackoverflow.com/questions/11023144/working-with-hex-strings-and-hex-values-more-easily-in-javascript
function addHexColor (c1, c2) {
  let hexStr = (parseInt(c1, 16) + parseInt(c2, 16)).toString(16)
  while (hexStr.length < 6) { hexStr = '0' + hexStr } // Zero pad.
  return hexStr
}

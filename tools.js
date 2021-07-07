function selectTool(newTool){
  if(newTool === "pen"){
    currentTool = "pen"
    clearTools()
    $("#pen").css("border", "5px inset #00FF00")
  }
  if(newTool === "dropper"){
    currentTool = "dropper"
    clearTools()
    $("#dropper").css("border", "5px inset #00FF00")
  }
  if(newTool === "bucket"){
    currentTool = "bucket"
    clearTools()
    $("#bucket").css("border", "5px inset #00FF00")
  }
  if(newTool === "noise"){
    currentTool = "noise"
    clearTools()
    $("#noise").css("border", "5px inset #00FF00")
  }
  if(newTool === "eraser"){
    currentTool = "eraser"
    clearTools()
    $("#eraser").css("border", "5px inset #00FF00")
  }
  if(newTool === "paint"){
    currentTool = "paint"
    clearTools()
    $("#paint").css("border", "5px inset #00FF00")
    $("#noiseConfig").css("display", "inherit")
  }
  if(newTool === "paint_bucket"){
    currentTool = "paint_bucket"
    clearTools()
    $("#paint_bucket").css("border", "5px inset #00FF00")
    $("#noiseConfig").css("display", "inherit")
  }
  if(newTool === "grid"){
    grid = !grid
    if(!grid){
      reloadDrawing()
    }
    update()
  }
  if(newTool === "save"){
    popup.confirm("what format?", "the .pxlo format can only be opened by this editor, use it if you are not done yet.<br>The .png format can be opened by image veiwers and shared with your freinds but CANNOT be opened by this program.", ".pxlo", ".png",
    function(){
      download($("#fileName").val()+".pxlo", JSON.stringify(drawing))
    },
    function(){
      saveCtx.clearRect(0,0,saveCanvas.width,saveCanvas.height)
      for(y = 0; y < drawing.height; y ++){
        for(x = 0; x < drawing.width; x ++){
          saveCtx.fillStyle = drawing.pixels[y][x]
          saveCtx.fillRect(x, y, 1, 1)
        }
      }
      var button = document.createElement("a")
      button.addEventListener('click', function (e) {
        var dataURL = saveCanvas.toDataURL('image/png').replace("image/png", "image/octet-stream")
        button.href = dataURL;
        button.download = $("#fileName").val()+".png"
      })
      button.click()
    })
  }
}

function usePen(event){
  x = event.pageX - $('#drawingCanvas').offset().left // get the x pos relitive to the canvas
  y = event.pageY - $('#drawingCanvas').offset().top
  ctx.fillStyle = $("#colorPicker").val()
  drawing.pixels[Math.floor(y/pixelSize)][Math.floor(x/pixelSize)] = ctx.fillStyle
  ctx.fillRect(Math.floor(x/pixelSize)*pixelSize-1, Math.floor(y/pixelSize)*pixelSize-1, pixelSize+1, pixelSize+1)
  reloadDrawing()
}

function useEraser(event){
  x = event.pageX - $('#drawingCanvas').offset().left // get the x pos relitive to the canvas
  y = event.pageY - $('#drawingCanvas').offset().top
  drawing.pixels[Math.floor(y/pixelSize)][Math.floor(x/pixelSize)] = "#00000000"
  ctx.clearRect(Math.floor(x/pixelSize)*pixelSize-1.5, Math.floor(y/pixelSize)*pixelSize-1, pixelSize+1, pixelSize+1)
  reloadDrawing()
}

function useDropper(event){
  x = event.pageX - $('#drawingCanvas').offset().left // get the x pos relitive to the canvas
  y = event.pageY - $('#drawingCanvas').offset().top
  if(drawing.pixels[Math.floor(y/pixelSize)][Math.floor(x/pixelSize)] !== "#00000000"){
    ctx.fillStyle = drawing.pixels[Math.floor(y/pixelSize)][Math.floor(x/pixelSize)]
    $("#colorPicker").val(ctx.fillStyle)
  }
  $("#pen").click()
}

function fillLine(xOffset, yOffset){
  for(i = 0; i < replaceCoords.length; i++){
    if(replaceCoords[i][1]+xOffset >= 0 && replaceCoords[i][1]+xOffset < drawing.height){
      if(drawing.pixels[replaceCoords[i][1]+xOffset][replaceCoords[i][0]+yOffset] === colorToReplace){
        newReaplaceCoords.push([replaceCoords[i][0]+yOffset, replaceCoords[i][1]+xOffset])
        drawing.pixels[replaceCoords[i][1]+xOffset][replaceCoords[i][0]+yOffset] = $("#colorPicker").val()
      }
    }
    if(Date.now()-startTime > 500){
      break
    }
    newReaplaceCoords[newReaplaceCoords.indexOf(replaceCoords[i])] = false
  }
  replaceCoords = []
  for(i = 0; i < newReaplaceCoords.length; i ++){
    if(newReaplaceCoords[i] !== false){
      replaceCoords.push(newReaplaceCoords[i])
    }
    if(Date.now()-startTime > 500){
      break
    }
  }
  newReaplaceCoords = JSON.parse(JSON.stringify(replaceCoords))
}

function paintLine(xOffset, yOffset){
  for(i = 0; i < replaceCoords.length; i++){
    if(replaceCoords[i][1]+xOffset >= 0 && replaceCoords[i][1]+xOffset < drawing.height){
      if(drawing.pixels[replaceCoords[i][1]+xOffset][replaceCoords[i][0]+yOffset] === colorToReplace){
        newReaplaceCoords.push([replaceCoords[i][0]+yOffset, replaceCoords[i][1]+xOffset])
        drawing.pixels[replaceCoords[i][1]+xOffset][replaceCoords[i][0]+yOffset] = ctx.fillStyle = "#" + addHexColor($("#colorPicker").val().slice(1), String(Math.floor(Math.random()*$("#rNoise").val()))+String(Math.floor(Math.random()*$("#gNoise").val()))+String(Math.floor(Math.random()*$("#bNoise").val())))
      }
    }
    newReaplaceCoords[newReaplaceCoords.indexOf(replaceCoords[i])] = false
  }
  replaceCoords = []
  for(i = 0; i < newReaplaceCoords.length; i ++){
    if(newReaplaceCoords[i] !== false){
      replaceCoords.push(newReaplaceCoords[i])
    }
  }
  newReaplaceCoords = JSON.parse(JSON.stringify(replaceCoords))
}

function paint(event){
  x = event.pageX - $('#drawingCanvas').offset().left // get the x pos relitive to the canvas
  y = event.pageY - $('#drawingCanvas').offset().top
  ctx.fillStyle = "#" + addHexColor($("#colorPicker").val().slice(1), String(Math.floor(Math.random()*$("#rNoise").val()))+String(Math.floor(Math.random()*$("#gNoise").val()))+String(Math.floor(Math.random()*$("#bNoise").val())))
  console.log(ctx.fillStyle)
  drawing.pixels[Math.floor(y/pixelSize)][Math.floor(x/pixelSize)] = ctx.fillStyle
  ctx.fillRect(Math.floor(x/pixelSize)*pixelSize-1, Math.floor(y/pixelSize)*pixelSize-1, pixelSize+1, pixelSize+1)
  reloadDrawing()
}

function paintBucket(event){
  var x = event.pageX - $('#drawingCanvas').offset().left // get the x pos relitive to the canvas
  var y = event.pageY - $('#drawingCanvas').offset().top
  x /= pixelSize
  x = Math.floor(x)
  y /= pixelSize
  y = Math.floor(y)
  colorToReplace = drawing.pixels[y][x]
  drawing.pixels[y][x] = $("#colorPicker").val()
  replaceCoords = [[x,y]]
  newReaplaceCoords = JSON.parse(JSON.stringify(replaceCoords))
  loops = 0
  while(replaceCoords.length !== 0 && loops < 100){
    paintLine(0,-1)
    paintLine(0, 1)
    paintLine(1,0)
    paintLine(-1, 0)
    loops ++
  }
  reloadDrawing()
}

function useBucket(event){
  var x = event.pageX - $('#drawingCanvas').offset().left // get the x pos relitive to the canvas
  var y = event.pageY - $('#drawingCanvas').offset().top
  x /= pixelSize
  x = Math.floor(x)
  y /= pixelSize
  y = Math.floor(y)
  colorToReplace = drawing.pixels[y][x]
  drawing.pixels[y][x] = $("#colorPicker").val()
  replaceCoords = [[x,y]]
  newReaplaceCoords = JSON.parse(JSON.stringify(replaceCoords))
  timedOut = false
  loops = 0
  startTime = Date.now()
  while(replaceCoords.length !== 0 && Date.now()-startTime < 500 && loops <100){
    fillLine(0,-1)
    fillLine(0, 1)
    fillLine(1,0)
    fillLine(-1, 0)
    console.log("loop")
    loops ++
  }
  console.log("done")
  if(Date.now()-startTime > 500){
    console.log("Error: timedOut")
  }
  reloadDrawing()
}

function clearTools(){
  $("#pen").css("border", "1px inset black")
  $("#dropper").css("border", "1px inset black")
  $("#bucket").css("border", "1px inset black")
  $("#noise").css("border", "1px inset black")
  $("#eraser").css("border", "1px inset black")
  $("#paint").css("border", "1px inset black")
  $("#paint_bucket").css("border", "1px inset black")
  $("#noiseConfig").css("display", "none")
}

function reloadDrawing(){
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  for(y = 0; y < drawing.height; y ++){
    for(x = 0; x < drawing.width; x ++){
      ctx.fillStyle = drawing.pixels[y][x]
      ctx.fillRect(x*pixelSize-1, y*pixelSize-1, pixelSize+1, pixelSize+1)
    }
  }
  update()
}

function resizeDrawing(){
  popup.confirm("erase drawing?", "changing the canvas size will erase the current drawing", "yes", "cancel",
  function(){
    drawing = {
      width: $("#width").val(),
      height: $("#width").val(),
      pixels: []
    }
    grid = true
    clicking = false
    document.getElementById("drawingCanvas").height = window.innerHeight - 50
    document.getElementById("drawingCanvas").width = window.innerHeight - 50
    canvas = document.getElementById('drawingCanvas')
    ctx = document.getElementById('drawingCanvas').getContext('2d')
    pixelSize = canvas.width/drawing.width
    document.getElementById("downloadCanvas").height = drawing.width
    document.getElementById("downloadCanvas").width = drawing.height
    saveCanvas = document.getElementById("downloadCanvas")
    saveCtx = document.getElementById("downloadCanvas").getContext("2d")
    currentTool = "pen"
    undos = [JSON.stringify(drawing)]
    for(y = 0;y < drawing.height; y ++){
      drawing.pixels[y] = []
      for(x = 0;x < drawing.width; x ++){
        drawing.pixels[y][x] = '#00000000'
      }
    }
  })
  reloadDrawing()
}
function zoom(newZoomAmount){
  zoomAmount += newZoomAmount
  document.getElementById("drawingCanvas").height = window.innerHeight - 50 + zoomAmount
  document.getElementById("drawingCanvas").width = window.innerHeight - 50 + zoomAmount
  canvas = document.getElementById('drawingCanvas')
  ctx = document.getElementById('drawingCanvas').getContext('2d')
  pixelSize = canvas.width/drawing.width
  reloadDrawing()
}

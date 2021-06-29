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
}

function fillLine(xOffset, yOffset){
  for(i = 0; i < replaceCoords.length; i++){
    if(replaceCoords[i][1]+xOffset > 0 && replaceCoords[i][1]+xOffset < drawing.height){
      if(drawing.pixels[replaceCoords[i][1]+xOffset][replaceCoords[i][0]+yOffset] === colorToReplace){
        newReaplaceCoords.push([replaceCoords[i][0]+yOffset, replaceCoords[i][1]+xOffset])
        drawing.pixels[replaceCoords[i][1]+xOffset][replaceCoords[i][0]+yOffset] = $("#colorPicker").val()
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
  loops = 0

  while(replaceCoords.length !== 0 && loops < 100){
    fillLine(0,-1)
    fillLine(0, 1)
    fillLine(1,0)
    fillLine(-1, 0)
    loops ++
  }
  reloadDrawing()
}

function clearTools(){
  $("#pen").css("border", "1px inset black")
  $("#dropper").css("border", "1px inset black")
  $("#bucket").css("border", "1px inset black")
  $("#noise").css("border", "1px inset black")
  $("#eraser").css("border", "1px inset black")
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

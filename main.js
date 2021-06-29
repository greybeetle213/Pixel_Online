function init(){
  drawing = {
    width: 16,
    height: 16,
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
  $('#drawingCanvas').mousemove(function (event) { update (event) })
  $('#drawingCanvas').click(function (event) {clicking=true; update (event, false); clicking=false})
  $('body').keypress(function(event){
    if(event.key === 'z' && undos.length > 1){
      drawing = JSON.parse(undos.pop())
      reloadDrawing()
    }
});
  update()
}
function update(event, drag=true){
  if(clicking){
    if(event !== undefined){
      if(JSON.stringify(drawing) !== undos[undos.length-1]){
        undos.push(JSON.stringify(drawing))
        if(undos.length > 100){
          undos.shift()
        }
      }
      if(currentTool === "pen"){
        usePen(event)
      }else if(currentTool === "dropper"){
        useDropper(event)
      }else if(currentTool === "eraser"){
        useEraser(event)
      }else if(currentTool === "bucket" && !drag){
        useBucket(event)
      }
    }

  }
  if(grid){
    for(i = 0; i < drawing.width; i++){
      ctx.beginPath()
      ctx.moveTo(i*pixelSize,0)
      ctx.lineTo(i*pixelSize, canvas.height)
      ctx.stroke()
    }
    for(i = 0; i < drawing.height; i++){
      ctx.beginPath()
      ctx.moveTo(0,i*pixelSize)
      ctx.lineTo(canvas.height, i*pixelSize)
      ctx.stroke()
    }
  }
}
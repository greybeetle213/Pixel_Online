// i made this a separate file because i might want to use it for another project and this will make it easier
// it makes a popup
/* sample usage
popup.alert("hi", "this is a popup", "ok", "function(){console.log("popup has been closed")}")
popup.alert("hi", "this is a popup", "ok")
popup.confirm("hi", "yes or no", "yes", "no", function(){console.log("yes")}, function(){console.log("no")})
popup.input("hi", "what is your name", function(name){console.log("hello "+name)})
*/
function closePopup (popUpFunction) {
    $('#popup').css('visibility', 'hidden') // close the popup
    if (popUpFunction !== '') { // if a function has been given
      popUpFunction() // run it
    }
  }
  popup = {
    alert: function (title, content, prompt = 'close', onClose = '') {
      $('#popupTitle').html(title)
      $('#popupText').html(content)
      globalOnAccept = onClose
      $('#popupButtons').html("<button id='popupButton' onclick='closePopup(globalOnAccept)'>" + prompt + '</button>') // make a button
      $('#popup').css('visibility', 'visible') // show the popup
    },
    confirm: function (title, content, accept, deny, onAccept = '', onDeny = '') {
      $('#popupTitle').html(title)
      $('#popupText').html(content)
      globalOnAccept = onAccept
      globalOnDeny = onDeny
      $('#popupButtons').html("<button id='popupButton' onclick='closePopup(globalOnAccept)'>" + accept + "</button> <button id='popupButton2' onclick='closePopup(globalOnDeny)'>" + deny + '</button>')
      $('#popup').css('visibility', 'visible') // show the popup
    },
    input: function (title, content, on_enter = '') {
      $('#popupTitle').html(title)
      $('#popupText').html(content)
      $('#popupButtons').html("<input type='text' id='popupInput'>") // make a text input
      $('#popupButtons').css('left', '20%')// make it centered
      test = function () { console.log('why') }
      $('#popupInput').on('keypress', function (e, onDone = on_enter) { // when a key is pressed in the text box
        if (e.key === 'Enter') { // if the key is enter
          $('#popup').css('visibility', 'hidden') // close the popup
          $('#popupButtons').css('left', '40%')
          if (onDone !== '') { // if there is a function to run
            onDone(document.getElementById('popupInput').value) // run it with the value of the text box as a paramater
          }
        }
      })
      $('#popup').css('visibility', 'visible') // show the popup
    }
  }
// const socket = io.connect(location.href);
const socket = io.connect('https://dataseed-yasir3614.c9users.io/');

  // dom
const message = document.querySelector('#message'),
      handle = document.querySelector('#name'),
      btn = document.querySelector('#send'),
      output = document.querySelector('#output'),
      feedback = document.querySelector('#feedback'),
      clean = document.querySelector('#clean');
      // event
      btn.addEventListener('click', () => {
        console.log('btn send');
        if (message.value != '' && handle.value != '') {
          console.log('length');
          
        socket.emit("private", { msg: message.value, to: handle.value} );
        
        // socket.emit('chat', {message: message.value,handle: handle.value});
        } else {
          alert('All fields are required!');
        }
        // socket.emit("private", { msg: chatMsg.val(), to: selected.text() });

        message.value = '';
      });

      message.addEventListener('keypress', () => {
        socket.emit('typing', handle.value);
      });

      // socket.on('chat', data => {
      //   output.innerHTML += `<p><strong>${data.handle}: </strong>${data.message}</p>`;
    
      // });
      socket.on('private',function(data){
        output.innerHTML += `<p>${data.from }<strong>${data.to}: </strong>${data.msg}</p>`;
    
      });

// socket.on("private", function(data) {    
//   chatLog.append('<li class="private"><em><strong>'+ data.from +' -> '+ data.to +'</strong>: '+ data.msg +'</em></li>');
// });




      var timer = setTimeout(makeNoTypingState, 1000);
      socket.on('typing', data => {
        feedback.innerHTML = `<p><em>${data} is typing a message...</em></p>`;
        clearTimeout(timer);
        timer = setTimeout(makeNoTypingState, 1000);
      });
      function makeNoTypingState() {
        feedback.innerHTML = "";
      }
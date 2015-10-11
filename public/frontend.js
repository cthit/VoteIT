

var optionamount=0;


$(function() {
  $('.optionsform').on('change','.voteoption', function(event) {

    if($(this).prop('checked')) {
      optionamount++;
      $("#votesleft").html($("#maximumnrOfVotes").html()-optionamount);
      if (optionamount == $("#maximumnrOfVotes").html()) {
        $('.voteoption:not(:checked)').prop('disabled', true);
      }
    } else {
      optionamount--;
      $("#votesleft").html($("#maximumnrOfVotes").html()-optionamount);
      $('.voteoption:not(:checked)').prop('disabled', false);
    }
  });


});
$(window).ready(function(){
  window.setInterval(countDown,1000);
  $("#votesleft").html($("#maximumnrOfVotes").html());
  function countDown(){
  //  console.log($("#timeleft").html());
    $("#timeleft").html($("#timeleft").html()-1);
    if($("#timeleft").html() == 0){
      location.reload();
    }
  }



});


//

/*
callWebSocket();
function callWebSocket() {

    var socket = new WebSocket("ws://localhost:3001/echo");


    socket.onopen = function () {
    //  socket.send("Hej hej hallå");
      //  alert("Hello, Connected To WS server");
    };

    socket.onmessage = function (e) {
        alert("The message received is : " + e.data);
        location.reload();
    };
    socket.onerror = function (e) {
      //  alert("An error occured while connecting... " + e.data);
    };
    socket.onclose = function () {
        //alert("hello.. The coonection has been clsoed");
    };

}
*/
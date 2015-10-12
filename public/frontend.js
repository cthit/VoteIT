

var optionamount=0;


$(function() {

  $('.vacant').prop('disabled', true);
  $('#vakant1').prop('disabled', false);
  var maxVotes = $("#maximumnrOfVotes").val();

  $('.optionsform').on('change','.voteoption', function(event) {

    if($(this).prop('checked')) {
      optionamount++;
      if (optionamount == maxVotes) {
        $('.voteoption:not(:checked)').prop('disabled', true);
      }
    } else {
      optionamount--;
      $('.voteoption:not(.vacant):not(:checked)').prop('disabled', false);
      $('#vakant1').prop('disabled', false);
    }
    $("#votesleft").html(maxVotes-optionamount);
  });
  $('.optionsform').on('change','.vacant', function(event) {
    var id = $(this).prop('id');
    id = parseInt(id.replace('vakant',''));
    var newId = '#vakant'+(id+1);

    if($(this).prop('checked')) {
      if (optionamount)
      $(newId).prop('disabled', false);
    } else {
      if($(newId).prop('checked')){
          optionamount--;
          $(newId).prop('checked', false);
          $(newId).prop('disabled', true);
      }

    }
    $("#votesleft").html(maxVotes-optionamount);
  })


  window.setInterval(countDown,1000);
  $("#votesleft").html(maxVotes);
  //$('.voteoption:class(:vakant)').prop('disabled', true);
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

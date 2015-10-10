var x=1;
var optionamount=0;

$(function() {
  $('.optionsform').on('change','.voteoption', function(event) {

    if($(this).prop('checked')) {
      optionamount++;
      if (optionamount == x) {
        $('.voteoption:not(:checked)').prop('disabled', true);
      }
    } else {
      optionamount--;
      $('.voteoption:not(:checked)').prop('disabled', false);
    }
  });
});

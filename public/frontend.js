var optionAmount = 0;

$(function() {
    $('.vacant').prop('disabled', true);
    $('#vakant1').prop('disabled', false);

    var maxVotes = $("#maximumNbrOfVotes").val();

    $('.optionsform').on('change', '.voteoption', function(event) {

        if ($(this).prop('checked')) {
            optionAmount++;
            if (optionAmount == maxVotes) {
                $('.voteoption:not(:checked)').prop('disabled', true);
            }
        } else {
            optionAmount--;
            $('.voteoption:not(.vacant):not(:checked)').prop('disabled', false);
            $('#vakant1').prop('disabled', false);
        }
        $("#votesleft").html(maxVotes - optionAmount);
    });
    $('.optionsform').on('change', '.vacant', function(event) {
        var id = $(this).prop('id');
        id = parseInt(id.replace('vakant', ''));
        var newId = '#vakant' + (id + 1);

        if ($(this).prop('checked')) {
            if (optionAmount)
                $(newId).prop('disabled', false);
        } else {
            if ($(newId).prop('checked')) {
                optionAmount--;
                $(newId).prop('checked', false);
                $(newId).prop('disabled', true);
            }

        }
        $("#votesleft").html(maxVotes - optionAmount);
    })


    window.setInterval(countDown, 1000);
    $("#votesleft").html(maxVotes);
    //$('.voteoption:class(:vakant)').prop('disabled', true);
    function countDown() {
        //  console.log($("#timeleft").html());
        $("#timeleft").html($("#timeleft").html() - 1);
        if ($("#timeleft").html() == 0) {
            location.reload();
        }
    }
});

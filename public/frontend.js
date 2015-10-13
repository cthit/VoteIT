var optionAmount = 0;
$(function() {
    setAllVacantBoxesDisabledExceptOne();

    var maxVotes = $("#maximumNbrOfVotes").val();

    $('.optionsform').on('change', '.voteoption', function(event) {
        handleVoteOptionEvent();
    });

    $('.optionsform').on('change', '.vacant', function(event) {
        handleVacantOptionEvent();
    })

    window.setInterval(countDown, 1000);
    $("#votesleft").html(maxVotes);

    function countDown() {
        $("#timeleft").html($("#timeleft").html() - 1);
        if ($("#timeleft").html() == 0) {
            location.reload();
        }
    }

    function setAllVacantBoxesDisabledExceptOne() {
        $('.vacant').prop('disabled', true);
        $('#vakant1').prop('disabled', false);
    }

    function handleVoteOptionEvent() {
        if ($(this).prop('checked')) {
            handleOptionChecked();
        } else {
            handleOptionUnchecked();
        }
        $("#votesleft").html(maxVotes - optionAmount);
    }

    function handleOptionChecked() {
        optionAmount++;
        if (optionAmount == maxVotes) {
            $('.voteoption:not(:checked)').prop('disabled', true);
        }
    }

    function handleVacantOptionEvent() {
        var id = $(this).prop('id');
        id = parseInt(id.replace('vakant', ''));
        var newId = '#vakant' + (id + 1);

        if ($(this).prop('checked')) {
            handleVacantOptionChecked(newId);
        } else {
            handleVacantOptionUnchecked(newId);
        }

        $("#votesleft").html(maxVotes - optionAmount);
    }

    function handleOptionUnchecked() {
        optionAmount--;
        $('.voteoption:not(.vacant):not(:checked)').prop('disabled', false);
        $('#vakant1').prop('disabled', false);
    }

    function handleVacantOptionChecked(vacantId) {
        if (optionAmount) {
            $(vacantId).prop('disabled', false);
        }
    }

    function handleVacantOptionUnchecked(vacantId) {
        if ($(newId).prop('checked')) {
            optionAmount--;
            $(newId).prop('checked', false);
            $(newId).prop('disabled', true);
        }
    }

});
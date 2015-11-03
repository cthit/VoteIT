var optionAmount = 0;

$(function() {
    setAllVacantBoxesDisabledExceptOne();

    var maxVotes = $("#maximumNbrOfVotes").val();

    $('.optionsform').on('change', '.voteoption', function(event) {
        handleVoteOptionEvent($(this));
    });

    $('.optionsform').on('change', '.vacant', function(event) {
        handleVacantOptionEvent($(this));
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

    function handleVoteOptionEvent(self) {
        if (self.prop('checked')) {
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

    function handleVacantOptionEvent(self) {
        var id = self.prop('id');
        id = parseInt(id.replace('vakant', ''));
        var pre = '#vakant';
        if (self.prop('checked')) {
            handleVacantOptionChecked(pre + (id + 1));
        } else {
            while(id <= maxVotes){
                handleVacantOptionUnchecked(pre + (id+1));
                id++;
            }
        }

        $("#votesleft").html(maxVotes - optionAmount);
    }

    function handleOptionUnchecked() {
        optionAmount--;
        $('.voteoption:not(.vacant):not(:checked)').prop('disabled', false);
        $('#vakant1').prop('disabled', false);
    }

    function handleVacantOptionChecked(vacantId) {
        if (optionAmount == maxVotes) {
            $('.voteoption:not(:checked)').prop('disabled', true);
        } else {
            $(vacantId).prop('disabled', false);
        }
    }

    function handleVacantOptionUnchecked(vacantId) {
        if ($(vacantId).prop('checked')) {
            optionAmount--;
            $(vacantId).prop('checked', false);
            $(vacantId).prop('disabled', true);
        }
    }

});
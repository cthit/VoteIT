$( document ).ready(function() {
  var counter = 1;

  $("#addButton").click(function () {

    counter++;
    var newTextBoxDiv = $(document.createElement('div'))
      .attr("id", 'TextBoxDiv' + counter);

      newTextBoxDiv.after().html('<label>Option #'+ (counter+1)+ ' : </label>' +
        '<input type="text" name="textbox' + (counter+1) +
          '" id="textbox' + (counter+1) + '" value="" placeholder="Write an option.." >');

          newTextBoxDiv.appendTo("#TextBoxesGroup");

    });

   $("#removeButton").click(function () {
     if(counter==1){
        alert("Need more than two option");
        return false;
     }

    $("#TextBoxDiv" + counter).remove();
      counter--;
    });
});

$( document ).ready(function() {
  var counter = 1;

  $("#addButton").click(function () {

    counter++;
    var newTextBoxDiv = $(document.createElement('div'))
      .attr("id", 'TextBoxDiv' + counter);

      newTextBoxDiv.after().html('<label>Option #'+ (counter+1)+ ' : </label>' +
        '<input type="text" name="textbox' + counter +
          '" id="textbox' + counter + '" value="" placeholder="Write an option.." >');

          newTextBoxDiv.appendTo("#TextBoxesGroup");


          console.log(counter);
    });

   $("#removeButton").click(function () {
     if(counter==1){
        alert("Need more than two option");
        return false;
     }


     console.log("första"+counter);
    $("#TextBoxDiv" + counter).remove();
      counter--;
      console.log("andra"+counter);
    });
});

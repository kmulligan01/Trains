$( document ).ready(function() {

    var config = {
      apiKey: "AIzaSyBRAx1QFxJ1dTx3N6ZXo1wrwgJ52ltbm6I",
      authDomain: "train-scheduler-6a1e5.firebaseapp.com",
      databaseURL: "https://train-scheduler-6a1e5.firebaseio.com",
      projectId: "train-scheduler-6a1e5",
      storageBucket: "train-scheduler-6a1e5.appspot.com",
      messagingSenderId: "362561222451"
    };
      firebase.initializeApp(config);
      
      var database = firebase.database();
    
      //Button for adding trains
      $("#add-train-btn").on("click", function(event) {
        event.preventDefault();
      
        // Grabs user input
        var trainName = $("#trainName").val().trim();
        var firstTrainTime = moment($("#firstTrainTime").val().trim(), "hh:mm").format("X");
        var frequency = moment($("#frequency").val().trim(), "minutes").format("X");
        var destination = $("#destination").val().trim();
        
      
        //hold train info in database
        var newTrain = {
          trainName: trainName,
          firstTrainTime: firstTrainTime,
          frequency: frequency,
          destination: destination
        };
      
        // Uploads train data to the database
        database.ref().push(newTrain);
      
        // Clears all of the text-boxes
        $("#trainName").val("");
        $("#firstTrainTime").val("");
        $("#frequency").val("");
        $("#destination").val("");
      });
      
      // appending trains to table
      database.ref().on("child_added", function(childSnapshot) {
        console.log(childSnapshot.val());
      
        var trainName = childSnapshot.val().trainName;
        var firstTrainTime = childSnapshot.val().firstTrainTime;
        var frequency = childSnapshot.val().frequency;
        var destination = childSnapshot.val().destination;
      
        // train Info
        console.log(trainName);
        console.log(firstTrainTime);
        console.log(frequency);
        console.log(destination);
      
        // Calculate the times
        var currentTime = moment().format("hh:mm");
    
        var firstTrainTimeCalc = moment(currentTime, "hh:mm").subtract(1, "years");
    
        var diffTime = moment().diff(moment(firstTrainTimeCalc), "minutes");
    
        var tRemainder = diffTime % frequency;
    
        var tMinutesTillTrain = frequency - tRemainder;
        
        var nextTrain = moment().add(tMinutesTillTrain, "hh:mm");
    
      
        // Add to table
        var newRow = $("<tr>").append(
          $("<td>").text(trainName),
          $("<td>").text(destination),
          $("<td>").text(moment(firstTrainTimeCalc).format("mm")),
          $("<td>").text(moment(nextTrain).format("hh:mm")),
          $("<td>").text(moment(tMinutesTillTrain).format("mm"))
        );
      
        // Append the new row to the table
        $("#train-table > tbody").append(newRow);
      });
      
    });
document.addEventListener("deviceready", onDeviceReady, false); 
function onDeviceReady(){
  // Where ALL your app code should exist
  console.log("Device ready! Ready to rock!!"); 

  // --- Variables --- //
  const $elFmSignUp = $("#fmSignUp"),
        $elFmLogIn = $("#fmLogIn"),
        $elBtnLogOut = $("#btnLogOut");
  const $elFmSaveComic = $("#fmSaveComic");
  const $elBtnDeleteCollection = $("#btnDeleteCollection");
  // Variable to keep track of which comic we're working with
  let comicWIP = "";
  // To keep track of who is logged in, to auto log them in
  let uid = localStorage.getItem("whoIsLoggedIn");

  // let myDB = new PouchDB("cats");
  // myDB.put({"_id" : "something", "field2" : 123, "moredata" : "Spider-Man"});

  // New unitialized database variable
  let myDB;

  // Function to initilize the database based on who is logged in
  function fnInitDB() {
    console.log("fnInitDB() is running");

    // Temporary variable to check whois is logged in, to use their EMAIL for the name of their DB
    let emailForDB = localStorage.getItem("whoIsLoggedIn");

    // Then use it to create the person's own DB
    myDB = new PouchDB(emailForDB);

    // Return this value to the rest of the app
    return myDB;
  } // END fnInitDB()

  // --- Auto Log In Code --- //
  if(uid === "" || uid === null || uid === undefined) {
    console.log("No one had last logged in. Stay at #pgWelcome");
  } else {
    console.log("A user had logged in: " + uid);
    fnInitDB();
    fnViewComics();
    $(".userEmail").html(uid);
    $(":mobile-pagecontainer").pagecontainer("change", "#pgHome");
  } // END Auto Log In

  // --- Functions --- //
  function fnSignUp(event) {
    event.preventDefault(); // Stops the refersh
    console.log("fnSignUp() is running");
    // Read the fields of the form, so first create Objects (Variables)

    let $elInEmailSignUp = $("#inEmailSignUp"),
        $elInPasswordSignUp = $("#inPasswordSignUp"), 
        $elInPasswordConfirmSignUp = $("#inPasswordConfirmSignUp");

  // Then display the contents of variables before using, in Console
  console.log("Your email is: " + $elInEmailSignUp.val());
  console.log("The PWD is: " + $elInPasswordSignUp.val());
  console.log("Their confirmed pass is: " + $elInPasswordConfirmSignUp.val());

    // Conditional Statement to check if passwords match
    if($elInPasswordSignUp.val() != $elInPasswordConfirmSignUp.val()) {
      console.log("Passwords do not match!");
      window.alert("Passwords DO NOT match!");
      $elInPasswordSignUp.val(""); // Clear the fields to try again
      $elInPasswordConfirmSignUp.val("");
    } else {
      console.log("Password DO MATCH!");
      // To avoid false positives of user accounts, make them consistent
      // victor@victor.com IS NOT THE SAME  Victor@victor.com
      let $tmpValInEmailSignUp = $elInEmailSignUp.val().toUpperCase(),
          $tmpValInPasswordSignUp = $elInPasswordSignUp.val();

      if(localStorage.getItem($tmpValInEmailSignUp) === null) {
        console.log("New User created");
        localStorage.setItem($tmpValInEmailSignUp, $tmpValInPasswordSignUp);
        window.alert("Welcome!");
        $elFmSignUp[0].reset(); // Clear the form for a new User account
      } else {
        console.log("Previous User detected");
        window.alert("Account already exists!");
      } // END If..Else checking for new/old User
    } // END If..Else checking passwords match
  } // END fnSignUp(event)

  function fnLogIn(event) {
    event.preventDefault();
    console.log("fnLogIn(event) is running");

    let $elInEmailLogIn = $("#inEmailLogIn"),
        $elInPasswordLogIn = $("#inPasswordLogIn"),
        $tmpValInEmailLogIn = $elInEmailLogIn.val().toUpperCase(),
        $tmpValInPasswordLogIn = $elInPasswordLogIn.val(); 
    
    if(localStorage.getItem($tmpValInEmailLogIn) === null) {
      console.log("User does NOT exist!");
      window.alert("Account does not exist!");
    } else {
      console.log("User DOES exist.")
      if($tmpValInPasswordLogIn === localStorage.getItem($tmpValInEmailLogIn)) {
        console.log("Password DOES match");
        // When they manually log in, set the localStorage object to the person currently logging in
        localStorage.setItem("whoIsLoggedIn", $tmpValInEmailLogIn);
        // Create their unique DB
        fnInitDB();
        // Refresh comic table
        fnViewComics();
        // Set the <h4> footers to the user's email to show who is logged in
        $(".userEmail").html($tmpValInEmailLogIn);
        // Via jQM, move from this screen (#pgLogIn) to #pgHome
        $(":mobile-pagecontainer").pagecontainer("change", "#pgHome");
      } else {
        console.log("Password does NOT match");
        window.alert("Passwords don't match!");
      } // END If..Else checking for password match
    } // END If..Else if User exists
  } // END fnLogIn(event)

  function fnLogOut() {
    console.log("fnLogOut() is running"); // No default (refresh) to prevent

    // Conditional Statement to confirm a log out
    switch(window.confirm("Do you want to log out?")) {
      case true: 
        console.log("They WANT to log out");
        $elFmSignUp[0].reset();
        $elFmLogIn[0].reset();
        // When they log out, set the localStorage objec to "nobody" is logged in
        localStorage.setItem("whoIsLoggedIn", "");
        $(":mobile-pagecontainer").pagecontainer("change", "#pgWelcome");
        break;
      case false:
        console.log("They DON'T want to log out");
        break;
      case "Maybe":
        console.log("They don't know what they want");
        break;
      default:
        console.log("Unknown choice");
        break;
    } // END Switch for log out
  } // END fnLogOut()

  // Prep the data to be stored
  function fnPrepComic() {
    console.log("fnPrepComic() is running");
    // Variables to store all the comic fields
    let $valInTitleSave = $("#inTitleSave").val(),
        $valInNumberSave = $("#inNumberSave").val(),
        $valInYearSave = $("#inYearSave").val(),
        $valInPublisherSave = $("#inPublisherSave").val(),
        $valInNotesSave = $("#inNotesSave").val();
    console.log($valInTitleSave, $valInNumberSave, $valInYearSave, $valInPublisherSave, $valInNotesSave);

    // Combine all the fields into one "bundle"  in JSON format, with required "_id" for PouchdB
    let tmpComic = {
      "_id" : $valInTitleSave.replace(/\W/g, "") + $valInYearSave + $valInNumberSave,
      "title" : $valInTitleSave,
      "number" : $valInNumberSave,
      "year" : $valInYearSave,
      "publisher" : $valInPublisherSave,
      "notes" : $valInNotesSave
    };

    // Send the data, prepped to the rest of the code
    return tmpComic;
  } // END fnPrepComic()

  // Store data
  function fnSaveComic(event) {
    event.preventDefault();
    console.log("fnSaveComic(event) is running");

    // Read and prep the pgSaveComic data
    let aComic = fnPrepComic();

    // Store the data in PouchDB and check for Failure or Success
    myDB.put(aComic, function(failure, success){
      if(failure) {
        console.log("Error: " + failure.message);
      } else {
        console.log("Saved the comic: " + success.ok);
        $elFmSaveComic[0].reset();
        fnViewComics(); // Then update the Table with new comic(s)
      } // END If/Else Failure/Success
    }); // END .put()
  } // END fnSaveComic(event)

  function fnViewComics() {
    console.log("fnViewcomics() is running");

    myDB.allDocs({"ascending" : true, "include_docs" : true}, 
    function(failure, success){
      if(failure) {
        console.log("Failure retrieving data: " + failure);
      } else { 
        console.log("Success, there is data: " + success);
        // Second check to confirm valid data
        if(success.rows[0] === undefined) {
          $("#divViewComics").html("No comics saved, yet!");
        } else {
          // Quick console msg about # of comics stored
          console.log("Comics to display " + success.rows.length);
          // The starting point of an HTML Table to show comics
          let comicData = "<table> <tr> <th>Name</th> <th>#</th> <th>Year</th> <th>Pub</th> <th>Note</th> </tr>";

          // A loop to create the next row(s) of the comic data
          for(let i = 0; i < success.rows.length; i++) {
            comicData += "<tr class='btnShowComicInfo' id='" + success.rows[i].doc._id + "'> <td>" + success.rows[i].doc.title + "</td> <td>" + success.rows[i].doc.number + "</td> <td>" + success.rows[i].doc.year + "</td> <td>" + success.rows[i].doc.publisher + "</td> <td>" + success.rows[i].doc.notes + "</td> </tr>";
          } // END For Loop
          comicData += "</table>";
          $("#divViewComics").html(comicData);
        } // END If/Else to check valid data
      } // END If/Else of .allDocs()
    }); // END .allDocs()
  } // END fnViewComics()

  // fnViewComics(); // Display comics =>>> moved to fnLogIn() because should run then

  function fnDeleteCollection() {
    console.log("fnDeleteCollection() is running");
    // Conditional to DOUBLE confirm that they DO want to delete everything
    if(window.confirm("Are you use you want to delete your whole collection?")) {
      console.log("They have agreed one time to delete");
      // Second confirmation
      if(window.confirm("Are you sure? There is NO undo!")) {
        console.log("They agreed the second time to delete");
        // Then delete the collection, deal with success or failure of operation
        myDB.destroy(function(failure, success){
          if(failure) {
            console.log("Error deleting sdsdsdsdsdsdsdssdsdsdDgfgfb: " + failure.message);
          } else {
            console.log("Database deleted: " + success.ok);
            // Now reinitialize the DB for new entries
            // myDB = new PouchDB("kitties");
            fnInitDB();
            // Refresh the table 
            // also re-init db..?
            fnViewComics();
            window.alert("Congrats, your mom threw away your comics.");
          }
        }); // END .destroy()
      } else {
        console.log("They chose again not to delete");
      } // END If/Else for 2nd confirmation
    } else {
      console.log("Cancelled the first delete");
    } // end If/Else 1st confirm
  } // END fnDeleteCollection()

  function fnEditComic(thisComic) {
    console.log("fnEditComic(thisComic) is running: " + thisComic.context.id);

    // First, populate the fields that are filled, and leave empty the others, so they may be changed (or not)
    myDB.get(thisComic.context.id, function(failure, success){
      if(failure) {
        console.log("Error getting the comic: " + failure.message);
      } else {
        console.log("Success getting the comic: " + success.title);
        $("#inTitleEdit").val(success.title);
        $("#inNumberEdit").val(success.number);
        $("#inYearEdit").val(success.year);
        $("#inPublisherEdit").val(success.publisher);
        $("#inNotesEdit").val(success.notes);

        // And set the global scope variable of WHICH comic we're using, so the fnEditComicConfirm knows where to save
        comicWIP = success._id;
      } // END If/Else from .get()
    }); // END .get()

    // Then open the Edit Screen to let them Update or Cancel
    $(":mobile-pagecontainer").pagecontainer("change", "#pgComicViewEdit", {"role":"dialog"});
  } // END fnEditComic(thisComic)

  function fnEditComicCancel() {
    console.log("fnEditComicCanel() is running");
    $("#pgComicViewEdit").dialog("close");
  } // END fnEditComicCanel()

  function fnEditComicConfirm(event) {
    event.preventDefault();
    console.log("fnEditComicConfirm(event) is running: " + comicWIP);

    // Re-read the fields (they may have changed, after all)
    let $valInTitleEdit = $("#inTitleEdit").val(), 
        $valInNumberEdit = $("#inNumberEdit").val(),
        $valInYearEdit = $("#inYearEdit").val(),
        $valInPublisherEdit = $("#inPublisherEdit").val(),
        $valInNotesEdit = $("#inNotesEdit").val();

    // As per PouchDB doc: first check if the comic to update exists
    myDB.get(comicWIP, function(failure, success){
      if(failure) {
        console.log("Errro: " + failure.message);
      } else {
        console.log("About to update: " + success._id);
        // After confirming re-insert to database, with anew REVISION number (_rev)
        myDB.put({
          "_id" : success._id,
          "_rev" : success._rev,
          "title" : $valInTitleEdit,
          "number" : $valInNumberEdit,
          "year" : $valInYearEdit,
          "publisher" : $valInPublisherEdit,
          "notes" : $valInNotesEdit
        }, function(failure, success){
          if(failure) {
            console.log("Err: " + failure.message);
          } else {
            console.log("Updated the comic: " + success.id);
            fnViewComics();
            $("#pgComicViewEdit").dialog("close");
          } // END If/Else for .put()
        }); // END .put() the updated data
      } // END .get() confimring
    }); // END .get() to confirm comic exists
  } // END fnEditComicConfirm(event)

  function fnEditComicDelete() {
    console.log("fnEditComicDelete is running. About to delete: " + comicWIP);

    // Confirm what to delete
    myDB.get(comicWIP, function(failure, success){
      if(failure) {
        console.log("E: " + failure.message);
      } else {
        console.log("Deleting: " + success._id);
        if(window.confirm("Are you use you want to delete the comic?")) {
          console.log("Confimred deleteion");
          myDB.remove(success, function(failure, success){
            if(failure) {
              console.log("Couldn't delete: " + failure.message);
            } else {
              console.log("Deleted comic: " + success.ok);
              fnViewComics();
              $("#pgComicViewEdit").dialog("close");
              // comicWIP = "";
            } // END If/Else .revmoe()
          }); // END .remove()
        } else {
          console.log("Canceled deletion");
        } // END If/Else Confirm
      } // END If/Else .get
    }); // END .get()
  } // END fnEditComicDelete()

  // --- Event Listeners --- //
  // Listen for Submit button in the Sign Up Form, and pass on the Event
  $elFmSignUp.submit(function(){fnSignUp(event);});
  $elFmLogIn.submit(function(){fnLogIn(event);});
  // Note: because NOT attached to a <form>, note the difference
  $elBtnLogOut.on("click", fnLogOut);
  $elFmSaveComic.submit(function(){fnSaveComic(event);});
  $elBtnDeleteCollection.on("click", fnDeleteCollection);
  // Another way to work a Object is to define it/use it at the same time
  $("#btnEditComicCancel").on("click", fnEditComicCancel);
  $("#fmEditComicInfo").submit(function(event){fnEditComicConfirm(event);});
  // Listen for clicking of a certain row <tr> that has a certain identifier (class of btnShowComicInfo), in a div #divViewComics
  // We need this because we're trying to interact with something that doesn' exist at runtime
  // And pass to the rest of the code the SPECIFIC row that it was using $(this)
  $("#divViewComics").on("click", "tr.btnShowComicInfo", function(){fnEditComic($(this));});
  $("#btnDeleteComic").on("click", fnEditComicDelete);
} // END onDeviceReady()

/*
  Name: Victor Campos <vcampos@sdccd.edu>
  Project: CBDb Summer 2020
  Description: The Comic Book Database
  Date: August 2020
*/
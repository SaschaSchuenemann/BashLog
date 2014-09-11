$(function () {
    "use strict";

var socket = null;
 
// select item when 
$(document).on('click', '.command' , function() {
     $(this).toggleClass("selected");
});

// clear commands
$('#clearBtn').click( function() {
    console.log('Clearing all commands');
    // add file to dom
  $('#content').empty();
});

// (de-)select all command elements
$('#toggleAllBtn').click( function() {
    
    // select all
    if ($("#toggleAllBtn").text() == "Select All") {
            $('.command').each(function( ) {
                // but only those that are not yet selected
                if(!$(this).hasClass("selected")){
                    $(this).addClass("selected");
                }
            });
            // set button to deselect
            $("#toggleAllBtn").text("Deselect All");
        } // deselect all
        else {
            // but only those that are selected
            $('.command').each(function( ) {
                if($(this).hasClass("selected")){
                    $(this).removeClass("selected");
                }
            });
            // set button to select
            $("#toggleAllBtn").text("Select All");
        }
});

// function that creates the html element for command
// we use this function instead of css so we can extract, collect and download the elements from the dom including the style def
var createHtmlElem = function(command){
    console.log('Create Html called with: ' + command)
    var el = '<div class="command" style=\'';
        el+=" color: #000000;";
        el+=" background: #ffffff;";
        el+=" border-style: solid;";
        el+=" border-width: 1px;";
        el+=" border-color: #000000;";
        el+=" border-radius: 5px;";
        el+=" padding-top: 5px;";
        el+=" padding-bottom: 5px;";
        el+=" padding-left:1px;";
        el+=" margin: 3px;";
        el+=" color:inherit;";
        el+=" text-decoration: none;";
        el+=' font-family: "Courier New", Courier, monospace;';
        el+=" font-size: small;";
    el+='\'># ';
    el+=command;
    el+="</div>";

    console.log('finished element creation');

    return el;
}

// add a command to the frontend
// is called when receiving new command via websockets
var add = function(data) {
  console.log('Received: '+ data);
  console.log('Cmnd: ' + data.cmd);

  var id = data.id || '0000';

  // use helper function to create html element
  var cmd = createHtmlElem(data.cmd);  
  console.log("elem created: " + cmd);

  // add file to dom
  $('#content')
    .append(cmd)
}

// open connection to backend using websockets
$( document ).ready(function() {

      this.socket = io.connect('http://localhost/');

      //Process any incoming messages
      this.socket.on('new', add);
  });

// helper function that creates and then downloads a textfile from a given string
function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);
    pom.click();
}


// export all selected commands
$('#exportBtn').click( function() {
    console.log("Export clicked");

    // create empty container for logfile
    var logFile = "";

    // create empty container for html code file
    var codeFile ="";
    
    // step through all elements from class selected
    $('.selected').each(function( index ) {

    // grab command test
    var _command = $(this).text()

    // create parent element for later html extraction
    var _el = $('<div></div>');

    // clone command element so it can be added to parent element without destroying original dom
    var _cmdElem = $(this).clone();

    // deselect command element
    $(this).toggleClass("selected");

    // log element
    console.log("Text:" + _command );

    // add command to text logfile
    logFile+=_command+"\n";

    // create html element for command and add to html code file
    var elemString = $(this).clone().wrap('<div/>').parent().html(); 

    // add html code to code file
    codeFile+="\n"+elemString;

    //TODO: create picture of this dom element / html element

    //TODO: send picture files to backend
    });


    // write text log file
    console.log("Logfile: \n" + logFile);

    // write html code file
    console.log("HTML Code: \n" + codeFile);

    // download files
    download("log.txt",logFile);

    download("code.html", codeFile);

});


});


$(function () {
    "use strict";
 
 // Problem with this code was, that it was not called on dynamically added elements
 /*   
// toggle command element
$('.command').click( function() {
    $(this).toggleClass("selected");
  } );
*/


$(document).on('click', '.command' , function() {
     $(this).toggleClass("selected");
});


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

var socket = null;

var add = function(data) {
  console.log('Received: '+ data);
  console.log('Cmnd: ' + data.cmd);

  var id = data.id || '0000';

  /*
  var cmd = $('<div class="command" id="' + id + '""></div>')
    .append(data.cmd) ;
    */

    console.log('About to call createHtmlElem');
  var cmd = createHtmlElem(data.cmd);  
  console.log("elem created: " + cmd);

  $('#content')
    .append(cmd)
}

$( document ).ready(function() {

      this.socket = io.connect('http://localhost/');

      

      //Process any incoming messages
      this.socket.on('new', add);
  });

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
    
    $('.selected').each(function( index ) {

    // command
    var _command = $(this).text()
    var _el = $('<div></div>');
    var _cmdElem = $(this).clone();

    // disable element
    $(this).toggleClass("selected");

    // log element
    console.log("Text:" + _command );

    // add command to text logfile
    logFile+=_command+"\n";

    // create html element for command and add to html code file


    var elemString = $(this).clone().wrap('<div/>').parent().html(); 

    codeFile+="\n"+elemString;

    // create picture of this dom element / html element

    // send picture files to backend
    });


    // write text log file
    console.log("Logfile: \n" + logFile);

    // write html code file
    console.log("HTML Code: \n" + codeFile);

    download("log.txt",logFile);

    download("code.html", codeFile);

});


});


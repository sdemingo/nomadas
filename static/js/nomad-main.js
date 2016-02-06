
var DOMAIN=""


function mainEvents(){
    $(".btn-home").click(loadWelcomePanel)
}

function loadWelcomePanel(){
    $.ajax({
    	url:DOMAIN+"/users/me",
    	type: 'get',
    	success: showHTMLContent,
    	error: error
    });  
}


$(document).ready(function () {
    nomadmap.init()
    nomadmap.loadMarkers()
    loadWelcomePanel()
})


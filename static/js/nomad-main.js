
var DOMAIN=""



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



var DOMAIN=""



$(document).ready(function () {
    nomadmap.init()
    
    // load main panel
    $.ajax({
    	url:DOMAIN+"/users/me",
    	type: 'get',
    	success: showHTMLContent,
    	error: error
    });  
})



var DOMAIN=""


function loadWelcomePanel(){
    $.ajax({
    	url:DOMAIN+"/users/me",
    	type: 'get',
    	success: function(html){
	    showHTMLContent(html)
	    moveTo("html")
	},
    	error: error
    });  
}


$(document).ready(function () {
    nomadmap.init()
    nomadmap.loadMarkers()
    loadWelcomePanel()
})


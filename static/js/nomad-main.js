
var DOMAIN=""


function mainEvents(){
    $("#btnMainPanel").off("click").click(loadWelcomePanel)
    $("#btnAdminPanel").off("click").click(loadAdminPanel)
}


function loadWelcomePanel(e){
    if (e) {
	e.preventDefault()
    }
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


function loadAdminPanel(e){
    if (e) {
	e.preventDefault()
    }
    $.ajax({
    	url:DOMAIN+"/admin",
    	type: 'get',
    	success: function(html){
	    showHTMLContent(html)
	    moveTo("html")
	    nomadconfig.init()
	},
    	error: error
    });  
}

$(document).ready(function () {
    nomadcheckins.init()
    nomadmap.init()
    nomadmap.loadMarkers()
    loadWelcomePanel()
})


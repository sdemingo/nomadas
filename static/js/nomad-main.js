
var DOMAIN=""


function mainEvents(){
    $("#btnMainPanel").off("click").click(loadWelcomePanel)
    $("#btnAdminPanel").off("click").click(loadAdminPanel)
    $(".tags-panel a.label").click(selectTag)
    $(".tags-panel a.label").on("click",launchSearchByTag)
}


// Mark tag as selected 
var selectTag = function(event){
    event.preventDefault()
    var element = $(this)
    if (element.hasClass("label-primary")) {
        element.removeClass("label-primary");
    }else{
	element.addClass("label-primary");
    }
}


// Recover clicked tags and launch a search by these tags
var launchSearchByTag = function(event){
    var tags=[]
    $(".tags-panel .results").empty()
    $(".tags-panel").find(".label-primary").each(function(){
	tags.push($(this).html())
    });

    nomadmap.loadMarkers(tags)
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


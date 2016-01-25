



var nomadmap = (function(){

    var bindFunctions = function(){

    }

    var init = function(){
	bindFunctions()

	var initLoc = new google.maps.LatLng(40.4279613,0.2967822)

	var mapOptions = {
	    zoom: 6,
	    center: {lat: -33, lng: 151},
	    disableDefaultUI: true,
	    center:initLoc
	}

	
	var map = new google.maps.Map(document.getElementById("map"), mapOptions)

    }

    return{
	init:init
    }


})()

$(document).ready(function () {

    nomadmap.init()
})


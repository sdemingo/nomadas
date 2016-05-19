

var nomadmap = (function(){

    var MARKERCOLOR = "FireBrick"
    var MARKERCOLOR_VISITED = "green"
    var MARKERCOLOR_CURRENT = "orange"

    var map
    var markers=[]
    var markerCluster
    var curMarker
    var lastLocation

    var initLoc = new google.maps.LatLng(40.4279613,0.2967822)

    var mapOptions = {
	zoom: 5,
	center: {lat: -33, lng: 151},
	disableDefaultUI: true,
	center:initLoc,
	disableDefaultUI: true,
	zoomControl: false,
	mapTypeControl: true,
	mapTypeControlOptions: {
	    style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
	    position: google.maps.ControlPosition.TOP_LEFT
	}
    }


    var refreshMap = function(clustering,points){
	deleteMarkers()
	showMarkers(clustering,points)
	if (points){
	    $(".results .showed").html(points.length)
	}
    }

    var deleteMarkers= function(){
	for (var i=0;i<markers.length;i++){
	    markers[i].setMap(null)
	}
	markers=[]
	if (markerCluster){
	    markerCluster.clearMarkers()
	}
    }

    var showMarkers = function(clustering,points){

	for (var i=0;i<points.length;i++){
	    var location = {lat: parseFloat(points[i].Lat), 
	    		    lng: parseFloat(points[i].Lon)}
	    var color=MARKERCOLOR
	    if (points[i].NChecks>0){
		color=MARKERCOLOR_VISITED
	    }

	    console.log("Creo marker para id "+points[i].Id)
	    var marker=newMarker(location,points[i].Name, color)
	    marker.point=points[i]
	    markers.push(marker)
	}


	mcOptions = {styles: [{
	    height: 53,
	    url: "/images/m1.png",
	    width: 53
	},
			      {
				  height: 56,
				  url: "/images/m2.png",
				  width: 56
			      },
			      {
				  height: 66,
				  url: "/images/m3.png",
				  width: 66
			      },
			      {
				  height: 78,
				  url: "/images/m4.png",
				  width: 78
			      },
			      {
				  height: 90,
				  url: "/images/m5.png",
				  width: 90
			      }]}

	if (clustering){
	    markerCluster = new MarkerClusterer(map, markers,mcOptions);
	}
    }


    var newMarker=function(location,name,color){
	if (!color){
	    color = MARKERCOLOR
	}

	var m = new google.maps.Marker({
	    position:location,
	    map:map,
	    icon: {
		path: google.maps.SymbolPath.CIRCLE,
		scale: 3,
		strokeColor:color,
		fillOpacity: 5
	    },
	    title:name
	})

	google.maps.event.addListener(m,"click",function(e){
	    if (m.point){
		//getPoint(m.point.Id)
		nomadpoints.loadPoint(m.point.Id)
	    }
	})
	
	google.maps.event.addListener(m,"dblclick",function(e){
	    if (!m.point){
		//editPointForm()
		nomadpoints.editPoint()
	    }
	})

	return m
    }
    


    var setCurrentMarker = function(location){
	lastLocation=location
	if (curMarker) {
	    curMarker.setPosition(location);
	} else {
	    curMarker = newMarker(location,"",MARKERCOLOR_CURRENT)
	}
    }

    var getCurrentLocation = function(){
	return lastLocation
    }


    var initMap = function(){
	map = new google.maps.Map(document.getElementById("map"), mapOptions)
	google.maps.event.addListener(map,"click",function(e){
	    setCurrentMarker(e.latLng)
	})
    }

    var init = function(){
	initMap()
    }

    return{
	init:init,
	getLocation:getCurrentLocation,
	addMarker:newMarker,
	update:function(points){
	    refreshMap(true,points)
	}
    }


})()

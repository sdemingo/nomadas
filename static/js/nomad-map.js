

var nomadmap = (function(){

    var MARKERCOLOR = "FireBrick"
    var MARKERCOLOR_VISITED = "green"
    var MARKERCOLOR_CURRENT = "orange"

    var map
    var curMarker
    var lastLocation
    var tagsSelected={}

    
    var newMarkerFormEvents = function(){
	// load tags panel if extists
	if ($(".tags-panel").length){
	    $.ajax({
    		url:DOMAIN+"/points/tags/list",
		dataType: 'json',
    		type: 'get',
    		success: function (tags){
		    $.each(tags,function(i){
			var tag=tags[i]
			$(".tags-panel").append(
			    $('<a href="#" class="label label-default">'+tag.Name+'</a>')
			    .click(function(e){
				e.stopPropagation();
				e.preventDefault()
				if (tagsSelected[tag.Id]){
				    $(this).removeClass("label-primary")
				    delete tagsSelected[tag.Id]
				}else{
				    $(this).addClass("label-primary")
				    tagsSelected[tag.Id]=tag
				}
			    })
			)
		    })
			},
    		error: error
	    }); 
	}

	// load position
	$("#Lat").html(lastLocation.lat())
	$("#Lon").html(lastLocation.lng())

	// buttons
	$("#userUpdateCancel").click(function(){
	    tagsSelected={}
	    loadWelcomePanel()
	})
	$("#userUpdateSubmit").click(function(){
	    var tmpUrl = $("form#newPoint").attr("action")
	    var marker = readForm($("form#newPoint"))
	    var tags = []
	    for (var k in tagsSelected){
		tags.push(tagsSelected[k].Name)
	    }
	    marker.Tags = tags.join(",")
	    addMarker(marker,tmpUrl)  
	})
    }

    var newMarkerForm = function(){
	$.ajax({
    	    url:DOMAIN+"/points/new",
    	    type: 'get',
    	    success: function (html){
		showHTMLContent(html)
		newMarkerFormEvents()
	    },
    	    error: error
	}); 
    }

    var addMarker = function(marker,tmpUrl){
	$.ajax({
    	    url:tmpUrl,
    	    type: 'post',
	    dataType: 'json',
	    data: JSON.stringify(marker),
    	    success: function (html){
		loadWelcomePanel()
		showInfoMessage("Punto creado con éxito")
	    },
    	    error: error
	}); 
    }


    var readForm = function(form){
	var m = $(form).serializeObject()
	// m.Tags = m.Tags.split(",").map(function(e){
	//     return e.trim()
	// })
	// m.Tags.clean("")

	//validator.validate(m,types)
	// if (validator.hasErrors()){
	//     showErrorMessage("Existen campos mal formados o sin información")
	//     return 
	// }

	return m
    }


    var newMarker=function(location,name,color){
	if (!color){
	    color = MARKERCOLOR_VISITED
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
		console.log("Queremos ver la info del punto "+m.point)
	    }
	})
	
	google.maps.event.addListener(m,"dblclick",function(e){
	    if (!m.point){
		newMarkerForm()
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


    var bindEventHandles = function(){



    }

    var init = function(){

	var initLoc = new google.maps.LatLng(40.4279613,0.2967822)

	var mapOptions = {
	    zoom: 6,
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

	map = new google.maps.Map(document.getElementById("map"), mapOptions)

	google.maps.event.addListener(map,"click",function(e){
	    setCurrentMarker(e.latLng)
	})
    }

    return{
	init:init
    }


})()

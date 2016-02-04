

var nomadmap = (function(){

    var MARKERCOLOR = "FireBrick"
    var MARKERCOLOR_VISITED = "green"
    var MARKERCOLOR_CURRENT = "orange"

    var map
    var curMarker
    var lastLocation
    var tagsSelected={}

    
    var newPointFormEvents = function(){
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

	    // read form and put it into formData
	    var form = document.getElementById("newPoint")
	    var formData = new FormData(form)
	    
	    // read marker fields and put them into json object
	    var point = readForm($("form#newPoint"))
	    var tags = []
	    for (var k in tagsSelected){
	    	tags.push(tagsSelected[k].Name)
	    }
	    point.Tags= tags
	    point.Lat = $("#Lat").html()
	    point.Lon = $("#Lon").html()
	    
	    formData.append("jsonPoint",JSON.stringify(point))
	    if (!IsValidPoint(point)){
		showErrorMessage("El punto tiene campos no validos")
		return
	    }
	    addPoint(formData,tmpUrl)  
	})
    }

    var newPointForm = function(){
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

    var addPoint = function(point,tmpUrl){
	$.ajax({
    	    url:tmpUrl,
    	    type: 'post',
            data: marker,
            cache:false,
            contentType: false,
            processData: false,
	    dataType: 'json',
    	    success: function (response){
		loadWelcomePanel()
		if (response.Error){
		    showErrorMessage(response.Error)
		}else{
		    showInfoMessage("Punto creado con éxito")
		}
	    },
    	    error: error
	}); 
    }

    var getPoints = function(tags){
	$.ajax({
    	    url:DOMAIN+"/points/list",
    	    type: 'get',
	    dataType: 'json',
    	    success: function (response){
		if (response.Error){
		    showErrorMessage(response.Error)
		}
		showMarkers(response)
	    },
    	    error: error
	}); 
    }

    var showMarkers = function(points){
	for (var i=0;i<points.length;i++){
	    var location = {lat: parseFloat(points[i].Lat), 
	    		    lng: parseFloat(points[i].Lon)}
	    var marker=newMarker(location, points[i].Name, MARKERCOLOR)
	    marker.point=points[i]
	}
    }

    var IsValidPoint = function(m){
	m.Name.trim()
	m.Desc.trim()
	return (m.Name!="") && 
	    (m.Desc!="")
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
	init:init,
	loadMarkers:getPoints
    }


})()

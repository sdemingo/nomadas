

var nomadmap = (function(){

    var MARKERCOLOR = "FireBrick"
    var MARKERCOLOR_VISITED = "green"
    var MARKERCOLOR_CURRENT = "orange"

    var map
    var points=[]
    var markers=[]
    var curMarker
    var lastLocation
    var tagsSelected={}

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

    var viewPointFormEvents = function(){
	$("#btnDeletePoint").click(function(){
	    var val=$("#pointId").html()
	    if (val){
		deletePoint(val)
	    }
	})

	$("#btnEditPoint").click(function(){
	    var val=$("#pointId").html()
	    if (val){
		editPointForm(val)
	    }
	})
    }

    
    var editPointFormEvents = function(){
	tagsSelected={}
	
	// load tags panel if extists
	if ($(".tags-panel").length){
	    $.ajax({
    		url:DOMAIN+"/points/tags/list",
		dataType: 'json',
    		type: 'get',
    		success: function (tags){
		    $(".tags-panel .label")		     		
			.click(function(e){
			    var tagName=$(this).html()
		    	    e.stopPropagation();
		    	    e.preventDefault()
		    	    if (tagsSelected[tagName]){
		    		$(this).removeClass("label-primary")
		    		delete tagsSelected[tagName]
		    	    }else{
		    		$(this).addClass("label-primary")
		    		tagsSelected[tagName]=1
		    	    }
		    	})

		    // mark as selected labels from the server template
		    $(".tags-panel .label-primary").each(function(e){
			var tagName=$(this).html()
			tagsSelected[tagName]=1
		    })	
		},
    		error: error
	    }); 
	}

	// load position
	if ($("#Lat").html() == ""){
	    $("#Lat").html(lastLocation.lat())
	}
	if ($("#Lon").html() == ""){
	    $("#Lon").html(lastLocation.lng())
	}

	// buttons
	$("#btnMainPanel").click(function(){
	    tagsSelected={}
	    loadWelcomePanel()
	})

	$("#btnNewPoint").click(function(){
	    var tmpUrl = $("#formNewPoint").attr("action")

	    // read form and put it into formData
	    var form = document.getElementById("formNewPoint")
	    var formData = new FormData(form)
	    
	    // read marker fields and put them into json object
	    var point = readForm($("#formNewPoint"))
	    var tags = []
	    for (var key in tagsSelected){
	    	tags.push(key)
	    }
	    point.Tags = tags
	    point.Lat = $("#Lat").html()
	    point.Lon = $("#Lon").html()
	    
	    formData.append("jsonPoint",JSON.stringify(point))
	    if (!IsValidPoint(point)){
		showErrorMessage("El punto tiene campos no validos")
		return
	    }
	    addPoint(formData)  
	})
    }

    var editPointForm = function(id){
	var urla=DOMAIN+"/points/edit"
	if (id){
	    urla=urla+"?id="+id
	}
	$.ajax({
    	    url:urla,
    	    type: 'get',
    	    success: function (html){
		showHTMLContent(html)
		moveTo("#content")
		editPointFormEvents()
	    },
    	    error: error
	})
    }

    var addPoint = function(point){

	var addPointUrl

	// First request for a uploadHandler 
	// with an async ajax
	$.ajax({
    	    url:DOMAIN+"/points/upload",
    	    type: 'get',
	    dataType: 'json',
	    async: false,
    	    success: function (url){
		addPointUrl = url.Path
	    },
    	    error: error
	})

	// Now, using the temp url handler to 
	// upload the point
	$.ajax({
    	    url:addPointUrl,
    	    type: 'post',
            data: point,
            cache:false,
            contentType: false,
            processData: false,
	    dataType: 'json',
    	    success: function (response){
		loadWelcomePanel()
		if (response.Error){
		    showErrorMessage(response.Error)
		}else{
		    points.push(response)
		    showMarkers()
		    showInfoMessage("Punto guardado con éxito")
		}
	    },
    	    error: error
	}); 
    }

    var deletePoint=function(id){
	$.ajax({
    	    url:DOMAIN+"/points/delete?id="+id,
    	    type: 'get',
	    dataType: 'json',
    	    success: function(response){
		loadWelcomePanel()
		if (response.Error){
		    showErrorMessage(response.Error)
		}else{
		    points = points.filter(function(it){
			return it.Id != parseInt(id)
		    })
		    deleteMarkers()
		    showMarkers()
		    showInfoMessage("Punto borrado con éxito")
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
		points = points.concat(response)
		showMarkers()
	    },
    	    error: error
	}); 
    }

    var getPoint = function(id){
	$.ajax({
    	    url:DOMAIN+"/points/get?id="+id,
    	    type: 'get',
    	    success: function(html){
		showHTMLContent(html)
		moveTo("#content")
		viewPointFormEvents()
	    },
    	    error: error
	}); 
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


    var deleteMarkers= function(){
	for (var i=0;i<markers.length;i++){
	    markers[i].setMap(null)
	}
	markers=[]
    }

    var showMarkers = function(){
	for (var i=0;i<points.length;i++){
	    var location = {lat: parseFloat(points[i].Lat), 
	    		    lng: parseFloat(points[i].Lon)}
	    var marker=newMarker(location, points[i].Name, MARKERCOLOR)
	    marker.point=points[i]
	    markers.push(marker)
	}
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
		getPoint(m.point.Id)
	    }
	})
	
	google.maps.event.addListener(m,"dblclick",function(e){
	    if (!m.point){
		editPointForm()
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


    var initMap = function(){
	map = new google.maps.Map(document.getElementById("map"), mapOptions)
	google.maps.event.addListener(map,"click",function(e){
	    setCurrentMarker(e.latLng)
	})
    }

    var init = function(){
	points=[]
	initMap()
    }

    return{
	init:init,
	loadMarkers:getPoints
    }


})()

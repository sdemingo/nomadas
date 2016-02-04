


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
	console.log("Inserto en el mapa "+points.length+" marcadores")
	for (var i=0;i<points.length;i++){
	    var location = {lat: parseFloat(points[i].Lat), 
	    		    lng: parseFloat(points[i].Lon)}
	    console.log(location)
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



function error (data){
    var msg = data.Error
    if ((!data) || (!data.Error)){
	msg="Se ha producido un error desconocido. El servidor no ha enviado información"
    }
    showErrorMessage(msg)
    console.log("Internal server error: "+msg)
}



function firstbootApp(){
    var firstUser={
	Mail:"admin@example.com",
	Name:"Sergio",
	Role:"1"
    }

    $.ajax({
    	url:DOMAIN+"/users/add",
	type: 'post',
	dataType: 'json',
	data: JSON.stringify(firstUser),
    	success: function(){
	    console.log("Añadido usuario por defecto")
	},
    	error: function(){
		console.log("Error añadiendo usuario por defecto")
	}
    })

    var tags=["Vaciado","Aguas","Gasolinera","Merendero",
	      "Zona Infantil", "Gratis", "Vigilado", 
	      "Taller","Urbano"]

    $.each(tags,function(i,name){
	var tag={Name:name}
	$.ajax({
    	    url:DOMAIN+"/points/tags/add",
	    type: 'post',
	    dataType: 'json',
	    data: JSON.stringify(tag),
    	    success: function(){
		console.log("Añadida etiqueta "+name)
	    },
    	    error: function(){
		console.log("Error añadiendo etiqueta "+name)
	    }
	})
    })
	}



function showErrorMessage(text) {
    var modalData={
	id:"errorDialog",
	type:"danger",
	titleText:"Error",
	bodyText:text
    }

    modal.init(modalData)
    $("#errorDialog").modal("show")
}

function showConfirmMessage(text,actionButtonAnyHandler) {
    var modalData={
	id:"confirmDialog",
	type:"info",
	titleText:"Confirmación",
	bodyText:text,
	actionButton:{
	    text:"Ok",
	    handler: actionButtonAnyHandler
	} 
    }

    modal.init(modalData)
    $("#confirmDialog").modal("show")
}

function showInfoMessage(text) {
    var modalData={
	id:"dialog",
	type:"info",
	titleText:"Información",
	bodyText:text
    }

    modal.init(modalData)
    $("#dialog").modal("show")
}


function showHTMLContent(content){
    $("#content").html(content)
}





$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
	    if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
	    }
	    o[this.name].push(this.value || '');
        } else {
	    o[this.name] = this.value || '';
        }
    });
    return o;
};

Array.prototype.clean = function(deleteValue) {
    for (var i = 0; i < this.length; i++) {
	if (this[i] == deleteValue) {         
	    this.splice(i, 1);
	    i--;
	}
    }
    return this;
};








/*
  - Run the modal with a button, using the same id for the modal an for data-target attr form button:
  <button id="..." type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#myDialog">

  - Operate the modal manually:
  $('#myDialog').modal('toggle');
  $('#myDialog').modal('show');
  $('#myDialog').modal('hide');

  - Init the modal with an object as:
  var modalData={
  id:"myDialog",
  titleText:"Titulo del dialogo",
  bodyText:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
  actionButton:{
  text:"Ok",
  handler: actionButtonAnyHandler
  } 
*/


var modal = {
    init:function(data){

	if ($(".modal").length){
	    $(".modal").remove()
	}

	$("body").append(
	    $('<div class="modal fade" id="'+data.id+'" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">')
		.append(
		    $('<div class="modal-dialog" role="document">')
			.append(
			    $('<div class="modal-content">')
				.append(
				    $('<div class="modal-header modal-header-'+data.type+'">')
					.append(
					    $('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>')
					)
					.append(
					    $('<h4 class="modal-title" id="myModalLabel">'+data.titleText+'</h4>')
					)
				)
			    
				.append(
				    $('<div class="modal-body">')
					.append(data.bodyText)
				)

				.append(
				    $('<div class="modal-footer">')
					.append(
					    $('<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>')
					)
				)
			)
		)
	)

	// insert action button
	if (data.actionButton){
	    $(".modal .modal-footer").append(
		$('<button type="button" class="btn btn-primary" data-dismiss="modal">'+data.actionButton.text+'</button>')
		    .click(data.actionButton.handler)
	    )
	}
    }
}





$(function() {
    
    function split( val ) {
	return val.split( /,\s*/ );
    }
    function extractLast( term ) {
	return split( term ).pop();
    }

    // Common functions for all input-tags
    $( "input.input-tags" )
	.bind( "keydown", function( event ) {
	    if ( event.keyCode === $.ui.keyCode.TAB &&
		 $( this ).autocomplete( "instance" ).menu.active ) {
		event.preventDefault();
	    }
	})
	.autocomplete({
	    minLength: 1,
	    source: function( request, response ) {
		response( $.ui.autocomplete.filter(
		    autocompleteTags, extractLast( request.term ) ) );
	    },
	    focus: function() {
		return false;
	    },
	    select: function( event, ui ) {
		var terms = split( this.value );
		terms.pop();
		terms.push( ui.item.value );
		terms.push( "" );
		this.value = terms.join( ", " );
		return false;
	    }
	});

    // Source callback for the users input-tags
    $("#userEditForm input.input-tags" )
	.autocomplete({
	    minLength: 1,
	    source: function( request, response ) {
		response( $.ui.autocomplete.filter(
		    Object.keys(CHEX.userTags), extractLast( request.term ) ) );
	    }
	});

    // Source callback for the questions input-tags
    $("#questEditForm input.input-tags" )
	.autocomplete({
	    minLength: 1,
	    source: function( request, response ) {
		response( $.ui.autocomplete.filter(
		    Object.keys(CHEX.questionTags), extractLast( request.term ) ) );
	    }
	});

    // Source callback for the questions input-tags
    $("#testEditForm input.input-tags" )
	.autocomplete({
	    minLength: 1,
	    source: function( request, response ) {
		response( $.ui.autocomplete.filter(
		    Object.keys(CHEX.testTags), extractLast( request.term ) ) );
	    }
	});
});

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


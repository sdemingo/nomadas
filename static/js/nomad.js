



var nomadmap = (function(){

    var MARKERCOLOR = "FireBrick"
    var MARKERCOLOR_VISITED = "green"
    var MARKERCOLOR_CURRENT = "orange"

    var map
    var curMarker
    var lastLocation


    var addMarker = function(){

    }
    
    var newMarkerForm = function(){
	$.ajax({
    	    url:DOMAIN+"/points/new",
    	    type: 'get',
    	    success: function (html){
		showHTMLContent(html)
		bindEventHandles()
	    },
    	    error: error
	}); 
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
		console.log("Añadimos el current marker como nuevo punto al mapa")
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

	// load tags panel if extists
	if ($(".tags-panel").length){
	    $.ajax({
    		url:DOMAIN+"/points/tags/list",
		dataType: 'json',
    		type: 'get',
    		success: function (tags){
		    $.each(tags,function(i){
			console.log("Cargamos etiqueta "+tags[i].Name)
			$(".tags-panel").append('<span class="label label-default">'+tags[i].Name+'</span>')
		    })
		},
    		error: error
	    }); 
	}

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



function showHTMLContent(content){
    $("#content").html(content)
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


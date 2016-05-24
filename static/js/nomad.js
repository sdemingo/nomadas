


var nomadconfig = (function(){

    var importPoints = function(){
        
	var check=window.File && window.FileReader && window.FileList && window.Blob
	if (!check){
	    showErrorMessage("FileReader API are not fully supported in this browser")
            return
	}   

	var input = document.getElementById("importFile")
	if ((!input) || (!input.files) || (!input.files[0])){
	    showErrorMessage("Please select a file before clicking load button")
	    return
	}

        file = input.files[0]
        fr = new FileReader()
	fr.readAsText(file)
        fr.onload = function(){
	    try{
		var points=JSON.parse(fr.result)
		if (!points){
		    showErrorMessage("JSON points file is bad formatted")
		    return
		}
	    }catch(err){
		showErrorMessage("JSON points file is bad formatted. "+err)
		return
	    }

	    for (var i=0;i<points.length;i++){
		nomadmap.sendPoint(points[i])
	    }

	    showInfoMessage("Se van a añadir "+points.length+" puntos. Esta operación puede tardar un tiempo")
	}
    }


    var sendConfig = function(){
	var config={}
	config.PublicBlob = $("#PublicBlob").prop("checked")

	$.ajax({
    	    url:DOMAIN+"/admin",
    	    type: 'post',
            data: JSON.stringify(config),
	    dataType: 'json',
    	    success: function (response){
		loadWelcomePanel()
		if (response.Error){
		    showErrorMessage(response.Error)
		}else{
		    showInfoMessage("Configuración actualizada con éxito")
		}
	    },
    	    error: error
	});
    }

    var readForm = function(form){
	var f = $(form).serializeObject()
	return f
    }

    var init = function(){
	$("#btnUsersPanel").off("click").on("click",loadUsersPanel)
	$("#btnImportFile").off("click").on("click",importPoints)
	$("#btnNewConfig").off("click").on("click",sendConfig)
    }

    return{
	init:init
    }

})()


var nomadusers = (function(){

    var listUsersFormEvents = function(){
	$(".btnDeleteUser").click(function(e){
	    e.preventDefault()
	    showErrorMessage("Esta opción aún no está implementada")
	})

	$("#btnNewUser").click(function(e){
	    e.preventDefault()
	    showErrorMessage("Esta opción aún no está implementada")
	})

    }


    var init = function(){
	listUsersFormEvents()
    }

    return{
	init:init
    }
})()


var nomadcheckins = (function(){

    var MAXDESCSIZE = 200

    var checkinFormEvents = function(){
	$("#btnNewCheckin").click(function(){
	    addCheckin()
	})

	$("#Desc").each(function() {
	    var $this = $(this);
	    var maxLength = MAXDESCSIZE
	    $this.attr('maxlength', null);
	    
	    var el = $("<span class=\"character-count\">" + maxLength + "/" + MAXDESCSIZE+"</span>");
	    el.insertAfter($this);
	    
	    $this.bind('keyup', function() {
		var cc = $this.val().length;
		el.text(maxLength - cc + "/"+MAXDESCSIZE);
		if(maxLength < cc) {
		    el.css('color', 'red');
		} else {
		    el.css('color', '');
		}
	    })
	});
    }
    

    var checkinForm = function(id){
	var urla=DOMAIN+"/checkins/edit"
	if (id){
	    urla=urla+"?id="+id
	}
	$.ajax({
    	    url:urla,
    	    type: 'get',
    	    success: function (html){
		showHTMLContent(html)
		moveTo("#content")
		checkinFormEvents()
	    },
    	    error: error
	})
    }


    var addCheckin = function(){
	var checkin = readForm($("#formNewCheckin"))
	if ( checkin.Desc.length > MAXDESCSIZE){
	    showErrorMessage("La descripción es demasiado larga")
	    return 
	}

	$.ajax({
    	    url:DOMAIN+"/checkins/new",
    	    type: 'post',
	    dataType: 'json',
	    data: JSON.stringify(checkin),
    	    success: function (url){
		showInfoMessage("Checkin guardado con éxito")
		loadWelcomePanel()
	    },
    	    error: error
	})
    }

    var deleteCheckin = function(id){
	$.ajax({
    	    url:DOMAIN+"/checkins/delete?id="+id,
    	    type: 'get',
    	    success: function (url){
		showInfoMessage("Checkin borrado con éxito")
		loadWelcomePanel()
	    },
    	    error: error
	})
    }


    var init = function(){

    }

    return{
	init:init,
	add:checkinForm,
	del:deleteCheckin
    }

})()



var nomadpoints = (function(){

    var tagsSelected={}
    var allPoints=[]


    var viewPointFormEvents = function(){
	$("#btnDeletePoint").click(function(){
	    var val=$("#pointId").html()
	    if (val){
		showConfirmMessage("¿Desea completar el borrado del punto?",function(){
		    deletePoint(val)
		})
	    }
	})

	$("#btnEditPoint").click(function(){
	    var val=$("#pointId").html()
	    if (val){
		editPointForm(val)
	    }
	})

	$("#btnSendPoint").click(function(){
	    //var val=$("#pointId").html()
	    showErrorMessage("Esta opción aún no está implementada")
	})

	$("#btnCheckInPoint").click(function(){
	    var val=$("#pointId").html()
	    if (val){
		nomadcheckins.add(val)
	    }
	})

	$("#btnDeleteCheckin").click(function(e){
	    e.stopPropagation()
	    e.preventDefault()
	    var id=$(this).attr("href").split("=")[1]
	    if (id){
		showConfirmMessage("¿Desea completar el borrado del registro?",function(){
		    nomadcheckins.del(id)
		})
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
		    	    e.stopPropagation()
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
	var lastLocation=nomadmap.getLocation()
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

	$("#btnVisibility").click(function(){
	    showErrorMessage("Esta opción aún no está implementada")
	    /*
	    var vis=$(this).find(".text").html()
	    if (vis == "Público"){
	    	$("#btnVisibility").find(".text").html("Privado")
	    	$("#btnVisibility").find(".glyphicon").removeClass("glyphicon-eye-open").addClass("glyphicon-eye-close")
	    }else{
	    	$("#btnVisibility").find(".text").html("Público")
	    	$("#btnVisibility").find(".glyphicon").removeClass("glyphicon-eye-close").addClass("glyphicon-eye-open")
	    }*/
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

    var addPoint = function(point,nodialog){

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
		if ((response.Error) && (!nodialog)){
		    showErrorMessage(response.Error)
		}else{
		    
		    var pos = searchPoint(allPoints,response.Id)
		    if (pos<0){
			allPoints.push(response)
		    }else{
			allPoints[pos]=response
		    }

		    if (!nodialog){
			showInfoMessage("Punto guardado con éxito")
			nomadmap.update(allPoints)
		    }
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
		    allPoints = allPoints.filter(function(it){
			return it.Id != parseInt(id)
		    })
		    nomadmap.update(allPoints)
		    showInfoMessage("Punto borrado con éxito")

		}
	    },
    	    error: error
	}); 
    }


    var getPoints = function(tags){
	var dataTags
	if ((tags) && (tags.length>0)){
	    dataTags={tags:tags.join(",")}
	}

	$.ajax({
    	    url:DOMAIN+"/points/list",
    	    type: 'get',
	    dataType: 'json',
	    data: dataTags,
    	    success: function (response){
		if (response.Error){
		    showErrorMessage(response.Error)
		}
		var reqFilteredPoints = ((tags) && (tags.length>0))
		if (!reqFilteredPoints){
		    allPoints = response
		}
		nomadmap.update(response)
		
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


    var searchPoint = function(allPoints,id){
	if ((!allPoints) || (!id)){
	    return -1
	}
	for (var i=0;i<allPoints.length;i++){
	    if (allPoints[i].Id == id){
		return i
	    }
	}
	return -1
    }



    var IsValidPoint = function(m){
	m.Name.trim()
	m.Desc.trim()
	return (m.Name!="") && 
	    (m.Desc!="")
    }


    var init = function(){

    }

    return{
	init:init,
	loadPoints:getPoints,
	loadPoint:getPoint,
	editPoint:editPointForm,
	sendPoint:function(point){
	    var nullFormData = new FormData()
	    nullFormData.append("jsonPoint",JSON.stringify(point))
	    addPoint(nullFormData,true)
	} 
    }
})()


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

function localStringDate(datestr){
    if (!datestr){
	return
    }
    datestr=datestr.replace("Monday","Lunes")
	.replace("Tuesday","Martes")
	.replace("Wednesday","Miércoles")
	.replace("Thursday","Jueves")
	.replace("Friday","Viernes")
	.replace("Saturday","Sábado")
	.replace("Sunday","Domingo")

	.replace("January","Enero")
	.replace("February","Febrero")
	.replace("March","Marzo")
	.replace("April","Abril")
	.replace("May","Mayo")
	.replace("June","Junio")
	.replace("July","Julio")
	.replace("Augoust","Agosto")
	.replace("September","Septiembre")
	.replace("October","Octubre")
	.replace("November","Noviembre")
	.replace("December","Diciembre")

    return datestr
}

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
	Mail:"admin@example.com",  // put here the gmail user admin account
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

    var tags=["Vaciado WC","Aguas","Gasolinera","Merendero",
	      "Zona Infantil", "Gratis", "Vigilado", 
	      "Taller","Urbano","Playa"]

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
    mainEvents()
}


function moveTo(id){
    var windowsize = $(window).width();
    if (windowsize <=  480){
	$("html, body").animate({
            scrollTop: $(id).offset().top
	}, 500);
    }
}



function readForm (form){
    var m = $(form).serializeObject()
    return m
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

    nomadpoints.loadPoints(tags)
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

function loadUsersPanel(e){
    if (e) {
	e.preventDefault()
    }
    $.ajax({
    	url:DOMAIN+"/users/list",
    	type: 'get',
    	success: function(html){
	    showHTMLContent(html)
	    moveTo("html")
	    nomadusers.init()
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
    nomadpoints.init()
    nomadmap.init()
    nomadpoints.loadPoints()
    loadWelcomePanel()
})


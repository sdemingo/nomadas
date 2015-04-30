


var nomadMap
var current_session 




// Dado un punto añade un marcador al mapa y le asigna ese punto
function addMarkerToMap(point){

    current_session.addMarker(point)
    $("#total-user-points").html(current_session.totalMarkers())
}



function deleteMarkerFromMap(){

    var point_id = $("#info-key").val()
    deletePoint(point_id,null,false)

    current_session.deleteMarker(point_id)
    $("#total-user-points").html(current_session.totalMarkers())
}




// Recarga el cuadro de previsualización de la imagen en el formulario de edición
function previewImage(blobKey){
    $("#imgPreview").empty()
    if (blobKey!=""){
	$("#imgPreview").append("<img src=\"http://localhost:8080/images/serve?blobKey="+blobKey+"\"  />")
    }
    var oldBlobKey = $("#blobKey").val()
    $("#blobKey").val(blobKey)
    deleteImage(oldBlobKey) // Borramos la anterior del servidor siempre
}





// muestra el formulario de edición del punto. Vacio o con los datos
// del punto ya rellenados y listos para editar
function fillInfoPanel(marker){

    if (!marker.point){
	return
    }

    var username

    getUserById(marker.point.UserId,function(user){
	username = user.Name
    },false)

    html=""
    html+="<h2>"+marker.point.Name+"</h2>"
    html+="<p><span> Coord: "+marker.point.Lat+", "+marker.point.Lon+"</span></p>"
    html+="<p><span> Por "+username+"</span></p>"
    if (marker.point.ImageKey!=""){
	html+="<img src=\"http://localhost:8080/images/serve?blobKey="+marker.point.ImageKey+"\" />"
    }
    html+="<p>"+marker.point.Desc+"</p>"

    $("#infopanel #info-key").val(marker.point.Id)
    $("#infopanel .content").html(html)

    showPanel("#infopanel")

    // Configuro botones de registro, actualizar borrar y cerrar
    $("#infopanel #checkin").off('click').click(function(){
	newCheckin(marker)  //muestro formulario de checkin
    })

    $("#infopanel #update").off('click').click(function(){
	fillEditPointPanel(marker)  //muestro formulario de edición
    })

    $("#infopanel #delete").off('click').click(function(){
	showConfirmation("¿Realmente desea eliminar el punto?",deleteMarkerFromMap)
	showPanel("#userpanel")
    })

    $("#infopanel #close").off('click').click(function(){
	showPanel("#userpanel",true)
    })
}



// Configura el formulario de edición, bien para craar un nuevo punto o bien para 
// editar un punto ya existente
function fillEditPointPanel(marker){

    if (marker && marker.point){
	// 
	// ------------- Actualizando un punto existente  ------------- 
	// 
	$("#editpanel #name").val(marker.point.Name)
	$("#editpanel #lat").val(marker.point.Lat)
	$("#editpanel #lon").val(marker.point.Lon)
	$("#editpanel #desc").val(marker.point.Desc)
	$("#editpanel #edit-key").val(marker.point.Id)
	$("#editpanel #blobKey").val(marker.point.ImageKey)
	$("#editpanel #imgPreview").empty()
	if (marker.point.ImageKey!=""){
	    $("#editpanel #imgPreview").append("<img src=\"http://localhost:8080/images/serve?blobKey="+marker.point.ImageKey+"\"  />")
	}

	$("#editpanel #savePoint").off('click').click(function(){
	    marker.point.UserId = current_session.user.Id
	    marker.point.Name = $("#name").val()
	    marker.point.Id = parseInt($("#edit-key").val())
	    marker.point.Lat = $("#lat").val()
	    marker.point.Lon = $("#lon").val()
	    marker.point.Desc = $("#desc").val()
	    marker.point.ImageKey = $("#blobKey").val()

	    sendPoint(marker.point,function(point){
		points.push(point)
	    },false)
	    showPanel("#userpanel")
	})

    }else{
	// 
	// ------------- Creando un nuevo punto  ------------- 
	// 
	$("#editpanel #name").val("")
	$("#editpanel #lat").val(nomadMap.marker_lat)
	$("#editpanel #lon").val(nomadMap.marker_lon)
	$("#editpanel #desc").val("")
	$("#editpanel #img").val("")
	$("#editpanel #imgPreview").empty()

	$("#editpanel #savePoint").off('click').click(function(){
	    // Creo el punto y relleno con el formulario
	    var p = {
		UserId : current_session.user.Id,
		Name : $("#name").val(),
		Lat :  $("#lat").val(),
		Lon :  $("#lon").val(),
		Desc : $("desc").val(),
		ImageKey : $("#blobKey").val()
	    }
	    
	    sendPoint(p,addMarkerToMap,false)
	    showPanel("#userpanel")
	})
    }

    //configuro botones de cancelar  en ambos casos
    $("#editpanel #cancelPoint").off('click').click(function(){
	showPanel("#userpanel",true)
    })
    
    showPanel("#editpanel")
}


function fillUserPanel(){
    
    $("#total-user-checkins").html(current_session.totalCheckins())
    $("#total-user-points").html(current_session.totalMarkers())
    $("#username").html(current_session.user.Name)

    fillCheckins(current_session.checkins,"#checkinsTable")
}




function fillCheckins(checkins,divId){
    if (!checkins){
	return
    }
    for (var i=0;i<checkins.length;i++){
	checks[checkins[i].Id]=checkins[i]
	getPoint(checkins[i].PointId,function(point){
	    $(divId).append("<tr><td>"+point.Name+"</td><td><a href=\"#\" id=\"deleteCheckin\"><span icon=\"&#xf1f8;\"></span></a></td></tr>")
	},true)
    }
}





function newCheckin(marker){

    for (var i = new Date().getFullYear(); i > 1980; i--){
	$('#year').append($('<option />').val(i).html(i));
    }

    var months=["Enero","Febrero","Marzo","Abril","Mayo",
		"Junio","Julio","Agosto","Septiembre",
		"Octubre","Noviembre","Diciembre"]

    for (var i = 0; i<months.length;i++){
	$('#month').append($('<option />').val(i+1).html(months[i]));
    }

    $("#checkinpanel #nights").val(0)

    $("#checkinpanel #saveCheckin").off('click').click(function(){
	// Creo el checkin y relleno con el formulario

	var c ={
	    UserId : current_session.user.Id,
	    PointId : marker.point.Id,
	    Stamp : $("#month").val()+"/"+$("#year").val(),
	    Nights : parseInt($("#nights").val()),
	    Text : $("#comment").val()
	}
	
	addCheckin(c,null,false)
	showPanel("#userpanel")
    })

    $("#checkinpanel #cancelCheckin").off('click').click(function(){
	showPanel("#userpanel",true)
    })

    showPanel("#checkinpanel")
}











function showPanel(panel,cancelOp){

    if (!cancelOp){
	cancelOp=false
    }

    $("#infopanel").hide()
    $("#editpanel").hide()
    $("#checkinpanel").hide()
    $("#userpanel").hide()

    if (cancelOp){
	var windowsize = $(window).width();
	if( windowsize < 700 ){
	    $("#userframe").hide()
	    $("#collapse-tab #up-arrow").hide();
	    $("#collapse-tab #down-arrow").show();
	    return
	}
    }

    if (panel){
	$("#userframe").show();  //si estamos en responsive es posible que este hide
	$(panel).show()
	$("#collapse-tab #up-arrow").show();
	$("#collapse-tab #down-arrow").hide();
    }
}





function showError(error){
    $("#modal" ).dialog({height:80,
			 title:"Error",
			 width:280,
			 resizable: false,
			 autoOpen: false });
    $("#modal" ).html(error).dialog("open");
}





function showConfirmation(msg,callback){

    $( "#modal" ).dialog({
	title:"Advertencia",
	resizable: false,
	autoOpen: false,
	buttons: [
	    {
		text: "Si",
		icons: {
		    primary: "ui-icon-check"
		},
		click: function(){
		    callback()
		    $( this ).dialog( "close" );
		},
	    },
	    {
		text: "No",
		icons: {
		    primary: "ui-icon-close"
		},
		click: function() {
		    $( this ).dialog( "close" )
		}
	    }
	]
    });

    $("#modal" ).html(msg).dialog("open");
}












function init(){
    nomadMap = new NomadMap()

    nomadMap.onMapClickHandler=function(event){
	nomadMap.setCurrentMarker(event.latLng)
	showPanel("#userpanel")
    }

    nomadMap.onMarkerClickHandler=function(){
	if (this.point){    // this is the marker
	    fillInfoPanel(this)
	}else{              // marker without point. It's the current marker
	    fillEditPointPanel(null) 
	}
    }

    nomadMap.init()


    current_session = new Session(nomadMap)
    current_session.init()

    fillUserPanel()
}


$(document).ready(function(){
    
    google.maps.event.addDomListener(window, 'load', init)

 
    $("#userpanel").show()

    $("#img").on("change",function() {
	var form = document.getElementById("editform")
	sendImage(form,previewImage)
    });


    $("#collapse-tab #up-arrow").click(function(){
	$("#userframe").hide();
	$("#collapse-tab #up-arrow").hide();
	$("#collapse-tab #down-arrow").show();
    })
    $("#collapse-tab #down-arrow").click(function(){
	showPanel("#userpanel")
	$("#collapse-tab #down-arrow").hide();
	$("#collapse-tab #up-arrow").show();
    })
});



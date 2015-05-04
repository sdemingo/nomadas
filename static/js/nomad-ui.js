


var nomadMap
var current_session 




// Dado un punto añade un marcador al mapa y le asigna ese punto
function addMarkerToMap(point){
    sendPoint(point,function(){
	current_session.addMarker(point)
	$("#total-user-points").html(current_session.totalMarkers())
    },false)
}


function deleteMarkerFromMap(){
    var point_id = $("#info-key").val()
    deletePoint(point_id,function(){
	current_session.deleteMarker(point_id)
	$("#total-user-points").html(current_session.totalMarkers())
    },false)
}


function addCheckinToMap(checkin,point){
    addCheckin(checkin,function(){
	// Cambio el marker por uno visitado
	current_session.deleteMarker(point.Id)
	current_session.addMarker(point,MARKERCOLOR_VISITED)
	setTimeout(function(){
	    current_session.addCheckin(checkin)
	    fillUserPanel()
	},1000)
    },false)
}


function deleteCheckinFromMap(){
    // TODO
}





// Recarga el cuadro de previsualización de la imagen en el formulario de edición
function previewImage(blobKey){
    $("#imgPreview").empty()
    if (blobKey!=""){
	$("#imgPreview").append("<img src=\""+DOMAIN+"/images/serve?blobKey="+blobKey+"\"  />")
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
	html+="<img src=\""+DOMAIN+"/images/serve?blobKey="+marker.point.ImageKey+"\" />"
    }
    html+="<p>"+marker.point.Desc+"</p>"

    $("#infopanel #info-key").val(marker.point.Id)
    $("#infopanel .content").html(html)

    showPanel("#infopanel")

    // Configuro botones de registro, actualizar borrar y cerrar
    $("#infopanel #checkin").off('click').click(function(){
	fillCheckin(marker)  //muestro formulario de checkin
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
	    $("#editpanel #imgPreview").append("<img src=\""+DOMAIN+"/images/serve?blobKey="+marker.point.ImageKey+"\"  />")
	}

	$("#editpanel #savePoint").off("click").click(function(){
	    marker.point.UserId = current_session.user.Id
	    marker.point.Name = $("#name").val()
	    marker.point.Id = parseInt($("#edit-key").val())
	    marker.point.Lat = $("#lat").val()
	    marker.point.Lon = $("#lon").val()
	    marker.point.Desc = $("#desc").val()
	    marker.point.ImageKey = $("#blobKey").val()

	    sendPoint(marker.point,null,false)
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

	$("#editpanel #savePoint").off("click").click(function(){
	    // Creo el punto y relleno con el formulario
	    var p = {
		UserId : current_session.user.Id,
		Name : $("#name").val(),
		Lat :  $("#lat").val(),
		Lon :  $("#lon").val(),
		Desc : $("desc").val(),
		ImageKey : $("#blobKey").val()
	    }
	    
	    //sendPoint(p,addMarkerToMap,false)
	    addMarkerToMap(p)
	    showPanel("#userpanel")
	})
    }


    //configuro botones de cancelar  en ambos casos
    $("#editpanel #cancelPoint").off("click").click(function(){
	showPanel("#userpanel",true)
    })

    // configuro en upload de la imagen
    $("#editpanel #img").off("change").on("change",function() {
	var formData = document.getElementById("editform")
	sendImage(formData,previewImage)
    });
    
    showPanel("#editpanel")
}


function fillUserPanel(){
    $("#total-user-checkins").html(current_session.totalCheckins())
    $("#total-user-points").html(current_session.totalMarkers())
    $("#username").html(current_session.user.Name)
    fillCheckinsTable("#checkinsTable")
}




function fillCheckinsTable(divId){
    var checkins = current_session.checkins
    if (!checkins){
	return
    }

    $(divId).empty()

    for (var i=0;i<checkins.length;i++){
	var m = current_session.getMarker(checkins[i].PointId)
	if (m && m.point){
	    var row = "<tr> \
<td><a href=\"#\" class=\"showPoint\" id=\"showPoint-"+m.point.Id+"\">"+m.point.Name+"</a></td>  \
<td>"+checkins[i].Stamp+"</td>  \
<td><a href=\"#\" class=\"btn delPoint\" id=\"delPoint-"+m.point.Id+"\"><span icon=\"&#xf00d;\"></span></a></td> \
</tr>"
	    $(divId).append(row)
	    
	}
    }

    $(divId+" tr:even").addClass("colored")

    $(divId+" .showPoint").click(function(){
	var id=$(this).attr("id")
	var f=id.split("-")
	if (f[1]){
	    var m = current_session.getMarker(f[1])
	    fillInfoPanel(m)
	}
    })

    $(divId+" .delPoint").click(function(){
	var id=$(this).attr("id")
	var f=id.split("-")
	if (f[1]){
	    var m = current_session.deleteMarker(f[1])
	}
    })
}





function fillCheckin(marker){

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
	addCheckinToMap(c,marker.point)
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












function initCollapseArrow(){
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
}



function initSessionMap(){
    nomadMap = new NomadMap()

    nomadMap.onMapClickHandler=function(event){
	nomadMap.setCurrentMarker(event.latLng)
	//showPanel("#userpanel")
    }

    nomadMap.onMarkerClickHandler=function(){
	if (this.point){    // marker with point its a normal marker
	    fillInfoPanel(this)
	}
    }

    nomadMap.onMarkerDblClickHandler=function(){
	if (!this.point){    // marker without point. It's the current marker
	    fillEditPointPanel(null)  
	}
    }

    nomadMap.init()
    current_session = new Session(nomadMap)
    current_session.init()

    fillUserPanel()
}





$(document).ready(function(){
    
    google.maps.event.addDomListener(window, "load", initSessionMap)
    initCollapseArrow()
    $("#userpanel").show()
});



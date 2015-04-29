





// Dado un punto añade un marcador al mapa y le asigna ese punto
function addMarkerToMap(point){
    var m = marker(new google.maps.LatLng(marker_lat,marker_lon), name)
    google.maps.event.addListener(m, 'click', function() {
	showInfo(this)
    });
    m.point = point
    markers.push(m)

    var t = $("#total-user-points").html()
    t = parseInt(t)+1
    $("#total-user-points").html(t)
}



function deleteMarkerFromMap(){
    var point_id = $("#info-key").val()
    deletePoint(point_id,null,false)

    nomadMap.deleteMarker(point_id)

    var t = $("#total-user-points").html()
    t = parseInt(t)-1
    $("#total-user-points").html(t)
    
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
function showInfo(marker){

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

    $("#infopoint #info-key").val(marker.point.Id)
    $("#infopoint .content").html(html)

    showPanel("#infopoint")

    // Configuro botones de registro, actualizar borrar y cerrar
    $("#infopoint #checkin").off('click').click(function(){
	newCheckin(marker)  //muestro formulario de checkin
    })

    $("#infopoint #update").off('click').click(function(){
	editInfo(marker)  //muestro formulario de edición
    })

    $("#infopoint #delete").off('click').click(function(){
	showConfirmation("¿Realmente desea eliminar el punto?",deleteMarkerFromMap)
	showPanel("#userpanel")
    })

    $("#infopoint #close").off('click').click(function(){
	showPanel("#userpanel",true)
    })
}



// Configura el formulario de edición, bien para craar un nuevo punto o bien para 
// editar un punto ya existente
function editInfo(marker){

    if (marker && marker.point){
	// 
	// ------------- Actualizando un punto existente  ------------- 
	// 
	$("#editpoint #name").val(marker.point.Name)
	$("#editpoint #lat").val(marker.point.Lat)
	$("#editpoint #lon").val(marker.point.Lon)
	$("#editpoint #desc").val(marker.point.Desc)
	$("#editpoint #edit-key").val(marker.point.Id)
	$("#editpoint #blobKey").val(marker.point.ImageKey)
	$("#editpoint #imgPreview").empty()
	if (marker.point.ImageKey!=""){
	    $("#editpoint #imgPreview").append("<img src=\"http://localhost:8080/images/serve?blobKey="+marker.point.ImageKey+"\"  />")
	}

	$("#editpoint #savePoint").off('click').click(function(){
	    marker.point.UserId = current_user.Id
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
	$("#editpoint #name").val("")
	$("#editpoint #lat").val(marker_lat)
	$("#editpoint #lon").val(marker_lon)
	$("#editpoint #desc").val("")
	$("#editpoint #img").val("")
	$("#editpoint #imgPreview").empty()

	$("#editpoint #savePoint").off('click').click(function(){
	    // Creo el punto y relleno con el formulario
	    var p = new Point()

	    p.UserId = current_user.Id
	    p.Name = $("#name").val()
	    p.Lat = $("#lat").val()
	    p.Lon = $("#lon").val()
	    p.Desc = $("desc").val()
	    p.ImageKey = $("#blobKey").val()
	    
	    sendPoint(p,addMarkerToMap,false)
	    showPanel("#userpanel")
	})
    }

    //configuro botones de cancelar  en ambos casos
    $("#editpoint #cancelPoint").off('click').click(function(){
	showPanel("#userpanel",true)
    })
    
    showPanel("#editpoint")
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
	var c = new Checkin()

	c.UserId = current_user.Id
	c.PointId = marker.point.Id
	c.Stamp = $("#month").val()+"/"+$("#year").val()
	c.Nights = parseInt($("#nights").val())
	c.Text = $("#comment").val()
	
	addCheckin(c,null,false)
	showPanel("#userpanel")
    })

    $("#checkinpanel #cancelCheckin").off('click').click(function(){
	showPanel("#userpanel",true)
    })

    showPanel("#checkinpanel")
}



function showCheckins(checkins,divId){
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




function showPanel(panel,cancelOp){

    if (!cancelOp){
	cancelOp=false
    }

    $("#infopoint").hide()
    $("#editpoint").hide()
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






/*
 * 
 *       PRINCIPAL
 *
 */

var nomadMap
var current_user


function init(){
    nomadMap = new NomadMap()
    nomadMap.init()

    current_user = new Session(nomadMap)
    current_user.init()


    $("#total-user-checkins").html(current_user.totalCheckins())
    $("#total-user-points").html(current_user.totalPoints())
    showCheckins(current_user.checkins,"#checkinsTable")
}


$(document).ready(function(){
    
    google.maps.event.addDomListener(window, 'load', init)


    $("#userpanel").show()

    $("#img").on("change",function() {
	var form = document.getElementById("editform")
	sendImage(form,previewImage)
    });


    // Controlo el menu desplegable 
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



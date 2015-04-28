

var points = []
var checks = []


var markers = []
var current_marker = null;

var maker_lat, marker_lon;
var locc = new google.maps.LatLng(40.4279613,10.2967822);
var map;
var blank_name = "Punto sin nombre"

var current_user





/*
 *
 *       FUNCIONES PARA GESTION DEL SESION LOCAL
 *
 */

function Session(){
    
    this.user
    this.points=[]
    this.checkins=[]

    Session.prototype.init=function(){
	var u
	var pts
	var chks

	getUserById(0,function(user){
	    u=user  
	},false)
	this.user=u

	getPointByUser(this.user.Id,function(srvpts){
	    pts=srvpts
	},false)

	getCheckinByUser(this.user.Id,function(srvchks){
	    chks=srvchks
	},false)

	this.points=pts
	this.checkins=chks
    }

    // Chequea si el usuario ha visisitado ese punto
    Session.prototype.pointVisited=function(pid){
	for (var i=0;i<this.checkins.length; i++){
	    if (this.checkins[i].PointId == pid){
		return true
	    }
	}
	return false
    }

    Session.prototype.totalPoints=function(){
	return this.points.length
    }

    Session.prototype.totalCheckins=function(){
	return this.checkins.length
    }

    
}








/*
 * 
 *       FUNCIONES PARA MAPA
 *
 */


function Point(){
    this.Id=0
    this.UserId=0
    this.Name=blank_name
    this.Lat=0
    this.Lon=0
    this.ImageKey=""
    this.Desc=""
}



function Checkin(){
    this.Id=0
    this.UserId=0
    this.PointId=0
    this.Stamp=""
    this.Nights=0
    this.Text=""
}



// Función de inicialización del mapa
function initialize() {

    var mapOptions = {
	zoom: 5,
	disableDefaultUI: true,
	center: locc
    }


    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);   

    // Dibujo marcadores en el mapa

    for (var i=0;i<current_user.points.length;i++){
	var m 
	var p = current_user.points[i]
	if (current_user.pointVisited(p.Id)){
	    m = marker(new google.maps.LatLng(p.Lat,p.Lon),p.Name)
	}else{
	    m = marker(new google.maps.LatLng(p.Lat,p.Lon),p.Name,"FireBrick")
	}
	m.point=p
	markers.push(m)

	// Asociamos a cada punto el evento de click
	google.maps.event.addListener(m, 'click', function() {
	    showInfo(this)
	});
    }
    

    // Evento de redimensionado
    google.maps.event.addDomListener(window, 'resize', function() {
	var center = map.getCenter();
	google.maps.event.trigger(map, "resize");
	map.setCenter(center);
    });


    // Evento de posicionamiento del current marker
    google.maps.event.addListener(map, 'click', function(event) {
	set_current_marker(event.latLng);
	showPanel("#userpanel")
    });
}



// Crea un marcador generico
function marker(location,name,color){
    if (!color){
	color = "green"
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
    return m
}



// Situa el marcador principal que actua de cursor
function set_current_marker(location) {
    marker_lat=location.lat()
    marker_lon=location.lng()

    if (current_marker) {
	current_marker.setPosition(location);
    } else {
	current_marker = marker(location,"","orange")

	google.maps.event.addListener(current_marker, 'click', function(){
	    editInfo(null)
	    set_current_marker(this.getPosition());
	});
    }
}



// Borra un marcador a través de la id de punto almacenada en el
function delete_marker(id){
    for (var i=0;i<markers.length;i++){
	if ((markers[i]) && (markers[i].point.Id == id)){
	    markers[i].setMap(null)
	    markers[i] = null
	}
    }
}



















/*
 * 
 *       INTERFAZ GRÁFICA
 *
 */





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



function deleteMarker(){
    var point_id = $("#info-key").val()
    deletePoint(point_id,null,false)

    delete_marker(point_id)

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
	showConfirmation("¿Realmente desea eliminar el punto?",deleteMarker)
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


$(document).ready(function(){
    
    current_user = new Session()
    current_user.init()

    google.maps.event.addDomListener(window, 'load', initialize)


    $("#total-user-checkins").html(current_user.totalCheckins())
    $("#total-user-points").html(current_user.totalPoints())
    showCheckins(current_user.checkins,"#checkinsTable")


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



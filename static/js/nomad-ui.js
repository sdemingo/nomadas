

var mobileUIWidth = 700
var mobileUI = false
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
	current_session.addMarker(point,true)
	setTimeout(function(){
	    current_session.reloadCheckins(fillUserPanel)
	},1500)
    },false)
}



function deleteCheckinFromMap(ckid,pid){

    var marker = current_session.getMarker(pid)
    var point = marker.point
    var ncheckins

    // Chequeo cuantos checkins tiene el punto
    getCheckinByPoint(pid,function(data){
	if (data){
	    ncheckins=data.length
	}else{
	    ncheckins=0
	}
	console.log(ncheckins)
    },false)

    deleteCheckin(ckid,function(){
	setTimeout(function(){
	    console.log("Recargo panel")
	    current_session.reloadCheckins(fillUserPanel)
	},1500)
	if (ncheckins <= 1){
	    // Cambio el marker por uno no visitado
	    current_session.deleteMarker(point.Id)
	    current_session.addMarker(point,false)
	}
    },false)
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

    fillPointCheckinsTable(marker.point.Id,"#pointCheckinsTable")

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

	    if (current_session.markerOk(marker.point)){
		sendPoint(marker.point,null,false)
		showPanel("#userpanel")
	    }else{
		showError("Algunos campos no se rellenaron correctamente")
	    }
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

	    if (current_session.markerOk(p)){
		//sendPoint(p,addMarkerToMap,false)
		addMarkerToMap(p)
		showPanel("#userpanel")
	    }else{
		showError("Algunos campos no se rellenaron correctamente")
	    }
	})
    }


    //configuro botones de cancelar  en ambos casos
    $("#editpanel #cancelPoint").off("click").click(function(){
	showPanel("#userpanel",true)
	deleteImage($("#blobKey").val())
    })

    // configuro en upload de la imagen
    $("#editpanel #img").off("change").on("change",function() {
	var formData = document.getElementById("editform")
	sendImage(formData,previewImage)
    })
    
    showPanel("#editpanel")
}


function fillUserPanel(){
    $("#total-user-checkins").html(current_session.totalCheckins())
    $("#total-user-points").html(current_session.totalMarkers())
    $("#username").html(current_session.user.Name)
    fillUserCheckinsTable("#userCheckinsTable")
}




function fillUserCheckinsTable(divId){

    $(divId).empty()

    var checkins = current_session.checkins
    if (!checkins){
	return
    }

    if (checkins.length>0){
	$(divId).append("<tr><th>Lugar</th><th>Fecha</th><th>Eliminar</th></tr>")
    }
    for (var i=0;i<checkins.length;i++){
	var m = current_session.getMarker(checkins[i].PointId)
	if (m && m.point){
	    var row = "<tr> \
<td class=\"resp-title\"><a href=\"#\" class=\"showPoint\" id=\"showPoint-"+m.point.Id+"\">"+m.point.Name+"</a></td>  \
<td class=\"center-align-cell resp-title\">"+showDate(checkins[i].Stamp)+"</td>  \
<td class=\"center-align-cell\"><a href=\"#\" class=\"btn delCheckin\" id=\"delCheckin-"+checkins[i].Id+"-"+m.point.Id+"\"><span icon=\"&#xf00d;\"></span></a></td> \
</tr>"
	    $(divId).append(row) 
	}
    }

    $(divId+" tr:odd").addClass("colored")

    $(divId+" .showPoint").click(function(){
	var id=$(this).attr("id")
	var f=id.split("-")
	if (f[1]){
	    var m = current_session.getMarker(f[1])
	    fillInfoPanel(m)
	}
    })

    $(divId+" .delCheckin").click(function(){
	var id=$(this).attr("id")
	var f=id.split("-")
	if (f[1] && f[2]){
	    showConfirmation("¿Realmente desea eliminar el registro?",function(){
		deleteCheckinFromMap(f[1],f[2])
	    })
	}
    })

    if (mobileUI){
	$(divId+" td.resp-title").each(function(){
	    $(this).attr("title",$(this).text())
	})
	    }
}



function fillPointCheckinsTable(pid,divId){

    var checkins

    $(divId).empty()

    getCheckinByPoint(pid,function(cks){
	checkins=cks
    },false)
    
    if (!checkins){
	return
    }

    if (checkins.length>0){
	$(divId).append("<tr><th>Nombre</th><th>Fecha</th><th>Noches</th></tr>")
    }

    for (var i=0;i<checkins.length;i++){	
	var row = "<tr> \
<td class=\"resp-title\">"+checkins[i].Username+"</td>  \
<td class=\"center-align-cell resp-title\">"+showDate(checkins[i].Stamp)+"</td>  \
<td class=\"center-align-cell resp-title\">"+checkins[i].Nights+"</td>  \
</tr>"
	$(divId).append(row)
    }

    $(divId+" tr:odd").addClass("colored")

    if (mobileUI){
	$(divId+" td.resp-title").each(function(){
	    $(this).attr("title",$(this).text())
	})
	    }
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

    $("#checkinpanel #nights").val(1)
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
	if (mobileUI){
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



function showDate(date){
    var month,year

    var f = date.split("/")
    
    if (f[0] == 1) {month = "Ene"}
    if (f[0] == 2) {month = "Feb"}
    if (f[0] == 3) {month = "Mar"}
    if (f[0] == 4) {month = "Abr"}
    if (f[0] == 5) {month = "May"}
    if (f[0] == 6) {month = "Jun"}
    if (f[0] == 7) {month = "Jul"}
    if (f[0] == 8) {month = "Ago"}
    if (f[0] == 9) {month = "Sept"}
    if (f[0] == 10){month = "Oct"}
    if (f[0] == 11){month = "Nov"}
    if (f[0] == 12){month = "Dic"}

    year = f[1]
    if (mobileUI && year.length==4){
	year = year.substring(2,4)
    }

    return month+" "+year
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

    if ( $(window).width() < mobileUIWidth){
	mobileUI=true
    }
    
    google.maps.event.addDomListener(window, "load", initSessionMap)
    initCollapseArrow()
    $("#userpanel").show()
});



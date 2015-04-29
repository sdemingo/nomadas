


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




function Session(map){
    
    this.user
    this.points=[]
    this.checkins=[]
    this.nomadMap=map
}


Session.prototype.init=function(){
    var u
    var pts
    var chks

    getUserById(0,function(user){
	u=user  
    },false)
    this.user=u

    if (this.user){
	getPointByUser(this.user.Id,function(srvpts){
	    pts=srvpts
	},false)

	getCheckinByUser(this.user.Id,function(srvchks){
	    chks=srvchks
	},false)

	//this.points=pts
	this.checkins=chks

	// Dibujo los puntos en markers del mapa
	for (var i=0;i<pts.length;i++){
	    this.nomadMap.addMarker(pts[i],this.pointVisited(pts[i].Id))
	}
    }
}


// Chequea si el usuario ha visisitado ese punto
Session.prototype.pointVisited=function(pid){
    if (this.checkins){
	for (var i=0;i<this.checkins.length; i++){
	    if (this.checkins[i].PointId == pid){
		return true
	    }
	}
    }
    return false
}

Session.prototype.totalPoints=function(){
    if (this.points){
	return this.points.length
    }else{
	return 0
    }
}

Session.prototype.totalCheckins=function(){
    if (this.checkins){
	return this.checkins.length
    }else{
	return 0
    }
}





function NomadMap(){
    this.markers=[]
    this.current_marker = null;
    this.maker_lat=0 
    this.marker_lon=0
    this.map

    this.initLoc = new google.maps.LatLng(15.4279613,20.2967822);
}


NomadMap.prototype.init=function(){
    var self = this

    this.mapOptions = {
	zoom: 5,
	disableDefaultUI: true,
	center: this.initLoc
    }

    this.map = new google.maps.Map(document.getElementById("map-canvas"), this.mapOptions);   

    // Evento de redimensionado
    google.maps.event.addDomListener(window, "resize", function() {
	var center = self.map.getCenter();
	google.maps.event.trigger(this.map, "resize");
	self.map.setCenter(center);
    });

    // Evento de posicionamiento del current marker
    google.maps.event.addListener(this.map, "click", function(event) {
	//set_current_marker(event.latLng);
	self.setCurrentMarker(event.latLng)
	showPanel("#userpanel")
    });
}



NomadMap.prototype.newMarker=function(location,name,color){
    if (!color){
	color = "green"
    }

    var m = new google.maps.Marker({
	position:location,
	map:this.map,
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


NomadMap.prototype.setCurrentMarker=function(location){
    this.marker_lat=location.lat()
    this.marker_lon=location.lng()

    if (this.current_marker) {
	this.current_marker.setPosition(location);
    } else {
	this.current_marker = this.newMarker(location,"","orange")

	google.maps.event.addListener(this.current_marker, "click", function(){
	    editInfo(null)
	    set_current_marker(this.getPosition());
	});
    }
}



NomadMap.prototype.addMarker=function(point,visited){

    if (visited){
	m = this.newMarker(new google.maps.LatLng(point.Lat,point.Lon),point.Name)
    }else{
	m = this.newMarker(new google.maps.LatLng(point.Lat,point.Lon),point.Name,"FireBrick")
    }
    m.point=point
    this.markers.push(m)

    // Asociamos a cada punto el evento de click (meter el callback por parametro)
    google.maps.event.addListener(m, 'click', function() {
	showInfo(this)
    });
}


NomadMap.prototype.deleteMarker=function(id){
    for (var i=0;i<this.markers.length;i++){
	if ((this.markers[i]) && (this.markers[i].point.Id == id)){
	    this.markers[i].setMap(null)
	    this.markers[i] = null
	}
    }
}





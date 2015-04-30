





var MARKERCOLOR = "FireBrick"
var MARKERCOLOR_VISITED = "green"
var MARKERCOLOR_CURRENT = "orange"


function Session(map){
    
    this.user
    this.markers=[]
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
	this.checkins=chks

	if (pts){
	    for (var i=0;i<pts.length;i++){
		this.addMarker(pts[i],this.pointVisited(pts[i].Id))
	    }
	}
    }
}


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

Session.prototype.totalMarkers=function(){
    if (this.markers){
	return this.markers.length
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


Session.prototype.addMarker=function(point,visited){

    if (visited){
	m = this.nomadMap.newMarker(new google.maps.LatLng(point.Lat,point.Lon),point.Name)
    }else{
	m = this.nomadMap.newMarker(new google.maps.LatLng(point.Lat,point.Lon),point.Name, MARKERCOLOR)
    }
    m.point=point
    this.markers.push(m)
}


Session.prototype.deleteMarker=function(id){
    for (var i=0;i<this.markers.length;i++){
	if ((this.markers[i]) && (this.markers[i].point.Id == id)){
	    this.markers[i].setMap(null)
	    this.markers.splice(i, 1);
	    i--;
	}
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


    google.maps.event.addDomListener(window, "resize", function() {
	var center = self.map.getCenter();
	google.maps.event.trigger(this.map, "resize");
	self.map.setCenter(center);
    });


    google.maps.event.addListener(this.map,"click",this.onMapClickHandler)

}



NomadMap.prototype.newMarker=function(location,name,color){
    if (!color){
	color = MARKERCOLOR_VISITED
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

    google.maps.event.addListener(m,"click",this.onMarkerClickHandler)

    return m
}


NomadMap.prototype.setCurrentMarker=function(location){
    this.marker_lat=location.lat()
    this.marker_lon=location.lng()

    if (this.current_marker) {
	this.current_marker.setPosition(location);
    } else {
	this.current_marker = this.newMarker(location,"",MARKERCOLOR_CURRENT)
    }
}






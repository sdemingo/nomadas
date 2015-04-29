


function Point(){
    this.Id=0
    this.UserId=0
    this.Name=""
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

    google.maps.event.addListener(m, 'click', function() {
	showInfo(this)
    });
}


Session.prototype.deleteMarker=function(id){
    for (var i=0;i<this.markers.length;i++){
	if ((this.markers[i]) && (this.markers[i].point.Id == id)){
	    this.markers[i].setMap(null)
	    this.markers[i] = null
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
}


NomadMap.prototype.addListener=function(eventName,callback){
    google.maps.event.addListener(this.map, eventName, callback)
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
    return m
}


NomadMap.prototype.setCurrentMarker=function(location){
    this.marker_lat=location.lat()
    this.marker_lon=location.lng()

    if (this.current_marker) {
	this.current_marker.setPosition(location);
    } else {
	this.current_marker = this.newMarker(location,"",MARKERCOLOR_CURRENT)

	google.maps.event.addListener(this.current_marker, "click", function(){
	    editInfo(null)
	    set_current_marker(this.getPosition());
	});
    }
}






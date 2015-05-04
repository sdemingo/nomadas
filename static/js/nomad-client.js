
/*
 * 
 *       COMUNICACIONES POR AJAX CON EL SERVIDOR
 *
 */

//var DOMAIN = "http://civic-rhythm-92417.appspot.com"
var DOMAIN = "http://192.168.1.11:8080"
//var DOMAIN = ""


// Recibe el punto para ser enviado al servidor y el callback que será ejecutado 
// cuando retorne exito el envio. El callback recibe el punto y la id asignada al punto
// en la base de datos
function sendPoint(p,callback,asy){

    if (asy==undefined){
	asy=true
    }

    $.ajax({
	url: DOMAIN+'/points/edit',
	type: 'post',
	dataType: 'json',
	data: JSON.stringify(p),
	async:asy,
	success: callback,
	error: function(data){
            console.log("send point error:"+data);
        }
    });
}



function deletePoint(id,callback,asy){
    if (asy==undefined){
	asy=true
    }

    $.ajax({
	url: DOMAIN+"/points/delete?id="+id,
	type: 'get',
	dataType: 'text',
	async:asy,
	success: callback,
	error: function(data){
            console.log("delete point error:"+data);
        }
    });
}


function getPoint(id,callback,asy){
    if (asy==undefined){
	asy=true
    }

    $.ajax({
	url: DOMAIN+"/points/get?id="+id,
	type: 'get',
	dataType: 'json',
	async:asy,
	success: callback
    });
}


function getPointByUser(uid,callback,asy){
    if (asy==undefined){
	asy=true
    }

    $.ajax({
	url: DOMAIN+"/points/get?userId="+uid,
	type: 'get',
	dataType: 'json',
	async:asy,
	success: callback
    });
}




function sendImage(form,callback){
    var formData = new FormData(form)
    var updateUrl=""

    // solicito primero la subida para que el servidor reservle la url de subida
    $.ajax({
	type:"GET",
	url: DOMAIN+"/images/new",
	async:false,
	success:function(data){
	    updateUrl=data
	},
	error: function(data){
            console.log("requested upload url error:"+data);
        }
    })

    // subo la foto a la url devuelta
    if (updateUrl != ""){
	$.ajax({
            type:"POST",
            url: DOMAIN+updateUrl,
            data:formData,
            cache:false,
            contentType: false,
            processData: false,
	    success:function(data){
		callback(data)
	    },
            error: function(req,status,data){
		console.log("upload image error: "+req.responseText);
		showError("Imagen demasiado grande")
            }
	});
    }
}


function deleteImage(key,callback){
    $.ajax({
	type:"GET",
	url:DOMAIN+"/images/delete?blobKey="+key,
	success:function(data){
	    if (callback){
		callback(data)
	    }
	},
	error: function(data){
            console.log("delete image error:"+data);
        }
    })
}




function addUser(u,callback,asy){
    if (asy==undefined){
	asy=true
    }

    $.ajax({
	url:DOMAIN+'/users/edit',
	type: 'post',
	dataType: 'json',
	data: JSON.stringify(u),
	async:asy,
	success: callback,
	error: function(data){
            console.log("add user error:"+data);
        }
    });
}

// Solicita información de un usuario. Si la id introducida es cero
// se solicita la información del usuario de la sesion
function getUserById(id,callback,asy){
    if (asy==undefined){
	asy=true
    }

    $.ajax({
	type:"GET",
	url:DOMAIN+"/users/get?id="+id,
	dataType: 'json',
	async:asy,
	success:function(data){
	    if (callback){
		callback(data)
	    }
	},
	error: function(data){
            console.log("get user error:"+data);
        }
    })
}


// Solicita información de un usuario segun su mail
function getUserByMail(mail,callback,asy){
    if (asy==undefined){
	asy=true
    }

    $.ajax({
	type:"GET",
	url:DOMAIN+"/users/get?mail="+mail,
	dataType: 'json',
	async:asy,
	success:callback,
	error: function(req,status,data){
            console.log("get user error:"+req.responseText);
        }
    })
}







function addCheckin(ck,callback,asy){
    if (asy==undefined){
	asy=true
    }

    $.ajax({
	url: DOMAIN+'/checkins/add',
	type: 'post',
	dataType: 'json',
	data: JSON.stringify(ck),
	async:asy,
	success: callback,
	error: function(req,status,data){
            console.log("send checkin error:"+req.responseText);
        }
    });
}



function deleteCheckin(id,callback,asy){
    if (asy==undefined){
	asy=true
    }

    $.ajax({
	url: DOMAIN+"/checkins/delete?id="+id,
	type: 'get',
	dataType: 'text',
	async:asy,
	success: callback,
	error: function(req,status,data){
            console.log("delete checkin error:"+req.responseText);
        }
    });
}


function getCheckinByPoint(pid,callback,asy){
    if (asy==undefined){
	asy=true
    }

    $.ajax({
	url: DOMAIN+'/checkins/get?pointId='+pid,
	type: 'get',
	dataType: 'json',
	async:asy,
	success: callback,
	error: function(req,status,data){
            console.log("get checkin error:"+req.responseText);
        }
    });
}



function getCheckinByUser(uid,callback,asy){
    if (asy==undefined){
	asy=true
    }

    $.ajax({
	url: DOMAIN+'/checkins/get?userId='+uid,
	type: 'get',
	dataType: 'json',
	async:asy,
	success: function (data) { 
	    callback(data)
	},
	error: function(req,status,data){
            console.log("get checkin error:"+req.responseText);
        }
    });
}

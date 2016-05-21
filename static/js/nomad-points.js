


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
	    var vis=$(this).find(".text").html()
	    if (vis == "Público"){
	    	$("#btnVisibility").find(".text").html("Privado")
	    	$("#btnVisibility").find(".glyphicon").removeClass("glyphicon-eye-open").addClass("glyphicon-eye-close")
	    }else{
	    	$("#btnVisibility").find(".text").html("Público")
	    	$("#btnVisibility").find(".glyphicon").removeClass("glyphicon-eye-close").addClass("glyphicon-eye-open")
	    }
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

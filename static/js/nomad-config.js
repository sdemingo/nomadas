

var nomadconfig = (function(){

    var importPoints = function(){
        
	var check=window.File && window.FileReader && window.FileList && window.Blob
	if (!check){
	    showErrorMessage("FileReader API are not fully supported in this browser")
            return
	}   

	var input = document.getElementById("importFile")
	if ((!input) || (!input.files) || (!input.files[0])){
	    showErrorMessage("Please select a file before clicking load button")
	    return
	}

        file = input.files[0]
        fr = new FileReader()
	fr.readAsText(file)
        fr.onload = function(){
	    try{
		var points=JSON.parse(fr.result)
		if (!points){
		    showErrorMessage("JSON points file is bad formatted")
		    return
		}
	    }catch(err){
		showErrorMessage("JSON points file is bad formatted. "+err)
		return
	    }

	    for (var i=0;i<points.length;i++){
		nomadmap.sendPoint(points[i])
	    }

	    showInfoMessage("Se van a añadir "+points.length+" puntos. Esta operación puede tardar un tiempo")
	}
    }


    var sendConfig = function(){
	var config={}
	config.PublicBlob = $("#PublicBlob").prop("checked")

	$.ajax({
    	    url:DOMAIN+"/admin",
    	    type: 'post',
            data: JSON.stringify(config),
	    dataType: 'json',
    	    success: function (response){
		loadWelcomePanel()
		if (response.Error){
		    showErrorMessage(response.Error)
		}else{
		    showInfoMessage("Configuración actualizada con éxito")
		}
	    },
    	    error: error
	});
    }

    var readForm = function(form){
	var f = $(form).serializeObject()
	return f
    }

    var init = function(){
	$("#btnImportFile").off("click").on("click",importPoints)
	$("#btnNewConfig").off("click").on("click",sendConfig)
    }

    return{
	init:init
    }

})()

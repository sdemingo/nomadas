

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


    var init = function(){
	$("#btnImportFile").off("click").on("click",importPoints)
    }

    return{
	init:init
    }

})()

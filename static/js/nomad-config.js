

var nomadconfig = (function(){

    var importPoints = function(){
        
	var check=window.File && window.FileReader && window.FileList && window.Blob
	if (!check){
	    showErrorMessage("FileReader API are not fully supported in this browser")
            return
	}   

	var input = document.getElementById("importFile")
	if (!input) || (!input.files) || (!input.files[0]){
	    showErrorMessage("Please select a file before clicking load button")
	    return
	}

        file = input.files[0]
        fr = new FileReader()
        fr.onload = function(){
	    var points=JSON.parse(fr.result)
	    console.log("Lanzo "+points.length+" peticiones de ajax")
	    // TODO
	    // POST all points in one or many ajax request
	}
        fr.readAsText(file)
    }


    var init = function(){
	$("#btnImportFile").off("click").on("click",importPoints)
    }

    return{
	init:init
    }

})()

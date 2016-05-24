

var nomadusers = (function(){

    var listUsersFormEvents = function(){
	$(".btnDeleteUser").click(function(e){
	    e.preventDefault()
	    showErrorMessage("Esta opción aún no está implementada")
	})

	$("#btnNewUser").click(function(e){
	    e.preventDefault()
	    showErrorMessage("Esta opción aún no está implementada")
	})

    }


    var init = function(){
	listUsersFormEvents()
    }

    return{
	init:init
    }
})()

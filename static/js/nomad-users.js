

var nomadusers = (function(){

    var listUsersFormEvents = function(){
	$(".btnDeleteUser").click(function(e){
	    e.preventDefault()
	    var id=$(this).attr("href").split("=")[1]
	    if (id){
		showConfirmMessage("¿Desea completar el borrado del usuario?\nSe borrará toda la información asociada a ese usuario como puntos o registros",function(){
		    deleteUser(id)
		})
	    }
	})

	$("#btnNewUser").click(function(e){
	    e.preventDefault()
	    var user = readForm($("#formNewUser"))
	    if (!IsValidUser(user)){
		showErrorMessage("El usuario tiene campos no validos")
		return
	    }
	    addUser(user)  
	})
    }


    var addUser = function(user,nodialog){
	$.ajax({
    	    url:DOMAIN+"/users/add",
    	    type: 'post',
            data: JSON.stringify(user),
	    dataType: 'json',
    	    success: function (response){
		setTimeout(
		    function() 
		    {
			loadUsersPanel()
		    }, 1000);
		
		if ((response.Error) && (!nodialog)){
		    showErrorMessage(response.Error)
		}
	    },
    	    error: error
	})
    }


    var deleteUser = function(id){
	$.ajax({
    	    url:DOMAIN+"/users/delete?id="+id,
    	    type: 'get',
    	    success: function (response){
		setTimeout(
		    function() 
		    {
			loadUsersPanel()
		    }, 1000);
		
		if ((response.Error) && (!nodialog)){
		    showErrorMessage(response.Error)
		}
	    },
    	    error: error
	}); 
    }


    var IsValidUser = function(m){
	m.Name.trim()
	m.Mail.trim()
	return (m.Name!="") && 
	    (m.Mail!="")
    }

    var init = function(){
	listUsersFormEvents()
    }

    return{
	init:init
    }
})()

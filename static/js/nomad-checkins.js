

var nomadcheckins = (function(){

    var MAXDESCSIZE = 200

    var checkinFormEvents = function(){
	$("#btnNewCheckin").click(function(){
	    addCheckin()
	})

	$("#Desc").each(function() {
	    var $this = $(this);
	    var maxLength = MAXDESCSIZE
	    $this.attr('maxlength', null);
	    
	    var el = $("<span class=\"character-count\">" + maxLength + "/" + MAXDESCSIZE+"</span>");
	    el.insertAfter($this);
	    
	    $this.bind('keyup', function() {
		var cc = $this.val().length;
		el.text(maxLength - cc + "/"+MAXDESCSIZE);
		if(maxLength < cc) {
		    el.css('color', 'red');
		} else {
		    el.css('color', '');
		}
	    })
	});
    }
    

    var checkinForm = function(id){
	var urla=DOMAIN+"/checkins/edit"
	if (id){
	    urla=urla+"?id="+id
	}
	$.ajax({
    	    url:urla,
    	    type: 'get',
    	    success: function (html){
		showHTMLContent(html)
		moveTo("#content")
		checkinFormEvents()
	    },
    	    error: error
	})
    }


    var addCheckin = function(){
	var checkin = readForm($("#formNewCheckin"))
	if ( checkin.Desc.length > MAXDESCSIZE){
	    showErrorMessage("La descripción es demasiado larga")
	    return 
	}

	$.ajax({
    	    url:DOMAIN+"/checkins/new",
    	    type: 'post',
	    dataType: 'json',
	    data: JSON.stringify(checkin),
    	    success: function (url){
		showInfoMessage("Checkin guardado con éxito")
		loadWelcomePanel()
	    },
    	    error: error
	})
    }

    var deleteCheckin = function(id){
	$.ajax({
    	    url:DOMAIN+"/checkins/delete?id="+id,
    	    type: 'get',
    	    success: function (url){
		showInfoMessage("Checkin borrado con éxito")
		loadWelcomePanel()
	    },
    	    error: error
	})
    }


    var init = function(){

    }

    return{
	init:init,
	add:checkinForm,
	del:deleteCheckin
    }

})()

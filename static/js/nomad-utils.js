


function error (data){
    var msg = data.Error
    if ((!data) || (!data.Error)){
	msg="Se ha producido un error desconocido. El servidor no ha enviado información"
    }
    showErrorMessage(msg)
    console.log("Internal server error: "+msg)
}



function firstbootApp(){
    var firstUser={
	Mail:"admin@example.com",
	Name:"Sergio",
	Role:"1"
    }

    $.ajax({
    	url:DOMAIN+"/users/add",
	type: 'post',
	dataType: 'json',
	data: JSON.stringify(firstUser),
    	success: function(){
	    console.log("Añadido usuario por defecto")
	},
    	error: function(){
	    console.log("Error añadiendo usuario por defecto")
	}
    })

    var tags=["Vaciado","Aguas","Gasolinera","Merendero",
	      "Zona Infantil", "Gratis", "Vigilado", 
	      "Taller","Urbano"]

    $.each(tags,function(i,name){
	var tag={Name:name}
	$.ajax({
    	    url:DOMAIN+"/points/tags/add",
	    type: 'post',
	    dataType: 'json',
	    data: JSON.stringify(tag),
    	    success: function(){
		console.log("Añadida etiqueta "+name)
	    },
    	    error: function(){
		console.log("Error añadiendo etiqueta "+name)
	    }
	})
    })
	}



function showErrorMessage(text) {
    var modalData={
	id:"errorDialog",
	type:"danger",
	titleText:"Error",
	bodyText:text
    }

    modal.init(modalData)
    $("#errorDialog").modal("show")
}

function showConfirmMessage(text,actionButtonAnyHandler) {
    var modalData={
	id:"confirmDialog",
	type:"info",
	titleText:"Confirmación",
	bodyText:text,
	actionButton:{
	    text:"Ok",
	    handler: actionButtonAnyHandler
	} 
    }

    modal.init(modalData)
    $("#confirmDialog").modal("show")
}

function showInfoMessage(text) {
    var modalData={
	id:"dialog",
	type:"info",
	titleText:"Información",
	bodyText:text
    }

    modal.init(modalData)
    $("#dialog").modal("show")
}


function showHTMLContent(content){
    $("#content").html(content)
    mainEvents()
}


function moveTo(id){
    var windowsize = $(window).width();
    if (windowsize <=  480){
	$("html, body").animate({
            scrollTop: $(id).offset().top
	}, 500);
    }
}





$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
	    if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
	    }
	    o[this.name].push(this.value || '');
        } else {
	    o[this.name] = this.value || '';
        }
    });
    return o;
};

Array.prototype.clean = function(deleteValue) {
    for (var i = 0; i < this.length; i++) {
	if (this[i] == deleteValue) {         
	    this.splice(i, 1);
	    i--;
	}
    }
    return this;
};








/*
  - Run the modal with a button, using the same id for the modal an for data-target attr form button:
  <button id="..." type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#myDialog">

  - Operate the modal manually:
  $('#myDialog').modal('toggle');
  $('#myDialog').modal('show');
  $('#myDialog').modal('hide');

  - Init the modal with an object as:
  var modalData={
  id:"myDialog",
  titleText:"Titulo del dialogo",
  bodyText:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
  actionButton:{
  text:"Ok",
  handler: actionButtonAnyHandler
  } 
*/


var modal = {
    init:function(data){

	if ($(".modal").length){
	    $(".modal").remove()
	}

	$("body").append(
	    $('<div class="modal fade" id="'+data.id+'" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">')
		.append(
		    $('<div class="modal-dialog" role="document">')
			.append(
			    $('<div class="modal-content">')
				.append(
				    $('<div class="modal-header modal-header-'+data.type+'">')
					.append(
					    $('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>')
					)
					.append(
					    $('<h4 class="modal-title" id="myModalLabel">'+data.titleText+'</h4>')
					)
				)
			    
				.append(
				    $('<div class="modal-body">')
					.append(data.bodyText)
				)

				.append(
				    $('<div class="modal-footer">')
					.append(
					    $('<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>')
					)
				)
			)
		)
	)

	// insert action button
	if (data.actionButton){
	    $(".modal .modal-footer").append(
		$('<button type="button" class="btn btn-primary" data-dismiss="modal">'+data.actionButton.text+'</button>')
		    .click(data.actionButton.handler)
	    )
	}
    }
}





$(function() {
    
    function split( val ) {
	return val.split( /,\s*/ );
    }
    function extractLast( term ) {
	return split( term ).pop();
    }

    // Common functions for all input-tags
    $( "input.input-tags" )
	.bind( "keydown", function( event ) {
	    if ( event.keyCode === $.ui.keyCode.TAB &&
		 $( this ).autocomplete( "instance" ).menu.active ) {
		event.preventDefault();
	    }
	})
	.autocomplete({
	    minLength: 1,
	    source: function( request, response ) {
		response( $.ui.autocomplete.filter(
		    autocompleteTags, extractLast( request.term ) ) );
	    },
	    focus: function() {
		return false;
	    },
	    select: function( event, ui ) {
		var terms = split( this.value );
		terms.pop();
		terms.push( ui.item.value );
		terms.push( "" );
		this.value = terms.join( ", " );
		return false;
	    }
	});

    // Source callback for the users input-tags
    $("#userEditForm input.input-tags" )
	.autocomplete({
	    minLength: 1,
	    source: function( request, response ) {
		response( $.ui.autocomplete.filter(
		    Object.keys(CHEX.userTags), extractLast( request.term ) ) );
	    }
	});

    // Source callback for the questions input-tags
    $("#questEditForm input.input-tags" )
	.autocomplete({
	    minLength: 1,
	    source: function( request, response ) {
		response( $.ui.autocomplete.filter(
		    Object.keys(CHEX.questionTags), extractLast( request.term ) ) );
	    }
	});

    // Source callback for the questions input-tags
    $("#testEditForm input.input-tags" )
	.autocomplete({
	    minLength: 1,
	    source: function( request, response ) {
		response( $.ui.autocomplete.filter(
		    Object.keys(CHEX.testTags), extractLast( request.term ) ) );
	    }
	});
});

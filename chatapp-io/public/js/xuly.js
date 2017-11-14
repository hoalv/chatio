var socket = io("http://localhost:3000/");

	socket.on('new-message', function(data){ 
		$('#chat-window').append('<p style="color: green; "><strong>' + data.un + ": </strong>"+ data.msg + '</p>');
	});
	socket.on('new-name-fail', function(data){
		alert("Tên "+ data.name + " đã được sử dụng, hãy nhập tên khác.");
	});

	socket.on('new-name-success', function(data){
		$('#hello-user').html('You have logged in with name  <strong>' + data.name +"</strong> !");
		$('#name-wrapper').hide(1000);
		$('#main-wrapper').show(500);
	});

	socket.on('send-online-users', function(data){
			
		$('#online').html("");
		data.forEach(function(i){
			$('#online').append('<p style="color: green; text-align: center">' + i + '</p>')
		});
	});

	socket.on('show-typing-msg', function(data){
		$('#typing-msg').show(500);
		// <p style="color: #777; ">' + data +  '</p>
	});

	socket.on('not-typing', function(){
			
		$('#typing-msg').hide(500);
		
	});

	socket.on('someone-out', function(data){
		$('#chat-window').append('<p style="color: #888; "><strong>' + data + ' </strong>logged out </p>');
	});

$(document).ready(function(){
	$('#name-wrapper').show();
	$('#main-wrapper').hide();
	$('#typing-msg').hide();

	$('#btnSend').click(function(){
		socket.emit('send-message', $('#msg').val());
		$('#msg').val("");
	});

	$('#form-msg').submit(function(e){
		e.preventDefault();
		socket.emit('send-message', $('#msg').val());
		$('#msg').val("");
	});
	$('#formlogin').submit(function(e){
		e.preventDefault();
		socket.emit('send-name', $('#name').val());
		$('#name').val("");
	});
	

	$('#btnRegister').click(function(){
		socket.emit('send-name', $('#name').val());
		$('#name').val("");
	});

	$('#msg').focusin(function(){
		socket.emit('typing-msg');
	});

			

	$('#msg').focusout(function(){
		socket.emit('out-typing-msg');
	});
			
	$('#btnLogout').click(function(){
		socket.emit('log-out');
		$('#name-wrapper').show(500);
		$('#main-wrapper').hide(1000);
	});

});
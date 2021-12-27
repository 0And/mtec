$(function () {
	var socket = io()
	// on form submition emit a "chat message" event to the socket -- to the server
	$("form").submit(function (e) {
		e.preventDefault() // prevents page reloading
		socket.emit("chat message", $("#m").val())
		$("#m").val("")
		return false
	})
	// listen to the "chat message" on the socket -- coming from the server
	socket.on("server message", function (msg) {
		$("#messages").append($("<li>").text(msg))
		if ($("#messages li").length > 5) {
			$("#messages li").eq(0).remove()
		}
	})
})
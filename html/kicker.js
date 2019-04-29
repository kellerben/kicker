var connection = new WebSocket("ws://"+document.domain+"/ws/", "json");
connection.onmessage = function(e){
	data = JSON.parse(e.data);
	$("#black").text(data.black);
	$("#yellow").text(data.yellow);
}
function score(name){
	$.post("/api/score/",{scorer:name});
}

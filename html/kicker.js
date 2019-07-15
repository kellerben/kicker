var connection;
function renewconnection(){
	connection = new WebSocket("ws://" +location.hostname+":"+location.port+"/ws/", "json");
	connection.onmessage = updateScore;
	connection.onclose = renewconnection;
}
var data;
function updateScore(e){
	data = JSON.parse(e.data);
	numrounds = Math.floor(1+data.rounds/6)*6;
	$("span#rounds").text((data.rounds+1) + " / " + numrounds);
	delete data.rounds;
	var ary = Object.values(data).sort(function(a,b){
		return b.points-a.points;
	});
	$(ary).each(function(i,v){
		if (i > 0) {
			var ranks = $("tr.players td.rank");
			if (ary[i-1].points == ary[i].points) {
				$(ranks[i]).text($(ranks[i-1]).text());
			} else {
				$(ranks[i]).text(i+1);
			};
		}
		$($("tr.players td.name input")[i]).val(v.name);
		$($("tr.players td.name input")[i]).attr("position", v.position);
		$($("tr.players td.points")[i]).text(v.points);
	});

}
function randomNames(){
	$.post("/api/randomNames/");
}
function reset(){
	$.post("/api/reset/");
}

function changePlayerName(e){
	var obj = {};
	position = $(e.target).attr("position");
	name = $(e.target).val();
	obj[position] = name;
	connection.send(JSON.stringify({ position: position, name: name}));
};
$(document).ready(function(){
	renewconnection();
	$('tr.players td.name input').bind('input',changePlayerName);
	var noSleep = new NoSleep();
	document.addEventListener('click', function enableNoSleep() {
		document.removeEventListener('click', enableNoSleep, false);
		noSleep.enable();
	}, false);
});

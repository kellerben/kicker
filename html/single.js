var connection;
function renewconnection(){
	connection = new WebSocket("ws://"+document.domain+"/ws/", "json");
	connection.onmessage = updateScore;
	connection.onclose = renewconnection;
}

function updateScore(e) {
	score = JSON.parse(e.data);
	//console.log(score[viewport]);
	$('#PlayerName').val(score[viewport].name);
	$('#score').text(score[viewport].points);
}

function changePlayerName(e){
	var obj = {};
	obj[viewport] = $('#PlayerName').val();
	connection.send(JSON.stringify({ position: viewport, name: $('#PlayerName').val()}));
};

function goal() {
	submitGoal(viewport);
};
function submitGoal(name){
	$.post("/api/goal/",{scorer:name});
}

var viewport;
$(document).ready(function(){
	if (location.hash.search(/^#[ns][ow]$/) == 0) {
		viewport = location.hash.substr(1,2);
		$('#PlayerName').bind('input',changePlayerName);
		//$('#score').click(goal);
		$('#goal').click(goal);
		//$('#score').fitText();
		renewconnection();
	}

	var noSleep = new NoSleep();
	document.addEventListener('click', function enableNoSleep() {
	  document.removeEventListener('click', enableNoSleep, false);
	  noSleep.enable();
	}, false);
});


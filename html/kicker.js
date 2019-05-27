var connection = new WebSocket("ws://"+document.domain+"/ws/", "json");
var data;
connection.onmessage = function(e){
	data = JSON.parse(e.data);
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
	$('tr.players td.name input').bind('input',changePlayerName);
});

function DrawingState(){
}
DrawingState.inheritsFrom(State);
DrawingState.prototype.addPoint = function(){
		alert("adding point");
		return 1;
		}

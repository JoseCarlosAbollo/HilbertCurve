var pic;			// Image container
var imgSize = 900;		// Size of the image
var order = 7;			// Number of steps to shape the curve
var sectr = Math.pow(2, order);	// Number of sectors divided in the plane (4 per step)
var len = imgSize/sectr;	// Size of a sector
var N = sectr * sectr;		// Number of vertices
var points = [];		// Map of vertices
var animation;			// Animation flag
var current = 1;		// The current vertex at any time in execution

// Preload desired picture
function preload() {
  pic = loadImage("picture.jpg"); //ERROR
}

function setup(){
	// Set and display the canvas
	let img = createImage(imgSize, imgSize);
	createCanvas(img.width, img.height);
	// Place the picture and resize it to fit measurements
	image(pic, 0, 0, imgSize, imgSize); //ERROR
	// Add a black background on top to block picture
	background(0);
	// Set the lines width and color
	strokeWeight(1);
	stroke(210);
	// Find the first vertex
	points[0] = Hilbert(0);
	// Find the rest and draw the lines joining them
	for(let i = 1; i < N; ++i){
		points[i] = Hilbert(i);
		line(points[i-1][0], points[i-1][1], points[i][0], points[i][1]);
	}
}

function draw(){
	// First for loop shows all curve at once, second loop draws it in an animation
	for(let i = 0; i < N-1; ++i){ animation = false;
	//for(let i = 0; i < current; ++i){ animation = true;
		// Pick the color from the picture's pixel placed in the vertex
		let color = img.get(int(points[i][0]),int(points[i][1])); //ERROR
		line(points[i][0], points[i][1], points[i+1][0], points[i+1][1]);
	}
	// Update the counter for animation
	if(animation){
		current++;
		if(current == N){
			current = 0;
			background(0,0,0,100);
		}
	}
}

function Hilbert(n){
	// Set vertices's relative position according to the sector they belong to
	let vertex = [[0,0], [0,1], [1,1], [1,0]];
	// Use a bit mask to know the position in the last step of the curve
	let index = n & 3;
	let pos = vertex[index];
	// Shift the vertex's number to get its position in the uppers steps
	for(let i = 1; i < order; ++i){
		n = n >>> 2;
		index = n & 3;
		// Shift the vertices according to the sector they belong to
		let shift = Math.pow(2,i);
		if(index == 0){
			// First sector gets rotated counterclockwise
			let aux = pos[0];
			pos[0] = pos[1];
			pos[1] = aux;
		}
		else if(index == 1){
			// Second sector gets shifted down
			pos[1] += shift;
		}
		else if(index == 2){
			// Third sector gets shifted down and left
			pos[0] += shift;
			pos[1] += shift;
		}
		else if(index == 3){
			// Forth sector gets rotated clockwise
			let aux = shift - 1 - pos[0];
			pos[0] = shift - 1 - pos[1];
			pos[1] = aux;
			// And shifted left
			pos[0] += shift;
		}
	}
	// Add more shifting to get absolute coordinates
	pos[0] = pos[0] * len + len/2;
	pos[1] = pos[1] * len + len/2;

	return pos;
}

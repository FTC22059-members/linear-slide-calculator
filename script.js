var scaleAmount = 1;
var extendedHeight = 1;
var retractedHeight = 1;

var canvas;
var parent = document.getElementById("preview-wrapper");

var retractedStepInput = document.getElementById("retracted-step");
var targetRetractedHeightInput = document.getElementById("target-retracted-height");
var extendedStepInput = document.getElementById("extended-step");
var targetExtendedHeightInput = document.getElementById("target-extended-height");
var segmentNumberInput = document.getElementById("number-of-segments");
var barLengthInput = document.getElementById("bar-length");
var chasisHeightInput = document.getElementById("chasis-height");
var tensionDropInput = document.getElementById("tension-drop");

var retractedStepUnits = document.getElementById("retracted-step-units");
var targetRetractedHeightUnits = document.getElementById("target-retracted-height-units");
var extendedStepUnits = document.getElementById("extended-step-units");
var targetExtendedHeightUnits = document.getElementById("target-extended-height-units");
var barLengthUnits = document.getElementById("bar-length-units");
var chasisHeightUnits = document.getElementById("chasis-height-units");

var retractedStep = 0
var targetRetractedHeight = 0
var extendedStep = 0
var targetExtendedHeight = 0
var segmentNumber = 1
var barLength = 0
var chasisHeight = 0
var tensionDrop = 0

var extension = 0

var minimumLength = 0
var maximumLength = 0

let pickupHeight = 75;

function setup() {
	canvas = createCanvas(parent.offsetWidth - 2, parent.offsetHeight - 2);
	canvas.parent("preview-wrapper");
	background(75)//51);
	strokeCap(SQUARE);
}

function draw() {
	resizeCanvas(parent.offsetWidth - 2, parent.offsetHeight - 2);
	background(75)//51);
	getSizes();
	computeMinMaxLengths();
	push()
	extendedHeight = ((barLength - extendedStep) * tensionDrop) * (segmentNumber - 1) + barLength + chasisHeight;
	retractedHeight = retractedStep * (segmentNumber - 1) + barLength + chasisHeight;
	document.getElementById("minimum-height-display").innerHTML = `Height When Retracted: <b>${retractedHeight.toFixed(2)} mm (${(retractedHeight / 25.4).toFixed(2)} in)</b>`
	document.getElementById("maximum-height-display").innerHTML = `Height When Extended: <b>${extendedHeight.toFixed(2)} mm (${(extendedHeight / 25.4).toFixed(2)} in)</b>`
	let viewHeight = max(
		extendedHeight,
		retractedHeight,
		targetExtendedHeight,
		targetRetractedHeight
	)
	scaleAmount = height / (viewHeight)/*height / (extendedHeight + MARGIN * 2);*/
	scale(scaleAmount)
	translate((width / scaleAmount / 2), viewHeight)//extendedHeight + MARGIN)
	fill(150)
	rect(width / scaleAmount / 16, 0, -width / scaleAmount / 8, -chasisHeight)
	push()
	stroke(238)
	strokeWeight(1.5 / scaleAmount)
	line(-width / scaleAmount / 2, -extendedHeight, width / scaleAmount / 2, -extendedHeight)
	line(-width / scaleAmount / 2, -retractedHeight, width / scaleAmount / 2, -retractedHeight)
	stroke(150, 255, 150)
	line(-width / scaleAmount / 2, -targetExtendedHeight, width / scaleAmount / 2, -targetExtendedHeight)
	line(-width / scaleAmount / 2, -targetRetractedHeight, width / scaleAmount / 2, -targetRetractedHeight)
	stroke(255, 150, 150)
	line(-width / scaleAmount / 2, -extendedHeight + (retractedStep * (segmentNumber) + chasisHeight - 2.5), width / scaleAmount / 2, -extendedHeight + (retractedStep * (segmentNumber) + chasisHeight - 2.5))
	noStroke()
	fill(238)
	textAlign(LEFT, TOP)
	textSize(10 / scaleAmount)
	text(`${extendedHeight.toFixed(1)} mm (${(extendedHeight / 25.4).toFixed(1)} in)`, -width / scaleAmount / 2 + 15, -extendedHeight + 15)
	text(`${retractedHeight.toFixed(1)} mm (${(retractedHeight / 25.4).toFixed(1)} in)`, -width / scaleAmount / 2 + 15, -retractedHeight + 15)
	text(`${(extendedHeight - (retractedStep * (segmentNumber) + chasisHeight - 2.5)).toFixed(1)} mm (${((extendedHeight - (retractedStep * (segmentNumber) + chasisHeight - 2.5)) / 25.4).toFixed(1)} in)`, -width / scaleAmount / 2 + 15, -extendedHeight + (retractedStep * (segmentNumber) + chasisHeight - 2.5) + 15)
	// circle((mouseX / scaleAmount - (width / scaleAmount / 2)), (mouseY / scaleAmount - viewHeight), 10)
	text(`(${-(mouseX / scaleAmount - (width / scaleAmount / 2)).toFixed(1)}, ${-(mouseY / scaleAmount - viewHeight).toFixed(1)})`, ((mouseX + 15) / scaleAmount - (width / scaleAmount / 2)), ((mouseY + 0) / scaleAmount - viewHeight))
	pop()
	translate(0, -chasisHeight)
    push()
		fill(238);
	for (let i = 0; i < segmentNumber; i++) {
		rect(0, 0, 14, -barLength);
		if (i < segmentNumber - 1) {
			translate(14, (-retractedStep - extension * (barLength - retractedStep - extendedStep)) * tensionDrop)
		}
	}
    pop()
		fill(221);
    for (let i = 0; i < segmentNumber; i++) {
		rect(-7, 0, 14, -extendedStep / 2);
		rect(7, -barLength, 14, extendedStep / 2);
		rect(7, 0, 7, -retractedStep);
		// rect(0, -barLength, 14, extendedStep);
		if (i < segmentNumber - 1) {
			translate(14, (-retractedStep - extension * (barLength - retractedStep - extendedStep)) * tensionDrop)
		}
	}
	translate(14, -retractedStep)// - extension * (barLength - retractedStep))
	fill(238)
	rect(0, 0, 14, retractedStep * (segmentNumber) + chasisHeight - pickupHeight + 14)
	push()
	fill(75, 75, 200)
	rect(14, retractedStep * (segmentNumber) + chasisHeight - 127, 101.6, 127)
	pop()
	rect(14, retractedStep * (segmentNumber) + chasisHeight - pickupHeight, 125, 14)
	pop()
}

function getSizes() {
	retractedStep = retractedStepInput.value * retractedStepUnits.value;
	targetRetractedHeight = targetRetractedHeightInput.value * targetRetractedHeightUnits.value;
	extendedStep = extendedStepInput.value * extendedStepUnits.value;
	targetExtendedHeight = targetExtendedHeightInput.value * targetExtendedHeightUnits.value;
	segmentNumber = segmentNumberInput.value;
	barLength = barLengthInput.value * barLengthUnits.value;
	chasisHeight = chasisHeightInput.value * chasisHeightUnits.value;
    tensionDrop = 1 - (tensionDropInput.value / 100);

	extension = document.getElementById("extension").value;
	document.getElementById("extension-display").innerHTML = (extension * 100).toFixed(1).padStart(5, '0') + "%";
}

function computeMinMaxLengths() {
	minimumLength = (((segmentNumber - 1) * extendedStep - chasisHeight + targetExtendedHeight)) / segmentNumber;
	maximumLength = -(segmentNumber - 1) * retractedStep - chasisHeight + targetRetractedHeight;

	document.getElementById("minimum-length-display").innerHTML = `Minimum Length: <b>${minimumLength.toFixed(2)} mm (${(minimumLength / 25.4).toFixed(2)} in)</b>`
	document.getElementById("maximum-length-display").innerHTML = `Maximum Length: <b>${maximumLength.toFixed(2)} mm (${(maximumLength / 25.4).toFixed(2)} in)</b>`
}
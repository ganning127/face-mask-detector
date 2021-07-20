const URL = "https://teachablemachine.withgoogle.com/models/lccjUR36W/";

let resultToMessage = {
	"nomask": "No mask detected ⚠️",
	"mask": "Mask Detected ✅"
}

let model, webcam, labelContainer, maxPredictions;

async function init() {
	const modelURL = URL + "model.json";
	const metadataURL = URL + "metadata.json";

	model = await tmImage.load(modelURL, metadataURL);
	maxPredictions = model.getTotalClasses();

	const flip = true;
	webcam = new tmImage.Webcam(350, 350, flip);
	await webcam.setup();
	await webcam.play();
	window.requestAnimationFrame(loop);

	document.getElementById("placeholder-img").remove()
	document.getElementById("webcam-container")
		.appendChild(webcam.canvas);

	labelContainer = document.getElementById("label-container");
	for (let i = 0; i < maxPredictions; i++) {
		labelContainer.appendChild(document.createElement("div"));
	}
}

async function loop() {
	webcam.update();
	await predict();
	window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
	// predict can take in an image, video or canvas html element
	const prediction = await model.predict(webcam.canvas);
	let highestPoss = determineDom(prediction)
	// let highestPoss = determineDom(prediction);
	document.getElementById("result").innerHTML = resultToMessage[highestPoss];
}

function determineDom(arr) {
	let maxValue = 0;
	let maxPrediction;

	for (var i = 0; i < arr.length; i++) {
		if (arr[i].probability > maxValue) {
			maxValue = arr[i].probability;
			maxPrediction = arr[i].className;
		}
	}
	return maxPrediction
}

init();
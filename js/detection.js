const URL = "https://teachablemachine.withgoogle.com/models/lccjUR36W/";
let highestPoss;
let resultToMessage = {
	"nomask": "No mask detected ⚠️",
	"mask": "Mask Detected ✅"
}

let model, webcam, labelContainer, maxPredictions;
let started = false;

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

	try {
		document.getElementById("placeholder-img").remove()
	}
	catch {
		console.log("already started once")
	}

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
	highestPoss = determineDom(prediction)



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

window.setInterval(() => {
	if (highestPoss) {
		console.log(highestPoss)
		let webhookUrl = document.getElementById("url").value;
		console.log(webhookUrl)
		// send fetch to url the user chose;
		if (webhookUrl) {
			try {
				fetch(webhookUrl, {
					method: "POST",
					headers: {
						status: highestPoss,
						timestamp: Date.now()
					}
				})
					.then(resp => resp.json())
					.then(data => {
						console.log(data)
					})
			}
			catch {
				console.log("webhook url is not valid.")
			}

		}





	}

}, 1000)

function detect(event) {
	event.preventDefault();
	if (started) {
		return;
	}
	started = true;

	console.log("starting...")
	init();

}
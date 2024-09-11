const cars = [
    {
        Id: 1,
        Name: "Racer 1",
        Img: "images/car1.png"
    },
    {
        Id: 2,
        Name: "Racer 2",
        Img: "images/car2.png"
    },
    {
        Id: 3,
        Name: "Racer 3",
        Img: "images/car3.png"
    },
    {
        Id: 4,
        Name: "Racer 4",
        Img: "images/car4.png"
    },
]

const getNumRacer = document.querySelector("input[type='number']");
const lanesContainer = document.querySelector(".lanes");
const submitBtn = document.querySelector("input[type='submit']");
const refreshDiv = document.getElementById("refresh-div");
const resultsDiv = document.querySelector(".results");

function createLane(numRacers){
    lanesContainer.innerHTML = "";

    for (let i = 0; i < numRacers; i++){
        const lane = document.createElement("div");
        lane.className = "lane";

        const carImage = document.createElement("img");
        carImage.className = "pics";
        carImage.src = cars[i].Img;

        lane.appendChild(carImage);
        lanesContainer.appendChild(lane);
    }
}

submitBtn.addEventListener("click", function() {
    const numRacers = parseInt(getNumRacer.value ,10);
    if(numRacers >= 2 && numRacers <=4){
        createLane(numRacers);
        createRefreshBtn();
        moveCars(cars.slice(0, numRacers));
    }
})

function createRefreshBtn(){
        refreshDiv.innerHTML = "";

        const refreshBtn = document.createElement("button");
        refreshBtn.innerHTML = "&#x21bb"; 
        refreshBtn.className = "refresh-button"; 

        refreshDiv.appendChild(refreshBtn);

        refreshBtn.addEventListener("click", function() {
            location.reload(); 
        });
}

function moveCars(cars) {
    const finishTimes = [];
    const carElements = [];

    cars.forEach((car, index) => {
        const carElement = document.querySelector(`.lane:nth-child(${index + 1}) .pics`);
        carElement.style.left = '0px';
        carElements[index] = carElement;
        finishTimes[index] = null;
    });

    const interval = setInterval(() => {
        let allFinished = true;

        carElements.forEach((carElement, index) => {
            const left = parseFloat(carElement.style.left);
            const laneWidth = lanesContainer.children[index].offsetWidth;
            const finishLine = laneWidth - carElement.offsetWidth;

            if (left < finishLine) {
                carElement.style.left = `${left + Math.random() * 5 + 1}px`;
                allFinished = false;
            } else if (finishTimes[index] === null) {
                finishTimes[index] = Date.now();
            }
        });


        if (allFinished) {
            clearInterval(interval);
            displayResults(finishTimes);
        }
    }, 50);
}

function displayResults(finishTimes) {
    const results = cars.map((car, index) => ({
        ...car,
        finishTime: finishTimes[index]
    }));

    results.sort((a, b) => a.finishTime - b.finishTime);

    let startTime
    resultsDiv.innerHTML = "";
    results.forEach((car, position) => {
        if (car.finishTime !== null) {  
            const timeTaken = ((car.finishTime - startTime) / 1000).toFixed(2); 

            let placeText;
            switch (position) {
                case 0:
                    placeText = "First place";
                    break;
                case 1:
                    placeText = "Second place";
                    break;
                case 2:
                    placeText = "Third place";
                    break;
                case 3:
                    placeText = "Fourth place";
                    break;
            }

            const resultItem = document.createElement("div");
            resultItem.className = `result-${position + 1}`;
            resultItem.textContent = `${placeText} - ${car.Name}: ${timeTaken} seconds`;
            resultsDiv.appendChild(resultItem);
        }
    });
}


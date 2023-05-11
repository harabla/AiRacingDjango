window.onload = function() {
    const elements = [
        {id: 'lapTimeData', chartId: 'lapTimeChart', name: 'lapTimes'},
        {id: 'positionData', chartId: 'positionChart', name: 'positions'},
        {id: 'airTempData', chartId: 'airTempChart', name: 'airTemps'},
        {id: 'trackTempData', chartId: 'trackTempChart', name: 'trackTemps'},
        {id: 'classPositionData', chartId: 'classPositionChart', name: 'classPositions'},
        {id: 'timeData', chartId: 'timeChart', name: 'times'}
    ];

    elements.forEach(({id, chartId, name}) => {
        let dataElement = document.getElementById(id);
        console.log(dataElement.dataset[name]);
        let data = JSON.parse(dataElement.dataset[name]);


        // process data
        if (Object.keys(data).length === 0) {
            console.error(`No ${name} data found for the selected race.`);
        } else {
            const requiredCars = Array.from({ length: 65 }, (_, i) => i);
            requiredCars.forEach((carNumber) => {
                if (!(carNumber in data)) {
                    console.warn(`No ${name} data found for car number ${carNumber}`);
                }
            });

            const labels = [];
            const datasets = [];

            // Assuming that data has the same number of laps for each car
            const firstCarNumber = Object.keys(data)[0];
            const numberOfLaps = data[firstCarNumber].length;

            for (let i = 0; i < numberOfLaps; i++) {
                labels.push(`Lap ${i + 1}`);
            }

            for (const carNumber in data) {
                const carData = data[carNumber];
                const carDataset = {
                    label: `Car ${carNumber}`,
                    data: [],
                    borderColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
                    borderWidth: 1,
                    fill: false,
                };
                datasets.push(carDataset);

                for (let i = 0; i < carData.length; i++) {
                    setTimeout(() => {
                        carDataset.data.push(carData[i]);
                        chart.update();
                    }, i * 300 + datasets.length * 100);
                }
            }

            const chart = new Chart(document.getElementById(chartId).getContext('2d'), {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: datasets,
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: false,
                            max: 150
                        },
                    },
                },
            });
        }
    });
}

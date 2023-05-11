function chartJSProcessing(data, chartId, yAxisMax) {
    if (Object.keys(data).length === 0) {
        console.error('No data found for the selected race.');
    } else {
        const requiredCars = Array.from({ length: 65 }, (_, i) => i);
        requiredCars.forEach((carNumber) => {
            if (!(carNumber in data)) {
                console.warn(`No data found for car number ${carNumber}`);
            }
        });

        const labels = [];
        const datasets = [];

        let numberOfLaps = 0;
        for (const carNumber in data) {
            const carData = data[carNumber];
            if (Array.isArray(carData)) {
                numberOfLaps = Math.max(numberOfLaps, carData.length);
            } else {
                const maxLapNumber = Math.max(...Object.keys(carData).map(Number));
                numberOfLaps = Math.max(numberOfLaps, maxLapNumber + 1);
            }
        }

        console.log(`Generating labels for chart: ${chartId}`);  // Log the chartId
        for (let i = 0; i < numberOfLaps; i++) {
            const label = `Lap ${i + 1}`;
            labels.push(label);
            console.log(`Added label: ${label}`);  // Log the added label
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

            if (Array.isArray(carData)) {
                for (let i = 0; i < carData.length; i++) {
                    carDataset.data.push(carData[i]);
                }
            } else {
                // If carData is an object, extract the values and sort them by the key (lap number)
                const sortedValues = new Array(numberOfLaps).fill(null);
                for (let lapNumber in carData) {
                    sortedValues[Number(lapNumber)] = carData[lapNumber];
                }
                carDataset.data.push(...sortedValues);
            }
        }

        const chart = new Chart(document.getElementById(chartId).getContext('2d'), {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets,
            },
            options: {
                animation: {
                    duration: 0  // general animation time
                },
                hover: {
                    animationDuration: 0  // duration of animations when hovering an item
                },
                responsiveAnimationDuration: 0,  // animation duration after a resize
                scales: {
                    y: {
                        beginAtZero: false,
                        max: yAxisMax
                    },
                },
            },
        });
    }
}

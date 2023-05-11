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

        const firstCarNumber = Object.keys(data)[0];
        console.log(`First car number for chart ${chartId}: ${firstCarNumber}`);  // Add this line

        const carData = data[firstCarNumber];
        console.log(`Car data for chart ${chartId}:`, carData);  // And this line

        const numberOfLaps = carData.length;

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
                data: carData,
                borderColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
                borderWidth: 1,
                fill: false,
            };
            datasets.push(carDataset);
        }

        const chart = new Chart(document.getElementById(chartId).getContext('2d'), {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets,
            },
            options: {
                animation: false,
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

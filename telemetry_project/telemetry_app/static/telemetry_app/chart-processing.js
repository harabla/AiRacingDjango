let charts = {};  // Global variable to store chart instances
let chartColors = {}; // Store chart colors

function chartJSProcessing(data, chartId, yAxisMax, chartTitle) {
    const carSelector = document.getElementById('car-selector');

    // Remove all options from the previous race
    carSelector.innerHTML = '<option value="">Select a car</option>';

    if (Object.keys(data).length === 0) {
        console.error('No data found for the selected race.');
    } else {
        const carNumbers = Object.keys(data);
        for (const carNumber of carNumbers) {
            const option = document.createElement('option');
            option.value = carNumber;
            option.textContent = `Car ${carNumber}`;
            carSelector.appendChild(option);
        }

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

        for (let i = 0; i < numberOfLaps; i++) {
            const label = `Lap ${i + 1}`;
            labels.push(label);
        }

        for (const carNumber in data) {
            const carData = data[carNumber];
            const carColor = loadColor(carNumber) || `hsl(${Math.random() * 360}, 100%, 50%)`;
            const carDataset = {
                label: `Car ${carNumber}`,
                data: [],
                borderColor: carColor,
                borderWidth: 1,
                fill: false,
            };
            datasets.push(carDataset);
            saveColor(carNumber, carColor);

            if (Array.isArray(carData)) {
                for (let i = 0; i < carData.length; i++) {
                    carDataset.data.push(carData[i]);
                }
            } else {
                const sortedValues = new Array(numberOfLaps).fill(null);
                for (let lapNumber in carData) {
                    sortedValues[Number(lapNumber)] = carData[lapNumber];
                }
                carDataset.data.push(...sortedValues);
            }
        }

        // Destroy the previous instance of the chart if it exists
        if (charts[chartId]) {
            charts[chartId].destroy();
        }

        const chart = new Chart(document.getElementById(chartId).getContext('2d'), {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets,
            },
            options: {
                animation: {
                    duration: 0
                },
                hover: {
                    animationDuration: 0
                },
                responsiveAnimationDuration: 0,
                scales: {
                    y: {
                        beginAtZero: false,
                        max: yAxisMax
                    },
                },
                plugins: {
                    title: {
                        display: true,
                        text: chartTitle,
                        font: {
                            size: 16,
                            color: '#000',
                        },
                    },
                },
            },
        });

        charts[chartId] = chart;

                carSelector.addEventListener('change', function() {
            for (const dataset of chart.data.datasets) {
                dataset.borderWidth = 1;
                dataset.borderColor = loadColor(dataset.label.split(' ')[1]);
            }

            const selectedCarNumber = this.value;
            if (selectedCarNumber) {
                for (const dataset of chart.data.datasets) {
                    if (dataset.label === `Car ${selectedCarNumber}`) {
                        dataset.borderWidth = 3;
                        dataset.borderColor = 'red';
                        break;
                    }
                }
            }

            chart.update();
        });
    }
}

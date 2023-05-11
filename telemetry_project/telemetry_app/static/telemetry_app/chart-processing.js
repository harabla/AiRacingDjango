function chartJSProcessing(data, chartId, yAxisMax) {
    const carSelector = document.getElementById('car-selector');

    // Remove all options from the previous race
    carSelector.innerHTML = '<option value="">Select a car</option>';

    if (Object.keys(data).length === 0) {
        console.error('No data found for the selected race.');
    } else {
        // Populate the dropdown with car numbers
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
            },
        });


                // Add an event listener to the dropdown
        carSelector.addEventListener('change', function() {
            // Reset all dataset styles
            for (const dataset of chart.data.datasets) {
                dataset.borderWidth = 1;
                dataset.borderColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
            }

            // If a car is selected, bolden its line
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

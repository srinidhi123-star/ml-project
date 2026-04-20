// Mock ML prediction logic for Smart Crop Field Prediction
// Simulates crop recommendation based on inputs

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('cropForm');
    const resultDiv = document.getElementById('predictionResult');
    const chartSection = document.getElementById('chartSection');
    let cropChart;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form values
        const soilType = document.getElementById('soilType').value;
        const temp = parseFloat(document.getElementById('temperature').value);
        const humidity = parseFloat(document.getElementById('humidity').value);
        const rainfall = parseFloat(document.getElementById('rainfall').value);
        const ph = parseFloat(document.getElementById('ph').value);

        // Mock ML prediction (rule-based simulation of trained model)
        const prediction = predictCrop(soilType, temp, humidity, rainfall, ph);
        const confidence = Math.round(Math.random() * 20 + 80); // 80-100%

        // Display result
        resultDiv.innerHTML = `
            <h3>🥕 Recommended Crop: <strong>${prediction.crop}</strong></h3>
            <p>Confidence: ${confidence}%</p>
            <p>Suitability Score: ${prediction.score}/10</p>
            <details>
                <summary>Why this crop?</summary>
                <p>${prediction.reason}</p>
            </details>
        `;
        resultDiv.classList.remove('hidden');

        // Show and update chart
        chartSection.classList.remove('hidden');
        updateChart(prediction.yields, prediction.crop);
    });

    function predictCrop(soil, temp, hum, rain, ph) {
        // Simple rule-based mock ML model based on common agricultural knowledge
        let score = 0;
        let reasons = [];
        let possibleCrops = [];

        // Soil suitability
        const soilScores = {
            loamy: { rice: 9, wheat: 8, maize: 9, sugarcane: 8, potato: 8, barley: 8 },
            clayey: { rice: 8, wheat: 7, cotton: 9, oats: 9, potato: 9 },
            sandy: { groundnut: 9, millets: 8, sorghum: 9, soybean: 8 },
            red: { cotton: 8, pulses: 7, sorghum: 8 },
            black: { cotton: 9, sorghum: 8, soybean: 7 },
            alluvial: { rice: 9, wheat: 8, maize: 8, sugarcane: 9, tomato: 9 }
        };
        if (soilScores[soil]) {
            Object.entries(soilScores[soil]).forEach(([crop, s]) => {
                possibleCrops.push({crop, score: s});
                score += s / 10;
            });
            reasons.push(`Soil (${soil}): Good for listed crops`);
        } else {
            score += 5;
        }

        // Temperature
        if (temp >= 20 && temp <= 35) {
            score += 2;
            reasons.push('Optimal temperature range');
        } else {
            score += 1;
            reasons.push('Suboptimal temperature');
        }

        // Humidity
        if (hum >= 60 && hum <= 90) {
            score += 1.5;
            reasons.push('Good humidity for most crops');
        }

        // Rainfall
        if (rain >= 50 && rain <= 250) {
            score += 2;
            reasons.push(`Good rainfall (${rain}mm)`);
        } else if (rain > 250) {
            score += 1;
            reasons.push('High rainfall - prefers water-tolerant crops');
        }

        // pH
        if (ph >= 6 && ph <= 7.5) {
            score += 1.5;
            reasons.push('Ideal pH range');
        }

        // Select best crop
        possibleCrops.sort((a, b) => b.score - a.score);
        const bestCrop = possibleCrops[0] || {crop: 'Rice', score: 7}; // fallback
        const finalScore = Math.min(10, Math.round(score));

        // Mock yield data for chart
        const yields = getYieldData(bestCrop.crop);

        return {
            crop: bestCrop.crop,
            score: finalScore,
            reason: reasons.join(', '),
            yields: yields
        };
    }

    function getYieldData(crop) {
        const yieldData = {
            rice: { Jan: 2.5, Feb: 3.0, Mar: 4.2, Apr: 3.8 },
            wheat: { Jan: 3.1, Feb: 4.0, Mar: 3.5, Apr: 2.8 },
            maize: { Jan: 3.5, Feb: 4.2, Mar: 5.0, Apr: 4.5 },
            sugarcane: { Jan: 8.0, Feb: 9.5, Mar: 10.2, Apr: 9.8 },
            cotton: { Jan: 1.2, Feb: 1.8, Mar: 2.5, Apr: 2.2 },
            groundnut: { Jan: 1.5, Feb: 2.0, Mar: 2.8, Apr: 2.5 },
            millets: { Jan: 2.0, Feb: 2.5, Mar: 3.0, Apr: 2.8 },
            pulses: { Jan: 1.0, Feb: 1.5, Mar: 2.0, Apr: 1.8 },
            potato: { Jan: 15, Feb: 20, Mar: 25, Apr: 22 },
            tomato: { Jan: 8, Feb: 12, Mar: 18, Apr: 15 },
            soybean: { Jan: 1.8, Feb: 2.3, Mar: 3.0, Apr: 2.7 },
            barley: { Jan: 2.8, Feb: 3.5, Mar: 3.2, Apr: 2.9 },
            oats: { Jan: 2.2, Feb: 3.0, Mar: 3.8, Apr: 3.2 },
            sorghum: { Jan: 1.5, Feb: 2.0, Mar: 2.8, Apr: 2.5 }
        };
        return yieldData[crop] || { Jan: 3, Feb: 3.5, Mar: 4, Apr: 3.5 };
    }

    function updateChart(yields, cropName) {
        const ctx = document.getElementById('cropChart').getContext('2d');
        
        if (cropChart) {
            cropChart.destroy();
        }

        cropChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr'],
                datasets: [{
                    label: `${cropName} Expected Yield (tons/ha)`,
                    data: Object.values(yields),
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.2)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
});


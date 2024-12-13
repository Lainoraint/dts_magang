let scatterChart, harvestChart, productionChart, productivityChart, actualData = [];

document.addEventListener('DOMContentLoaded', () => {
    loadHarvestAreaChart();
    loadProductionChart();
    loadProductivityChart();
    loadScatterPlot();
});

// Form Submit: Prediksi Produktivitas
document.getElementById('predictForm').onsubmit = async (e) => {
    e.preventDefault();
    const luasPanen = parseFloat(document.getElementById('luas_panen').value);
    const produksi = parseFloat(document.getElementById('produksi').value);

    try {
        const response = await fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ luas_panen: luasPanen, produksi : produksi }),
        });

        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const result = await response.json();
        document.getElementById('result').textContent = `Prediksi Produktivitas: ${result.prediction.toFixed(2)} ton`;

        loadScatterPlot(); // Perbarui scatter plot setelah prediksi
    } catch (error) {
        document.getElementById('result').textContent = `Error: ${error.message}`;
    }
};

// Fetch dan Render Harvest Area Chart
async function loadHarvestAreaChart() {
    try {
        const response = await fetch('http://127.0.0.1:5000/harvest-area-data');
        const data = await response.json();

        if (harvestChart) harvestChart.destroy();
        harvestChart = new Chart(document.getElementById('harvestAreaChart').getContext('2d'), {
            type: 'bar',
            data: {
                labels: data.kecamatan,
                datasets: [
                    { label: '2019', data: data.luasPanen2019, backgroundColor: 'purple' },
                    { label: '2020', data: data.luasPanen2020, backgroundColor: 'yellow' },
                    { label: '2021', data: data.luasPanen2021, backgroundColor: 'blue' },
                    { label: '2022', data: data.luasPanen2022, backgroundColor: 'green' },
                    { label: '2023', data: data.luasPanen2023, backgroundColor: 'red' },
                ],
            },
            options: {
                plugins: {
                    title: { display: true, text: 'Luas Panen Jagung per Tahun' },
                },
                responsive: true,
                scales: {
                    x: { title: { display: true, text: 'Kecamatan' } },
                    y: { title: { display: true, text: 'Luas Panen (ha)' }, beginAtZero: true },
                },
            },
        });
    } catch (error) {
        console.error('Error loading harvest area data:', error);
    }
}

// Fetch dan Render Production Chart
async function loadProductionChart() {
    try {
        const response = await fetch('http://127.0.0.1:5000/harvest-area-data');
        const data = await response.json();

        if (productionChart) productionChart.destroy();
        productionChart = new Chart(document.getElementById('productionChart').getContext('2d'), {
            type: 'bar',
            data: {
                labels: data.kecamatan,
                datasets: [
                    { label: '2019', data: data.produksi2019, backgroundColor: 'rgba(75, 192, 192, 0.6)' },
                    { label: '2020', data: data.produksi2020, backgroundColor: 'rgba(153, 102, 255, 0.6)' },
                    { label: '2021', data: data.produksi2021, backgroundColor: 'rgba(255, 159, 64, 0.6)' },
                    { label: '2022', data: data.produksi2022, backgroundColor: 'rgba(255, 99, 132, 0.6)' },
                    { label: '2023', data: data.produksi2023, backgroundColor: 'rgba(54, 162, 235, 0.6)' },
                ],
            },
            options: {
                plugins: {
                    title: { display: true, text: 'Produksi Jagung per Tahun' },
                },
                responsive: true,
                scales: {
                    x: { title: { display: true, text: 'Kecamatan' } },
                    y: { title: { display: true, text: 'Produksi (ton)' }, beginAtZero: true },
                },
            },
        });
    } catch (error) {
        console.error('Error loading production data:', error);
    }
}

// Fetch dan Render Productivity Chart
async function loadProductivityChart() {
    try {
        const response = await fetch('http://127.0.0.1:5000/harvest-area-data');
        const data = await response.json();

        if (productivityChart) productivityChart.destroy();
        productivityChart = new Chart(document.getElementById('productivityChart').getContext('2d'), {
            type: 'bar',
            data: {
                labels: data.kecamatan,
                datasets: [
                    { label: '2019', data: data.productivity2019, backgroundColor: 'rgba(255, 206, 86, 0.6)' },
                    { label: '2020', data: data.productivity2020, backgroundColor: 'rgba(75, 192, 192, 0.6)' },
                    { label: '2021', data: data.productivity2021, backgroundColor: 'rgba(153, 102, 255, 0.6)' },
                    { label: '2022', data: data.productivity2022, backgroundColor: 'rgba(255, 99, 132, 0.6)' },
                    { label: '2023', data: data.productivity2023, backgroundColor: 'rgba(54, 162, 235, 0.6)' },
                ],
            },
            options: {
                plugins: {
                    title: { display: true, text: 'Produktivitas Jagung per Tahun' },
                },
                responsive: true,
                scales: {
                    x: { title: { display: true, text: 'Kecamatan' } },
                    y: { title: { display: true, text: 'Produktivitas (ton/ha)' }, beginAtZero: true },
                },
            },
        });
    } catch (error) {
        console.error('Error loading productivity data:', error);
    }
}

// Fetch dan Render Scatter Plot
async function loadScatterPlot() {
    try {
        const response = await fetch('http://127.0.0.1:5000/scatter-data');
        const data = await response.json();

        const actual = data.actual.map(d => ({ x: d['Luas Panen'], y: d['Produksi'] }));
        const predicted = data.predicted.map(d => ({ x: d['Luas Panen'], y: d['Produksi'] }));

        if (scatterChart) scatterChart.destroy();
        scatterChart = new Chart(document.getElementById('scatterPlot').getContext('2d'), {
            type: 'scatter',
            data: {
                datasets: [
                    { label: 'Actual Data', data: actual, backgroundColor: 'rgba(75, 192, 192, 0.6)' },
                    { label: 'Predicted Data', data: predicted, backgroundColor: 'rgba(255, 99, 132, 0.6)' },
                ],
            },
            options: {
                plugins: {
                    title: { display: true, text: 'Scatter Plot dengan Garis Regresi' },
                },
                responsive: true,
                scales: {
                    x: { title: { display: true, text: 'Luas Panen (ha)' } },
                    y: { title: { display: true, text: 'Produksi (ton)' } },
                },
            },
        });
    } catch (error) {
        console.error('Error loading scatter data:', error);
    }
}
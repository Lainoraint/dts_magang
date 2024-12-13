<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prediksi Produktivitas Jagung</title>
    <!-- Link to Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Link to external CSS file -->
    <link href="{{ asset('css/style.css') }}" rel="stylesheet">
    <!-- Link to Chart.js for the charts -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>

    <div class="container">
        <h1 class="text-center my-4">Prediksi Produktivitas Jagung</h1>

        <!-- Form to input data for prediction -->
        <div class="card">
            <div class="card-header">
                Formulir Prediksi
            </div>
            <div class="card-body">
                <form id="predictForm">
                    <div class="mb-3">
                        <label for="luas_panen" class="form-label">Luas Panen (ha):</label>
                        <input type="number" id="luas_panen" name="luas_panen" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label for="produksi" class="form-label">Produksi (ton):</label>
                        <input type="number" id="produksi" name="produksi" class="form-control" required>
                    </div>
                    <button type="submit" class="btn btn-custom">Prediksi</button>
                </form>
                <h2 id="result" class="result-text"></h2>
            </div>
        </div>

        <!-- Scatter Plot with Regression Line -->
        <div class="card">
            <div class="card-header">
                Scatter Plot dengan Garis Regresi
            </div>
            <div class="card-body">
                <div class="chart-container">
                    <canvas id="scatterPlot"></canvas>
                </div>
            </div>
        </div>

        <!-- Charts for various data -->
        <div class="card">
            <div class="card-header">
                Perbandingan Luas Panen per Tahun
            </div>
            <div class="card-body">
                <div class="chart-container">
                    <canvas id="harvestAreaChart"></canvas>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                Perbandingan Produksi per Tahun
            </div>
            <div class="card-body">
                <div class="chart-container">
                    <canvas id="productionChart"></canvas>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                Perbandingan Produktivitas per Tahun
            </div>
            <div class="card-body">
                <div class="chart-container">
                    <canvas id="productivityChart"></canvas>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.min.js"></script>

    <!-- Link to external JavaScript file -->
    <script src="{{ asset('js/script.js') }}" defer></script>

</body>
</html>

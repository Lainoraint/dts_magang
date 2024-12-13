from flask import Flask, jsonify, request
import pandas as pd
import os
import pickle  # Untuk memuat file .pkl
from flask_cors import CORS
import csv

app = Flask(__name__)

CORS(app)

# Path ke file dataset dan model
DATASET_PATH = os.path.join('data', 'simplified_dataset.csv')
MODEL_PATH = os.path.join('models', 'regression_model.pkl')
DATASET_AWAL = os.path.join('data','dataset.csv')

# Simpan dataset dan model di memori
data = pd.DataFrame()
model = None

# Fungsi untuk memuat dataset
def load_dataset():
    global data
    if os.path.exists(DATASET_PATH):
        data = pd.read_csv(DATASET_PATH)
    else:
        # Jika file tidak ditemukan, inisialisasi DataFrame kosong
        data = pd.DataFrame(columns=['Luas Panen', 'Produksi'])

# Fungsi untuk memuat model
def load_model():
    global model
    if os.path.exists(MODEL_PATH):
        with open(MODEL_PATH, 'rb') as file:
            model = pickle.load(file)
    else:
        raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")

@app.route('/data', methods=['GET'])
def get_data():
    try:
        # Pastikan path ke dataset benar
        df = pd.read_csv(DATASET_PATH)

        # Pastikan kolom yang dibaca diformat sebagai float
        df['Luas Panen'] = df['Luas Panen'].replace(',', '', regex=True).astype(float)
        df['Produksi'] = df['Produksi'].replace(',', '', regex=True).astype(float)

        # Konversi data ke format JSON
        data = df.to_dict(orient='records')
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route('/predict', methods=['POST'])
def predict():
    global data, model
    content = request.json
    luas_panen = float(content['luas_panen'])
    produksi = float(content['produksi'])

    # Gunakan model untuk prediksi
    input_features = [[luas_panen, produksi]]
    prediction = model.predict(input_features)[0]

    # Tambahkan data baru ke dataset
    new_entry = {'Luas Panen': luas_panen, 'Produksi': produksi}
    data = pd.concat([data, pd.DataFrame([new_entry])], ignore_index=True)

    # Simpan dataset ke file agar tetap tersimpan
    data.to_csv(DATASET_PATH, index=False)

    return jsonify({'prediction': prediction})

@app.route('/scatter-data', methods=['GET'])
def scatter_data():
    try:
        # Pastikan data tersedia
        if data.empty:
            return jsonify({"error": "No data available"}), 400

        # Format ulang data agar siap untuk scatter plot
        actual_data = data[['Luas Panen', 'Produksi']].to_dict(orient='records')

        # Prediksi menggunakan model
        predicted_data = [
            {"Luas Panen": row["Luas Panen"], "Produksi": model.predict([[row["Luas Panen"], row["Produksi"]]])[0]}
            for _, row in data.iterrows()
        ]

        # Return data dalam format JSON
        return jsonify({"actual": actual_data, "predicted": predicted_data})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/regression-line', methods=['GET'])
def regression_line():
    try:
        # Pastikan data tersedia
        if data.empty:
            return jsonify({"error": "No data available"}), 400

        # Ambil rentang luas panen dari data
        min_luas_panen = data['Luas Panen'].min()
        max_luas_panen = data['Luas Panen'].max()

        # Buat data prediksi pada rentang luas panen
        step = (max_luas_panen - min_luas_panen) / 100
        x_values = [min_luas_panen + i * step for i in range(101)]
        predictions = model.predict([[x, 0] for x in x_values])

        # Format data untuk frontend
        regression_data = [{"x": x, "y": y} for x, y in zip(x_values, predictions)]
        return jsonify({"regression_line": regression_data})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/residual-data', methods=['GET'])
def residual_data():
    try:
        # Hitung prediksi dan residu
        predictions = model.predict(data[['Luas Panen', 'Produksi']])
        residuals = data['Produksi'] - predictions

        # Format data untuk frontend
        residual_data = [{"x": actual, "y": residual}
                         for actual, residual in zip(data['Produksi'], residuals)]
        return jsonify({"residuals": residual_data})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/harvest-area-data', methods=['GET'])
def get_harvest_area_data():
    try:
        # Hardcode the path to your dataset
        df = pd.read_csv(DATASET_AWAL)
        
        return jsonify({
            'kecamatan': df['Kecamatan'].tolist(),
            'luasPanen2019': df['Luas Panen 2019'].tolist(),
            'luasPanen2020': df['Luas Panen 2020'].tolist(),
            'luasPanen2021': df['Luas Panen 2021'].tolist(),
            'luasPanen2022': df['Luas Panen 2022'].tolist(),
            'luasPanen2023': df['Luas Panen 2023'].tolist(),
            'luasPanen2023': df['Luas Panen 2023'].tolist(),
            'produksi2019': df['Produksi 2019'].tolist(),
            'produksi2020': df['Produksi 2020'].tolist(),
            'produksi2021': df['Produksi 2021'].tolist(),
            'produksi2022': df['Produksi 2022'].tolist(),
            'produksi2023': df['Produksi 2023'].tolist(),
            'productivity2019': df['Produktivitas 2019'].tolist(),
            'productivity2020': df['Produktivitas 2020'].tolist(),
            'productivity2021': df['Produktivitas 2021'].tolist(),
            'productivity2022': df['Produktivitas 2022'].tolist(),
            'productivity2023': df['Produktivitas 2023'].tolist()
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500



if __name__ == '__main__':
    load_dataset()
    load_model()
    app.run(debug=True)

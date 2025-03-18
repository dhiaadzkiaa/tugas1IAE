from flask import Flask, request, jsonify, render_template
import requests

app = Flask(__name__)

API_KEY = "1e127aa9e4da0c258ef11852e0f5c267"  # Ganti dengan API key OpenWeather
BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/weather", methods=["GET"])
def get_weather():
    city = request.args.get("city")
    if not city:
        return jsonify({"error": "City parameter is required"}), 400

    response = requests.get(BASE_URL, params={"q": city, "appid": API_KEY, "units": "metric"})

    if response.status_code != 200:
        return jsonify({"error": "Kota tidak ditemukan"}), response.status_code

    data = response.json()
    return jsonify({
        "city": data["name"],
        "temperature": data["main"]["temp"],
        "weather": data["weather"][0]["description"]
    })

if __name__ == "__main__":
    app.run(debug=True)

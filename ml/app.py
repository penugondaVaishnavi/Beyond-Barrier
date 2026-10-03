import os
import joblib
import pandas as pd
import numpy as np
from flask import Flask, request, jsonify

app = Flask(__name__)

# Base directory for resolving model files
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RISK_MODEL_PATH = os.path.join(BASE_DIR, "risk_model.pkl")
HOURS_MODEL_PATH = os.path.join(BASE_DIR, "hours_model.pkl")

# Load models at startup
risk_model = None
hours_model = None

try:
    if os.path.exists(RISK_MODEL_PATH) and os.path.exists(HOURS_MODEL_PATH):
        risk_model = joblib.load(RISK_MODEL_PATH)
        hours_model = joblib.load(HOURS_MODEL_PATH)
        print("[OK] Models loaded successfully into memory.")
    else:
        print("[WARN] Model artifacts not found. Please verify risk_model.pkl and hours_model.pkl exist.")
except Exception as e:
    print(f"[ERROR] Error loading models: {str(e)}")

# Required input feature keys
REQUIRED_FEATURES = [
    "attendance",
    "marks",
    "cgpa",
    "course_score",
    "course_attendance",
    "credits",
    "course_difficulty",
    "learning_pace",
    "weekly_available_hours"
]

RISK_LABEL_MAP = {
    0: "Low Risk (Safe)",
    1: "Medium Risk (Moderate)",
    2: "High Risk (Critical Deficit)"
}

RISK_BADGE_MAP = {
    0: "safe",
    1: "moderate",
    2: "critical"
}

def validate_and_extract_features(data):
    """Validates presence and types of the 9 required features."""
    missing = [feat for feat in REQUIRED_FEATURES if feat not in data]
    if missing:
        return None, f"Missing required features: {', '.join(missing)}"

    parsed = {}
    try:
        parsed["attendance"] = float(data["attendance"])
        parsed["marks"] = float(data["marks"])
        parsed["cgpa"] = float(data["cgpa"])
        parsed["course_score"] = float(data["course_score"])
        parsed["course_attendance"] = float(data["course_attendance"])
        parsed["credits"] = int(data["credits"])
        parsed["course_difficulty"] = float(data["course_difficulty"])
        parsed["learning_pace"] = int(data["learning_pace"])
        parsed["weekly_available_hours"] = float(data["weekly_available_hours"])
    except (ValueError, TypeError) as e:
        return None, f"Invalid data type in features: {str(e)}"

    # Bounds validation
    if not (0 <= parsed["attendance"] <= 100):
        return None, "attendance must be between 0 and 100."
    if not (0 <= parsed["marks"] <= 100):
        return None, "marks must be between 0 and 100."
    if not (0 <= parsed["cgpa"] <= 10):
        return None, "cgpa must be between 0 and 10."
    if not (0 <= parsed["course_score"] <= 100):
        return None, "course_score must be between 0 and 100."
    if not (0 <= parsed["course_attendance"] <= 100):
        return None, "course_attendance must be between 0 and 100."
    if parsed["credits"] <= 0:
        return None, "credits must be greater than 0."
    if not (1.0 <= parsed["course_difficulty"] <= 5.0):
        return None, "course_difficulty must be between 1.0 and 5.0."
    if parsed["learning_pace"] not in [1, 2, 3]:
        return None, "learning_pace must be 1 (Slow), 2 (Moderate), or 3 (Fast)."
    if parsed["weekly_available_hours"] <= 0:
        return None, "weekly_available_hours must be greater than 0."

    return parsed, None


@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint confirming service status and model loading state."""
    models_ready = (risk_model is not None) and (hours_model is not None)
    return jsonify({
        "status": "online" if models_ready else "degraded",
        "service": "Beyond Barriers ML Inference Engine",
        "version": "1.0.0",
        "models_loaded": {
            "risk_model": risk_model is not None,
            "hours_model": hours_model is not None
        },
        "model_types": {
            "risk_model": type(risk_model).__name__ if risk_model else None,
            "hours_model": type(hours_model).__name__ if hours_model else None
        }
    }), 200 if models_ready else 503


@app.route("/predict-plan", methods=["POST"])
def predict_plan():
    """Inference endpoint predicting academic risk level and recommended study hours."""
    if not risk_model or not hours_model:
        return jsonify({
            "error": "ML models are not loaded in memory. Check service logs."
        }), 503

    payload = request.get_json(silent=True)
    if not payload or not isinstance(payload, dict):
        return jsonify({
            "error": "Invalid request body. Expected JSON object with required features."
        }), 400

    # Validate features
    features, err = validate_and_extract_features(payload)
    if err:
        return jsonify({
            "error": "Validation error",
            "message": err
        }), 400

    # Prepare DataFrame matching exact column ordering from training
    input_df = pd.DataFrame([features])[REQUIRED_FEATURES]

    try:
        # 1. Predict Risk
        risk_class = int(risk_model.predict(input_df)[0])
        risk_proba = risk_model.predict_proba(input_df)[0]

        # 2. Predict Study Hours
        predicted_hours = float(hours_model.predict(input_df)[0])
        # Ensure study hours do not exceed total weekly budget
        bounded_hours = round(min(predicted_hours, features["weekly_available_hours"]), 2)

        # 3. Format Response
        response = {
            "success": True,
            "input_features": features,
            "predictions": {
                "risk_level": risk_class,
                "risk_label": RISK_LABEL_MAP.get(risk_class, "Unknown"),
                "risk_category": RISK_BADGE_MAP.get(risk_class, "moderate"),
                "risk_probabilities": {
                    "low": round(float(risk_proba[0]), 4),
                    "medium": round(float(risk_proba[1]), 4),
                    "high": round(float(risk_proba[2]), 4)
                },
                "recommended_study_hours": bounded_hours,
                "allocated_weekly_percentage": round((bounded_hours / features["weekly_available_hours"]) * 100, 1)
            }
        }

        # Optional metadata pass-through if caller provided course/student metadata
        if "course_code" in payload:
            response["course_code"] = payload["course_code"]
        if "course_name" in payload:
            response["course_name"] = payload["course_name"]
        if "student_id" in payload:
            response["student_id"] = payload["student_id"]

        return jsonify(response), 200

    except Exception as e:
        return jsonify({
            "error": "Inference computation error",
            "message": str(e)
        }), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    print(f">> Starting ML Inference Service on http://127.0.0.1:{port}")
    app.run(host="127.0.0.1", port=port, debug=False)

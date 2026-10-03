import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor
from sklearn.metrics import accuracy_score, f1_score, mean_squared_error, r2_score

def train_and_evaluate():
    ml_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_path = os.path.join(ml_dir, "student_study_data.csv")

    if not os.path.exists(dataset_path):
        print(f"Dataset not found at {dataset_path}. Generating dataset first...")
        from generate_dataset import generate_student_study_data
        df = generate_student_study_data(n_samples=1500)
        df.to_csv(dataset_path, index=False)
    else:
        df = pd.read_csv(dataset_path)

    print(f"Loaded dataset: {dataset_path} with {len(df)} samples.\n")

    # Define features
    feature_cols = [
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

    X = df[feature_cols]
    y_class = df["target_risk_level"]
    y_reg = df["target_study_hours"]

    # -------------------------------------------------------------
    # 1. Train / Test Split (80% Train, 20% Test)
    # -------------------------------------------------------------
    X_train_c, X_test_c, y_train_c, y_test_c = train_test_split(
        X, y_class, test_size=0.20, random_state=42, stratify=y_class
    )

    X_train_r, X_test_r, y_train_r, y_test_r = train_test_split(
        X, y_reg, test_size=0.20, random_state=42
    )

    print("=" * 60)
    print(" 1. TRAINING RANDOM FOREST CLASSIFIER (RISK PREDICTION)")
    print("=" * 60)

    # Train Classifier
    risk_classifier = RandomForestClassifier(
        n_estimators=100,
        max_depth=8,
        random_state=42,
        class_weight='balanced'
    )
    risk_classifier.fit(X_train_c, y_train_c)

    # Evaluate Classifier
    y_pred_c = risk_classifier.predict(X_test_c)
    acc = accuracy_score(y_test_c, y_pred_c)
    f1 = f1_score(y_test_c, y_pred_c, average="weighted")

    print(f" Classification Accuracy: {acc * 100:.2f}%")
    print(f" Classification F1-Score: {f1:.4f}")

    print("\nFeature Importances (Risk Classification):")
    for feat, imp in sorted(zip(feature_cols, risk_classifier.feature_importances_), key=lambda x: x[1], reverse=True):
        print(f"  - {feat:25s}: {imp:.4f}")

    print("\n" + "=" * 60)
    print(" 2. TRAINING GRADIENT BOOSTING REGRESSOR (STUDY HOURS)")
    print("=" * 60)

    # Train Regressor
    hours_regressor = GradientBoostingRegressor(
        n_estimators=120,
        learning_rate=0.08,
        max_depth=4,
        random_state=42
    )
    hours_regressor.fit(X_train_r, y_train_r)

    # Evaluate Regressor
    y_pred_r = hours_regressor.predict(X_test_r)
    mse = mean_squared_error(y_test_r, y_pred_r)
    rmse = np.sqrt(mse)
    r2 = r2_score(y_test_r, y_pred_r)

    print(f" Regression RMSE: {rmse:.4f} hours")
    print(f" Regression R²:   {r2:.4f}")

    print("\nFeature Importances (Study Hours Regression):")
    for feat, imp in sorted(zip(feature_cols, hours_regressor.feature_importances_), key=lambda x: x[1], reverse=True):
        print(f"  - {feat:25s}: {imp:.4f}")

    # -------------------------------------------------------------
    # 3. Save Trained Models using Joblib
    # -------------------------------------------------------------
    risk_model_path = os.path.join(ml_dir, "risk_model.pkl")
    hours_model_path = os.path.join(ml_dir, "hours_model.pkl")

    joblib.dump(risk_classifier, risk_model_path)
    joblib.dump(hours_regressor, hours_model_path)

    print("\n" + "=" * 60)
    print(" MODEL ARTIFACTS PERSISTENCE")
    print("=" * 60)
    print(f" Saved Risk Model:  {risk_model_path}")
    print(f" Saved Hours Model: {hours_model_path}")
    print(" Training pipeline completed successfully!")

if __name__ == "__main__":
    train_and_evaluate()

# Beyond Barriers – AI-Integrated Personalized Study Planning System

## 🔗 Live Demo

🌐 **Project Website:** https://beyond-barrier.vercel.app/

📂 **GitHub Repository:** https://github.com/penugondaVaishnavi/Beyond-Barrier

## 📌 About the Project

Beyond Barriers is an AI-integrated web application designed to provide
personalized study planning for students.

The system analyzes student academic and course-related information and
predicts:

- Student Risk Level – Low, Medium, or High
- Recommended Study Hours

The predictions are used to provide personalized study guidance.

## 🤖 Machine Learning Pipeline

The project implements an end-to-end Machine Learning pipeline:

1. Problem Identification
2. Dataset Selection
3. Data Preprocessing
4. Algorithm Selection
5. Model Building
6. Hyperparameter Tuning
7. Performance Evaluation

### Machine Learning Models

- **Random Forest Classifier** – Student Risk Level Prediction
- **Gradient Boosting Regressor** – Recommended Study Hours Prediction

### Hyperparameter Tuning

GridSearchCV with 5-fold cross-validation was used to identify the best
hyperparameters for both models.

### Performance

#### Classification

- Accuracy: **99.33%**
- Precision: **0.9935**
- Recall: **0.9933**
- F1-Score: **0.9934**

#### Regression

- MAE: **0.1587 hours**
- RMSE: **0.2037 hours**
- R² Score: **0.9664**

## 🛠️ Technologies Used

- React
- Vite
- Node.js
- Express.js
- MongoDB
- Python
- Flask
- Scikit-learn
- HTML
- CSS
- JavaScript

## 📁 Project Structure

```text
Beyond-Barrier/
├── backend/
├── ml/
├── public/
├── src/
├── package.json
└── README.md

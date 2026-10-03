import numpy as np
import pandas as pd
import os

def generate_student_study_data(n_samples=1500, random_seed=42):
    np.random.seed(random_seed)

    # Common realistic course catalog matching the existing university curriculum
    courses = [
        {"code": "CS201", "name": "Data Structures & Algorithms", "credits": 4, "difficulty": 4.2},
        {"code": "CS204", "name": "Computer Systems Architecture", "credits": 3, "difficulty": 3.6},
        {"code": "MATH210", "name": "Engineering Discrete Mathematics", "credits": 3, "difficulty": 4.0},
        {"code": "ENG105", "name": "Technical Communication & Ethics", "credits": 2, "difficulty": 2.1},
        {"code": "CS301", "name": "Database Management Systems", "credits": 4, "difficulty": 3.4},
        {"code": "CS305", "name": "Operating Systems & Concurrency", "credits": 4, "difficulty": 3.8}
    ]

    records = []
    student_idx = 0

    while len(records) < n_samples:
        student_idx += 1
        # Baseline student profile
        overall_attendance = float(np.clip(np.random.normal(74, 12), 42.0, 99.0))
        # Correlation between attendance and baseline marks
        marks_base = 0.55 * overall_attendance + np.random.normal(18, 10)
        overall_marks = float(np.clip(marks_base, 32.0, 96.0))
        
        # CGPA correlated with overall marks
        cgpa = float(np.clip((overall_marks / 10.0) + np.random.normal(0, 0.35), 4.2, 9.9))
        
        # 1: Slow / Visual, 2: Moderate, 3: Fast / Accelerated
        learning_pace = int(np.random.choice([1, 2, 3], p=[0.25, 0.50, 0.25]))
        
        # Available study budget in hours per week
        weekly_available_hours = float(np.clip(np.random.normal(16.0, 4.0), 8.0, 28.0))

        # Assign 3 to 5 courses per student
        assigned_courses = np.random.choice(courses, size=np.random.randint(3, 5), replace=False)

        for course in assigned_courses:
            credits = course["credits"]
            difficulty = course["difficulty"]

            # Course-level attendance slightly fluctuates from overall attendance
            course_attendance = float(np.clip(overall_attendance + np.random.normal(0, 6.0), 38.0, 100.0))

            # Course score affected by difficulty, course attendance, and student base marks
            difficulty_penalty = (difficulty - 3.0) * 4.5
            course_score_raw = (
                0.60 * overall_marks +
                0.25 * course_attendance -
                difficulty_penalty +
                np.random.normal(0, 5.5)
            )
            course_score = float(np.clip(course_score_raw, 24.0, 98.0))

            # -------------------------------------------------------------
            # Target 1: Risk Level Classification (0: Low, 1: Medium, 2: High)
            # High Risk: score < 55 or (score < 60 and course_attendance < 75)
            # Medium Risk: score < 70 or course_attendance < 75
            # Low Risk: score >= 70 and course_attendance >= 75
            # -------------------------------------------------------------
            risk_score = (
                (60.0 - course_score) * 1.5 +
                (75.0 - course_attendance) * 1.0 +
                (difficulty - 3.0) * 3.0 +
                np.random.normal(0, 2.5)
            )

            if risk_score > 12.0 or course_score < 52.0:
                target_risk_level = 2  # High Risk
            elif risk_score > 0.0 or course_score < 68.0 or course_attendance < 75.0:
                target_risk_level = 1  # Medium Risk
            else:
                target_risk_level = 0  # Low Risk

            # -------------------------------------------------------------
            # Target 2: Study Hours Allocation Regression
            # Hours needed to bring student up to proficiency (target 80% mark)
            # -------------------------------------------------------------
            score_deficit = max(4.0, 82.0 - course_score)
            difficulty_multiplier = 0.85 + (difficulty / 5.0) * 0.45
            credit_multiplier = credits / 3.0
            
            # Pace modifier (slow pace requires more study time)
            pace_factor = 1.30 if learning_pace == 1 else (1.00 if learning_pace == 2 else 0.78)

            base_study_hours = (score_deficit / 18.0) * difficulty_multiplier * credit_multiplier * pace_factor
            
            # Add subtle realistic variance
            study_hours = float(np.clip(base_study_hours + np.random.normal(0, 0.2), 1.0, 9.5))

            records.append({
                "attendance": round(overall_attendance, 2),
                "marks": round(overall_marks, 2),
                "cgpa": round(cgpa, 2),
                "course_score": round(course_score, 2),
                "course_attendance": round(course_attendance, 2),
                "credits": int(credits),
                "course_difficulty": round(difficulty, 2),
                "learning_pace": int(learning_pace),
                "weekly_available_hours": round(weekly_available_hours, 2),
                "target_risk_level": int(target_risk_level),
                "target_study_hours": round(study_hours, 2)
            })

            if len(records) >= n_samples:
                break
        if len(records) >= n_samples:
            break

    df = pd.DataFrame(records)
    return df

if __name__ == "__main__":
    output_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(output_dir, "student_study_data.csv")

    print(f"Generating 1,500 synthetic student-course records...")
    df = generate_student_study_data(n_samples=1500)
    df.to_csv(output_path, index=False)

    print(f"Dataset successfully generated at: {output_path}")
    print(f"Total Rows: {len(df)}")
    print("\nFeature Summary:")
    print(df.describe().round(2))
    print("\nTarget Risk Level Distribution (0: Low, 1: Medium, 2: High):")
    print(df['target_risk_level'].value_counts().sort_index())

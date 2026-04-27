import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, ConfusionMatrixDisplay

# =========================
# 1. LOAD DATA
# =========================
df = pd.read_csv("Dataset.csv")

print("Dataset Shape:", df.shape)
print(df.head())

# =========================
# 2. PREPROCESSING
# =========================

# Handle missing values
df.fillna(df.mean(numeric_only=True), inplace=True)

# Define features & target
X = df.drop("AssignmentCompletion", axis=1)
y = df["AssignmentCompletion"]

# =========================
# 3. TRAIN TEST SPLIT
# =========================
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# =========================
# 4. SCALING
# =========================
scaler = StandardScaler()

X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# =========================
# 5. MODEL (RANDOM FOREST)
# =========================
rf = RandomForestClassifier(
    n_estimators=200,
    max_depth=10,
    random_state=42
)

rf.fit(X_train, y_train)

y_pred = rf.predict(X_test)

# =========================
# 6. EVALUATION
# =========================
print("\nMODEL PERFORMANCE:")
print("Accuracy:", accuracy_score(y_test, y_pred))
print("Precision:", precision_score(y_test, y_pred, average='weighted'))
print("Recall:", recall_score(y_test, y_pred, average='weighted'))
print("F1 Score:", f1_score(y_test, y_pred, average='weighted'))

# =========================
# 7. CONFUSION MATRIX
# =========================
cm = confusion_matrix(y_test, y_pred)

disp = ConfusionMatrixDisplay(confusion_matrix=cm)
disp.plot()

plt.title("Confusion Matrix")
plt.show()

# =========================
# 8. ACTUAL vs PREDICTED
# =========================
plt.figure()
plt.scatter(y_test, y_pred)

plt.xlabel("Actual")
plt.ylabel("Predicted")
plt.title("Actual vs Predicted")

plt.plot([y_test.min(), y_test.max()],
         [y_test.min(), y_test.max()])

plt.show()

# =========================
# 9. FEATURE IMPORTANCE
# =========================
importance = pd.Series(rf.feature_importances_, index=X.columns)

importance.sort_values().plot(kind='barh')

plt.title("Feature Importance")
plt.show()

# Take one real student from dataset
new_student = [X.iloc[0].values]

new_student_scaled = scaler.transform(new_student)

prediction = rf.predict(new_student_scaled)

print("\nNEW STUDENT PREDICTION:", prediction)

if prediction[0] == 1:
    print("Risk Level: LOW")
else:
    print("Risk Level: HIGH")

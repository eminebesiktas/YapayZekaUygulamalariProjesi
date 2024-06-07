import os
import cv2
import numpy as np
import tensorflow as tf
import mediapipe as mp
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout

# Mediapipe Pose modeli
mp_pose = mp.solutions.pose
pose = mp_pose.Pose()

# Keypoint'leri çıkartmak için fonksiyon
def extract_keypoints(results):
    keypoints = []
    for res in results.pose_landmarks.landmark:
        keypoints.append([res.x, res.y, res.z, res.visibility])
    return np.array(keypoints).flatten()

# Keypoint tabanlı model oluşturma
def create_keypoint_model(input_shape, num_classes):
    model = Sequential([
        Dense(128, activation='relu', input_shape=input_shape),
        Dropout(0.5),
        Dense(128, activation='relu'),
        Dropout(0.5),
        Dense(num_classes, activation='softmax')
    ])
    model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
    return model

# Eğitim ve test veri setlerini oluşturma
def load_keypoint_data(data_dir, label_map):
    X = []
    y = []
    for category, label in label_map.items():
        category_dir = os.path.join(data_dir, category)
        for image_file in os.listdir(category_dir):
            image_path = os.path.join(category_dir, image_file)
            image = cv2.imread(image_path)
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            results = pose.process(image_rgb)
            if results.pose_landmarks:
                keypoints = extract_keypoints(results)
                X.append(keypoints)
                y.append(label)
    return np.array(X), np.array(y)

data_dir = "frames"
label_map = {"chest fly machine": 0, "leg extension": 1, "plank": 2, "pull Up": 3, "squat": 4, "tbar row": 5, "tricep dips": 6}

X, y = load_keypoint_data(data_dir, label_map)

from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Modeli oluşturma
input_shape = (X_train.shape[1],)  # Keypoint sayısı
num_classes = len(label_map)
model = create_keypoint_model(input_shape, num_classes)

# Modeli eğitme
model.fit(X_train, y_train, validation_data=(X_test, y_test), epochs=10)

# Modeli kaydetme
model.save("model.h5")

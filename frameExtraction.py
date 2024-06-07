import numpy as np
import cv2
import mediapipe as mp
import os
from keras.layers import Dense, Conv1D, MaxPooling1D, Flatten, Dropout
from sklearn.model_selection import train_test_split
from keras.models import Sequential

mp_pose = mp.solutions.pose
pose = mp_pose.Pose()
mp_drawing = mp.solutions.drawing_utils

def extract_keypoints(results):
    keypoints = []
    for res in results.pose_landmarks.landmark:
        keypoints.append([res.x, res.y, res.z, res.visibility])
    return np.array(keypoints).flatten()

def process_videos(video_path):
    cap = cv2.VideoCapture(video_path)
    keypoints_list = []

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(image)

        if results.pose_landmarks:
            keypoints = extract_keypoints(results)
            keypoints_list.append(keypoints)

    cap.release()
    return keypoints_list

# Her video için poz bilgilerini çıkartıyorum ve kaydediyorum
data_dir = 'dataset'
exercise_labels = os.listdir(data_dir)
all_keypoints = []
labels = []

for idx, exercise in enumerate(exercise_labels):
    exercise_path = os.path.join(data_dir, exercise)
    videos = os.listdir(exercise_path)

    for video in videos:
        video_path = os.path.join(exercise_path, video)
        keypoints = process_videos(video_path)
        all_keypoints.extend(keypoints)
        labels.extend([idx] * len(keypoints))

all_keypoints = np.array(all_keypoints)
labels = np.array(labels)

# Veriyi eğitim ve test setlerine ayırma
X_train, X_test, y_train, y_test = train_test_split(all_keypoints, labels, test_size=0.2, random_state=42)

model_cnn = Sequential()
model_cnn.add(Conv1D(64, kernel_size=3, activation='relu', input_shape=(X_train.shape[1], 1)))
model_cnn.add(MaxPooling1D(pool_size=2))
model_cnn.add(Conv1D(128, kernel_size=3, activation='relu'))
model_cnn.add(MaxPooling1D(pool_size=2))
model_cnn.add(Flatten())
model_cnn.add(Dense(64, activation='relu'))
model_cnn.add(Dropout(0.5))
model_cnn.add(Dense(len(exercise_labels), activation='softmax'))

model_cnn.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# Modeli eğitme
history = model_cnn.fit(X_train, y_train, epochs=10, validation_data=(X_test, y_test))

loss, accuracy = model_cnn.evaluate(X_test, y_test)
print(f'Model accuracy: {accuracy}')

# Modeli kaydetme
history.save("model.h5")
import os
import numpy as np
import cv2
import mediapipe as mp
from sklearn.model_selection import train_test_split
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM, Dropout
from multiprocessing import Pool


mp_pose = mp.solutions.pose
pose = mp_pose.Pose()
mp_drawing = mp.solutions.drawing_utils


def extract_keypoints(results):
    keypoints = []
    for res in results.pose_landmarks.landmark:
        keypoints.append([res.x, res.y, res.z, res.visibility])
    return np.array(keypoints).flatten()


def process_videos(video_path, frame_skip=5):
    cap = cv2.VideoCapture(video_path)
    keypoints_list = []
    frame_count = 0
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        if frame_count % frame_skip == 0:
            image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = pose.process(image)

            if results.pose_landmarks:
                keypoints = extract_keypoints(results)
                keypoints_list.append(keypoints)

        frame_count += 1

    cap.release()
    return keypoints_list


def process_exercise_videos(args):
    exercise, data_dir, pose_data_dir, frame_skip = args
    keypoints = []
    labels = []
    exercise_path = os.path.join(data_dir, exercise)
    pose_exercise_path = os.path.join(pose_data_dir, exercise)
    os.makedirs(pose_exercise_path, exist_ok=True)
    videos = os.listdir(exercise_path)

    for video in videos:
        video_path = os.path.join(exercise_path, video)
        video_keypoints = process_videos(video_path, frame_skip)
        keypoints.extend(video_keypoints)
        labels.extend([exercise] * len(video_keypoints))
        pose_data_path = os.path.join(pose_exercise_path, video.replace('.mp4', '.npy'))
        np.save(pose_data_path, video_keypoints)

    return keypoints, labels


data_dir = 'dataset'
pose_data_dir = 'pose_data'
os.makedirs(pose_data_dir, exist_ok=True)
exercise_labels = os.listdir(data_dir)
all_keypoints = []
labels = []
frame_skip = 5

with Pool() as pool:
    results = pool.map(process_exercise_videos,
                       [(exercise, data_dir, pose_data_dir, frame_skip) for exercise in exercise_labels])

for keypoints, label in results:
    all_keypoints.extend(keypoints)
    labels.extend(label)

all_keypoints = np.array(all_keypoints)
labels = np.array(labels)

# Eğitim ve test setlerine ayırma
X_train, X_test, y_train, y_test = train_test_split(all_keypoints, labels, test_size=0.2, random_state=42)

# Modeli oluşturma
model = Sequential()
model.add(LSTM(64, return_sequences=True, activation='relu', input_shape=(X_train.shape[1], 1)))
model.add(LSTM(128, return_sequences=False, activation='relu'))
model.add(Dense(64, activation='relu'))
model.add(Dense(len(exercise_labels), activation='softmax'))

# Modeli derleme
model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# Modeli eğitme
history = model.fit(X_train, y_train, epochs=10, validation_data=(X_test, y_test))

# Modeli değerlendirme
loss, accuracy = model.evaluate(X_test, y_test)
print(f'Model accuracy: {accuracy}')
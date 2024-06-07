# app.py
from flask import Flask, render_template, Response
import cv2
import numpy as np
import tensorflow as tf
import mediapipe as mp

app = Flask(__name__)

mp_pose = mp.solutions.pose
pose = mp_pose.Pose()
mp_drawing = mp.solutions.drawing_utils

model = tf.keras.models.load_model('trained_model.h5')
exercise_labels = ['Chest Fly Machine', 'Leg Extension', 'Plank', 'Pull Up', 'Squat', 'T Bar Row', 'Tricep Dips']

def generate_frames():
    cap = cv2.VideoCapture(0)
    while True:
        success, frame = cap.read()
        if not success:
            break
        else:
            image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = pose.process(image)

            if results.pose_landmarks:
                resized_image = cv2.resize(frame, (128, 128))
                resized_image = np.expand_dims(resized_image, axis=0)
                prediction = model.predict(resized_image)
                predicted_class = np.argmax(prediction, axis=1)[0]
                predicted_label = exercise_labels[predicted_class]

                # Tahmin güvenilirliği skoru oluşturma
                confidence_score = np.max(prediction)

                # Değerlendirme puanını hesaplama (10 üzerinden)
                evaluation_score = int(confidence_score * 10)

                cv2.putText(frame, f"{predicted_label}, Evaluation: {evaluation_score}/10", (10, 30),
                            cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2, cv2.LINE_AA)
                mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


if __name__ == '__main__':
    app.run(debug=True)
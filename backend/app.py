from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore
import cloudinary
import cloudinary.uploader

# Initialize Firebase
cred = credentials.Certificate("vital-link-12089-firebase-adminsdk-fbsvc-211df85b04.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# Initialize Cloudinary
cloudinary.config(
    cloud_name="dpkm4hw1a",
    api_key="865722886633634",
    api_secret="k2P4wgzd2IJuaabtxaf8tdlD3a8"
)

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Requests

# User Registration (Doctor/Patient)
@app.route("/register", methods=["POST"])
def register_user():
    data = request.json
    user_ref = db.collection("users").document(data['user_id'])
    user_ref.set({
        'user_id': data['user_id'],
        'role': data['role'],
        'name': data['name'],
        'specialty': data.get('specialty', '')  # Specialty only for doctors
    })
    return jsonify({"message": "User registered successfully!"})

# Messaging API
@app.route("/send_message", methods=["POST"])
def send_message():
    data = request.json
    db.collection("messages").add(data)
    return jsonify({"message": "Message sent successfully!"})

# Get Patient Messages (Doctor)
@app.route("/get_patient_messages/<doctor_id>", methods=["GET"])
def get_patient_messages(doctor_id):
    messages = db.collection("messages").where("receiver_id", "==", doctor_id).stream()
    return jsonify([msg.to_dict() for msg in messages])

# Get Patient List (Doctor)
@app.route("/get_patients/<doctor_id>", methods=["GET"])
def get_patients(doctor_id):
    patients = db.collection("messages").where("receiver_id", "==", doctor_id).stream()
    patient_ids = set([msg.to_dict()["sender_id"] for msg in patients])
    
    # Fetch patient details
    patient_details = []
    for pid in patient_ids:
        user_ref = db.collection("users").document(pid).get()
        patient_details.append(user_ref.to_dict())
    
    return jsonify(patient_details)

# Document Upload (Patient)
@app.route("/upload_document", methods=["POST"])
def upload_document():
    file = request.files['file']
    visibility = request.form.get('visibility')  # 'all' or specific doctor
    doctor_id = request.form.get('doctor_id', None)  # Optional: for specific doctor
    
    upload_result = cloudinary.uploader.upload(file)
    document_data = {
        'user_id': request.form['user_id'],
        'doctor_id': doctor_id,
        'document_url': upload_result['secure_url'],
        'visibility': visibility,
        'date_uploaded': firestore.SERVER_TIMESTAMP
    }
    db.collection("documents").add(document_data)
    return jsonify({"message": "File uploaded", "file_url": upload_result['secure_url']})

# Get Documents (For Doctor or Patient)
@app.route("/get_documents/<user_id>", methods=["GET"])
def get_documents(user_id):
    documents = db.collection("documents").where("user_id", "==", user_id).stream()
    return jsonify([doc.to_dict() for doc in documents])

if __name__ == "__main__":
    app.run(debug=True)

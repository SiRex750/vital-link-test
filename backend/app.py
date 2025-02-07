from flask import Flask, request, jsonify
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

# Messaging API
@app.route("/send_message", methods=["POST"])
def send_message():
    data = request.json
    db.collection("messages").add(data)
    return jsonify({"message": "Message sent successfully!"})

@app.route("/get_messages/<user_id>", methods=["GET"])
def get_messages(user_id):
    messages = db.collection("messages").where("receiver_id", "==", user_id).stream()
    return jsonify([msg.to_dict() for msg in messages])

# Document Upload API
@app.route("/upload_document", methods=["POST"])
def upload_document():
    file = request.files['file']
    upload_result = cloudinary.uploader.upload(file)
    return jsonify({"message": "File uploaded", "file_url": upload_result['secure_url']})

if __name__ == "__main__":
    app.run(debug=True)

const API_URL = "http://localhost:5000";

let userType = null;  // Either 'doctor' or 'patient'

function setUserType(type) {
    userType = type;
    document.getElementById('user-type').style.display = 'none';
    
    if (userType === 'doctor') {
        document.getElementById('doctor-options').style.display = 'block';
        loadDoctorPatients();
    } else {
        document.getElementById('patient-options').style.display = 'block';
        loadPatientDoctors();
    }
}

function loadDoctorPatients() {
    fetch(`${API_URL}/get_patients/doctor123`)  // Example doctor ID
        .then(res => res.json())
        .then(data => {
            const patientsList = document.getElementById('patients-list');
            data.forEach(patient => {
                const patientItem = document.createElement('div');
                patientItem.innerHTML = `${patient.name} (${patient.specialty})`;
                patientsList.appendChild(patientItem);
            });
        });
}

function sendDoctorMessage() {
    const message = document.getElementById('doctor-message').value;
    fetch(`${API_URL}/send_message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender_id: "doctor123", receiver_id: "patient123", message })
    })
    .then(res => res.json())
    .then(data => alert(data.message));
}

function loadPatientDoctors() {
    fetch(`${API_URL}/get_documents/patient123`)  // Example patient ID
        .then(res => res.json())
        .then(data => {
            const doctorList = document.getElementById('doctor-list');
            data.forEach(doc => {
                const doctorItem = document.createElement('div');
                doctorItem.innerHTML = `${doc.name} (${doc.specialty})`;
                doctorList.appendChild(doctorItem);
            });
        });
}

function uploadDocument() {
    const file = document.getElementById('fileInput').files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('visibility', 'all');  // Change this as needed
    formData.append('user_id', 'patient123');
    
    fetch(`${API_URL}/upload_document`, { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => alert("File uploaded: " + data.file_url));
}

function sendPatientMessage() {
    const message = document.getElementById('patient-message').value;
    fetch(`${API_URL}/send_message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender_id: "patient123", receiver_id: "doctor123", message })
    })
    .then(res => res.json())
    .then(data => alert(data.message));
}

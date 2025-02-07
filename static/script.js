const API_URL = "http://localhost:5000";

function showDoctorLogin() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('userRole').innerText = 'Doctor';
}

function showPatientLogin() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('userRole').innerText = 'Patient';
}

function login() {
    const userId = document.getElementById('userId').value;
    const role = document.getElementById('userRole').innerText.toLowerCase();
    
    if (role === 'doctor') {
        // Fetch list of patients
        fetch(`${API_URL}/get_messages/${userId}`)
            .then(res => res.json())
            .then(data => {
                const patientList = document.getElementById('patientList');
                patientList.innerHTML = '';
                data.forEach(patient => {
                    const li = document.createElement('li');
                    li.innerText = `Patient ID: ${patient.sender_id}, Message: ${patient.message}`;
                    patientList.appendChild(li);
                });
            });
        document.getElementById('patients-list').style.display = 'block';
    } else if (role === 'patient') {
        // Fetch list of doctors
        fetch(`${API_URL}/get_messages/${userId}`)
            .then(res => res.json())
            .then(data => {
                const doctorList = document.getElementById('doctorList');
                doctorList.innerHTML = '';
                data.forEach(doctor => {
                    const li = document.createElement('li');
                    li.innerText = `Doctor ID: ${doctor.receiver_id}, Speciality: ${doctor.speciality}`;
                    doctorList.appendChild(li);
                });
            });
        document.getElementById('doctors-list').style.display = 'block';
    }

    document.getElementById('loginForm').style.display = 'none';
}

function sendMessage() {
    const message = document.getElementById("message").value;
    fetch(`${API_URL}/send_message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender_id: "patient123", receiver_id: "doctor123", message })
    })
    .then(res => res.json())
    .then(data => alert(data.message));
}

function uploadDocument() {
    const file = document.getElementById("fileInput").files[0];
    let formData = new FormData();
    formData.append("file", file);

    fetch(`${API_URL}/upload_document`, { method: "POST", body: formData })
    .then(res => res.json())
    .then(data => alert("File uploaded: " + data.file_url));
}

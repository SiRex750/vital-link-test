const API_URL = "http://localhost:5000";

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

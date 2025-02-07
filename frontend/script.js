const API_URL = "http://localhost:5000";

function sendMessage() {
    const message = document.getElementById("message").value;
    fetch(`${API_URL}/send_message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            sender_id: "patient123",
            receiver_id: "doctor123",
            message: message
        })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        loadMessages();
    })
    .catch(err => console.error("Error sending message:", err));
}

function uploadDocument() {
    const file = document.getElementById("fileInput").files[0];
    let formData = new FormData();
    formData.append("file", file);

    fetch(`${API_URL}/upload_document`, {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(data => alert("File uploaded: " + data.file_url))
    .catch(err => console.error("Error uploading document:", err));
}

function loadMessages() {
    const userId = "patient123";  // Or dynamically set this
    fetch(`${API_URL}/get_messages/${userId}`, {
        method: "GET"
    })
    .then(res => res.json())
    .then(data => {
        const messagesDiv = document.getElementById("messages");
        messagesDiv.innerHTML = "";  // Clear existing messages
        data.forEach(msg => {
            const msgDiv = document.createElement("div");
            msgDiv.textContent = `From: ${msg.sender_id} - ${msg.message}`;
            messagesDiv.appendChild(msgDiv);
        });
    })
    .catch(err => console.error("Error loading messages:", err));
}

// Load messages on page load
window.onload = loadMessages;

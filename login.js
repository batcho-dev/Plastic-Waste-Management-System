// login.js
document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const messageDiv = document.getElementById("message");
    messageDiv.textContent = "";
    messageDiv.className = "message";

    // Collect form data
    const formData = {
        email: document.querySelector('input[name="email"]').value.trim(),
        password: document.querySelector('input[name="password"]').value,
        role: document.querySelector('select[name="role"]').value
    };

    // Basic client-side validation
    if (!formData.email || !formData.password || !formData.role) {
        messageDiv.textContent = "Please fill in all required fields";
        messageDiv.className = "message error";
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            // Save the JWT token - very important!
            localStorage.setItem("token", result.token);
            localStorage.setItem("user", JSON.stringify(result.user));

            messageDiv.textContent = "Login successful! Redirecting...";
            messageDiv.className = "message success";

            setTimeout(() => {
                window.location.href = "UserDashboard.html";
            }, 1200);
        } else {
            messageDiv.textContent = result.error || "Login failed. Please check your credentials.";
            messageDiv.className = "message error";
        }
    } catch (err) {
        messageDiv.textContent = "Could not connect to server. Is backend running?";
        messageDiv.className = "message error";
        console.error("Login error:", err);
    }
});
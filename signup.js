// signup.js

// Optional: Show OTP field only after valid phone length (you can keep or remove)
const phoneInput = document.querySelector('input[name="phone"]');
const otpContainer = document.getElementById('otpContainer');

if (phoneInput && otpContainer) {
    phoneInput.addEventListener('input', () => {
        otpContainer.style.display = phoneInput.value.trim().length >= 9 ? 'block' : 'none';
    });
}

document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const messageDiv = document.getElementById("message");
    messageDiv.textContent = "";
    messageDiv.className = "message";

    // Collect form data
    const formData = {
        full_name: document.querySelector('input[name="name"]').value.trim(),
        email: document.querySelector('input[name="email"]').value.trim(),
        password: document.querySelector('input[name="password"]').value,
        phone: document.querySelector('input[name="phone"]')?.value.trim() || null,
        role: document.querySelector('select[name="role"]').value
    };

    // Basic validation
    if (!formData.full_name || !formData.email || !formData.password || !formData.role) {
        messageDiv.textContent = "Please fill in all required fields";
        messageDiv.className = "message error";
        return;
    }

    // Optional: password strength check (you can make it stricter)
    if (formData.password.length < 6) {
        messageDiv.textContent = "Password must be at least 6 characters";
        messageDiv.className = "message error";
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            messageDiv.textContent = "Account created successfully! Redirecting to login...";
            messageDiv.className = "message success";

            setTimeout(() => {
                window.location.href = "Login.html";
            }, 1800);
        } else {
            messageDiv.textContent = result.error || "Signup failed. Please try again.";
            messageDiv.className = "message error";
        }
    } catch (err) {
        messageDiv.textContent = "Could not connect to server. Is backend running?";
        messageDiv.className = "message error";
        console.error("Signup error:", err);
    }
});
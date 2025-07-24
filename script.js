(() => {
    const extensionName = "faiss-extension";
    const settingsKey = "faiss-extension-enabled";

    function log(msg) {
        console.log(`[FaissExtension] ${msg}`);
    }

    function fetchMemory(query) {
        return fetch("http://127.0.0.1:7861/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query, top_k: 5 })
        })
        .then(res => res.json())
        .then(data => data.results || []);
    }

    function injectMemoriesIntoPrompt(results) {
        const memoryBlock = results.map((r, i) => `(${i+1}) ${r}`).join("\n");
        const textarea = document.querySelector("#chat-send-text");
        if (textarea) {
            textarea.value = `/* MEMOIRE RAPPELEE */\n${memoryBlock}\n\n` + textarea.value;
        }
    }

    function addButton() {
        const bar = document.querySelector("#send-row");
        if (!bar || document.getElementById("faiss-btn")) return;

        const btn = document.createElement("button");
        btn.id = "faiss-btn";
        btn.textContent = "🔍 Souvenirs";
        btn.style.marginLeft = "8px";
        btn.onclick = async () => {
            const query = prompt("Que veux-tu rappeler à l’IA ?");
            if (!query) return;
            const results = await fetchMemory(query);
            injectMemoriesIntoPrompt(results);
        };
        bar.appendChild(btn);
    }

    function setupExtension() {
        addButton();
        log("Extension Faiss chargée.");
    }

    window.addEventListener("load", () => {
        setTimeout(setupExtension, 1000);
    });
})();

document.getElementById("generateApiKeyBtn").addEventListener("click", async () => {
    const response = await fetch("/generate-api", { method: "POST" });
    const data = await response.json();
    document.getElementById("apiKey").innerText = `Your API Key: ${data.apiKey}`;
  });
  
  document.getElementById("ocrForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const apiKey = document.getElementById("userApiKey").value;
    const imageFile = document.getElementById("imageInput").files[0];
    
    const formData = new FormData();
    formData.append("apiKey", apiKey);
    formData.append("image", imageFile);
  
    const response = await fetch("/ocr", {
      method: "POST",
      body: formData,
    });
  
    const data = await response.json();
    if (data.error) {
      document.getElementById("ocrResult").innerText = `Error: ${data.error}`;
    } else {
      document.getElementById("ocrResult").innerText = `Extracted Text: ${data.text}`;
    }
  });
  
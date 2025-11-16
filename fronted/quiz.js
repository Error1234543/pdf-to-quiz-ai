async function uploadPDF() {
    const fileInput = document.getElementById('pdfFile');
    if (!fileInput.files.length) return alert('Select a PDF');
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    const res = await fetch('https://pdf-to-quiz-ai.onrender.com/upload', { method: 'POST', body: formData });
    const data = await res.json();
    document.getElementById('result').innerText = JSON.stringify(data, null, 2);
}
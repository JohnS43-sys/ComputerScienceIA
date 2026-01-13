function exportToPDF() {
    const doc = new jspdf.jsPDF();
    const messageElements = document.querySelectorAll('.message-item');
    messageElements.forEach((element, index) => {
        const text = element.innerText;
        doc.text(text, 10, 10 + (index * 10));
    }); 
    doc.save('conversation.pdf');
}
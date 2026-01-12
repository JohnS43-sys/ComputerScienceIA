function exportToPDF() {
    const doc = new jspdf.jsPDF();
    const messageElements = document.querySelectorAll('.message-content');
    doc.save('conversation.pdf');
}
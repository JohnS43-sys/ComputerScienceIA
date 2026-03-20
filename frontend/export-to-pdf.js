//Function to export all the content of a conversation
function exportToPDF() {
    //initialize a new jsPDF
    const doc = new jspdf.jsPDF();
    //extract all message-items
    const messageElements = document.querySelectorAll('.message-item');
    //loop through each element in messageElements
    messageElements.forEach((element, index) => {
        const text = element.innerText;
        //add each message element to the doc
        doc.text(text, 10, 10 + (index * 10));
    }); 
    //save the doc
    doc.save('conversation.pdf');
}
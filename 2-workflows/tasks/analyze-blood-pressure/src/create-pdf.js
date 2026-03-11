
async function createPDF({ sdk, user, document, diagnosis }) {

  // Generate the PDF with the PDF analysis template
  const task = await exh.tasks.functions.execute('html-to-pdf', {
      "templateName": "pdf-analysis",
      "language": "NL",
      "timeZone": "Europe/Brussels",
      "inputs": {
          "first_name": user.firstName,
          "category": diagnosis,
          "diastolic": document.data.diastolic,
          "systolic": document.data.systolic,
          "date": new Date(document.data.timestamp).toDateString(),
      }
  });

  // Transition the document to report-available
  await sdk.data.documents.transition("blood-pressure-measurement", document.id, {
    // Report property is added to the data to store the file service token
    name: 'add-report',
    data: { report: task.result.fileToken }
  });

  return task.result.fileToken;
}

module.exports = {
  createPDF
}

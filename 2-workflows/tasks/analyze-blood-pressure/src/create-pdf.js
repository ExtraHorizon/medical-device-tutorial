
async function createPDF({ sdk, user, document, diagnosis }) {
  // Find the pdf template
  const pdfTemplate = await sdk.templates.findByName("pdf-analysis");

  // Generate the PDF with the template
  const pdf = await sdk.templates.resolveAsPdf(pdfTemplate.id, {
      "language": "NL",
      "time_zone": "Europe/Brussels",
      "content": {
          "first_name": user.firstName,
          "category": diagnosis,
          "diastolic": document.data.diastolic,
          "systolic": document.data.systolic,
          "date": new Date(document.data.timestamp).toDateString(),
      }
  });

  // Upload the pdf to the file service
  const fileResult = await sdk.files.create(`measurement-${document.id}`, pdf);

  // Transition the document to report-available
  await sdk.data.documents.transition("blood-pressure-measurement", document.id, {
    // Report property is added to the data to store the file service token
    name: 'add-report',
    data: { report: fileResult.tokens[0].token }
  });

  return pdf;
}

module.exports = {
  createPDF
}

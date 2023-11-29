const { getSDK } = require("./sdk");

// https://www.heart.org/en/health-topics/high-blood-pressure/understanding-blood-pressure-readings
function getDiagnosis(systolic, diastolic) {
    if(systolic < 120 && diastolic < 80) {
        return "normal";
    }

    if(systolic < 130 && diastolic < 80) {
        return "elevated";
    }

    if(systolic < 140 && diastolic < 90) {
        return "hypertension-stage-1";
    }

    if(systolic < 180 && diastolic < 120) {
        return "hypertension-stage-2";
    }

    return "hypertensive-crisis";
}

exports.handler = async (task) => {
    const sdk = await getSDK();

    //Read the blood pressure document
    const retrievedDocument= await sdk.data.documents.findById('blood-pressure-measurement', task.data.documentId);

    // Analyze the measurement and assign a category to it
    const diagnosis = getDiagnosis(retrievedDocument.data.systolic, retrievedDocument.data.diastolic);

    // Find the id of the transition, needed for transitioning the document
    const schema = await sdk.data.schemas.findByName('blood-pressure-measurement');
    const transition = schema.transitions.find(transition => transition.name === "mark-as-analyzed");

    // Sending an email with the result of the analysis
    const user = await sdk.users.findById(retrievedDocument.creatorId);

    // Find the pdf template
    const pdfTemplate = await sdk.templates.findByName("pdf-analysis");

    // Generate the PDF with the template
    const pdf = await sdk.templates.resolveAsPdf(pdfTemplate.id, {
        "language": "NL",
        "time_zone": "Europe/Brussels",
        "content": {
            "first_name": user.first_name,
            "category": diagnosis,
            "diastolic": retrievedDocument.data.diastolic,
            "systolic": retrievedDocument.data.systolic,
            "date": new Date(retrievedDocument.data.timestamp).toDateString(),
        }
    });

    // Upload the pdf to the file service
    const fileResult = await sdk.files.create(`measurement-${task.data.documentId}`, pdf);

    // Transition the document to analyzed
    await sdk.data.documents.transition(
        'blood-pressure-measurement',
        task.data.documentId,
        // Report property is added to the data to store the file service token
        { id: transition.id, data: { category: diagnosis, report: fileResult.tokens[0].token }}
    );

    // Sending an email with the result of the analysis
    const mailTemplate = await sdk.templates.findByName("mail-analysis");

    await sdk.mails.send({
        recipients: { to: [user.email] },
        templateId: mailTemplate.id,
        content: {
            first_name: user.firstName,
            date: retrievedDocument.data.timestamp.toLocaleString(),
            category: diagnosis,
        },
         attachments: [{
            name: 'analysis.pdf',
            content: pdf.toString('base64'),
            type: fileResult.mimetype,
         }],
    });
};

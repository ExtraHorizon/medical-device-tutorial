const { getSDK } = require("./sdk");

exports.handler = async (task) => {
    const sdk = await getSDK();

    //Read the blood pressure document
    const retrievedDocument= await sdk.data.documents.findById('blood-pressure-measurement', task.data.documentId);

    // Extract the measurement from the document
    const measurement = retrievedDocument.data;

    // Analyze the measurement and assign a category to it
    const category = getCategory(measurement.systolic, measurement.diastolic);

    // Find the id of the transition, needed for transitioning the document
    const schema = await sdk.data.schemas.findByName('blood-pressure-measurement');
    const transition = schema.transitions.find(transition => transition.name === "mark-as-analyzed");

    // Transition the document to analyzed
    await sdk.data.documents.transition('blood-pressure-measurement', task.data.documentId, { id: transition.id, data: { category }  });


    const user = await sdk.users.findById(retrievedDocument.creatorId);

    await sdk.mails.send({
        recipients: { to: [user.email] },
        templateId: "652d1daf3844935e3f82e066",
        content: {
            first_name: user.firstName,
            date: measurement.timestamp.toLocaleString(),
            blood_pressure: category,
        }
    });
};

// https://www.heart.org/en/health-topics/high-blood-pressure/understanding-blood-pressure-readings
function getCategory(systolic, diastolic) {
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

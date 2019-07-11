const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

exports.updateTypeInfo = functions.database.ref("user/{userId}").onWrite(event => {
    const getSomethingPromise = admin.database().ref(`/user/{userId}/answers`).once('value');
    getSomethingPromise.then(results => {
        let answers = []
        Object.entries(answers).forEach(
            ([key, value]) => answers.push(value) 
        );
        let score = calculateScore(answers, 0);

        //update values

    })

    
});

function calculateScore(answeredQuestion, totalQuestions) {
    let positiveAnsweredQuestions = 0;
    for(let i = 0; answeredQuestions.length < i; i++) {
      if (answeredQuestion.value == 1) {
        positiveAnsweredQuestions += 1;
      }
    }
    let score = (positiveAnsweredQuestions / totalQuestions) * 100;
    return score;
  }


//calculate accuray using weird formula
function calculateAccuracy() {

}


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

exports.updateTypeInfo = functions.database.ref(`/users/{userId}/answers`).onWrite((snapshot, context) => {
    const dimension = ["A", "B", "C", "D"];

    console.log("starting to calculate score");
    let user_id = context.params.userId;
    let results = snapshot.after.val();
    let answers = [];

    let totalQuestions = 5;
    let totalQuestionsAmount = 20;
    // { q1: {answer: 1} }

    let keys = Object.keys(results);
    for (let i = 0; i < keys.length; i++) {
        answers.push(results[keys[i]]);
    }
    let scores = [];

    //calculates score of questions and pushes it in array
    dimension.forEach((element) => {
        let tempAnswers = answers.filter(answer => answer.dimension === element);
        let score = calculateScore(tempAnswers, totalQuestions);
        scores.push(score);
    });

    let scoreIndex = getMaxIndexFromArray(scores);
    console.log(`score: ${scores[scoreIndex]} and type: ${dimension[scoreIndex]}`);
    let db = admin.database();
    let ref = db.ref(`/users/${user_id}/profile`);
    ref.set({
        score: scores[scoreIndex],
        type: dimension[scoreIndex],
        accuracy: calculateAccuracy(totalQuestionsAmount, answers.length)
    }).catch( () => {
        console.log(`could not update user profile information`);
    });

    return 0;
});

function getMaxIndexFromArray(array) {
    let max = array[0];
    let maxIndex = 0;

    array.forEach((element, index) => {
        if (element > max) {
            maxIndex = index;
        }
    });
    return maxIndex;
}

function calculateScore(answeredQuestions, totalQuestions) {
    let positiveAnsweredQuestions = 0;
    for (let i = 0; i < answeredQuestions.length; i++) {
        if (answeredQuestions[i].value === 1) {
            positiveAnsweredQuestions += 1;
        }
    }
    let score = (positiveAnsweredQuestions / totalQuestions) * 100;
    console.log(`calculated score: ${score}`);
    return score;
}

function calculateAccuracy(totalQuestionsAmount, answeredQuestionsAmount) {
    return Math.round((answeredQuestionsAmount / totalQuestionsAmount) * 100);
}

vconst functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

exports.updateTypeInfo = functions.database.ref(`/users/{userId}/answers`).onWrite((snapshot, context) => {
      console.log("starting to calculate score");
      let user_id = context.params.userId;
      let results = snapshot.after.val();
      let answers = [];
      let keys = Object.keys(results);
      let totalQuestions = 5;
      let totalQuestionsAmount = 20;
      // { q1: {answer: 1} }

      for(let i = 0; i < keys.length; i++) {
        answers.push(results[keys[i]]);
      }
      let scores = [];
      let dimension = ["A", "B", "C", "D"];

      //calculates score of questionas and pushes it in array
      for(let i = 0; i < 4; i++) {
        let tempAnswers = answers.filter(answer => answer.dimension === dimension[i]);
        let score = calculateScore(tempAnswers, totalQuestions);
        scores.push(score);
      }
      let scoreIndex = getMaxIndexFromArray(scores);
      console.log(`score: ${scores[scoreIndex]} and type: ${dimension[scoreIndex]}`)
      let db = admin.database();
      let ref = db.ref(`/users/${user_id}`);
      let user_ref = ref.child("profile");
      user_ref.set({
        score: scores[scoreIndex],
        type: dimension[scoreIndex],
        accuracy: calculateAccuracy(totalQuestionsAmount, answers.length)
      });

      return 0;
});

function getMaxIndexFromArray(array) {
  var max = array[0];
  var maxIndex = 0;

  for (let i = 1; i < array.length; i++) {
      if (array[i] > max) {
          maxIndex = i;
          max = array[i];
      }
  }
  return maxIndex;
}

function calculateScore(answeredQuestions, totalQuestions) {
    let positiveAnsweredQuestions = 0;
    for(let i = 0; i < answeredQuestions.length; i++) {
        if (answeredQuestions[i].value === 1) {
        positiveAnsweredQuestions += 1;
      }
    }
    let score = (positiveAnsweredQuestions / totalQuestions) * 100;
    console.log(`calculated score: ${score}`);
    return score;
  }

function countQuestions() {
  return [5, 5, 5, 5];
}

//calculate accuray using weird formula
function calculateAccuracy(totalQuestionsAmount, answeredQuestionsAmount) {
  return (answeredQuestionsAmount / totalQuestionsAmount) * 100;
}

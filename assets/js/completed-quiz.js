const GRAPHQL_ENDPOINT = "http://localhost:8080/v1/graphql"
const params = new URLSearchParams(window.location.search) // use the prev URL

const course_id = params.get("cid")
const quizId = params.get("qid")

async function exitButton(){
  
  toExit = `
  <a href="http://localhost:3000/pages/course_content?id=${course_id}" class="button">Exit Quiz</a>
  `
  document.getElementById('exitButton').innerHTML += toExit
}
exitButton()


async function updateCompletedQuiztable(quiz_attempt, pof) {
  // console.log(pof)
  // console.log(quiz_id)

  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': getIdToken(),
    },

    body: JSON.stringify({
      query:
        `
          mutation {
            update_completed_quiz(where: {attempt: {_eq: ${quiz_attempt}}, learner_id: {_eq: 1}},_set:{passed:"${pof}"}){
              affected_rows
            }
          }
          `

    })
  })

}


async function getQuizResults(title, sectionId, counter) {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': getIdToken(),
    },

    body: JSON.stringify({
      query: `
      query{
        completed_quiz(where:{quiz_id:{_eq:${quizId}}},order_by:{
          attempt:asc
        }){
          score
          quiz_id
          attempt
          learner_id
        }
      }
      
        `
    })
  })

  const dataset = await response.json()
  console.log(dataset)
  const allCompletedquizzes = dataset.data.completed_quiz

  // DISPLAY ALL THE UNIQUE WEEKS 
  oneRow = ''
  let overallGrade = 0
  let passingGrade = counter / 2

  for (eachQuiz of allCompletedquizzes) {
    console.log(eachQuiz)
    overallGrade = (eachQuiz.score / counter) * 100
    overallGrade = parseFloat(overallGrade).toFixed(2);


    oneRow += `
  <tr>
    <th>${eachQuiz.attempt}</th>
    <th>${title}</th>
    <th>${sectionId}</th> 
    <th>${eachQuiz.score}/${counter}</th>`
    // console.log(eachQuiz.score)

    if (eachQuiz.score < passingGrade) {
      pof = false
      // console.log(eachQuiz.score / counter)
      oneRow += `
      <th style="color:#ff3333">Failed</th>`
      // console.log(eachQuiz.score, pof)
      console.log(pof)
      updateCompletedQuiztable(eachQuiz.attempt, pof)
    }

    else {
      pof = true
      oneRow += `
      <th style="color:#3CB371">Passed</th>`
      // console.log(eachQuiz.score, pof)

      updateCompletedQuiztable(eachQuiz.attempt, pof)
    }

    oneRow += `
    <tr>
  `
    overallGrade = 0
  }
  document.getElementById('quizResults').innerHTML = oneRow


}


async function getQuizTitle() {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': getIdToken(),
    },

    body: JSON.stringify({
      query:
        `
        query{
          quiz(where: {id: {_eq: ${quizId}}}){
            title
            section_id
            questions
            {
              id
            }
          }
        }
        `
    })
  })
  const dataset = await response.json()
  const allQuestions = dataset.data.quiz[0].questions
  // console.log(allQuestions)
  let counter = 0
  for (question of allQuestions) {
    // console.log(question)
    counter += 1
  }

  const title = dataset.data.quiz[0].title
  const sectionId = dataset.data.quiz[0].section_id

  getQuizResults(title, sectionId, counter)

}

getQuizTitle()

// let counter = 0
// for (question of allQuestions) {
//   console.log(question)
//   counter += 1
// }

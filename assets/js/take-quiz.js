const GRAPHQL_ENDPOINT = getHasuraEndpoint()
const params = new URLSearchParams(window.location.search) // use the prev URL

const section_id = params.get("sid")
const course_id = params.get("cid")
const quiz_id = params.get("qid")

let loadedAttempt = null
let loadedQuizId = null

async function getquiz() {
  let query = `
    query {
      course(where: {id: {_eq:${course_id}}}) {
        sections(where:{id:{_eq:${section_id}}}) {
          name
          quizzes {
            id
            questions {
              id
              title
              question_options {
                id
                title
              }
            }
          }
        }
      }

      completed_quiz(where: {quiz_id: {_eq: ${quiz_id}}, learner_id: {_eq: 1}, score: {_neq: -1}}, order_by: {attempt: desc}, limit: 1) {
        attempt
      }
    }              
  `
  const { course: quiz, completed_quiz } = (await postDataToHasura(query))
  const { questions: all_questions_object, id: quizId } = quiz[0].sections[0].quizzes[0]
  const currentAttempts = completed_quiz.length === 0 ? 1 : completed_quiz[0].attempt + 1
 
  loadedAttempt = currentAttempts
  console.log(loadedAttempt)

  loadedQuizId = quizId
 

  
  display_question = ''

  for (individual_question_object of all_questions_object) {
    const { id: questionId } = individual_question_object

    display_question += `
        <div>
            <p id="insert_question" class="text-justify h5 pb-2 font-weight-bold">${individual_question_object.title}</p>
            <div id="insert_options" class="options py-3">`
    for (options of individual_question_object.question_options) {
      display_question +=
        `
          <label class="rounded p-2 option"> ${options.title} <input type="radio" name="radio-${questionId}" onclick="insertSelectedOptions(${currentAttempts}, ${quizId}, ${questionId}, ${options.id})"><span class="checkmark"></span> </label> 
        `
    }
    display_question += `
            </div>        
        </div>`
  }
  document.getElementById('one_question').innerHTML = display_question

  query = `
    mutation {
      insert_completed_quiz(objects: [
        {
          attempt: ${currentAttempts},
          learner_id: 1,
          quiz_id: ${quizId}
        }
      ], on_conflict: {
        constraint: completed_quiz_pkey
      }) {
        affected_rows
      }
    }  
  `
  await postDataToHasura(query)
}

getquiz()

async function postDataToHasura (query) {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': getIdToken(),
      'x-hasura-role': 'learner'
    },

    body: JSON.stringify({ query })
  })

  const dataset = await response.json()
  return dataset.data
}

async function insertSelectedOptions (attempt, quizId, questionId, selectedOption) {
  console.log("testing")
  const query = `
    mutation {
      insert_selected_options_one(object: {attempt: ${attempt}, learner_id: 1, option_id: ${selectedOption}, quiz_id: ${quizId}, question_id: ${questionId}}, on_conflict: {constraint: selected_options_pkey, update_columns: option_id}) {
        option_id
      }
    }
  `

  await postDataToHasura(query)
}

async function submitQuiz() {
  
  const query = `
    mutation {
      gradeQuiz(object: {attempt: ${loadedAttempt}, learner_id: 1, quiz_id: ${loadedQuizId}}) {
        status
        message
      }
    }
  `
  // console.log(query)
  await postDataToHasura(query)
  finishQuizPage(loadedQuizId)
}


async function finishQuizPage(idQuiz){
  location.href = `completed-quiz?qid=${idQuiz}&cid=${course_id}`;

}

// async function uploadGrade(){

// }

const GRAPHQL_ENDPOINT = "http://localhost:8080/v1/graphql"
const FAKE_TRAINER_ID = 1

$(document).ready(async function () {
  $("#navbar").load("/common/navbar.html")

  const quizzes = await getQuizzes(FAKE_TRAINER_ID)
  quizzes.forEach(({ id, title, time_limit }) => {
    $("#quiz-list").first().append(`
      <div class="card mb-4">
        <div class="d-flex card-body justify-content-between align-items-center">
          <p class="mb-0">${title}</p>

          <div>
            <button class="btn text-danger">Delete</button>
            <button class="btn">Edit</button>
          </div>
        </div>
      </div>
    `)
  })
})

async function getQuizzes (trainerId) {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'authorization': getIdToken(),
    },
    body: JSON.stringify({
      query: `
        query {
          section(where: {trainer_id: {_eq: ${trainerId}}}) {
            quizzes {
              id
              title
              time_limit
            }
          }
        }      
      `
    })
  })

  const responseJson = await response.json()
  return responseJson.data.section.map(section => section.quizzes).flat()
}

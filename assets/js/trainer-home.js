const GRAPHQL_ENDPOINT = getHasuraEndpoint()
const FAKE_TRAINER_ID = 1

$(document).ready(async function () {
  $("#navbar").load("/common/navbar.html")

  const quizzes = await getQuizzes(FAKE_TRAINER_ID)
  quizzes.forEach(({ id, title, time_limit }) => {
    $("#quiz-list").first().append(`
      <div class="card mb-4">
        <div class="d-flex card-body justify-content-between align-items-center">
          <div>
            <p class="mb-0">${title}</p>
            <span class="badge rounded-pill bg-secondary">Time limit: ${time_limit} minutes</span>
          </div>

          <div>
            <button class="btn text-danger" onclick="onRemoveQuiz(${id})">Delete</button>
            <a class="btn" href="/pages/create-quiz?quiz=${id}">Edit</a>
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

async function onRemoveQuiz (quizId) {
  const shouldRemove = confirm("Once removed cannot be reverted.")
  if (!shouldRemove) return

  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'authorization': getIdToken(),
    },
    body: JSON.stringify({
      query: `
        mutation {
          delete_quiz_by_pk(id: ${quizId}) {
            id
          }
        }    
      `
    })
  })

  const { errors } = await response.json()
  if (errors) {
    Swal.fire({
      title: 'Error!',
      text: 'Quiz cannot be removed at this moment.',
      icon: 'error'
    })

    return
  }

  Swal.fire({
    title: 'Alert',
    text: 'The quiz has been successfully removed',
    icon: 'success'
  }).then(result => {
    if (result.isDismissed || result.isConfirmed)
      location.reload()
  })
}

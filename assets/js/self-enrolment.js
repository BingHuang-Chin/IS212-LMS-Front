const GRAPHQL_ENDPOINT = "http://localhost:8080/v1/graphql"

$(document).ready(async function () {
  $('#header').load("/common/navbar.html")

  await getCourseList()
})

async function getCourseList () {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'authorization': getIdToken(),
    },
    body: JSON.stringify({
      query: `
        query {
          course {
            badge {
              image
            }
            
            id
            title
            description
            enrolment_start_date
            enrolment_end_date
          }
        }
      `
    })
  })

  const { errors, data } = await response.json()
  if (errors)
    return Swal.fire({
      title: 'Error!',
      text: 'Something went wrong.',
      icon: 'error'
    })

  renderCourseList(data.course)
}

function renderCourseList (courses) {
  console.log(courses)
}

const GRAPHQL_ENDPOINT = "http://localhost:8080/v1/graphql"
const FAKE_LEARNER_ID = 1

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
  courses.forEach(course => {
    let { id, title, description, enrolment_end_date, enrolment_start_date } = course

    enrolment_start_date = luxon.DateTime.fromISO(enrolment_start_date).toISODate()
    enrolment_end_date = luxon.DateTime.fromISO(enrolment_end_date).toISODate()

    $("#course-list").first().append(`
      <div class="col p-2">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <p>${description}</p>
          </div>

          <footer class="fs-6 text-secondary text-end px-3 pb-2">
            <button class="d-block ms-auto btn btn-primary" onclick="onEnrolCourse(${id})">Enrol</button>
            <span>Enrolment: ${enrolment_start_date} - ${enrolment_end_date}</span>
          </footer>
        </div>
      </div>
    `)
  })
}

async function onEnrolCourse (courseId) {
  const learnerId = FAKE_LEARNER_ID // TODO: Replace with actual learner id

  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'authorization': getIdToken(),
    },
    body: JSON.stringify({
      query: `
        mutation {
          enrolCourse(object: {courseId: ${courseId}, learnerId: ${learnerId}}) {
            status
            message
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

  const { status, message } = data
  if (status !== 200)
    return Swal.fire({
      title: 'Error!',
      text: message,
      icon: 'error'
    })

  Swal.fire({
    title: 'Success!',
    text: message,
    icon: 'success'
  })
}

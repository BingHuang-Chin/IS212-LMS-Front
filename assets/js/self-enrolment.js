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
  const [classes, vacancy, userEnrolments] = await getAvailableClasses(courseId)
  let classElement = ''
  const enroledClasses = userEnrolments.map(enrolment => enrolment.class_id)

  for (const lesson of classes) {
    const { id, class_size, name, class_start_time, class_end_time } = lesson
    if (vacancy[id] !== undefined && vacancy[id] >= class_size)
      continue

    const actualClassSize = vacancy[id] === undefined
      ? class_size
      : class_size - vacancy[id]

    const isEnroled = enroledClasses.findIndex(enroledClass => enroledClass === id) >= 0

    classElement += `
      <div class="col card mb-2">
        <div class="card-body">
          <h5 class="card-title">${name}</h5>
          <p>Space left: ${actualClassSize}</p>

          <button class="btn ${isEnroled ? "btn-success pe-none" : "btn-primary"}" onclick="onClassSelected(${courseId}, ${id})">
            ${isEnroled ? "Enroled" : "Enrol"}
          </button>
        </div>
      </div>
    `
  }

  if (classElement.length === 0)
    classElement = "<p>No classes available.</p>"

  Swal.fire({
    title: "Select a class to enrol",
    showConfirmButton: false,
    showCancelButton: true,
    html: `
      <div class="row row-cols-1 m-0 p-0">
        ${classElement}
      </div>
    `
  })
}

async function getAvailableClasses (courseId) {
  const learnerId = FAKE_LEARNER_ID

  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'authorization': getIdToken(),
    },
    body: JSON.stringify({
      query: `
        query {
          course_by_pk(id: ${courseId}) {
            classes {
              id
              name
              class_size
              class_start_time
              class_end_time
            }
            
            capacity: enrolments(where: {status_id: {_eq: 2}}) {
              class_id
            }
            
            learnerEnrolments: enrolments(where: {learner_id: {_eq: ${learnerId}}}) {
              class_id
            }
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

  const { classes, capacity, learnerEnrolments } = data.course_by_pk
  const enrolmentDict = {}

  capacity.forEach(({ class_id }) => {
    if (enrolmentDict[class_id] === undefined)
      enrolmentDict[class_id] = 1
    else
      enrolmentDict[class_id] += 1
  })

  return [classes, enrolmentDict, learnerEnrolments]
}

async function onClassSelected (courseId, classId) {
  console.log(courseId, classId)

  // const learnerId = FAKE_LEARNER_ID // TODO: Replace with actual learner id

  // const response = await fetch(GRAPHQL_ENDPOINT, {
  //   method: "POST",
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'authorization': getIdToken(),
  //   },
  //   body: JSON.stringify({
  //     query: `
  //       mutation {
  //         enrolCourse(object: {courseId: ${courseId}, learnerId: ${learnerId}}) {
  //           status
  //           message
  //         }
  //       }
  //     `
  //   })
  // })

  // const { errors, data } = await response.json()
  // if (errors)
  //   return Swal.fire({
  //     title: 'Error!',
  //     text: 'Something went wrong.',
  //     icon: 'error'
  //   })

  // const { status, message } = data
  // if (status !== 200)
  //   return Swal.fire({
  //     title: 'Error!',
  //     text: message,
  //     icon: 'error'
  //   })

  // Swal.fire({
  //   title: 'Success!',
  //   text: message,
  //   icon: 'success'
  // })
}
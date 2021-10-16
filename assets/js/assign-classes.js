const GRAPHQL_ENDPOINT = "http://localhost:8080/v1/graphql"
$('#header').load("/common/navbar.html");

async function getClasses() {
    const params = new URLSearchParams(window.location.search)
    const courseId = params.get("id")
    const response = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': getIdToken(),
        },
        body: JSON.stringify({
            query: `
            query {
                class(where: {course_id: {_eq: ${courseId}}}) {
                  name
                  class_size
                  start_date
                  end_date
                  class_start_time
                  class_end_time
                  trainer {
                    name
                  }
                }
              }
            `
        })
    })

    const { errors, data } = await response.json()
    if (errors) {
        Swal.fire({
            title: 'Error!',
            text: 'Failed to retrieve courses',
            icon: 'error'
        }).then(result => {
            if (result.isDismissed || result.isConfirmed)
                location.reload()
        })
        return
    }
    if (data.class.length <= 0) {
        Swal.fire({
            title: 'Error!',
            text: 'There are no classes in this course!',
            icon: 'error'
        })
    }

    else {
        for (const classes of data.class) {
            cards = `
                <div class="card ms-3 me-3 mt-3 mb-3 col-md-4">
                    <div class="card-body">
                        <h5 class="card-title mb-3"><strong><u>${classes.name}</u></strong></h5>
                        <p class="card-text"><strong>Class Size: ${classes.class_size}</strong>
                        <p class="card-text"><strong>Course start date: ${classes.start_date}</strong>
                        <p class="card-text"><strong>Course end date: ${classes.end_date}</strong>
                        <p class="card-text"><strong>Class start time: ${classes.class_start_time}</strong>
                        <p class="card-text"><strong>Class end time: ${classes.class_end_time}</strong>
                        <p class="card-text"><strong>Trainer: ${getTrainerName(classes.trainer)}</strong>
                    </div>
                </div>`
            $("#cardColumns").append(cards)

        }
    }
}
getClasses()


function getTrainerName(input) {
    for (i in input) {
        return input[i]
    }
}
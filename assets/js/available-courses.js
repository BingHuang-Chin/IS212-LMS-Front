const GRAPHQL_ENDPOINT = "http://localhost:8080/v1/graphql"
$('#header').load("/common/navbar.html");

async function getClasses() {
    const response = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': getIdToken(),
        },
        body: JSON.stringify({
            query: `
                query {
                    course {
                        title
                        description
                        classes {
                            name
                            class_size
                            class_start_time
                            class_end_time
                            start_date
                            end_date
                            trainer {
                                name
                            }
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

    unique_course = []
    for (const classes of data.course) {
        for (const single_class of classes.classes)  {
            cards = `     
            <div class="card ms-3 me-3 mt-3 mb-3 col-md-4">
                <div class="card-body">
                    <h5 class="card-title">${classes.title}</h5>
                    <p class="card-text"><strong>Class schedule: ${single_class.name}</strong>
                    <p class="card-text"><strong>Class Size: ${single_class.class_size}</strong>
                    <p class="card-text"><strong>Course start date: ${single_class.start_date}</strong>
                    <p class="card-text"><strong>Course end date: ${single_class.end_date}</strong>
                    <p class="card-text"><strong>Class start time: ${single_class.class_start_time}</strong>
                    <p class="card-text"><strong>Class end time: ${single_class.class_end_time}</strong>
                    <p class="card-text"><strong>Trainer: ${getTrainerName(single_class.trainer)}</strong>
                </div>
            </div>`
            document.getElementById("cardColumns").innerHTML += cards
        }
    }

}

getClasses()


function getTrainerName(input) {
    for (i in input) {
        return input[i]
    }
}
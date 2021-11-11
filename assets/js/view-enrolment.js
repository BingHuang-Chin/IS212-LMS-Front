const GRAPHQL_ENDPOINT = "http://localhost:8080/v1/graphql"
$('#header').load("/common/hr-navbar.html");

async function getEnrolment() {
    const response = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': getIdToken(),
        },
        body: JSON.stringify({
            query: `
                query {
                    enrolment {
                    class {
                        class_size
                        start_date
                        end_date
                    }
                    course {
                        id
                    }
                    learner {
                        name
                        id
                    }
                    trainer {
                        id
                        name
                    }
                    status {
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
    let enrolments = []
    for (const enrolment of data.enrolment) {
        enrolments += `
            <tr>
                <td>${enrolment.course.id}</td>
                <td>${enrolment.learner.id}</td>
                <td>${enrolment.learner.name}</td>
                <td>${enrolment.trainer.id}</td>
                <td>${enrolment.trainer.name}</td>
                <td>${enrolment.class.class_size}</td>
                <td>${enrolment.class.start_date}</td>
                <td>${enrolment.class.end_date}</td>
                <td>${enrolment.status.name}</td>

            </tr>
        `

    }

    $("#enrolmentDetails").append(enrolments)
}
getEnrolment()
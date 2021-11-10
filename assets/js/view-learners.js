const GRAPHQL_ENDPOINT = "http://localhost:8080/v1/graphql"
$('#header').load("/common/hr-navbar.html");

async function getLearners() {
    const response = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': getIdToken(),
        },
        body: JSON.stringify({
            query: `
                query {
                    learner {
                    id
                    name
                  }
                }
            `
        })
    })

    const { errors, data } = await response.json()
    if (errors) {
        Swal.fire({
            title: 'Error!',
            text: 'Failed to retrieve learners!',
            icon: 'error'
        }).then(result => {
            if (result.isDismissed || result.isConfirmed)
                location.reload()
        })
        return
    }
    console.log(data)
    let list_learners = []
    for (const learners of data.learner) {
        list_learners += `
            <tr>
                <td>${learners.id}</td>
                <td>${learners.name}</td>
            </tr>
        `

    }

    $("#learnerDetails").append(list_learners)
}

getLearners()
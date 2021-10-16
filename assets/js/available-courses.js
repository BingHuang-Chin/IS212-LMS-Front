const GRAPHQL_ENDPOINT = "http://localhost:8080/v1/graphql"
$('#header').load("/common/navbar.html");

async function getCourses() {
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
                        id
                        title
                        description
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
    for (const courses of data.course) {
        cards = `
            <div class="card ms-3 me-3 mt-3 mb-3 col-md-3">
                <div class="card-body text-center">
                <h5 class="card-title mb-3"><strong><u>${courses.title}</u></strong></h5>
                <p class="card-text"><strong>Course description: ${courses.description}</strong></br></br>
                <a href="/pages/assign-classes?id=${courses.id}" class="card-link">View classes</a>
                </div>
            </div>`
        document.getElementById("cardColumns").innerHTML += cards
    }

}

getCourses()


function getTrainerName(input) {
    for (i in input) {
        return input[i]
    }
}


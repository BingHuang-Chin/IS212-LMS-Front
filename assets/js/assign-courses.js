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
                        id
                        title
                        classes {
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
    console.log(data.course)

    for (const classes of data.course) {
        console.log(classes.classes)
    }
}

getClasses()

// for (record of records) {
//     cards = `     
//     <div class="card">
//         <img src="../api/images/${record.others.image}" class="card-img-top" alt="...">
//         <div class="card-body">
//             <h5 class="card-title">${record.bio.name}</h5>

//             <p class="card-text"><strong>${record.movie.title} (${record.movie.year})</strong>
//             </br><i>${record.movie.description}<i></p>
//         </div>
//     </div>`
//     document.getElementById("cardColumns").innerHTML += cards
// }
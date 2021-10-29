const GRAPHQL_ENDPOINT = "http://localhost:8080/v1/graphql"
$('#header').load("/common/navbar.html");
$(document).ready(function () {
    $('#table').hide()
})

let class_id
let trainer_id
async function enrolLearnersAndTrainers() {
    array = []
    const params = new URLSearchParams(window.location.search)
    const course_id = params.get("id")
    $("input:checkbox[name=learnersID]:checked").each(function () {
        array.push($(this).val());
    });
    console.log(trainer_id)
    console.log(class_id)
    for (i in array) {
        learner
    }
    final_array = []
    const response = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': getIdToken(),
        },
        body: JSON.stringify({
            query: `
                mutation MyMutation($objects: [enrolment_insert_input!]!) {
                insert_enrolment(objects: $objects) {
                  affected_rows
                }
              }            
            `,
            variables: {
                "objects": [
                    {
                        "learner_id": 1,
                        course_id,
                        trainer_id,
                        "status_id": 1,
                        class_id
                    }
                ]
            }
        })
    })
}
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

    for (const learner of data.learner) {
        list_learners = `
            <tr>
                <td>${learner.id}</td>
                <td>${learner.name}</td>
                <td><input type="checkbox" name="learnersID" value="${learner.id}"></td>
            </tr>
        `
        $("#learnerDetails").append(list_learners)
    }
}

getLearners()


async function getTrainers() {
    const response = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': getIdToken(),
        },
        body: JSON.stringify({
            query: `
                query {
                    trainer {
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

    for (const trainer of data.trainer) {
        console.log(trainer)
        list_trainers = `
            <tr>
                <td>${trainer.id}</td>
                <td>${trainer.name}</td>
                <td><input type="checkbox" name="trainersID" value="${trainer.id}"></td>
            </tr>
        `
        $("#tainerDetails").append(list_trainers)
    }
}

getTrainers()

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
                  id
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
            console.log(classes.id)
            cards = `
                <div class="card mb-4">
                    <div class="card-body">
                        <h5 class="card-title mb-3"><strong><u>${classes.name}</u></strong></h5>
                        <p class="card-text"><strong>Class Size: ${classes.class_size}</strong></p>
                        <p class="card-text"><strong>Class start date: ${classes.start_date}</strong></p>
                        <p class="card-text"><strong>Class end date: ${classes.end_date}</strong></p>
                        <p class="card-text"><strong>Class start time: ${classes.class_start_time}</strong></p>
                        <p class="card-text"><strong>Class end time: ${classes.class_end_time}</strong></p>
                        <p class="card-text"><strong>Trainer: ${getTrainerName(classes.trainer)}</strong></p>
                        <button type="button" class="btn btn-secondary" onclick="showtable(${classes.id})">Assign available learners and trainers</button>
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


function showtable(classID) {
    class_id = classID
    showtable2()
    $("#table").show();
}

function showtable2(trainerID) {
    trainer_id = trainerID
    $("#table").show();
}

// function getEnrolmentDetails() {
//     array = []
//     const params = new URLSearchParams(window.location.search)
//     const course_id = params.get("id")
//     $("input:checkbox[name=learnersID]:checked").each(function () {
//         array.push($(this).val());
//     });
//     console.log(array)
//     for (i in array) {
//         console.log(array[i])
//     }

//     console.log(classID)
//     console.log(course_id)
// }

// getEnrolmentDetails()


// function getTrainerDetails(input) {
//     trainers = input
//     for (i in trainers) {
//         console.log(i)
//         if (isNaN(i)) {
//             return input[i][0]
//         }
//         else {
//             return input[i][1]
//         }
//     }
// }

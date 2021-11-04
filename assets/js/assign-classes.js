const GRAPHQL_ENDPOINT = "http://localhost:8080/v1/graphql"
$('#header').load("/common/navbar.html");
$(document).ready(function () {
    $('#table').hide()
    $('#table2').hide()
})

let class_id
let trainer_id
let status_id = 1
async function enrolLearnersAndTrainers() {
    learners_array = []
    object_array = []
    const params = new URLSearchParams(window.location.search)
    const course_id = params.get("id")

    $("input:checkbox[name=learnersID]:checked").each(function () {
        learners_array.push($(this).val());
    });

    trainer_id = $("input:radio[name=trainersID]:checked").val()

    for (i in learners_array) {
        const object = {}
        object['learner_id'] = parseInt(learners_array[i])
        object['course_id'] = parseInt(course_id)
        object['trainer_id'] = parseInt(trainer_id)
        object['status_id'] = parseInt(status_id)
        object['class_id'] = parseInt(class_id)
        object_array.push(object)
    }
    console.log(object_array)


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
                "objects": object_array
            }
        })
    })
    const { errors } = await response.json()
    if (errors) {
        Swal.fire({
            title: 'Error!',
            text: 'Failed to add learners and trainer at the moment',
            icon: 'error'
        })
        return
    }

    Swal.fire({
        title: 'Learners and trainer added!',
        text: 'Learners and Trainer has been successfully added',
        icon: 'success'
    }).then(result => {
        if (result.isDismissed || result.isConfirmed)
            location.reload()
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
        list_trainers = `
            <tr>
                <td>${trainer.id}</td>
                <td>${trainer.name}</td>
                <td><input type="radio" name="trainersID" value="${trainer.id}"></td>
            </tr>
        `
        $("#tainerDetails").append(list_trainers)
    }
}

getTrainers()

async function getClassLearners(id) {
    const response = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': getIdToken(),
        },
        body: JSON.stringify({
            query: `
                query {
                    learner(where: {enrolments: {class_id: {_eq: ${id}}}}) {
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
            text: 'Failed to retrieve enrolled learners!',
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
        $("#enrolledLearners").append(list_learners)
    }
}
getClassLearners()

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
            cards = `
                <div class="card mb-4">
                    <div class="card-body">
                        <h5 class="card-title mb-3"><strong><u>${classes.name}</u></strong></h5>
                        <p class="card-text"><strong>Class Size: ${classes.class_size}</strong></p>
                        <p class="card-text"><strong>Class start date: ${classes.start_date}</strong></p>
                        <p class="card-text"><strong>Class end date: ${classes.end_date}</strong></p>
                        <p class="card-text"><strong>Class start time: ${classes.class_start_time}</strong></p>
                        <p class="card-text"><strong>Class end time: ${classes.class_end_time}</strong></p>
                        <p class="card-text"><strong>Trainer: ${classes.trainer_id}</strong></p>
                        <button type="button" class="btn btn-secondary mb-3" onclick="showtable(${classes.id})">View available learners and trainers</button>
                        <button type="button" class="btn btn-secondary" style="margin-bottom:5px" onclick="showtable2(${classes.id})">View enrolled learners</button>
                    </div>
                </div>`
            $("#cardColumns").append(cards)
        }
    }
}
getClasses()


// function getTrainerName(input) {
//     for (i in input) {
//         return input[i]
//     }
// }


function showtable(classID) {
    class_id = classID
    $("#table").show();
}

function showtable2(classID) {
    class_id = classID
    getClassLearners(class_id)
    $("#table2").show();
}


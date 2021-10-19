const GRAPHQL_ENDPOINT = "http://localhost:8080/v1/graphql"
$('#header').load("/common/navbar.html");
$(document).ready(function(){
    $('#table').hide()
   })

// $("#table").css("display","none");
    
$("#showit").click(function(e){
  $("#loader").css("display","inline-block");
})


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
        console.log(learner)
        list_learners = `
            <tr>
                <td>${learner.id}</td>
                <td>${learner.name}</td>
                <td><input type="checkbox" id="${learner.id}" value="${learner.id}"></td>
            </tr>
        `
        $("#learnerDetails").append(list_learners)
    }
}

getLearners()


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
                <div class="card mb-4">
                    <div class="card-body">
                        <h5 class="card-title mb-3"><strong><u>${classes.name}</u></strong></h5>
                        <p class="card-text"><strong>Class Size: ${classes.class_size}</strong></p>
                        <p class="card-text"><strong>Class start date: ${classes.start_date}</strong></p>
                        <p class="card-text"><strong>Class end date: ${classes.end_date}</strong></p>
                        <p class="card-text"><strong>Class start time: ${classes.class_start_time}</strong></p>
                        <p class="card-text"><strong>Class end time: ${classes.class_end_time}</strong></p>
                        <p class="card-text"><strong>Trainer: ${getTrainerName(classes.trainer)}</strong></p>
                        <button type="button" class="btn btn-secondary" onclick="showtable()">View available learners</button>
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


function showtable() {
    $("#table").show();
    }
  
// <div class="dropdown">
// <button type="button" class="btn btn-secondary dropdown-toggle" id="dropdownMenuOffset" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-offset="10,20">
//     View learners
// </button>
// <div class="dropdown-menu" id="dropdown1" aria-labelledby="dropdownMenuOffset"></div>
// </div>
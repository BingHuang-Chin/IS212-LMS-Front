/* 
Fetch the values of the form submit and send it to hasura database using graphQL
*/
// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict';
    $('#header').load("/common/navbar.html");


    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation');
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms).forEach((form) => {
        form.addEventListener('submit', (event) => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            else {
                createCourse()
            }
            form.classList.add('was-validated');
        }, false);
    });
})();



const GRAPHQL_ENDPOINT = "http://localhost:8080/v1/graphql"


async function createCourse() {
    const [course_title, course_description, course_start_date, course_end_date, enrolment_start_date, enrolment_end_date, badge_id] = [
        $('#course_title').val(),
        $('#course_description').val(),
        $('#course_start_date').val(),
        $('#course_end_date').val(),
        $('#enrolment_start_date').val(),
        $('#enrolment_end_date').val(),
        $('#badge_id').val()
    ]
    const response = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': getIdToken(),
        },
        body: JSON.stringify({
            query: `
            mutation MyMutation($object: course_insert_input!) {
                insert_course_one(object: $object) {
                  id
                }
              }
            `,
            variables: {
                object: {
                    "title": course_title,
                    "description": course_description,
                    "start_date": course_start_date,
                    "end_date": course_end_date,
                    enrolment_start_date,
                    enrolment_end_date
                }
            }
        })
    })

    const { errors } = await response.json()
    if (errors) {
        Swal({
            title: 'Error!',
            text: 'Failed to add course at the moment',
            icon: 'error'
        })
        return
    }

    Swal({
        title: 'Course created!',
        text: 'The course has been successfully created',
        icon: 'success'
    }).then(result => {
        if (result.isDismissed || result.isConfirmed)
            location.reload()
    })


const responseJson = await response.json()
return responseJson.data.courseCreate
}




async function getDropdownOptions() {
    const response = await fetch(GRAPHQL_ENDPOINT, {
        method = "POST",
        headers: {
            'Content-Type': 'application/json',
            authorization: getIdToken(),
        },
        body: JSON.stringify({
            query: `
                query {
                    badge_id
                }
            `
        })
    })

    const responseJson = await response.json()
}
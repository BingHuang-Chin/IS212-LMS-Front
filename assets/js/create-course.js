/* 
Fetch the values of the form submit and send it to hasura database using graphQL
*/
// Example starter JavaScript for disabling form submissions if there are invalid fields
const GRAPHQL_ENDPOINT = "http://localhost:8080/v1/graphql"


async function createCourse() {
    const [title, description, start_date, end_date, enrolment_start_date, enrolment_end_date, badge_id] = [
        $('#course_title').val(),
        $('#description').val(),
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
                    title,
                    description,
                    start_date,
                    end_date,
                    enrolment_start_date,
                    enrolment_end_date,
                    badge_id
                }
            }
        })
    })
    
    const { errors } = await response.json()
    if (errors) {
        Swal.fire({
            title: 'Error!',
            text: 'Failed to add course at the moment',
            icon: 'error'
        })
        return
    }

    Swal.fire({
        title: 'Course created!',
        text: 'The course has been successfully created',
        icon: 'success'
    }).then(result => {
        if (result.isDismissed || result.isConfirmed)
            location.reload()
    })
}


async function getDropdownOptions() {
    const response = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': getIdToken(),
        },
        body: JSON.stringify({
            query: `
                query {
                    badge {
                    id
                    title
                    }
                }
            `
        })
    })
    const { errors, data } = await response.json()
    if (errors) {
        Swal.fire({
            title: 'Error!',
            text: 'Failed to retrieve drop down',
            icon: 'error'
        }).then(result => {
            if (result.isDismissed || result.isConfirmed)
                location.reload()
        })
        return
    }

    for (const option of data.badge) {
        const getDropdownList = `<option value="${option.id}">${option.title}</option>`
        $('#badge_id').append(getDropdownList)
        }
}


(() => {
    'use strict';
    $('#header').load("/common/navbar.html");
    getDropdownOptions()
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation');
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms).forEach((form) => {
        form.addEventListener('submit', (event) => {
            event.preventDefault()
            if (!form.checkValidity()) {
                event.stopPropagation();
            }
            else {
                createCourse()
            }
            form.classList.add('was-validated');
        }, false);
    });
})();
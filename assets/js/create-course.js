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
                addCourse()
            }
            form.classList.add('was-validated');
        }, false);
    });
})();

async function addCourse() {
    const [course_title, course_description, course_start_date, course_end_date, enrolment_start_date, enrolment_end_date] = [
        $('#course_title').val(),
        $('#description').val(),
        $('#course_start_date').val(),
        $('#course_end_date').val(),
        $('#enrolment_start_date').val(),
        $('#enrolment_end_date').val()
    ]
}


async function createCourse({ course_title, description, course_start_date, course_end_date, enrolment_start_date, enrolment_end_date }) {
    const response = await fetch('http://localhost:8080/v1/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${myadminsecretkey}`,
        },
        body: JSON.stringify({
            query: `
            mutation {
                insert_course_one(
                  object: {
                    title: "",
                    description: "", 
                    enrolment_end_date: "", 
                    enrolment_start_date: "", 
                    start_date: "", end_date: ""
                })}
            `,
            variables: {
                course: {
                    course_title,
                    description,
                    course_start_date,
                    course_end_date,
                    enrolment_start_date,
                    enrolment_end_date
                }
            }
        })
    })

    const responseJson = await response.json()
    return responseJson.data.courseCreate
}
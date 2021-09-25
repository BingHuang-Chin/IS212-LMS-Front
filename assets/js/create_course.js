/* 
Fetch the values of the form submit and send it to hasura database using graphQL
*/
// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict';

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


function addCourse() {
    let course_title = document.getElementById("course_title").value
    let course_description = document.getElementById("description").value
    let course_start_date = document.getElementById("course_start_date").value
    let course_end_date = document.getElementById("course_end_date").value
    let enrolment_start_date = document.getElementById("enrolment_start_date").value
    let enrolment_end_date = document.getElementById("enrolment_end_date").value
    
    
}

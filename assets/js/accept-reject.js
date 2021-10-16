/* 
Fetch the values of the form submit and send it to hasura database using graphQL
*/
// Example starter JavaScript for disabling form submissions if there are invalid fields
const GRAPHQL_ENDPOINT = "http://localhost:8080/v1/graphql"
$('#header').load("/common/navbar.html");

async function getcourses(){
    const [title, description, start_date, end_date] = [
        $('#course_title').val(),
        $('#description').val(),
        $('#course_start_date').val(),
        $('#course_end_date').val()
    ]

    const response = await fetch(GRAPHQL_ENDPOINT, {
        method:'POST', 
        headers:{
            'Content-Type': 'application/json',
            'authorization': getIdToken(),
        },

        body: JSON.stringify({
            query: `
            query  {
                course {
                  title
                  description
                  enrolment_start_date
                  enrolment_end_date
                  start_date
                  end_date
                }
              }
              
            `,

        })
        
    })
    
    const dataset = await response.json()
    console.log(dataset.data.course[0])
    for(const courses of dataset.data.course){
        cards = `
        <div class="col-sm-4" id="pre"> 
            <div class="card" style="width:400px">
                <img class="card-img-top" src="/assets/images/jennie.jpeg" alt="Card image">
                <div class="card-body">
                <h4 class="card-title">${courses.title}</h4>
                <p class="card-text">${courses.description}</p>
                <a href="#" class="btn btn-primary">View Course</a>
            </div>
        </div>
        
        `
        document.getElementById('cardcolumns').innerHTML+= cards

    }

}

getcourses()

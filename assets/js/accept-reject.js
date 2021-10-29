/* 
Fetch the values of the form submit and send it to hasura database using graphQL
*/
// Example starter JavaScript for disabling form submissions if there are invalid fields
const GRAPHQL_ENDPOINT = "http://localhost:8080/v1/graphql"
// $('#header').load("/common/navbar.html");

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
                  id
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
 
    console.log(dataset.data.course[1])
    for(const courses of dataset.data.course){
        console.log(courses.id)
        cards = `
        <div class="col-lg-3 col-md-6 mb-4 mb-lg-0">
        <!-- Card-->
        <div class="card rounded shadow-sm border-0">
        <div class="card-body p-4"><img src="https://bootstrapious.com/i/snippets/sn-cards/shoes-1_gthops.jpg" alt="" class="img-fluid d-block mx-auto mb-3">
            <h5> <a href="http://localhost:3000/pages/course_content?id=${courses.id}" class="text-dark ">${courses.title}</a></h5>
            <p class="small text-muted font-italic">${courses.description}</p>
            <ul class="list-inline small">
            <li class="list-inline-item m-0"><i class="fa fa-star text-success"></i></li>
            <li class="list-inline-item m-0"><i class="fa fa-star text-success"></i></li>
            <li class="list-inline-item m-0"><i class="fa fa-star text-success"></i></li>
            <li class="list-inline-item m-0"><i class="fa fa-star text-success"></i></li>
            <li class="list-inline-item m-0"><i class="fa fa-star-o text-success"></i></li>
            </ul>
        </div>
        </div>
        </div>
        `
        document.getElementById('cardcolumns').innerHTML+= cards

    }

}

getcourses()



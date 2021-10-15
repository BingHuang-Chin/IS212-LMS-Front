/* 
Fetch the values of the form submit and send it to hasura database using graphQL
*/
// Example starter JavaScript for disabling form submissions if there are invalid fields
const GRAPHQL_ENDPOINT = "http://localhost:8080/v1/graphql"

async function accept(){
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
            'authorization': getIdToken()
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

    console.log(await response.json())
}

console.log("hi")
accept()

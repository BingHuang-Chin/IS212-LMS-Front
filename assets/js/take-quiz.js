const GRAPHQL_ENDPOINT = "http://localhost:8080/v1/graphql"
const params = new URLSearchParams(window.location.search) // use the prev URL

const section_id = params.get("qid")

const course_id = params.get("cid")
console.log(section_id)
console.log(course_id)


async function getquiz(){
  
    const response = await fetch(GRAPHQL_ENDPOINT,{
        method:'POST', 
        headers:{
            'Content-Type': 'application/json',
            'authorization': getIdToken(),
        },

        body: JSON.stringify({
            query:`
            query {
                course(where: {id: {_eq:${course_id}}}) {
                  sections(where:{id:{_eq:${section_id}}}) {
                    name
                    quizzes {
                      questions {
                        title
                        question_options {
                          title
                        }
                      }
                    }
                  }
                }
              }              
            `
        })
    })
    const dataset = await response.json()
    const quiz = dataset.data.course

    console.log(quiz)
    all_questions_object = quiz[0].sections[0].quizzes[0].questions

    display_question = ''

    for(individual_question_object of all_questions_object){
        display_question+=`
        <div>
            <p id="insert_question" class="text-justify h5 pb-2 font-weight-bold">${individual_question_object.title}</p>
            <div id="insert_options" class="options py-3">`
            for(options of individual_question_object.question_options){
                console.log(options.title)

                display_question+=
                `
                <label class="rounded p-2 option"> ${options.title} <input type="radio" name="radio"> <span class="crossmark"></span> </label> 
                `
            }
            display_question+=`
            </div>        
        </div>`
    }
    document.getElementById('one_question').innerHTML= display_question
    }

getquiz()

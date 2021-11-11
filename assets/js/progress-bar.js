const GRAPHQL_ENDPOINT = getHasuraEndpoint()
const params = new URLSearchParams(window.location.search) // use the prev URL
const course_id = params.get("id")
console.log(course_id)

async function exitButton(){
  
  toExit = `
  <a href="/pages/course_content?id=${course_id}" class="button">Exit Quiz</a>
  `
  document.getElementById('exitButton').innerHTML += toExit
}
exitButton()

async function getallQuiz(){

const response = await fetch(GRAPHQL_ENDPOINT,{
    method:'POST', 
    headers:{
        'Content-Type': 'application/json',
        'authorization': getIdToken(),
    },

    body: JSON.stringify({
        query:`
        query{
            section(where:{course_id:{_eq:${course_id}}}){
              id
              name
            }
          }
        `
    })
})
section_list = []
// console.log(section_list)
const dataset = await response.json()

var section_object = dataset.data.section
// console.log(section_object)

for (eachSection of section_object){
    section_list.push(eachSection.id)
}
// all sections for the course 
// console.log(section_list)


//length of quiz 
let amountofQuiz = section_list.length 


let allQuizId = []
for(section_iid of section_list){
    var getQuizID = await getQuizId(section_iid)
    allQuizId.push(getQuizID)
}
oneRow =''
var getQuizresults = ''
let counter = 0
for(individualQuizId of allQuizId){
    getQuizresults = await getQuizStatus(individualQuizId)

    if(getQuizresults == true){
        counter+=1
        oneRow += `
        <tr>
          <th>${individualQuizId}</th>
          <th>Passed</th>
         </tr> `

    }
    else{
        oneRow += `
        <tr>
          <th>${individualQuizId}</th>
          <th>Work in Progress</th>
         </tr> `

    }
    document.getElementById('quizResults').innerHTML = oneRow
    getQuizresults =''
}

courseProgression = (counter/amountofQuiz) * 100 
courseProgression = Math.round(courseProgression)

let progressBar = ''
  
progressBar = `
    <div class="progress-bar bg-success" role="progressbar" aria-valuenow="0" aria-valuemin="100" aria-valuemax="100" style="width:${courseProgression}%">
        <span class="sr-only">70% Complete</span>
    </div>`
document.getElementById('ProgressBar').innerHTML += progressBar

var courseTitle = await getCourseTitleName(course_id)
console.log(courseTitle, "herrrerer")


let titleHeading  = ''
  
titleHeading = `
                <h2>${courseTitle}</h2>`
document.getElementById('displaycTitle').innerHTML += titleHeading


let coursePercentage  = ''
  
coursePercentage = `
                <h2>${courseProgression}%</h2>`
document.getElementById('percentage').innerHTML += coursePercentage


}
getallQuiz()



async function getQuizId(individualSection){
    const responsed = await fetch(GRAPHQL_ENDPOINT,{
        method:'POST', 
        headers:{
            'Content-Type': 'application/json',
            'authorization': getIdToken(),
        },
    
        body: JSON.stringify({
            query:`
            query{
                quiz(where:{section_id:{_eq:${individualSection}}}){
                  id
                  questions {
                    id
                    title
                  }
                }
              }
              
              
            `
        })
    })
    const datasetted = await responsed.json()
    let refined_data = datasetted.data.quiz[0].id

    return refined_data

}


async function getQuizStatus(qid){

    const responsed = await fetch(GRAPHQL_ENDPOINT,{
        method:'POST', 
        headers:{
            'Content-Type': 'application/json',
            'authorization': getIdToken(),
        },
    
        body: JSON.stringify({
            query:`
            query{
                completed_quiz(where:{quiz_id:{_eq:${qid}}}){
                  passed
                  quiz_id
                  learner_id
                }
              }
              
            `
        })
    })

    let new_data = await responsed.json()
    quiz_outcome = new_data.data.completed_quiz
    for(inOutcome of quiz_outcome){
        if(inOutcome.passed == true){
            return true
        }
    }
    return quiz_outcome
}



async function getCourseTitleName(course_id){
    const responses = await fetch(GRAPHQL_ENDPOINT,{
        method:'POST', 
        headers:{
            'Content-Type': 'application/json',
            'authorization': getIdToken(),
        },
    
        body: JSON.stringify({
            query:`
            query{
                course(where:{id:{_eq:${course_id}}}){
                  title
                }
              }
            `
        })
    })
    const datasetted = await responses.json()

    let toReturnName = datasetted.data.course[0].title
    console.log(toReturnName)
    // let refined_data = datasetted.data.quiz[0].id

    return toReturnName

}

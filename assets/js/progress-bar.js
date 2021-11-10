// const GRAPHQL_ENDPOINT = "http://localhost:8080/v1/graphql"
// const params = new URLSearchParams(window.location.search) // use the prev URL
// const course_id = params.get("id")


// async function exitButton(){
  
//   toExit = `
//   <a href="http://localhost:3000/pages/course_content?id=${course_id}" class="button">Exit Quiz</a>
//   `
//   document.getElementById('exitButton').innerHTML += toExit
// }
// exitButton()

// async function getallQuiz(){

// const response = await fetch(GRAPHQL_ENDPOINT,{
//     method:'POST', 
//     headers:{
//         'Content-Type': 'application/json',
//         'authorization': getIdToken(),
//     },

//     body: JSON.stringify({
//         query:`
//         query{
//             section(where:{course_id:{_eq:${course_id}}}){
//               id
//               name
//             }
//           }
//         `
//     })
// })
// section_list = []
// // console.log(section_list)
// const dataset = await response.json()

// var section_object = dataset.data.section
// // console.log(section_object)

// for (eachSection of section_object){
//     section_list.push(eachSection.id)
// }
// // all sections for the course 
// // console.log(section_list)


// //length of quiz 
// let amountofQuiz = section_list.length 


// let allQuizId = []
// for(section_iid of section_list){
//     var getQuizID = await getQuizId(section_iid)
//     allQuizId.push(getQuizID)
// }
// console.log(allQuizId)
// oneRow =''
// var getQuizresults = ''
// for(individualQuizId of allQuizId){
//     getQuizresults = await getQuizStatus(individualQuizId)
//     console.log(getQuizresults)

//     if(getQuizresults == true){
//         oneRow += `
//         <tr>
//           <th>${individualQuizId}</th>
//           <th>Passed</th>
//          </tr> `

//     }
//     else{
//         oneRow += `
//         <tr>
//           <th>${individualQuizId}</th>
//           <th>In Progress</th>
//          </tr> `

//     }
//     document.getElementById('quizResults').innerHTML = oneRow
//     getQuizresults =''



// }
// }
// getallQuiz()



// async function getQuizId(individualSection){
//     const responsed = await fetch(GRAPHQL_ENDPOINT,{
//         method:'POST', 
//         headers:{
//             'Content-Type': 'application/json',
//             'authorization': getIdToken(),
//         },
    
//         body: JSON.stringify({
//             query:`
//             query{
//                 quiz(where:{section_id:{_eq:${individualSection}}}){
//                   id
//                   questions {
//                     id
//                     title
//                   }
//                 }
//               }
              
              
//             `
//         })
//     })
//     const datasetted = await responsed.json()
//     let refined_data = datasetted.data.quiz[0].id

//     return refined_data

// }


// async function getQuizStatus(qid){
//     console.log(qid,"QQQQ")

//     const responsed = await fetch(GRAPHQL_ENDPOINT,{
//         method:'POST', 
//         headers:{
//             'Content-Type': 'application/json',
//             'authorization': getIdToken(),
//         },
    
//         body: JSON.stringify({
//             query:`
//             query{
//                 completed_quiz(where:{quiz_id:{_eq:${qid}}}){
//                   passed
//                   quiz_id
//                   learner_id
//                 }
//               }
              
//             `
//         })
//     })

//     let new_data = await responsed.json()
//     quiz_outcome = new_data.data.completed_quiz[0].passed
//     console.log("test")

//     console.log(quiz_outcome)
//     return quiz_outcome
// }

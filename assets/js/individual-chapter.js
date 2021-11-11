const GRAPHQL_ENDPOINT = "http://localhost:8080/v1/graphql"
const params = new URLSearchParams(window.location.search) // use the prev URL
const single_material = params.get("mid") // course link

// course ID
const iid = params.get("iid")

//section ID 
const sid = params.get("sid") 
// console.log("hello")

let qid = null

$(document).ready(function () {
    $("#sidebar").mCustomScrollbar({
        theme: "minimal"
    });

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar, #content').toggleClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });
});

async function getmaterials(){
  
    const response = await fetch(GRAPHQL_ENDPOINT,{
        method:'POST', 
        headers:{
            'Content-Type': 'application/json',
            'authorization': getIdToken(),
        },

        body: JSON.stringify({
            query:`
              query {
                course_by_pk(id: ${iid}) {
                  course_materials(order_by: {week: asc}) {
                    course_id
                    chapter_name
                    course_link
                    description
                    week
                    section_id
                  }
                  
                  sections(where: { id: { _eq: ${sid} }}) {
                    quizzes {
                      id
                    }
                  }
                }
              }
            `
        })
    })
    const dataset = await response.json()
    const materials = dataset.data.course_by_pk.course_materials
    const courseObject = dataset.data.course_by_pk.course_materials
    // console.log(dataset)

    //getallSections  1 2 3 
    sectionArray = []
    for(course of courseObject){
        sectionArray.push(course.section_id)
    }

    // get all quizzes belonging to the sections

    //quiz ID of current section
    qid = dataset.data.course_by_pk.sections[0].quizzes[0].id
 
    // function to check if its unique 
    function checkAvailability(arr, val) {
      return arr.some(arrVal => val === arrVal);
    }

    // Get all the unique weeks 
    week_array = []
    for(oneWeek of materials){
        if(checkAvailability(week_array, oneWeek.week) == false){
            week_array.push(oneWeek.week)
        }
    }


    // DISPLAY ALL THE UNIQUE WEEKS 
    week_dropdown = ''

    for(individual_week of week_array){
        week_dropdown += `
        <li class="active" id=${individual_week}>
            <a href="#homeSubmenu${individual_week}" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">Section ${individual_week}</a>
            <ul class="collapse list-unstyled" id="homeSubmenu${individual_week}"> `
            for(individual_materials of materials){
                if(individual_week == individual_materials.week){
                    week_dropdown += 
        
                    `<li>
                            <a href="http://localhost:3000/pages/individual-chapter?mid=${individual_materials.course_link}&iid=${individual_materials.course_id}&sid=${individual_materials.section_id}">${individual_materials.chapter_name}</a>        
                    </li>`
                       
                }
     
            }
            week_dropdown +=`</ul> 
        </li>
        `
    }
    document.getElementById('displaysidechapter').innerHTML= week_dropdown

    document.getElementById('coursetitle').innerHTML= materials[0].description
    downloadContent()
    // if the section is the first in the course then ill enable the quiz immediately
    if(sid == sectionArray[0]){
        toQuizBtn()
    }
    else{
        var ans = await checkifPasses(iid,sid, sectionArray)
        console.log(ans, "AAAAANS")

        if(ans == true){
            toQuizBtn()

        }
    }

}
getmaterials()
 
 

async function getindividual(){
    material_row = `
        <iframe src="${single_material}#toolbar=0" width="1000px" height="800px"></iframe>
        `
        document.getElementById('individualcontent').innerHTML+= material_row
    }
    getindividual()


    
async function downloadContent(){
    to_download = `
    <a href="${single_material}" target="_blank"> Download Content</a>
    `
    document.getElementById('download_button').innerHTML= to_download

}

async function toQuizBtn(){

    to_quiz = 
    `
    <a href="http://localhost:3000/pages/take-quiz?sid=${sid}&cid=${iid}&qid=${qid}">Start Quiz</a>        
    `
    document.getElementById('quiz_time').innerHTML= to_quiz
}


async function checkifPasses(iid, sid, sectionArray){
    sectionBefore =''
    sectionBefore = sectionArray.indexOf(sectionArray [sid-1])
    const response = await fetch(GRAPHQL_ENDPOINT,{
        method:'POST', 
        headers:{
            'Content-Type': 'application/json',
            'authorization': getIdToken(),
        },

        body: JSON.stringify({
            query:`
              query {
                course_by_pk(id: ${iid}) {
                  course_materials {
                    course_id
                    chapter_name
                    course_link
                    description
                    week
                    section_id
                  }
                  
                  sections(where: { id: { _eq: ${sectionBefore} }}) {
                    quizzes {
                      id
                    }
                  }
                }
              }
            `
        })
    })
    const dataseted = await response.json()
    console.log(dataseted)

    //this is the quizID for the section before 
    const quizId = dataseted.data.course_by_pk.sections[0].quizzes[0].id
    // console.log(quizId)

    //Query the completed_quiz table
    const responsed = await fetch(GRAPHQL_ENDPOINT,{
        method:'POST', 
        headers:{
            'Content-Type': 'application/json',
            'authorization': getIdToken(),
        },

        body: JSON.stringify({
            query:`
            query{
  
                completed_quiz(where: {quiz_id: {_eq: ${quizId}}}){
                  passed
                }
              }              `
        })
    })

    const new_data = await responsed.json()
    console.log(new_data)
    let quiz_status = new_data.data.completed_quiz
    for(outcome of quiz_status){
        if(outcome.passed == true){
            return(true)
        }
        }

}

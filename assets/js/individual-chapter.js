const GRAPHQL_ENDPOINT = "http://localhost:8080/v1/graphql"
const params = new URLSearchParams(window.location.search) // use the prev URL
const single_material = params.get("mid") // course link

// course ID
const iid = params.get("iid")

//section ID 
const sid = params.get("sid") 
// console.log("hello")

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
                course_materials(where: {course_id: {_eq: ${iid}}}) {
                  chapter_name
                  course_id
                  course_link
                  description
                  week
                  section_id
                }
              }
              
            `
        })
    })
    const dataset = await response.json()
    const materials = dataset.data.course_materials

 
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
            <a href="#homeSubmenu${individual_week}" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">Week ${individual_week}</a>
            <ul class="collapse list-unstyled" id="homeSubmenu${individual_week}"> `
            for(individual_materials of materials){
                if(individual_week == individual_materials.week){
                    // console.log(individual_materials.week)
                    quiz_section_id = individual_materials.section_id
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
}
getmaterials()
 
 

async function getindividual(){
    material_row = `
        <iframe src="${single_material}#toolbar=0" width="1000px" height="800px"></iframe>
        `
        document.getElementById('individualcontent').innerHTML+= material_row
    }
    getindividual()


    
async function downloadbtn(){
    to_download = `
    <a href="path_to_file" download="${single_material}">Download Content</a>
    `
    document.getElementById('download_button').innerHTML= to_download

    to_quiz = 
    `
    <a href="http://localhost:3000/pages/take-quiz?qid=${sid}&cid=${iid}">Start Quiz</a>        
    `
    document.getElementById('quiz_time').innerHTML= to_quiz


}
downloadbtn()


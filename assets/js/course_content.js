const GRAPHQL_ENDPOINT = "http://localhost:8080/v1/graphql"
// $('#header').load("/common/navbar.html");
const params = new URLSearchParams(window.location.search) // use the prev URL
const course_id = params.get("id")
// console.log(course_id)

async function viewCourseProgressBtn(){
    courseProgress = `
    <a href="http://localhost:3000/pages/progress-bar?id=${course_id}" class="button">View Course Progress </a>
    `
    document.getElementById('progressBar').innerHTML += courseProgress
}
viewCourseProgressBtn()
 
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
                course_materials(where: {course_id: {_eq: ${course_id}}}, order_by: {week: asc}) {
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
    let sectionId = null
 
    // function to check if its unique 
    function checkAvailability(arr, val) {
      return arr.some(arrVal => val === arrVal);
    }

    // Get all the unique weeks 
    week_array = []
    for(oneWeek of materials){
        console.log(oneWeek)
        if(checkAvailability(week_array, oneWeek.week) == false){
            week_array.push(oneWeek.week)
        }

        sectionId = oneWeek.section_id
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
                    // console.log(individual_materials.section_id)
                    week_dropdown += 
        
                    `<li>
                            <a href="http://localhost:3000/pages/individual-chapter?mid=${individual_materials.course_link}&iid=${individual_materials.course_id}&sid=${sectionId}">${individual_materials.chapter_name}</a>        
                    </li>`   
                }
     
            }
            week_dropdown +=`</ul> 
        </li>
        `
    }
    document.getElementById('displaysidechapter').innerHTML= week_dropdown
    console.log(materials)
    document.getElementById('coursetitle').innerHTML= materials[0].description
}
getmaterials()


// <div class="row d-flex justify-content-center mt-100">
//     <div class="col-md-6">
//         <div class="progress blue"> <span class="progress-left"> <span class="progress-bar"></span> </span> <span class="progress-right"> <span class="progress-bar"></span> </span>
//             <div class="progress-value">90%</div>
//         </div>
//         <div class="progress yellow"> <span class="progress-left"> <span class="progress-bar"></span> </span> <span class="progress-right"> <span class="progress-bar"></span> </span>
//             <div class="progress-value">37.5%</div>
//         </div>
//     </div>
// </div>

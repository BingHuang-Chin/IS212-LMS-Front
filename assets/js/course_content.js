const GRAPHQL_ENDPOINT = "http://localhost:8080/v1/graphql"
// $('#header').load("/common/navbar.html");
const params = new URLSearchParams(window.location.search) // use the prev URL
const course_id = params.get("id")
 
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
                course_materials(where: {course_id: {_eq: ${course_id}}}) {
                  chapter_name
                  course_id
                  course_link
                }
              }
              
            `
        })
        

    })
    const dataset = await response.json()
    const materials = dataset.data.course_materials
    console.log(materials)

    for(individual_materials of materials){
        material_row = `
        <h4>${individual_materials.chapter_name}</h4>
                <div class="line"></div>
        `
        document.getElementById('bodycontent').innerHTML+= material_row

    }

}

// TODO display the chapers chronologically

getmaterials()
console.log("hi there")


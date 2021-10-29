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
                  description
                }
              }
              
            `
        })
        

    })
    const dataset = await response.json()
    const materials = dataset.data.course_materials
    console.log(materials[0].description)
    for(individual_materials of materials.reverse()){
        material_row = 
                        `<li>
                                <a href="http://localhost:3000/pages/individual-chapter?mid=${individual_materials.course_link}">${individual_materials.chapter_name}</a>
                        </li>`
        document.getElementById('displaysidechapter').innerHTML+= material_row

    }
    document.getElementById('coursetitle').innerHTML= materials[0].description

     

}

getmaterials()
console.log("hi there")


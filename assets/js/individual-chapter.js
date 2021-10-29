const GRAPHQL_ENDPOINT = "http://localhost:8080/v1/graphql"
// $('#header').load("/common/navbar.html");
const params = new URLSearchParams(window.location.search) // use the prev URL
const single_material = params.get("mid")

async function getindividual(){
    
    // const dataset = await response.json()
    // const materials = dataset.data.course_materials
    // console.log(materials)
    material_row = `
        <iframe src="${single_material}" width="400" height="400"></iframe>

        `
        console.log(material_row)
        
        document.getElementById('individualcontent').innerHTML+= material_row

    

}

getindividual()
console.log("testign")

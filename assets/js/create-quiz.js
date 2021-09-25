const generateQuestionCard = () => {
  const questionTemplate = $("#question-template").html()
  $("#question-body").append(questionTemplate)
}

const generateOption = element => {
  console.log(element)
}

$(document).ready(() => {
  generateQuestionCard()
})
const generateQuestionCard = () => {
  const questionTemplate = $("#question-template").html()
  $("#question-body").append(questionTemplate)
}

const generateOption = element => {
  const parents = $(element).parents()
  const cardElement = parents[2]
  const questionTypeElement = $(cardElement).find(".section-id")[0]
  const questionType = $(questionTypeElement).val()
  
  const optionInputElement = $("#option-input-template").html()
  const optionsElement = $(cardElement).find(".options")[0]
  $(optionsElement).append(optionInputElement)
}

$(document).ready(() => {
  generateQuestionCard()
})
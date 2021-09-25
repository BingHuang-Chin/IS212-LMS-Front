const generateQuestionCard = () => {
  const totalQuestions = $("#question-body").children().length
  const questionElement = $($("#question-template").html())

  // Setup question number
  const questionHeaderElement = $(questionElement).find(".question-display")[0]
  $(questionHeaderElement).html(`Question ${totalQuestions + 1}`)

  // Setup dynamic options groups
  const radioButtonElement = $(questionElement).find(".form-check-input")[0]
  $(radioButtonElement).attr("name", `question-${totalQuestions}`)
  $(radioButtonElement).attr("checked", true)

  $("#question-body").append(questionElement)
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
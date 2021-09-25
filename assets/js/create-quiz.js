const generateQuestionCard = () => {
  const questionTemplate = $("#question-template").html()
  $("#question-body").append(questionTemplate)
}
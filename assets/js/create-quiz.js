const generateQuestionCard = () => {
  createQuiz.ensureQuestionTypes()

  const totalQuestions = $("#question-body").children().length
  const questionElement = $($("#question-template").html())

  // Setup question number
  const questionHeaderElement = $(questionElement).find(".question-display")[0]
  $(questionHeaderElement).html(`Question ${totalQuestions + 1}`)

  // Setup change listener for question type dropdown
  const questionTypeDropdownElement = $(questionElement).find(".question-type")[0]
  $(questionTypeDropdownElement).attr("onchange", `onQuestionTypeChange(this, ${totalQuestions})`)

  // Setup dynamic options groups
  const radioButtonElement = $(questionElement).find(".form-check-input")[0]
  $(radioButtonElement).attr("name", `question-${totalQuestions}`)
  $(radioButtonElement).attr("checked", true)

  // Setup event listener for adding new options
  const addOptionButtonElement = $(questionElement).find(".add-option")[0]
  $(addOptionButtonElement).attr("onclick", `generateOption(this, ${totalQuestions})`)

  $("#question-body").append(questionElement)
}

const generateOption = (element, questionNumber) => {
  const parents = $(element).parents()
  const cardElement = parents[2]

  const optionInputElement = $($("#option-input-template").html())
  const radioButtonElement = $(optionInputElement).find(".form-check-input")[0]
  $(radioButtonElement).attr("name", `question-${questionNumber}`)

  const optionsElement = $(cardElement).find(".options")[0]
  $(optionsElement).append(optionInputElement)
}

const onQuestionTypeChange = (element, questionNumber) => {
  // TODO: Vera help me handle this
  console.log(element, questionNumber)
}

const createQuiz = {
  questionTypes: [],

  ensureQuestionTypes: function() {
    if (this.questionTypes.length > 0) return

    Swal.fire({
      title: 'Error!',
      text: 'No question types available for selection',
      icon: 'error'
    })

    throw new Error("No question types loaded.")
  },

  getQuestionTypes: async function() {
    const response = await fetch("http://localhost:8080/v1/graphql", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${getIdToken()}`,
      },
      body: JSON.stringify({
        query: `
          query {
            question_type {
              id
              name
            }
          }
        `
      })
    })

    const responseJson = await response.json()
    this.questionTypes = responseJson.data.question_type
    this.updateQuestionTypeTemplate()
  },

  updateQuestionTypeTemplate: function() {
    const questionElement = $($("#question-template").html())
    const questionTypeSelectElement = $(questionElement.find(".question-type")[0])

    this.questionTypes.forEach(questionType => {
      const { id, name } = questionType
      questionTypeSelectElement.append(`<option value="${id}">${name}</option>`)
    })

    $($("#question-template")[0].content.children[0]).replaceWith(questionElement)
  }
}

$(document).ready(async () => {
  ensureAuthenticated()

  await createQuiz.getQuestionTypes()
  generateQuestionCard()
})

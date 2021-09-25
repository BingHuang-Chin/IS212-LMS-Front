const HTML_ELEMENTS = {
  addOptionClass: ".add-option",
  optionsClass: ".options",
  optionInputTemplateId: "#option-input-template",
  radioButtonClass: ".form-check-input",
  questionBodyId: "#question-body",
  questionTemplateId: "#question-template",
  questionTitleClass: ".question-display",
  questionTypeClass: ".question-type"
}

const generateQuestionCard = () => {
  createQuiz.ensureQuestionTypes()

  const totalQuestions = $(HTML_ELEMENTS.questionBodyId).children().length
  const questionElement = $($(HTML_ELEMENTS.questionTemplateId).html())

  // Setup question number
  const questionHeaderElement = $(questionElement).find(HTML_ELEMENTS.questionTitleClass)[0]
  $(questionHeaderElement).html(`Question ${totalQuestions + 1}`)

  // Setup change listener for question type dropdown
  const questionTypeDropdownElement = $(questionElement).find(HTML_ELEMENTS.questionTypeClass)[0]
  $(questionTypeDropdownElement).attr("onchange", `onQuestionTypeChange(this, ${totalQuestions})`)

  // Setup dynamic options groups
  const radioButtonElement = $(questionElement).find(HTML_ELEMENTS.radioButtonClass)[0]
  $(radioButtonElement).attr("name", `question-${totalQuestions}`)
  $(radioButtonElement).attr("checked", true)

  // Setup event listener for adding new options
  const addOptionButtonElement = $(questionElement).find(HTML_ELEMENTS.addOptionClass)[0]
  $(addOptionButtonElement).attr("onclick", `generateOption(this, ${totalQuestions})`)

  $(HTML_ELEMENTS.questionBodyId).append(questionElement)
}

const generateOption = (element, questionNumber) => {
  const parents = $(element).parents()
  const cardElement = parents[2]

  const optionInputElement = $($(HTML_ELEMENTS.optionInputTemplateId).html())
  const radioButtonElement = $(optionInputElement).find(HTML_ELEMENTS.radioButtonClass)[0]
  $(radioButtonElement).attr("name", `question-${questionNumber}`)

  const optionsElement = $(cardElement).find(HTML_ELEMENTS.optionsClass)[0]
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
    const questionElement = $($(HTML_ELEMENTS.questionTemplateId).html())
    const questionTypeSelectElement = $(questionElement.find(HTML_ELEMENTS.questionTypeClass)[0])

    this.questionTypes.forEach(questionType => {
      const { id, name } = questionType
      questionTypeSelectElement.append(`<option value="${id}">${name}</option>`)
    })

    $($(HTML_ELEMENTS.questionTemplateId)[0].content.children[0]).replaceWith(questionElement)
  }
}

$(document).ready(async () => {
  ensureAuthenticated()

  await createQuiz.getQuestionTypes()
  generateQuestionCard()
})

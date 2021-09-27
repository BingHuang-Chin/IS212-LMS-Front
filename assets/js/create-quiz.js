const GRAPHQL_ENDPOINT = "http://localhost:8080/v1/graphql"

const HTML_ELEMENTS = {
  addOptionClass: ".add-option",
  optionsClass: ".options",
  optionInputTemplateId: "#option-input-template",
  radioButtonClass: ".form-check-input",
  inputClass: ".form-control",
  questionBodyId: "#question-body",
  questionTemplateId: "#question-template",
  questionTitleClass: ".question-display",
  questionTypeClass: ".question-type",
  questionInfoClass: ".question-info",
  questionClass: ".question",
  quizTitleId: "#quiz-title",
  sectionSelectId: "#section-id",
  timeLimitId: "#time-limit",
  submitQuizId: "#submit-quiz"
}

const QUESTION_TYPES = {
  mcq: "1",
  trueFalse: "2"
}

const generateQuestionCard = question => {
  createQuiz.ensureQuestionTypes()

  const totalQuestions = $(HTML_ELEMENTS.questionBodyId).children().length
  const questionElement = $($(HTML_ELEMENTS.questionTemplateId).html())

  // Setup question number
  const questionHeaderElement = $(questionElement).find(HTML_ELEMENTS.questionTitleClass)[0]
  $(questionHeaderElement).html(`Question ${totalQuestions + 1}`)

  // Setup change listener for question type dropdown
  const questionTypeDropdownElement = $(questionElement).find(HTML_ELEMENTS.questionTypeClass)[0]
  $(questionTypeDropdownElement).attr("onchange", `onQuestionTypeChange(this, ${totalQuestions})`)
  $(questionTypeDropdownElement).val(question ? question.question_type_id : null)

  // Setup event listener for adding new options
  const addOptionButtonElement = $(questionElement).find(HTML_ELEMENTS.addOptionClass)[0]
  $(addOptionButtonElement).attr("onclick", `generateOption(this, ${totalQuestions})`)

  if (question) {
    // Setup question title, which will be the first input
    const questionTitleElement = $(questionElement).find(HTML_ELEMENTS.inputClass)[0]
    $(questionTitleElement).val(question.title)

    question.question_options.forEach(option =>
      generateOption(addOptionButtonElement, totalQuestions, { value: option.title, checked: option.is_answer }))
  }
  else {
    // Setup dynamic options groups
    generateOption(addOptionButtonElement, totalQuestions, { checked: true })
  }

  $(HTML_ELEMENTS.questionBodyId).append(questionElement)
}

const generateOption = (element, questionNumber, { checked = false, value = "", id = null } = {}) => {
  const parents = $(element).parents()
  const cardElement = parents[2]

  const optionInputElement = $($(HTML_ELEMENTS.optionInputTemplateId).html())
  const radioButtonElement = $(optionInputElement).find(HTML_ELEMENTS.radioButtonClass)[0]
  $(radioButtonElement).attr("name", `question-${questionNumber}`)
  $(radioButtonElement).attr("checked", checked)

  if (value)
    $(optionInputElement).find(HTML_ELEMENTS.inputClass).val(value)

  const optionsElement = $(cardElement).find(HTML_ELEMENTS.optionsClass)[0]
  $(optionsElement).append(optionInputElement)
}

const onQuestionTypeChange = (element, questionNumber) => {
  const parents = $(element).parents()
  const cardElement = parents[3]

  const questionType = $(element).val()
  if (questionType === QUESTION_TYPES.mcq) {
    const addOptionButton = $(cardElement).find(HTML_ELEMENTS.addOptionClass)[0]
    $(addOptionButton).removeClass("d-none")
  }
  else if (questionType === QUESTION_TYPES.trueFalse) {
    const addOptionButton = $(cardElement).find(HTML_ELEMENTS.addOptionClass)[0]
    $(addOptionButton).addClass("d-none")

    const optionElements = $(cardElement).find(HTML_ELEMENTS.optionsClass).children()
    optionElements.each((index, optionElement) => {
      if (index < 2)
        $(optionElement).find(HTML_ELEMENTS.inputClass).val(index === 0 ? "True" : "False")
      else
        $(optionElement).remove()
    })

    if (optionElements.length === 1)
      generateOption($(cardElement).find(HTML_ELEMENTS.addOptionClass)[0], questionNumber, { value: "False" })
  }
}

const createQuiz = {
  questionTypes: [],
  sections: [],

  ensureQuestionTypes: function () {
    if (this.questionTypes.length > 0) return

    Swal.fire({
      title: 'Error!',
      text: 'No question types available for selection',
      icon: 'error'
    })

    throw new Error("No question types loaded.")
  },

  getDropdownOptions: async function () {
    const response = await fetch(GRAPHQL_ENDPOINT, {
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

            section {
              id
              name
            }
          }
        `
      })
    })

    const responseJson = await response.json()
    this.questionTypes = responseJson.data.question_type
    this.sections = responseJson.data.section

    this.updateQuestionTypeTemplate()
    this.updateSectionOptions()
  },

  postQuiz: async function (quizData) {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${getIdToken()}`,
      },
      body: JSON.stringify({
        query: `
          mutation MyMutation($object: quiz_insert_input!) {
            insert_quiz_one(object: $object) {
              id
            }
          }        
        `,
        variables: {
          object: quizData
        }
      })
    })

    const { errors } = await response.json()
    if (errors) {
      Swal.fire({
        title: 'Error!',
        text: 'Quiz could not be created at this moment',
        icon: 'error'
      })
      return
    }

    Swal.fire({
      title: 'Quiz created!',
      text: 'The quiz has been successfully created',
      icon: 'success'
    }).then(result => {
      if (result.isDismissed || result.isConfirmed)
        location.reload()
    })
  },

  updateQuestionTypeTemplate: function () {
    const questionElement = $($(HTML_ELEMENTS.questionTemplateId).html())
    const questionTypeSelectElement = $(questionElement.find(HTML_ELEMENTS.questionTypeClass)[0])

    this.questionTypes.forEach(questionType => {
      const { id, name } = questionType
      questionTypeSelectElement.append(`<option value="${id}">${name}</option>`)
    })

    $($(HTML_ELEMENTS.questionTemplateId)[0].content.children[0]).replaceWith(questionElement)
  },

  updateSectionOptions: function () {
    this.sections.forEach(section => {
      const { id, name } = section
      $(HTML_ELEMENTS.sectionSelectId).append(`<option value="${id}">${name}</option>`)
    })
  }
}

const updateQuiz = {
  quiz: null,

  getQuiz: async function (quizId) {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${getIdToken()}`,
      },
      body: JSON.stringify({
        query: `
          query {
            quiz_by_pk(id: ${quizId}) {
              id
              title
              time_limit
              section_id
              questions {
                id
                title
                question_type_id
                question_options {
                  id
                  title
                  is_answer
                }
              }
            }
          }
        `
      })
    })

    const responseJson = await response.json()
    this.quiz = responseJson.data.quiz_by_pk

    if (!this.quiz) {
      Swal.fire({
        title: 'Error!',
        text: 'Quiz not found',
        icon: 'error'
      })
      return
    }

    this.updateQuestionInfoUi()
    this.updateQuestionsUi()
  },

  updateQuestionInfoUi: function () {
    const questionInfoElement = $(HTML_ELEMENTS.questionInfoClass)
    $(questionInfoElement).find(HTML_ELEMENTS.quizTitleId).val(this.quiz.title),
      $(questionInfoElement).find(HTML_ELEMENTS.sectionSelectId).val(this.quiz.section_id),
      $(questionInfoElement).find(HTML_ELEMENTS.timeLimitId).val(this.quiz.time_limit)
  },

  updateQuestionsUi: function () {
    this.quiz.questions.forEach(question => generateQuestionCard(question))
  }
}

const onCreateQuiz = async () => {
  const questionInfo = getQuestionInformationData()
  const questions = getQuestionsData()
  const quizData = {
    ...questionInfo,
    questions
  }

  await createQuiz.postQuiz(quizData)
}

const getQuestionInformationData = () => {
  const questionInfoElement = $(HTML_ELEMENTS.questionInfoClass)
  const [title, section_id, time_limit] = [
    $(questionInfoElement).find(HTML_ELEMENTS.quizTitleId).val(),
    $(questionInfoElement).find(HTML_ELEMENTS.sectionSelectId).val(),
    $(questionInfoElement).find(HTML_ELEMENTS.timeLimitId).val()
  ]

  return { title, section_id, time_limit }
}

const getQuestionsData = () => {
  const questionsData = []
  $(HTML_ELEMENTS.questionClass).each((_, cardElement) => {
    // NOTE: it only retrieves the first input (question-title) value
    const title = $(cardElement).find(HTML_ELEMENTS.inputClass).val()
    const question_type_id = parseInt($(cardElement).find(HTML_ELEMENTS.questionTypeClass).val())

    questionsData.push({
      title,
      question_type_id,
      question_options: getOptionsData(cardElement)
    })
  })

  return { data: questionsData }
}

const getOptionsData = (element) => {
  const optionsData = []
  $(element)
    .find(HTML_ELEMENTS.optionsClass)
    .children()
    .each((_, option) => {
      const is_answer = $(option).find(HTML_ELEMENTS.radioButtonClass).is(":checked")
      const title = $(option).find(HTML_ELEMENTS.inputClass).val()

      optionsData.push({ is_answer, title })
    })

  return { data: optionsData }
}

$(document).ready(async () => {
  ensureAuthenticated()

  await createQuiz.getDropdownOptions()

  const params = new URLSearchParams(window.location.search)
  const quizId = params.get("quiz")
  if (quizId) {
    await updateQuiz.getQuiz(quizId)
    $(HTML_ELEMENTS.submitQuizId).text("Update Quiz")
    return
  }

  generateQuestionCard()
})

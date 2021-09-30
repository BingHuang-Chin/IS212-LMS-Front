const GRAPHQL_ENDPOINT = "http://localhost:8080/v1/graphql"

const QUESTION_TYPES = {
  mcq: "1",
  trueFalse: "2"
}

const generateQuestionCard = question => {
  createQuiz.ensureQuestionTypes()

  const totalQuestions = UiElements.getQuestionLength()
  const questionElement = UiElements.cloneElement(UiElements.questionTemplateId)

  // Setup question number
  const questionHeaderElement = UiElements.findOneFromParent(questionElement, UiElements.questionTitleClass)
  questionHeaderElement.html(`Question ${totalQuestions + 1}`)

  // Setup change listener for question type dropdown
  const questionTypeDropdownElement = UiElements.findOneFromParent(questionElement, UiElements.questionTypeClass)
  questionTypeDropdownElement.attr("onchange", `onQuestionTypeChange(this, ${totalQuestions})`)
  questionTypeDropdownElement.val(question ? question.question_type_id : null)

  // Setup event listener for adding new options
  const addOptionButtonElement = UiElements.findOneFromParent(questionElement, UiElements.addOptionClass)
  addOptionButtonElement.attr("onclick", `generateOption(this, ${totalQuestions})`)

  if (question) {
    // Setup hidden input to contain uid
    const uidInputElement = UiElements.generateHiddenInput(UiElements.questionUidClass, question.id)
    UiElements.appendElement(questionElement, uidInputElement)

    const questionTitleElement = UiElements.findOneFromParent(questionElement, UiElements.questionInputClass)
    questionTitleElement.val(question.title)

    question.question_options.forEach(option =>
      generateOption(addOptionButtonElement, totalQuestions, { value: option.title, checked: option.is_answer, id: option.id }))
  }
  else {
    // Setup dynamic options groups
    generateOption(addOptionButtonElement, totalQuestions, { checked: true })
  }

  UiElements.appendElement(UiElements.questionListId, questionElement)
}

const generateOption = (element, questionNumber, { checked = false, value = "", id = null } = {}) => {
  const cardElement = UiElements.findOneFromChild(element, UiElements.questionCardClass)
  const optionInputElement = UiElements.cloneElement(UiElements.optionTemplateId)

  const radioButtonElement = UiElements.findOneFromParent(optionInputElement, UiElements.optionRadioClass)
  radioButtonElement.attr("name", `question-${questionNumber}`)
  radioButtonElement.attr("checked", checked)

  if (value)
    UiElements.findOneFromParent(optionInputElement, UiElements.optionInputClass).val(value)

  // Setup hidden input to contain uid
  if (id) {
    const uidInputElement = UiElements.generateHiddenInput(UiElements.optionUidClass, id)
    UiElements.appendElement(optionInputElement, uidInputElement)
  }

  const optionsElement = UiElements.findOneFromParent(cardElement, UiElements.optionListClass)
  optionsElement.append(optionInputElement)
}

const onQuestionTypeChange = (element, questionNumber) => {
  const cardElement = UiElements.findOneFromChild(element, UiElements.questionCardClass)

  const questionType = $(element).val()
  const addOptionButton = UiElements.findOneFromParent(cardElement, UiElements.addOptionClass)

  if (questionType === QUESTION_TYPES.mcq) {
    addOptionButton.removeClass("d-none")
  }
  else if (questionType === QUESTION_TYPES.trueFalse) {
    addOptionButton.addClass("d-none")

    const optionElements = cardElement.find(UiElements.optionListClass).children()
    optionElements.each((index, optionElement) => {
      if (index < 2)
        UiElements.findOneFromParent(optionElement, UiElements.optionInputClass).val(index === 0 ? "True" : "False")
      else
        $(optionElement).remove()
    })

    if (optionElements.length === 1)
      generateOption(UiElements.findOneFromParent(cardElement, UiElements.addOptionClass), questionNumber, { value: "False" })
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
        'authorization': getIdToken(),
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
        'authorization': getIdToken(),
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
    const questionElement = UiElements.cloneElement(UiElements.questionTemplateId)
    const questionTypeSelectElement = UiElements.findOneFromParent(questionElement, UiElements.questionTypeClass)

    this.questionTypes.forEach(questionType => {
      const { id, name } = questionType
      questionTypeSelectElement.append(`<option value="${id}">${name}</option>`)
    })

    $($(UiElements.questionTemplateId)[0].content.children[0]).replaceWith(questionElement)
  },

  updateSectionOptions: function () {
    this.sections.forEach(section => {
      const { id, name } = section
      $(UiElements.sectionSelectId).append(`<option value="${id}">${name}</option>`)
    })
  }
}

const updateQuiz = {
  quiz: null,

  queuedDeletionQuery: "",

  getQuiz: async function (quizId) {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'authorization': getIdToken(),
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
    const questionInfoElement = $(UiElements.questionInfoCardClass)
    $(questionInfoElement).find(UiElements.quizTitleId).val(this.quiz.title)
    $(questionInfoElement).find(UiElements.sectionSelectId).val(this.quiz.section_id)
    $(questionInfoElement).find(UiElements.timeLimitId).val(this.quiz.time_limit)
  },

  updateQuestionsUi: function () {
    this.quiz.questions.forEach(question => generateQuestionCard(question))
  },

  modifyQuiz: async function (query) {
    if (!query && !this.queuedDeletionQuery)
      return

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'authorization': getIdToken(),
      },
      body: JSON.stringify({
        query: `
          mutation {
            ${query}
            ${this.queuedDeletionQuery}
          }        
        `
      })
    })

    const { errors } = await response.json()
    if (errors) {
      Swal.fire({
        title: 'Error!',
        text: 'Quiz could not be updated at this time.',
        icon: 'error'
      })
      return
    }

    Swal.fire({
      title: 'Quiz updated!',
      text: 'The quiz has been successfully updated',
      icon: 'success'
    }).then(result => {
      if (result.isDismissed || result.isConfirmed)
        location.reload()
    })
  }
}

const onSubmitQuiz = async () => {
  const questionInfo = getQuestionInformationData()
  const questions = getQuestionsData()
  const quizData = {
    ...questionInfo,
    questions
  }

  if (!updateQuiz.quiz)
    await createQuiz.postQuiz(quizData)
  else {
    const updatedQuestionInfo = getQuestionInfoUpdateQuery(questionInfo)
    const updatedQuestions = getQuestionUpdateQuery(questions)
    updateQuiz.modifyQuiz(updatedQuestionInfo.concat(updatedQuestions))
  }
}

const onCancel = () => {
  window.history.back()
}

const onOptionRemove = element => {
  const optionElements = UiElements.findOneFromChild(element, UiElements.optionListClass)
  const optionsLeft = optionElements.children().length

  if (optionsLeft <= 1) {
    Swal.fire({
      title: 'Warning!',
      text: 'Cannot remove last option',
      icon: 'warning'
    })
    return
  }

  const optionElement = UiElements.findOneFromChild(element, UiElements.optionContainerClass)
  const optionId = parseInt(UiElements.findOneFromParent(optionElement, UiElements.optionUidClass).val())
  const queryName = `_del_option_${updateQuiz.queuedDeletionQuery.length}`
  updateQuiz.queuedDeletionQuery += `
    ${queryName}: delete_question_option_by_pk(id: ${optionId}) {
      id
    }
  `

  $(optionElement).remove()
}

const getQuestionInformationData = () => {
  const questionInfoElement = $(UiElements.questionInfoCardClass)
  const [title, section_id, time_limit] = [
    $(questionInfoElement).find(UiElements.quizTitleId).val(),
    $(questionInfoElement).find(UiElements.sectionSelectId).val(),
    $(questionInfoElement).find(UiElements.sectionSelectId).val()
  ]

  return { title, section_id, time_limit }
}

const getQuestionsData = () => {
  const questionsData = []
  $(UiElements.questionCardClass).each((_, cardElement) => {
    const title = UiElements.findOneFromParent(cardElement, UiElements.questionInputClass).val()
    const question_type_id = parseInt(UiElements.findOneFromParent(cardElement, UiElements.questionTypeClass).val())
    let question = {
      title,
      question_type_id,
      question_options: getOptionsData(cardElement)
    }

    if (updateQuiz.quiz) {
      // questionId will be appeneded to the last element, we will retrieve from the last element in find
      const questionId = parseInt(UiElements.findOneFromParent(cardElement, UiElements.questionUidClass).val())

      if (!isNaN(questionId))
        question = { ...question, id: questionId }
    }

    questionsData.push(question)
  })

  return { data: questionsData }
}

const getOptionsData = (element) => {
  const optionsData = []
  $(element)
    .find(UiElements.optionListClass)
    .children()
    .each((_, option) => {
      const is_answer = $(option).find(UiElements.optionRadioClass).is(":checked")
      const title = $(option).find(UiElements.optionInputClass).val()
      let optionData = { is_answer, title }

      if (updateQuiz.quiz) {
        const optionId = parseInt($(option).find(UiElements.optionUidClass).val())

        if (!isNaN(optionId))
          optionData = { ...optionData, id: optionId }
      }

      optionsData.push(optionData)
    })

  return { data: optionsData }
}

const getQuestionInfoUpdateQuery = (questionInfo) => {
  let query = ""
  const { title, section_id, time_limit } = updateQuiz.quiz

  if (questionInfo.title != title
    || questionInfo.section_id != section_id
    || questionInfo.time_limit != time_limit) {
    query += `
      update_quiz_by_pk(pk_columns: {id: ${updateQuiz.quiz.id}}, _set: {
        section_id: ${questionInfo.section_id},
        time_limit: ${questionInfo.time_limit},
        title: "${questionInfo.title}"
      }) {
        id
      }
  `
  }

  return query
}

const getQuestionUpdateQuery = ({ data }) => {
  let query = ""
  const orignalQuizState = updateQuiz.quiz.questions

  data.forEach((question, index) => {
    let queryName = `_question_${index}`
    const originalQuestion = orignalQuizState.find(q => q.id == question.id)

    if (!originalQuestion) {
      let newOptionsQuery = ""
      question.question_options.data.forEach((option, index) => {
        const comma = index === question.question_options.data.length - 1 ? "" : ","
        newOptionsQuery += `
          {
            is_answer: ${option.is_answer},
            title: "${option.title}"
          }${comma}
        `
      })

      query += `
        ${queryName}: insert_question_one(object: {
          question_type_id: ${question.question_type_id},
          quiz_id: ${updateQuiz.quiz.id},
          title: "${question.title}",
          question_options: {
            data: [
              ${newOptionsQuery}
            ]
          }
        }) {
          id
        }
      `
      return
    }

    query += getOptionUpdateQuery(originalQuestion.id, question.question_options, originalQuestion.question_options)

    if (originalQuestion.question_type_id != question.question_type_id
      || originalQuestion.title != question.title) {
      query += `
        ${queryName}: update_question_by_pk(pk_columns: {id: ${originalQuestion.id}}, _set: {
          question_type_id: ${question.question_type_id},
          title: "${question.title}"
        }) {
          id
        }
      `
    }
  })

  return query
}

const getOptionUpdateQuery = (questionId, { data }, originalOptions) => {
  let query = ""

  data.forEach((option, index) => {
    const queryName = `_option_${questionId}_${index}`
    const originalOption = originalOptions.find(o => o.id == option.id)
    if (!originalOption) {
      query += `
        ${queryName}: insert_question_option_one(object: {
          is_answer: ${option.is_answer},
          question_id: ${questionId},
          title: "${option.title}"
        }) {
          id
        }
      `
      return
    }

    if (originalOption.is_answer != option.is_answer
      || originalOption.title != option.title) {
      query += `
        ${queryName}: update_question_option_by_pk(pk_columns: {id: ${originalOption.id}}, _set: {
          title: "${option.title}",
          is_answer: ${option.is_answer}
        }) {
          id
        }
      `
    }
  })

  return query
}

$(document).ready(async () => {
  ensureAuthenticated()

  await createQuiz.getDropdownOptions()

  const params = new URLSearchParams(window.location.search)
  const quizId = params.get("quiz")
  if (quizId) {
    await updateQuiz.getQuiz(quizId)
    $(UiElements.submitQuizButtonId).text("Update Quiz")
    return
  }

  generateQuestionCard()
})

const UiElements = {
  // Question info specific element identifiers
  questionInfoCardClass: ".question-info.card",
  sectionSelectId: "#section-id",
  quizTitleId: "#quiz-title",
  timeLimitId: "#time-limit",

  // Questions specific element identifiers
  questionUidClass: ".quest-uid",
  questionTitleClass: ".question-display",
  questionTypeClass: ".question-type",
  questionTemplateId: "#question-template",
  questionListId: "#question-body",
  questionInputClass: ".question-input",
  questionCardClass: ".question.card",

  // Options specific element identifiers
  optionUidClass: ".opt-uid",
  addOptionClass: ".add-option",
  optionListClass: ".options",
  optionRadioClass: ".option-radio",
  optionInputClass: ".option-input",
  optionTemplateId: "#option-input-template",
  optionContainerClass: ".option.container",

  // Generic element identifiers
  inputClass: ".form-control",
  radioButtonClass: ".form-check-input",
  submitQuizButtonId: "#submit-quiz",

  appendElement: function (parentElem, childElem) {
    if (typeof (parentElem) === "string") {
      $(parentElem).append(childElem)
      return
    }

    $(parentElem).append(childElem)
  },

  getQuestionLength: function () {
    return $(this.questionListId).children().length
  },

  cloneElement: function (uiElementType) {
    return $($(uiElementType).html())
  },

  findOneFromParent: function (parentElem, uiElementType) {
    return $(parentElem).find(uiElementType).first()
  },

  findOneFromChild: function (childElem, uiElementType) {
    return $(childElem).parents(uiElementType).first()
  },

  generateHiddenInput: function (uiElementType, value) {
    const omitClassAndIdIdentifier = uiElementType.replace(".", "").replace("#", "")

    if (uiElementType.includes("."))
      return $(`<input type="hidden" class="${omitClassAndIdIdentifier}" value="${value}" />`)
    else
      return $(`<input type="hidden" id="${omitClassAndIdIdentifier}" value="${value}" />`)
  }
}

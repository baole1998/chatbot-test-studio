import api from "../../../services/APIServer"

// CHAT SYSTEMS API LIST: ----------------------
export const getChatSystems = (params = {}) => {
    return api({
        method: "get",
        url: "/testflow/chat-system/",
        params
    })
}

export const postChatSystems = (data = {}) => {
    return api({
        method: "post",
        url: "/testflow/chat-system/",
        data
    })
}
// --------------------END----------------------



// TEST SUITES API LIST: -----------------------
export const getTestSuites = (params = {}) => {
    return api({
        method: "get",
        url: "/testflow/suites/",
        params
    })
}

export const postTestSuites = (data = {}) => {
    return api({
        method: "post",
        url: "/testflow/suites/",
        data
    })
}

export const putTestSuites = (data = {}, code) => {
    return api({
        method: "put",
        url: `/testflow/suites/${code}/`,
        data
    })
}

export const deleteTestSuites = (code) => {
    return api({
        method: "delete",
        url: `/testflow/suites/${code}/`,
    })
}
// --------------------END-----------------------



// TEST CASES API LIST: -------------------------
export const getTestCases = (params = {}) => {
    return api({
        method: "get",
        url: "/testflow/test-cases/",
        params
    })
}

export const postTestCases = (data = {}) => {
    return api({
        method: "post",
        url: "/testflow/test-cases/",
        data
    })
}
export const putTestCases = (data, code) => {
    return api({
        method: "put",
        url: `/testflow/test-cases/${code}/`,
        data
    })
}
export const deleteTestCases = (code) => {
    return api({
        method: "delete",
        url: `/testflow/test-cases/${code}/`,
    })
}

// --------------------END-----------------------



// TEST ITEMS API LIST: -------------------------
export const getTestItems = (params = {}) => {
    return api({
        method: "get",
        url: "/testflow/test-items/",
        params
    })
}

export const postTestItems = (data = {}) => {
    return api({
        method: "post",
        url: "/testflow/test-items/",
        data
    })
}

export const putTestItems = (data, code) => {
    return api({
        method: "put",
        url: `/testflow/test-items/${code}/`,
        data
    })
}

export const deleteTestItems = (code) => {
    return api({
        method: "delete",
        url: `/testflow/test-items/${code}/`
    })
}
// --------------------END-----------------------



// TEST QUESTIONS API LIST: ---------------------
export const getTestQuestions = (data = {}) => {
    return api({
        method: "get",
        url: "/testflow/test-questions/",
        data
    })
}

export const postTestQuestions = (data = {}) => {
    return api({
        method: "post",
        url: "/testflow/test-questions/",
        data
    })
}

export const putTestQuestions = (data, code) => {
    return api({
        method: "put",
        url: `/testflow/test-questions/${code}/`,
        data
    })
}
export const deleteTestQuestions = (data, code) => {
    return api({
        method: "delete",
        url: `/testflow/test-questions/${code}/`,
        data
    })
}
// --------------------END-----------------------

// TEST QUESTIONS API LIST: ---------------------
export const getTriggerTesting = (params) => {
    return api({
        method: "get",
        url: `/testflow/start-testing/`,
        params
    })
}
// --------------------END-----------------------



import React, { useState, useEffect, Fragment } from 'react'

import { Button, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"
import { Grid } from '@mui/material'
import TextField from '@mui/material/TextField'
import TagsInput from 'app/components/TagInput/TagsInput'
import DefaultSnackBar from 'app/components/SnackBar/SanckBar'
import { 
    postTestItems, 
    postTestQuestions, 
    deleteTestItems, 
    deleteTestQuestions,
    putTestItems 
} from '../API-management/API-Actions'
import "./TestItems.scss"

const isEmpty = (prop) => {
    return (
        prop === null ||
        prop === undefined ||
        (prop.length === 0) ||
        (prop.constructor === Object && Object.keys(prop).length === 0)
    )
}

const AddOrEditItemsModal = (props) => {
    const { visibleModal, onCancel, item, onSubmit, caseID } = props

    // const isAddNew = isEmpty(item)
    const [open, setOpen] = useState(false)
    const [alertProps, setAlertProps] = useState('')
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const [questions, setQuestions] = useState('')
    const [answer, setAnswers] = useState('')

    useEffect(() => {
        let isMounted = true
        if (item) {
            if (isMounted) {
                const questions = item?.questions.map((item) => {
                    return item?.question
                })
                setQuestions(questions)
                setAnswers(item?.answer)
            }
            return () => {
                isMounted = false
            }
        }
    }, [item])

    const handleChange = event => {
        const { value } = event.target
        setAnswers(value)
    }

    const actionDeleteTestQuestions = async (listQuestion) => {
        if (isEmpty(listQuestion)) {
            return
        }
        // listQuestion = {"id": removeItemID, ...}
        await deleteTestQuestions(listQuestion)
            .then((res) => {
                console.log(res)
            })
            .catch((error) => {
                console.log(error)
                if (error.status === 404 && error.statusText === 'Not Found') {
                    setAlertProps({
                        message: 'Test item has been deleted recently !',
                        severity: 'error'
                    })
                    return
                }
            })
    }

    const actionCreateNewTestQuestion = async (listQuestionWithTestItemID) => {
        await postTestQuestions(listQuestionWithTestItemID)
            .then((res) => {
                console.log(res)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const actionUpdateTestItem = async (answer, code) => {
        await putTestItems(answer, code)
        .then((res) => {
            console.log(res)
            return(true)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    const handleDeleteTestItem = async () => {

        await actionDeleteTestQuestions(item?.questions).then(() => {
            deleteTestItems(item?.id)
            .then((res) => {
                onSubmit({
                    message: 'Delete test item successfuly !',
                    severity: 'success'
                })
            })
            .catch((error) => {
                console.log(error)
                setAlertProps({
                    message: 'Something has wrong with the server !',
                    severity: 'error'
                })
                setOpen(true)
                return
            })
        })
    }

    const handleUpdateNewListQuestions = async (newQs, oldQs) => {
        const deleteItemsID = []
        const newQuestionsList = []
        for (let index = 0; index < oldQs.length; index++) {
            const element = oldQs[index]?.question
            // This action will get the old question that not in the new question array
            const oldQuestion = !newQs.includes(element)
            if (oldQuestion) {
                deleteItemsID.push({id: oldQs[index]?.id})
            }
        }
        for (let index = 0; index < newQs.length; index++) {
            const element = newQs[index]
            // This action will get the new question that not in the old question array
            const newQuestion = oldQs.find(x => x.question === element)
            // If newQuestion array element not in old array, it's a new one
            if (!newQuestion) {
                newQuestionsList.push(element)
            } 
        }
        const newQuestions = {
            'item_id': item?.id,
            'question': newQuestionsList
        }
        // case1: Notthing update
        if (isEmpty(newQuestionsList) && isEmpty(deleteItemsID) && item?.answer === answer) {
            return false
        }
        //case2: update all
        if (item?.answer !== answer && !isEmpty(deleteItemsID) && !isEmpty(newQuestionsList)) {
            await actionUpdateTestItem({answer: answer}, item?.id)
            await actionDeleteTestQuestions(deleteItemsID)
            await actionCreateNewTestQuestion(newQuestions)
            return true
        }
        // case3: update answer
        if (item?.answer !== answer && isEmpty(deleteItemsID) && isEmpty(newQuestionsList)) {
            await actionUpdateTestItem({answer: answer}, item?.id)
            return true
        }
        //case4: update answer & delete questions
        if (item?.answer !== answer && !isEmpty(deleteItemsID) && isEmpty(newQuestionsList)) {
            await actionUpdateTestItem({answer: answer}, item?.id)
            await actionDeleteTestQuestions(deleteItemsID)
            return true
        }
        //case5: update answer & addnew questions
        if (item?.answer !== answer && !isEmpty(newQuestionsList) && isEmpty(deleteItemsID)) {
            await actionUpdateTestItem({answer: answer}, item?.id)
            await actionCreateNewTestQuestion(newQuestions)
            return true
        }
        //case6: update questions
        if (item?.answer === answer && !isEmpty(newQuestionsList) && isEmpty(deleteItemsID)) {
            await actionCreateNewTestQuestion(newQuestions)
            return true
        }
        //case7: delete questions
        if (item?.answer === answer && isEmpty(newQuestionsList) && !isEmpty(deleteItemsID)) {
            await actionDeleteTestQuestions(deleteItemsID)
            return true
        }
        //case8: update questions & delete questions
        if (item?.answer === answer && !isEmpty(deleteItemsID) && !isEmpty(newQuestionsList)) {
            await actionCreateNewTestQuestion(newQuestions)
            await actionDeleteTestQuestions(deleteItemsID)
            return true
        }
    }

    const handleSubmit = async () => {
        if (isEmpty(questions) || isEmpty(answer)) {
            setAlertProps({
                message: 'Please fill all required fields !',
                severity: 'error'
            })
            setOpen(true)
            return
        }

        const newItem = {
            'answer': answer,
            'case_code': caseID?.code
        }

        if (isEmpty(item)) {
            await postTestItems(newItem)
                .then((res) => { 
                    console.log(res)
                    if (res.status === 201) {
                        const newQuestions = {
                            'item_id': res?.data?.id,
                            'question': questions
                        }
                        actionCreateNewTestQuestion(newQuestions).then(() => {
                            onSubmit({
                                message: 'Create test item successfuly !',
                                severity: 'success'
                            })
                        })
                    }      
                })
                .catch((error) => {
                    console.log(error)
                })
        } else {
            const isUpdateOrNot = await handleUpdateNewListQuestions(questions, item?.questions)
            if (isUpdateOrNot) {
                onSubmit({
                    message: 'Update test item successfuly !',
                    severity: 'success'
                })
            } else {
                onCancel(true)
            }
        }
    }

    return (
        <Fragment>
            <div>
            <Modal
                isOpen={visibleModal}
                toggle={() => onCancel(true)}
                size='lg'
            >
                <ModalHeader toggle={() => onCancel(true)}>
                    Add new test item
                </ModalHeader>
                <ModalBody>
                    <Grid container spacing={3}>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <FormGroup>
                            <TagsInput
                                selectedTags={(items) => {setQuestions(items)}}
                                oldQuestions={questions}
                                fullWidth
                                variant="outlined"
                                size="medium"
                                fieldName="question"
                                name="questions"
                                label="Questions"
                                defaultHelperText="# Please press enter to save the questions list !"
                            />
                            </FormGroup>
                            <FormGroup>
                                <TextField
                                    type="text"
                                    name="answer"
                                    fullWidth
                                    value={answer || ''}
                                    label="Answer"
                                    onChange={handleChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    style={{ height: "3.581em"}}
                                >
                                </TextField>
                            </FormGroup>
                        </Grid>
                    </Grid>
                </ModalBody>
                <ModalFooter>
                    <Button style={{ backgroundColor: 'rgb(178, 34, 34)' }} onClick={() => setShowDeleteModal(true)}>
                        Delete
                    </Button>
                    <Button color="success" onClick={handleSubmit}>Save</Button>
                </ModalFooter>
            </Modal>

            {open && (
                <DefaultSnackBar 
                    open={open}
                    message={alertProps?.message}
                    severity={alertProps?.severity}
                    onClose={(isClose) => {
                        if (isClose) {
                            setOpen(false)
                        }
                    }}
                />
            )}
        </div>
        {showDeleteModal && (
            <Modal
                isOpen={visibleModal}
                toggle={() => onCancel(true)}
                size='md'
                centered
            >
                <ModalHeader toggle={() => onCancel(true)}>
                    Delete test item
                </ModalHeader>
                <ModalBody>
                   <span>Are you sure you want to delete this test item ?</span>
                   <br /> 
                   <span>This action also delete all answer, questions and test results</span>
                </ModalBody>
                <ModalFooter>
                    <Button style={{ backgroundColor: 'rgb(178, 34, 34)' }} onClick={() => setShowDeleteModal(false)}>
                        NO
                    </Button>
                    <Button color="success" onClick={handleDeleteTestItem}>YES</Button>
                </ModalFooter>
            </Modal>
        )}
        </Fragment>
    )
}

export default AddOrEditItemsModal
import React, { useState, useEffect, Fragment } from 'react'

import { Button, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Grid } from '@mui/material'
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

import DefaultSnackBar from 'app/components/SnackBar/SanckBar';
import { postTestCases, putTestCases, deleteTestCases } from '../API-management/API-Actions'


const isEmpty = (prop) => {
    return (
        prop === null ||
        prop === undefined ||
        (prop.length === 0) ||
        (prop.constructor === Object && Object.keys(prop).length === 0)
    );
}

const AddOrEditCaseModal = (props) => {
    const { visibleModal, onCancel, item, onSubmit, suite_code } = props

    const isAddNew = isEmpty(item)
    const [open, setOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const [alertProps, setAlertProps] = useState({})
    const [description, setDescription] = useState()
    const [isFlow, setIsFlow] = useState('')

    useEffect(() => {
        if (!isAddNew) {
            setDescription(item?.description)
            setIsFlow(item?.isFlow)            
        }
    }, [item, isAddNew])


    const isFlowOptions = [
        {
            value: "true",
            label: "True"
        },
        {
            value: "false",
            label: "False"
        }
    ]
        
    const handleSelectSystems = event => {
        const { value } = event.target
        setIsFlow(value)
    }

    const handleChange = event => {
        const { value } = event.target
        setDescription(value)
    }

    const handleDeleteTestCase = async () => {
        await deleteTestCases(item?.code)
            .then((res) => {
                // console.log(res);
                onSubmit({
                    message: 'Delete test case successfuly !',
                    severity: 'success'
                })
            })
            .catch((error) => {
                console.log(error);
                setAlertProps({
                    message: 'Something has wrong with the server !',
                    severity: 'error'
                })
                setOpen(true);
                return
            })
    }

    const handleSubmit = async () => {
        if (isEmpty(description) || isEmpty(isFlow)) {
            setAlertProps({
                message: 'Please fill all required fields !',
                severity: 'error'
            })
            setOpen(true);
            return
        }
        let data = {
            isFlow: isFlow,
            description: description
        }
        if (isAddNew) {
            data = {...data, suite_code: suite_code}
            await postTestCases(data)
                .then((res) => {
                    console.log(res);
                    onSubmit({
                        message: 'Added new test case successfuly !',
                        severity: 'success'
                    })
                })
                .catch((error) => {
                    console.log(error);
                    setAlertProps({
                        message: 'Something has wrong with the server !',
                        severity: 'error'
                    })
                    setOpen(true);
                    return
                })
        } else {
            if (data?.isFlow === item?.isFlow) {
                delete data?.isFlow
            }
            if (data?.description === item?.description) {
                delete data?.description
            }
            if (isEmpty(data)) {
                onCancel(true)
                return
            }
            await putTestCases(data, item?.code)
                .then((res) => {
                    console.log(res);
                    onSubmit({
                        message: 'Update test case successfuly !',
                        severity: 'success'
                    })
                })
                .catch((error) => {
                    console.log(error);
                    setAlertProps({
                        message: 'Something has wrong with the server !',
                        severity: 'error'
                    })
                    setOpen(true);
                    return
                })

        }
        

    }

    return (
        <Fragment>
            <div>
            <Modal
                isOpen={visibleModal}
                toggle={() => onCancel(true)}
            >
                <ModalHeader toggle={() => onCancel(true)}>
                {isAddNew ? 'Add new' : 'Edit'} test case
                </ModalHeader>
                <ModalBody>
                    <Grid container spacing={3}>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <FormGroup>
                                <TextField
                                    type="text"
                                    name="description"
                                    fullWidth
                                    value={description || ''}
                                    label="Description"
                                    onChange={handleChange}
                                    helperText="Description for this test case"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                >
                                </TextField>
                            </FormGroup>
                            <FormGroup>
                                <TextField
                                    select
                                    name="isFlow"
                                    fullWidth
                                    value={isFlow}
                                    label="Is Flow ?"
                                    onChange={handleSelectSystems}
                                    helperText="Is this a flow testing ?"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                >
                                    {isFlowOptions.map((options) => (
                                        <MenuItem key={options.value} value={options.value}>
                                            {options.label}
                                        </MenuItem>
                                    ))}
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
                    Delete test case
                </ModalHeader>
                <ModalBody>
                   <span>Are you sure you want to delete this test case ?</span>
                   <br /> 
                   <span>This action also delete all test items and test results</span>
                </ModalBody>
                <ModalFooter>
                    <Button style={{ backgroundColor: 'rgb(178, 34, 34)' }} onClick={() => setShowDeleteModal(false)}>
                        NO
                    </Button>
                    <Button color="success" onClick={handleDeleteTestCase}>YES</Button>
                </ModalFooter>
            </Modal>
        )}
        </Fragment>
    )
}

export default AddOrEditCaseModal
import React, { useState, useEffect, Fragment } from 'react'

import { Button, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Grid } from '@mui/material'
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

import DefaultSnackBar from 'app/components/SnackBar/SanckBar';
import { getChatSystems, postTestSuites, putTestSuites, deleteTestSuites } from '../API-management/API-Actions'


const isEmpty = (prop) => {
    return (
        prop === null ||
        prop === undefined ||
        (prop.length === 0) ||
        (prop.constructor === Object && Object.keys(prop).length === 0)
    );
}

const AddOrEditSuitesModal = (props) => {
    const { visibleModal, onCancel, item, onSubmit } = props

    const isAddNew = isEmpty(item)
    const [open, setOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [alertProps, setAlertProps] = useState({})
    const [description, setDescription] = useState('')
    const [chatSystemsList, setChatSystemsList] = useState([])
    const [chatSystems, setChatSystems] = useState('')

    useEffect(() => {
        getChatSystems()
            .then((res) => {
                // console.log(res);
                if (res.status === 200) {
                    const chatSystemsList = res.data.map((item) => {
                        return { value: item.code, label: `${item.name} - ${item.type}` }
                    })
                    setChatSystemsList(chatSystemsList)
                    return () => {
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            })

        if (!isAddNew) {
            setDescription(item?.description)
            setChatSystems(item?.systems_code?.code)
            return () => {
            }
        }
        
    }, [isAddNew, item])


    const handleSelectSystems = event => {
        const { value } = event.target
        setChatSystems(value)
    }

    const handleChangeDescription = event => {
        const { value } = event.target
        setDescription(value)
    }

    const handleDeleteTestSuite = async () => {
        await deleteTestSuites(item?.code)
            .then((res) => {
                // console.log(res);
                onSubmit({
                    message: 'Delete test suite successfuly !',
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
        if (isEmpty(description) || isEmpty(chatSystems)) {
            setAlertProps({
                message: 'Please fill all required fields !',
                severity: 'error'
            })
            setOpen(true);
            return
        }
        const data = {
            systems_code: chatSystems,
            description: description
        }
        if (isAddNew) {
            await postTestSuites(data)
                .then((res) => {
                    // console.log(res);
                    onSubmit({
                        message: 'Added new test suite successfuly !',
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
            if (data?.systems_code === item?.systems_code?.code) {
                delete data?.systems_code
            }
            if (data?.description === item?.description) {
                delete data?.description
            }
            if (isEmpty(data)) {
                onCancel(true)
                return
            }

            await putTestSuites(data, item?.code)
                .then((res) => {
                    console.log(res);
                    onSubmit({
                        message: 'Update test suite successfuly !',
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
                    size='md'
                >
                    <ModalHeader toggle={() => onCancel(true)}>
                        {isAddNew ? 'Add new' : 'Edit'} test suite
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
                                        onChange={handleChangeDescription}
                                        helperText="Description for this test suite"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    >
                                    </TextField>
                                </FormGroup>
                                <FormGroup>
                                    <TextField
                                        select
                                        name="systems_code"
                                        fullWidth
                                        value={chatSystems}
                                        label="Chat Systems"
                                        onChange={handleSelectSystems}
                                        helperText="Please select chat systems"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    >
                                        {chatSystemsList.map((options) => (
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
                        Delete test suite
                    </ModalHeader>
                    <ModalBody>
                       <span>Are you sure you want to delete this test suite ?</span>
                       <br /> 
                       <span>This action also delete all test cases and test results</span>
                    </ModalBody>
                    <ModalFooter>
                        <Button style={{ backgroundColor: 'rgb(178, 34, 34)' }} onClick={() => setShowDeleteModal(false)}>
                            NO
                        </Button>
                        <Button color="success" onClick={handleDeleteTestSuite}>YES</Button>
                    </ModalFooter>
                </Modal>
            )}
    </Fragment >
    )
}

export default AddOrEditSuitesModal
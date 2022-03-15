import React, { Fragment, useEffect, useState, useCallback } from "react";
import DataTable from "react-data-table-component";
import { Icon, IconButton, Chip } from '@mui/material'
import AddCircleOutline from '@material-ui/icons/AddCircleOutline'
import KeyboardReturnRounded from '@material-ui/icons/KeyboardReturnRounded'
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Row, Col } from "reactstrap"
import { getTestCases, putTestCases, getTriggerTesting} from "../API-management/API-Actions"
import AddOrEditCaseModal from "./AddTestCaseModal"
import DefaultSnackBar from 'app/components/SnackBar/SanckBar';
import Tooltip from '@mui/material/Tooltip';
import { isEmpty } from "lodash";

const TestCasesTable = () => {
    const [data, setData] = useState()
    const [selectedItem, setSelectedItem] = useState()

    const navigate = useNavigate()
    const currentURL = useLocation()

    const [open, setOpen] = useState(false);

    const [alertProps, setAlertProps] = useState({})
    const [visibleModal, setVisibleModal] = useState(false)
    const suiteID = useParams()

    useEffect(() => {
        let param = suiteID
        if (param) {
            getTestCases(param)
            .then((res) => {
                console.log(res);
                if (res.status === 200) {
                    setData(res.data)
                }
            })
            .catch((error) => {
                console.log(error);
            })
        }
    }, [suiteID, alertProps, visibleModal])

    const handleDetail = (items = {}) => {
        const url = currentURL?.pathname
        navigate(`${url}/${items?.code}`)
    };

    const handleBack = () => {
        navigate(-1)
    }

    const handleItem = (item) => {
        setSelectedItem(item)
        setVisibleModal(true)
    }

    const handleStartTesting = async (row) => {
        if (!isEmpty(row?.test_items)) {
            await putTestCases({ status: 2 }, row?.code).then(() => {
                getTriggerTesting({code: row?.code}).then((res) => console.log(res))
                setAlertProps({
                    message: `Start testing case "${row?.description}"!`,
                    severity: 'success'
                })
                setOpen(true)
                return
            })
        } else {
            setAlertProps({
                message: `Test case "${row?.description}" does have any test items, please create at least one !`,
                severity: 'error'
            })
            setOpen(true)
        }
    }
    const handleStopTesting = async (row) => {
        await putTestCases({ status: 1 }, row?.code).then(() => {
            getTriggerTesting({code: row?.code})
            setAlertProps({
                message: `Stop testing case  "${row?.description}"!`,
                severity: 'error'
            })
            setOpen(true)
        })
    }

    const columns = [
        {
            name: 'ID',
            minWidth: "100px",
            maxWidth: '100px',
            sortable: true,
            cell: (row) => <span>{row?.code || "---"}</span>
        },
        {
            name: 'Case description',
            minWidth: "400px",
            maxWidth: '800px',
            cell: (row) => <span>{row?.description || "---"}</span>
        },
        {
            name: 'Case flow',
            minWidth: "100px",
            maxWidth: '800px',
            cell: (row) =>
                <span>
                    {(row?.isFlow) ? (
                        <Chip label="True" color="success" variant="outlined" />
                    ) : (
                        <Chip label="False" color="error" variant="outlined" />
                    )}
                </span>
        },
        {
            name: "Action",
            minWidth: "100px",
            maxWidth: '100px',
            cell: (row, id) => (
                <div className="column-action d-flex align-items-course">
                    {row?.status === 2 && (
                        <Fragment>
                            <Tooltip title="Pause" fontSize="large">
                                <Icon
                                    id={`pause${id}`}
                                    fontSize="large"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handleStopTesting(row)}
                                >pause_circle_outline
                                </Icon>
                            </Tooltip>
                        </Fragment>
                    )}
                    {row?.status === 1 && (
                        <Fragment>
                            <Tooltip title="Play" fontSize="large">
                                <Icon
                                    id={`play${id}`}
                                    fontSize="large"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handleStartTesting(row)}
                                >play_circle_outline
                                </Icon>
                            </Tooltip>
                        </Fragment>
                    )}
                    {row?.status === 1 && (
                        <Fragment>
                            <Tooltip title="Edit" fontSize="large">
                                <Icon
                                    fontSize="large"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handleItem(row)}
                                >assignment
                                </Icon>
                            </Tooltip>
                        </Fragment>
                    )}
                    {row?.status === 1 && (
                        <Fragment>
                            <Tooltip title="Test" fontSize="large">
                                <Icon
                                    fontSize="large"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handleDetail(row)}
                                >subdirectory_arrow_right
                                </Icon>
                            </Tooltip>
                        </Fragment>
                    )}
                </div>

            )
        }
    ];

    const handleAddTestCase = useCallback(() => {
        setVisibleModal(true)
    }, [])

    const CustomeHeader = ({
        handleAddTestCase,
        handleBack
    }) => {
        return (
            <div className="invoice-list-table-header w-100 py-2">
                <Col lg="0" className="d-flex align-items-course px-0 px-lg-1" style={{ float: 'right' }}>
                    <Tooltip title="Back">
                        <IconButton aria-label="keyboard_return" onClick={handleBack}>
                            <KeyboardReturnRounded />
                        </IconButton>
                    </Tooltip>
                </Col>
                <Row style={{ display: "flex", alignItems: "center" }}>
                    <Col lg="0" className="d-flex align-items-course px-0 px-lg-1">
                        <Tooltip title="Add new story">
                            <IconButton aria-label="add" onClick={handleAddTestCase}>
                                <AddCircleOutline />
                            </IconButton>
                        </Tooltip>
                    </Col>
                    <Col lg="5" className="d-flex align-items-course px-0 px-lg-1">
                        <p className="table-title">Test Cases Board</p>
                    </Col>

                </Row>
            </div>
        )
    }

    return (
        <Fragment>
            <DataTable
                columns={columns}
                subHeader={true}
                data={data}
                pagination
                subHeaderComponent={
                    <CustomeHeader
                        handleAddTestCase={handleAddTestCase}
                        handleBack={handleBack}
                    />
                }
            />
            {visibleModal && (
                <AddOrEditCaseModal
                    visibleModal={visibleModal}
                    suite_code={suiteID.code}
                    item={selectedItem}
                    onCancel={(isRefeshData) => {
                        if (isRefeshData) {
                            console.log("REFRESH");
                            setSelectedItem()
                        }
                        setVisibleModal(false)
                    }}
                    onSubmit={(executionCommand) => {
                        if (executionCommand) {
                            setAlertProps(executionCommand)
                            setOpen(true)
                            setVisibleModal(false)
                            setSelectedItem()
                        }
                    }}

                />)}

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

        </Fragment>
    );
}
export default TestCasesTable

import React, { Fragment, useEffect, useState, useCallback } from "react";
import DataTable from "react-data-table-component";
import { Icon, IconButton } from '@mui/material'
import AddCircleOutline from '@material-ui/icons/AddCircleOutline'
import AddOrEditSuitesModal from './AddTestSuitesModal'
// import KeyboardReturnRounded from '@material-ui/icons/KeyboardReturnRounded'
import { useNavigate } from "react-router-dom";
import { Row, Col } from "reactstrap"
import { getTestSuites } from "../API-management/API-Actions"
import DefaultSnackBar from 'app/components/SnackBar/SanckBar';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

const CustomWidthTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))({
    [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 1000,
        maxHeight: 300,
        fontSize: 13
    },
});

const SuitesTable = () => {
    const [data, setData] = useState()

    const [open, setOpen] = useState(false);
    const [visibleModal, setVisibleModal] = useState(false)

    const [alertProps, setAlertProps] = useState({})
    const [selectedItem, setSelectedItem] = useState()

    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true
        getTestSuites()
            .then((res) => {
                if (isMounted) {
                    // console.log(res);
                    if (res.status === 200) {
                        setData(res.data)
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            })
        return () => {
            isMounted = false
        }
    }, [alertProps])

    const handleDetail = (items = {}) => {
        navigate(`/suites/${items?.code}`)
    };

    const handleAddTestSuite = useCallback (() => {
        setVisibleModal(true)
    }, [])

    const handleItem = (item) => {
        setSelectedItem(item)
        setVisibleModal(true)
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
            name: 'Description',
            minWidth: "300px",
            maxWidth: '800px',
            cell: (row) => 
            <CustomWidthTooltip title={row?.description} style={{maxHeight: 50}}>
                <span>
                    {row?.description?.length > 80 ? `${row?.description?.slice(0, 85)}....` : row?.description || "---"}
                </span>
            </CustomWidthTooltip>
            
        },
        {
            name: 'Chat Systems Name',
            minWidth: "200px",
            maxWidth: '800px',
            cell: (row) => <span>{row?.systems_code?.name || "---"}</span>
        },
        {
            name: "Action",
            minWidth: "100px",
            maxWidth: '100px',
            cell: (row, id) => (
                <div className="column-action d-flex align-items-course">
                    <Tooltip title="Edit" fontSize="large">
                        <Icon
                            fontSize="large"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleItem(row)}
                        >assignment
                        </Icon>
                    </Tooltip>
                    {/* <Tooltip title="Delete" fontSize="large">
                        <Icon
                            fontSize="large"
                            style={{ cursor: "pointer", color: "#B22222" }}

                        >delete_forever
                        </Icon>
                    </Tooltip> */}
                    <Tooltip title="Test Cases" fontSize="large">
                        <Icon
                            fontSize="large"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleDetail(row)}
                        >subdirectory_arrow_right
                        </Icon>
                    </Tooltip>
                </div>

            )
        }
    ];

    const CustomeHeader = ({
        handleAddTestSuite,
        // handleBack
    }) => {
        return (
            <div className="invoice-list-table-header w-100 py-2">
                <Col lg="0" className="d-flex align-items-course px-0 px-lg-1" style={{float: 'right'}}>
                    <Tooltip title="Back">
                        <IconButton aria-label="keyboard_return">
                            {/* <KeyboardReturnRounded /> */}
                        </IconButton>
                    </Tooltip>
                </Col>
                <Row style={{ display: "flex", alignItems: "center" }}>
                    <Col lg="0" className="d-flex align-items-course px-0 px-lg-1">
                        <Tooltip title="Add new test suite">
                            <IconButton aria-label="add" onClick={handleAddTestSuite}>
                                <AddCircleOutline />
                            </IconButton>
                        </Tooltip>
                    </Col>
                    <Col lg="5" className="d-flex align-items-course px-0 px-lg-1">
                        <p className="table-title">Test Suites Board</p>
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
                        handleAddTestSuite={handleAddTestSuite}
                        // handleBack={handleBack}
                    />
                }
            />

            {visibleModal && (
                <AddOrEditSuitesModal
                    visibleModal={visibleModal}
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
export default SuitesTable

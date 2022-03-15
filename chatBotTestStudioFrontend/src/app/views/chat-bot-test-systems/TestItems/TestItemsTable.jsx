import React, { Fragment, useCallback, useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Icon, IconButton } from '@mui/material'
import AddCircleOutline from '@material-ui/icons/AddCircleOutline'  
import KeyboardReturnRounded from '@material-ui/icons/KeyboardReturnRounded'  
import AddOrEditItemsModal from "./AddItemsModal";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col } from "reactstrap"
import '../ChatBotTestSystems.scss'
import DefaultSnackBar from 'app/components/SnackBar/SanckBar';
import { getTestItems } from "../API-management/API-Actions"
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

const TestItemsTable = () => {
    const [visibleModal, setVisibleModal] = useState(false)
    const [open, setOpen] = useState(false)
    const [data, setData] = useState()
    const [alertProps, setAlertProps] = useState({})
    const [selectedItem, setSelectedItem] = useState()
    const caseID = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        let param = caseID
        getTestItems(param)
            .then((res) => {
                if (res.status === 200) {
                    // console.log(res.data)
                    setData(res.data)
                }
            })
            .catch((error) => {
                // console.log(error);
            })
    }, [visibleModal, caseID])

    // const handleDetail = () => {
    // };
    
    const rowShowing = (array) => {
        return (
            <div>
                {array.map((data) => (
                    <CustomWidthTooltip title={data?.question} style={{maxHeight: 50}} key={data?.question}>
                        <span key={data?.question}>
                            {data?.question?.length > 40 ? `- ${data?.question?.slice(0, 40)}....` : `- ${data?.question}`|| "---"}
                            <br/>
                        </span> 
                    </CustomWidthTooltip>
                ))}
            </div>
        )
        
    }
    
    const handleBack = () => {
        navigate(-1)
    }
    
    const columns = [
        {
            name: 'ID',
            minWidth: "100px",
            maxWidth: "100px",
            sortable: true,
            cell: (row) => <span>{row?.id || "---"}</span>
        },
        {
            name: 'Questions',
            minWidth: "200px",
            maxWidth: "500px",
            sortable: true,
            cell: (row) => rowShowing(row?.questions)
        },
        {
            name: 'Answer',
            minWidth: "400px",
            maxWidth: "800px",
            sortable: true,
            cell: (row) => 
            <CustomWidthTooltip title={row?.answer} style={{maxHeight: 50}}>
                <span >{row?.answer?.length > 50 ? `${row?.answer?.slice(0, 50)}...` : row?.answer|| "---"}</span>
            </CustomWidthTooltip>     
        },
        {
            name: "Action",
            minWidth: "100px",
            maxWidth: "100px",
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
                </div>
            )
        }
    ];
    
    const handleAddStory = useCallback(() => {
        setVisibleModal(true);
    }, []);

    const handleItem = (item) => {
        setVisibleModal(true)
        setSelectedItem(item)
    }
    
    const CustomeHeader = ({
        handleAddStory,
        handleBack
    }) => {
        return (
            <div className="invoice-list-table-header w-100 py-2">
                <Col lg="0" className="d-flex align-items-course px-0 px-lg-1" style={{float: 'right'}}>
                    <Tooltip title="Back">
                        <IconButton aria-label="keyboard_return" onClick={handleBack}>
                            <KeyboardReturnRounded />
                        </IconButton>
                    </Tooltip>
                </Col>
                <Row style={{ display: "flex", alignItems: "center" }}>
                    <Col lg="0" className="d-flex align-items-course px-0 px-lg-1">
                        <Tooltip title="Add new story">
                            <IconButton aria-label="add" onClick={handleAddStory}>
                                <AddCircleOutline />
                            </IconButton>
                        </Tooltip>
                    </Col>
                    <Col lg="5" className="d-flex align-items-course px-0 px-lg-1">
                        <p className="table-title">Test Items Board</p>
                    </Col>
                    
                </Row>
            </div>
        )
    }

    return (
        <Fragment>
            <DataTable
                columns={columns}
                data={data}
                pagination
                subHeader={true}
                subHeaderComponent={
                    <CustomeHeader
                        handleAddStory={handleAddStory}
                        handleBack={handleBack}
                    />
                }
            />
            {visibleModal && (
                <AddOrEditItemsModal 
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
                    caseID={caseID}
                />
            )}

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
export default TestItemsTable

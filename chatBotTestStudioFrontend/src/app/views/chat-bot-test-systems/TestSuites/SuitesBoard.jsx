import React, { Fragment } from 'react'
import { Breadcrumb, SimpleCard } from 'app/components'
import SuitesTable from "./SuitesTable"
import { styled } from '@mui/system'
import '../ChatBotTestSystems.scss'

const Container = styled('div')(({ theme }) => ({
    margin: '30px',
    [theme.breakpoints.down('sm')]: {
        margin: '16px',
    },
    '& .breadcrumb': {
        marginBottom: '30px',
        [theme.breakpoints.down('sm')]: {
            marginBottom: '16px',
        },
        
    },
    
}))

const TestSuites = () => {
    // const { palette } = useTheme()

    return (
        <Fragment>
            <Container>
                <div className="breadcrumb">
                    <Breadcrumb
                        routeSegments={[
                            { name: 'Test Suites' },
                        ]}
                    />
                </div>
                <SimpleCard>
                    <SuitesTable />
                </SimpleCard>
            </Container>

        </Fragment>
    )
}

export default TestSuites

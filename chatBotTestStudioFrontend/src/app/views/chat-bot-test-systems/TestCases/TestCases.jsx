import React, { Fragment } from 'react'
import { Breadcrumb, SimpleCard } from 'app/components'
import TestCaseTable from './TestCasesTable'
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

const TestCase = () => {
    // const { palette } = useTheme()

    return (
        <Fragment>
            <Container>
                <div className="breadcrumb">
                    <Breadcrumb
                        routeSegments={[
                            { name: 'Tools', path: '/tools/suites' },
                            { name: 'Test Suites', path: '/tools/suites' },
                            { name: 'Test Cases' },
                        ]}
                    />
                </div>
                <SimpleCard>
                    <TestCaseTable />
                </SimpleCard>
            </Container>

        </Fragment>
    )
}

export default TestCase

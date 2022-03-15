import React, { Fragment } from 'react'
import { Breadcrumb, SimpleCard } from 'app/components'
import TestItemsTable from './TestItemsTable'
import { styled } from '@mui/system'

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

const TestItems = () => {
    // const { palette } = useTheme()

    return (
        <Fragment>
            <Container>
                <div className="breadcrumb">
                    <Breadcrumb
                        routeSegments={[
                            { name: 'Tools', path: '/tools/suites' },
                            { name: 'Test Suites', path: '/tools/suites' },
                            { name: 'Test Cases', path: '/tools/suites' },
                            { name: 'Test Items' },
                        ]}
                    />
                </div>
                <SimpleCard>
                    <TestItemsTable />
                </SimpleCard>
            </Container>

        </Fragment>
    )
}

export default TestItems

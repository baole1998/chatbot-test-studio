import React, { lazy } from 'react'
import Loadable from 'app/components/Loadable/Loadable'

// const ChatSystems = Loadable(lazy(() => import('./TestSystems/SystemsBoard')))
const SuitesBoard = Loadable(lazy(() => import('./TestSuites/SuitesBoard')))
const TestCases = Loadable(lazy(() => import('./TestCases/TestCases')))
const TestItems = Loadable(lazy(() => import('./TestItems/TestItems')))

const suitesBoardRoutes = [
    // {
    //     path: '/chatsystems',
    //     element: <ChatSystems />,
    // },
    {
        path: '/suites/',
        element: <SuitesBoard />,
    },
    {
        path: '/suites/:code',
        element: <TestCases />,
    },
    {
        path: '/suites/:code/:code',
        element: <TestItems />,
    }
]

export default suitesBoardRoutes

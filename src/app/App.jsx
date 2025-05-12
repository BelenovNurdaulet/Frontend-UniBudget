import {ThemeProvider, themeOzenDefault} from '@ozen-ui/kit/ThemeProvider'
import {SnackbarProvider} from '@ozen-ui/kit/Snackbar'
import Login from '../features/auth/Login'

import {Routes, Route} from 'react-router-dom'
import Header from '../components/Header/Header'
// import Register from '../features/registration/Register'
import styles from './App.module.css'
import ProtectedRoute from '../components/ProtectedRoute'
// import UserList from '../features/Users/UsersList'
import CreateIssuance from '../features/Issuance/CreateIssuance'
import Unauthorized from '../utils/Unauthorized'
import {ROLES, ALL_ROLES} from '../utils/roles'

import MyIssuancesTable from '../features/Issuance/MyIssuancesTable'
import IssuanceInfo from '../features/Issuance/IssuanceInfo/IssuanceInfo'
import RouteRedirect from '../components/RouteRedirect'
import {Suspense} from 'react'
import {PageLoader} from '../components/PageLoader/PageLoader'
import {ErrorBoundary} from 'react-error-boundary'
import {ErrorFallback} from '../components/ErrorFallback/ErrorFallback'
import {lazy} from 'react'
import PublicRoute from "../components/PublicRoute.jsx";
import Periods from "../features/period/Periods.jsx";
import PeriodInfo from "../features/period/periodInfo/PeriodInfo.jsx";
import CreatePeriod from "../features/period/CreatePeriod.jsx";
import EditPeriod from "../features/period/EditPeriod.jsx";
import AllRequestsTable from "../features/request/AllRequestsTable.jsx";
import UsersList from "../features/Users/UsersList.jsx";
import RequestInfo from "../features/request/RequestInfo/RequestInfo.jsx";
import CreateRequest from "../features/request/CreateRequest.jsx";


const UserProfile = lazy(() => import('../features/UserProfle/UserProfile'))
const UserList = lazy(() => import('../features/Users/UsersList'))
const AllIssuancesTable = lazy(() => import('../features/Issuance/AllIssuancesTable'))
const Register = lazy(() => import('../features/registration/Register'))

function App() {
    return (
        <ThemeProvider theme={themeOzenDefault}>
            <SnackbarProvider
                maxMessages={3}
                lifetime={4000}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            >
                <div className={styles.appContainer}>
                    <Header/>

                    <main className={styles.mainContent}>
                        <ErrorBoundary fallbackRender={ErrorFallback}>
                            <Suspense fallback={<PageLoader size="l"/>}>
                                <Routes>
                                    {/* authenticated users */}
                                    <Route element={<ProtectedRoute allowedRoles={ALL_ROLES}/>}>
                                        <Route path="/manage" element={<UserProfile/>}/>
                                        <Route path="/my-issuances" element={<MyIssuancesTable/>}/>
                                        <Route path="/my-issuances/completed" element={<MyIssuancesTable/>}/>
                                        <Route path="/issuance/:id" element={<IssuanceInfo/>}/>
                                    </Route>

                                    {/* Public */}
                                    <Route element={<PublicRoute/>}>
                                        <Route path="/login" element={<Login/>}/>
                                    </Route>
                                    <Route path="/" element={<RouteRedirect/>}/>
                                    <Route path="/signup" element={<Register/>}/>
                                    <Route path="/unauthorized" element={<Unauthorized/>}/>
                                    <Route path="/request/:id" element={<RequestInfo />}/>

                                    {/* Admin-only */}
                                    <Route element={<ProtectedRoute allowedRoles={[ROLES.Administration]}/>}>
                                        <Route path="/periods" element={<Periods/>}/>
                                        <Route path="/users" element={<UserList/>}/>
                                        <Route path="/period/:id" element={<PeriodInfo />} />
                                        <Route path="/period/:id/edit" element={<EditPeriod />} />
<Route path="/create-period" element={<CreatePeriod />}/>
                                        <Route path="/issuances" element={<AllRequestsTable/>}/>
                                        <Route path="/issuances/completed" element={<AllIssuancesTable/>}/>

                                    </Route>

                                    <Route
                                        element={
                                            <ProtectedRoute
                                                allowedRoles={[
                                                    ROLES.Administration,
                                                    ROLES.Executor,
                                                    ROLES.Finance,
                                                    ROLES.RequestCreator,
                                                ]}
                                            />
                                        }
                                    >
                                        <Route path="/create" element={<CreateRequest/>}/>
                                    </Route>
                                </Routes>
                            </Suspense>
                        </ErrorBoundary>
                    </main>
                </div>
            </SnackbarProvider>
        </ThemeProvider>
    )
}

export default App

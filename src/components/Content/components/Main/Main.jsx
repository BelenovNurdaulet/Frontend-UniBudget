// src/components/Layout/Main/Main.jsx
import { useMemo } from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import { useBreakpoints } from '@ozen-ui/kit/useBreakpoints';

import { navigation } from '../../../../helpers';
import { ALL_ROLES } from '../../../../utils/rolesConfig.jsx';

import s from './Main.module.css';
import { Footer } from '../Footer/Footer.jsx';
import { Page } from '../Page/Page.jsx';
import { useApp } from '../../../../app/AppContext.jsx';

import RouteRedirect from '../../../RouteRedirect.jsx';
import PublicRoute from '../../../PublicRoute.jsx';
import ProtectedRoute from '../../../ProtectedRoute.jsx';
import {LoginPage} from "../../../../features/LoginPage/LoginPage.jsx";
import ErrorPage from "../../../../utils/ErrorPage.jsx";


export const Main = () => {
    const { m } = useBreakpoints();
    const isMobile = !m;
    const { setScrollContainerEl } = useApp();

    const routes = useMemo(() => Object.entries(navigation.routes), []);

    return (
        <main ref={el => setScrollContainerEl?.(el)} className={s.main}>
            <Routes>
                {/** 1. Корневой редирект по роли */}
                <Route index element={<RouteRedirect />} />

                {/** 2. Страница логина – публичная */}
                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<LoginPage />} />
                </Route>

                {/** 3. Неавторизованные (403) */}
                <Route path="/unauthorized" element={<ErrorPage code={403} />} />

                {/** 4. Все остальные – защищённые */}
                {routes.map(([key, props]) => {
                    // пропускаем уже обработанные маршруты
                    if (
                        props.path === '/' ||
                        props.path === '/login' ||
                        props.path === '/unauthorized'
                    ) {
                        return null;
                    }

                    return (
                        <Route
                            key={key}
                            element={
                                <ProtectedRoute allowedRoles={props.roles ?? ALL_ROLES} />
                            }
                        >
                            <Route path={props.path} element={<Page {...props} />} />
                        </Route>
                    );
                })}
                <Route path="*" element={<ErrorPage code={404} />} />
            </Routes>

            {!isMobile && <Footer />}
        </main>
    );
};

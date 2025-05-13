import { useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';

import { useBreakpoints } from '@ozen-ui/kit/useBreakpoints';

import { navigation } from '../../../../helpers';


import s from './Main.module.css';
import {Footer} from "../Footer/Footer.jsx";
import {Page} from "../Page/Page.jsx";
import {useApp} from "../../../../app/AppContext.jsx";

export const Main = () => {
    const { m } = useBreakpoints();
    const isMobile = !m;
    const { setScrollContainerEl } = useApp();

    const routes = useMemo(() => {
        return Object.entries(navigation.routes);
    }, []);

    return (
        <main ref={(el) => setScrollContainerEl?.(el)} className={s.main}>
            <Routes>
                {routes.map(([key, props]) =>
                    props.path ? (
                        <Route
                            key={key}
                            path={props.path}
                            element={<Page {...props} />}
                        />
                    ) : null
                )}
            </Routes>
            {!isMobile && <Footer />}
        </main>
    );
};

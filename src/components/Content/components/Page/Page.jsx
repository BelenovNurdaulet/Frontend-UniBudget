import { useMemo } from 'react';

import { BreadcrumbItem, Breadcrumbs } from '@ozen-ui/kit/Breadcrumbs';
import { Container } from '@ozen-ui/kit/Container';
import { spacing } from '@ozen-ui/kit/MixSpacing';

import { useBreakpoints } from '@ozen-ui/kit/useBreakpoints';
import clsx from 'clsx';
import { parse } from 'regexparam';
import { Link, useLocation, useParams } from 'react-router-dom';

import { navigation } from '../../../../helpers';
import s from './Page.module.css';

export const Page = ({ component: Component, containerProps }) => {
    const params = useParams();
    const location = useLocation();

    const { m } = useBreakpoints();
    const isMobile = !m;

    const locations = useMemo(() => {
        return location.pathname
            .split('/')
            .filter(Boolean)
            .reduce((acc, item, index) => {
                const prev = acc[index - 1];
                const next = prev ? `${prev}/${item}` : `/${item}`;
                return [...acc, next];
            }, []);
    }, [location.pathname]);

    const breadcrumbs = useMemo(() => {
        return locations.reduce((acc, path) => {
            const route = Object.values(navigation.routes).find(
                ({ path: routePath }) => routePath && parse(routePath).pattern.test(path)
            );
            return route ? [...acc, route] : acc;
        }, []);
    }, [locations]);

    const root = breadcrumbs[0];

    const showBreadcrumbs = !root?.disableBreadcrumbs && !isMobile;

    if (!Component) return null;

    return (
        <Container
            position="center"
            maxWidth="fullWidth"
            gutters={{ xs: 'm', m: '2xl' }}
            className={clsx(s.container, spacing({ py: isMobile ? 'm' : '2xl' }))}
            {...containerProps}
        >
            {showBreadcrumbs && (
                <Breadcrumbs>
                    {breadcrumbs.map(({ title, link }, index) => (
                        <BreadcrumbItem
                            key={index}
                            disabled={index === breadcrumbs.length - 1}
                            as={Link}
                            to={link || ''}
                        >
                            {title}
                        </BreadcrumbItem>
                    ))}
                </Breadcrumbs>
            )}

            <Component {...params} />
        </Container>
    );
};

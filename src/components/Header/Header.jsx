import {useDispatch, useSelector} from 'react-redux'
import {logout, selectIsAuthenticated, selectUser} from '../../features/auth/authSlice'
import { Stack } from '@ozen-ui/kit/Stack'
import { ExitIcon } from '@ozen-ui/icons'
import logoHorizontal from '../../assets/img/logo_bereke_new-Cxm-qsBd.svg'
import styles from './Header.module.css'
import { HEADER_LINKS } from './HeaderLinks'
import { Card } from '@ozen-ui/kit/Card'
import { Paper } from '@ozen-ui/kit/Paper'
import {Link as RouterLink} from "react-router-dom";
import {Link} from "@ozen-ui/kit/Link";
import {useNavigate} from "react-router";
import {useSnackbar} from "@ozen-ui/kit/Snackbar";



const Header = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { pushMessage } = useSnackbar()

    const user = useSelector(selectUser)
    const isLogin = useSelector(selectIsAuthenticated)


    const userRole = user?.userRole
    const allowedLinks = HEADER_LINKS.filter((link) => link.roles.includes(userRole))
    const handleLogout = () => {
        dispatch(logout())
        pushMessage({
            title: 'Выход выполнен',
            description: 'Вы успешно вышли из системы.',
            status: 'success',
        })
        navigate('/login')                             // переходим на страницу логина
    }
    return (
        <Card size="s" borderWidth="s" shadow="m" as={Paper} className={styles.container}>
            <Stack
                className={styles.stack}
                gap="l"
                direction="row"
                align="center"
                justify={isLogin ? 'spaceBetween' : 'flex-start'}
            >
                <div>
                    <RouterLink to='/'>
                        <img src={logoHorizontal} />
                    </RouterLink>
                </div>
                {isLogin ? (
                    <Stack className={styles.list} direction="row" gap="m">
                        {allowedLinks.map((link) => (
                            <RouterLink
                                key={link.href}
                                className={styles.link}
                                to={link.href}
                            >
                                {link.text}
                            </RouterLink>
                            /*
                        <Link
                        key={link.href}
                        className={styles.link}
                        as="a"
                        display="inlineBlock"
                        variant="text-m"
                        href={link.href}
                        >
                      {link.text}
                        </Link>

          */
                        ))}
                        <Link
                            as="a"
                            display="inlineBlock"
                            variant="text-m"
                            align="center"
                            onClick={handleLogout}
                            className={styles.logout}
                        >
                            <ExitIcon size="m" color="var(--color-content-error)" />
                            Выход
                        </Link>
                    </Stack>
                ) : null}
            </Stack>
        </Card>
    )
}

export default Header

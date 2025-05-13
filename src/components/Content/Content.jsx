import { Paper } from '@ozen-ui/kit/Paper';

import s from './Content.module.css';
import {Main} from "./components/Main/Main.jsx";

export const Content = () => {
    return (
        <Paper className={s.content} radius="l">
            <Main />
        </Paper>
    );
};

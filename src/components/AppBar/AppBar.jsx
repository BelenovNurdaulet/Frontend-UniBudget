import { Drawer } from '@ozen-ui/kit/Drawer';
import { Paper } from '@ozen-ui/kit/Paper';
import { Stack } from '@ozen-ui/kit/Stack';
import { useBreakpoints } from '@ozen-ui/kit/useBreakpoints';

import s from './AppBar.module.css';

import { useAppBar } from './useAppBar';
import {AppBarSwitcher} from "./components/AppBarSwitcher/AppBarSwitcher.jsx";
import {ROLES} from "../../utils/roles.jsx";

export const AppBar = ({ children }) => {
  const [openState, expandState] = useAppBar();
  const [expand, { on: expandOn, off: expandOff }] = expandState;
  const [open, { off: openOff }] = openState;
  const { m } = useBreakpoints();
  const isMobile = !m;

  return (
      <>
        {!isMobile && (
            <Paper background="accent" className="AppBar">
              <Stack
                  className="Toolbar"
                  data-expand={expand}
                  direction="column"
                  gap="0"
              >
                {children}
              </Stack>
              <AppBarSwitcher onOpen={expandOn} onClose={expandOff} open={expand} />
            </Paper>
        )}
        {isMobile && (
            <Drawer
                placement="left"
                variant="little"
                open={open}
                className="AppBarMobile"
                onClose={openOff}
                windowProps={{
                  className: s.window,
                  background: 'accent',
                }}
                hideCloseButton
                keepMounted
            >
              <Stack className="Toolbar" data-expand direction="column">
                {children}
              </Stack>
            </Drawer>
        )}
      </>
  );
};

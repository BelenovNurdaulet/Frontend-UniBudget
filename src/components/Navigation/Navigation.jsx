import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { useBoolean } from '@ozen-ui/kit/useBoolean';
import { useBreakpoints } from '@ozen-ui/kit/useBreakpoints';
import { Tooltip } from '@ozen-ui/kit/Tooltip';
import { Collapse } from '@ozen-ui/kit/Collapse';
import { ListItemButton, ListItemIcon, ListItemText } from '@ozen-ui/kit/List';
import { ArrowDownFilledIcon, ArrowUpFilledIcon, DotIcon } from '@ozen-ui/icons';

import { navigation } from '../../helpers.jsx';
import { selectUser } from '../../features/auth/authSlice.js';
import { ROLES } from '../../utils/rolesConfig.jsx';
import { isSelectedItem } from './utils';
import { AccentList } from "../AccentList/AccentList.jsx";
import { useAppBar } from "../AppBar/useAppBar.js";
import {Badge} from "@ozen-ui/kit/Badge";


const roleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

const NavigationItem = ({ onClick,name, userRole }) => {
  const { m } = useBreakpoints();
  const isMobile = !m;
  const [appBarState, appBarActions] = useAppBar();
  const { expand } = appBarState;
  const { off: close } = appBarActions;
  const [expanded, { toggle }] = useBoolean(false);
  const location = useLocation();

  const cfg = navigation.routes[name];
  if (cfg.roles && !cfg.roles.includes(userRole)) return null;

  const Icon = cfg.icon;
  const title = cfg.title;
  const link = cfg.link;
  const subItems = cfg.subItems || [];
  const hasSub = subItems.length > 0;

  const handleClick = () => {
    if (hasSub) {
      toggle();
    } else {
      if (close) close();
    }
  };

  return (
      <>
        <Tooltip
            label={title}
            offset={[0, 20]}
            placement="right"
            disabled={expand || isMobile}
        >
          <ListItemButton
              as={link ? Link : 'div'}
              to={link || '/'}
              selected={isSelectedItem(link, location.pathname)}
              onClick={onClick || handleClick}
          >
            {Icon && (
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
            )}
            <ListItemText primary={title}
                          primaryTypographyProps={{ noWrap: true, color: 'accentPrimary' }}
            />
            {cfg.count && (
                <ListItemIcon>
                  <Badge content={cfg.count} color="errorDark" />
                </ListItemIcon>
            )}
            {hasSub && (
                <ListItemIcon>
                  {expanded ? <ArrowUpFilledIcon /> : <ArrowDownFilledIcon />}
                </ListItemIcon>
            )}
          </ListItemButton>
        </Tooltip>

        {hasSub && (
            <Collapse expanded={expanded} unmountOnClosed>
              <AccentList>
                {subItems.map(sub => {
                  const subCfg = navigation.routes[sub];
                  if (subCfg.roles && !subCfg.roles.includes(userRole)) return null;
                  return (
                      <ListItemButton
                          as={Link}
                          to={link || ''}
                          onClick={close}
                          selected={isSelectedItem(link, location.pathname)}
                      >
                        <ListItemIcon><DotIcon /></ListItemIcon>
                        <ListItemText primary={subCfg.title} primaryTypographyProps={{ noWrap: true }} />
                      </ListItemButton>
                  );
                })}
              </AccentList>
            </Collapse>
        )}
      </>
  );
};

export const Navigation = () => {
  const user = useSelector(selectUser);
  const rawRole = user?.[roleClaim];
  const userRole = rawRole || ROLES.RequestCreator;
  return (

      <AccentList as="nav">
        {navigation.apps.map(app => (
            <NavigationItem key={app} name={app} userRole={userRole} />
        ))}
      </AccentList>
  );
};

import { useContext } from 'react';
import { AppBarContext } from './AppBarContext.jsx';

export const useAppBar = () => {
  return useContext(AppBarContext);
};

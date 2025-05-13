import { createContext } from 'react';
import { useBoolean } from '@ozen-ui/kit/useBoolean';

export const AppBarContext = createContext([
  [false, {}],
  [false, {}],
]);

export const AppBarProvider = ({ children }) => {
  const openState = useBoolean(false);
  const expandState = useBoolean(true);

  return (
      <AppBarContext.Provider value={[openState, expandState]}>
        {children}
      </AppBarContext.Provider>
  );
};

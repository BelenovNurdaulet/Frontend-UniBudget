import { ArrowLeftIcon, ArrowRightIcon } from '@ozen-ui/icons';
import { IconButton } from '@ozen-ui/kit/IconButtonNext';
import { useBoolean } from '@ozen-ui/kit/useBoolean';
import { useDebounceCallback } from '@ozen-ui/kit/useDebounceCallback';

import './AppBarSwitcher.css';

export const AppBarSwitcher = ({ open = false, onOpen, onClose }) => {
  const [toggleIsVisible, { on, off }] = useBoolean(false);

  const handleHover = (isEnter) => {
    if (isEnter) {
      on();
    } else {
      off();
    }
  };

  const [debounceHover] = useDebounceCallback(
      handleHover,
      toggleIsVisible ? 1000 : 50
  );

  return (
      <div
          className="AppBarSwitcher"
          onMouseEnter={() => debounceHover(true)}
          onMouseLeave={() => debounceHover(false)}
      >
        <IconButton
            className="AppBarSwitcher-Icon"
            variant="floating"
            size="2xs"
            onClick={open ? onClose : onOpen}
            icon={open ? ArrowLeftIcon : ArrowRightIcon}
            style={{
              visibility: toggleIsVisible ? 'visible' : 'hidden',
            }}
            compressed
        />
      </div>
  );
};

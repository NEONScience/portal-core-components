import React, { useState, useRef, useEffect } from 'react';

import Grid from '@material-ui/core/Grid';
import Button, { ButtonProps } from '@material-ui/core/Button';
import ButtonGroup, { ButtonGroupProps } from '@material-ui/core/ButtonGroup';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import Theme from '../Theme/Theme';
import { Nullable } from '../../types/core';
import { exists } from '../../util/typeUtil';

interface SplitButtonProps {
  name: string;
  options: string[];
  selectedOption: string;
  onClick: (selectedOption: string) => void;
  onChange: (selectedOption: string) => void;
  buttonGroupProps: Nullable<ButtonGroupProps>;
  buttonProps: Nullable<ButtonProps>;
  selectedOptionDisplayCallback: Nullable<(selectedOption: string) => string>;
}

const SplitButton: React.FC<SplitButtonProps> = (props: SplitButtonProps): JSX.Element => {
  const {
    name,
    options,
    selectedOption,
    selectedOptionDisplayCallback,
    onClick,
    onChange,
    buttonGroupProps,
    buttonProps,
  }: SplitButtonProps = props;
  const [open, setOpen] = useState(false);
  const [stateSelectedOption, setStateSelectedOption] = useState(selectedOption);
  const anchorRef = useRef<HTMLDivElement>(null);
  let appliedButtonGroupProps: ButtonGroupProps = {
    variant: 'outlined',
    color: 'primary',
  };
  if (exists(buttonGroupProps)) {
    appliedButtonGroupProps = buttonGroupProps as ButtonGroupProps;
  }
  let appliedButtonProps: ButtonProps = {
    color: 'primary',
    size: 'small',
  };
  if (exists(buttonProps)) {
    appliedButtonProps = buttonProps as ButtonProps;
  }

  useEffect(() => {
    if (selectedOption === stateSelectedOption) return;
    setStateSelectedOption(selectedOption);
  }, [selectedOption, stateSelectedOption]);

  const handleClick = (): void => {
    onClick(stateSelectedOption);
  };
  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number,
  ): void => {
    setStateSelectedOption(options[index]);
    onChange(options[index]);
    setOpen(false);
  };
  const handleToggle = (): void => {
    setOpen((prevOpen) => !prevOpen);
  };
  const handleClose = (event: React.MouseEvent<Document, MouseEvent>): void => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setOpen(false);
  };

  const renderSelectedOption = (): string => {
    if (exists(selectedOptionDisplayCallback)) {
      // eslint-disable-next-line max-len
      return (selectedOptionDisplayCallback as (selectedOption: string) => string)(stateSelectedOption);
    }
    return stateSelectedOption;
  };

  return (
    <Grid container direction="column" alignItems="center">
      <Grid item xs={12}>
        <ButtonGroup
          aria-label={`${name}-split-button`}
          {...appliedButtonGroupProps}
          ref={anchorRef}
        >
          <Button onClick={handleClick}>{renderSelectedOption()}</Button>
          <Button
            aria-controls={open ? `${name}-split-button-menu` : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-label={`${name}-split-button-select`}
            aria-haspopup="menu"
            {...appliedButtonProps}
            onClick={handleToggle}
          >
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
        <Popper
          transition
          anchorEl={anchorRef.current}
          open={open}
          role={undefined}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: (placement === 'bottom')
                  ? 'center top'
                  : 'center bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id={`${name}-split-button-menu`}>
                    {options.map((option: string, index: number): JSX.Element => ((
                      <MenuItem
                        key={option}
                        selected={option === stateSelectedOption}
                        onClick={(event) => handleMenuItemClick(event, index)}
                      >
                        {option}
                      </MenuItem>
                    )))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Grid>
    </Grid>
  );
};

const WrappedSplitButton = (Theme as any).getWrappedComponent(SplitButton);

export default WrappedSplitButton;

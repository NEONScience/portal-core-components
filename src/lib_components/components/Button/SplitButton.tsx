import React, { useState, useRef } from 'react';

import Grid from '@mui/material/Grid';
import Button, { ButtonProps } from '@mui/material/Button';
import ButtonGroup, { ButtonGroupProps } from '@mui/material/ButtonGroup';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import Theme from '../Theme/Theme';
import { makeStyles } from '../Theme/makeStyles';
import { NeonTheme } from '../Theme/types';
import { Nullable } from '../../types/core';
import { exists } from '../../util/typeUtil';

const useStyles = makeStyles()((theme: NeonTheme) => ({
  fullWidth: {
    width: '100%',
  },
  fitContent: {
    width: 'fit-content',
  },
  noChange: {
  },
}));

interface SplitButtonProps {
  name: string;
  options: string[];
  selectedOption: string;
  onClick: (selectedOption: string) => void;
  onChange: (selectedOption: string) => void;
  buttonGroupProps: Nullable<ButtonGroupProps>;
  buttonMenuProps: Nullable<ButtonProps>;
  buttonProps: Nullable<ButtonProps>;
  selectedOptionDisplayCallback: Nullable<(selectedOption: string) => string>;
  isFullWidth: Nullable<boolean>;
  styleOverrides: Nullable<React.CSSProperties>;
}

const SplitButton: React.FC<SplitButtonProps> = (props: SplitButtonProps): React.JSX.Element => {
  const {
    name,
    options,
    selectedOption,
    selectedOptionDisplayCallback,
    onClick,
    onChange,
    buttonGroupProps,
    buttonMenuProps,
    buttonProps,
    isFullWidth,
    styleOverrides,
  }: SplitButtonProps = props;

  const { classes } = useStyles();
  const [open, setOpen] = useState(false);
  const [stateSelectedOption, setStateSelectedOption] = useState(selectedOption);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [anchorRefEl, setAnchorRefEl] = useState<HTMLElement | null>(null);
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
  let appliedButtonMenuProps: ButtonProps = {
    color: 'primary',
    size: 'small',
  };
  if (exists(buttonMenuProps)) {
    appliedButtonMenuProps = buttonMenuProps as ButtonProps;
  }

  if (selectedOption !== stateSelectedOption) {
    setStateSelectedOption(selectedOption);
  }

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
    setAnchorRefEl(anchorRef.current);
    setOpen((prevOpen) => !prevOpen);
  };
  const handleClose = (event: MouseEvent | TouchEvent): void => {
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

  const widthStyle = exists(isFullWidth) ? classes.fullWidth : classes.noChange;
  const iconWidthStyle = exists(isFullWidth) ? classes.fitContent : classes.noChange;
  const customStyles = exists(styleOverrides) ? styleOverrides : {};

  return (
    <Grid
      container
      className={widthStyle}
      style={{
        alignItems: 'center',
      }}
    >
      <Grid size={{ xs: 12 }} className={widthStyle}>
        <ButtonGroup
          aria-label={`${name}-split-button`}
          {...appliedButtonGroupProps}
          ref={anchorRef}
          className={widthStyle}
        >
          <Button
            {...appliedButtonProps}
            onClick={handleClick}
            className={widthStyle}
          >
            {renderSelectedOption()}
          </Button>
          <Button
            aria-controls={open ? `${name}-split-button-menu` : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-label={`${name}-split-button-select`}
            aria-haspopup="menu"
            {...appliedButtonMenuProps}
            onClick={handleToggle}
            className={iconWidthStyle}
            style={{ ...customStyles }}
          >
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
        <Popper
          transition
          anchorEl={anchorRefEl}
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
                    {options.map((option: string, index: number): React.JSX.Element => ((
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

import React from 'react';
import { ButtonProps } from '@mui/material/Button';
import { ButtonGroupProps } from '@mui/material/ButtonGroup';
import { Nullable } from '../../types/core';
type SelectedOptionRenderType = (selectedOption: string) => string;
interface SplitButtonProps {
    name: string;
    options: string[];
    selectedOption: string;
    onClick: (selectedOption: string) => void;
    onChange: (selectedOption: string) => void;
    buttonGroupProps?: Nullable<ButtonGroupProps>;
    buttonMenuProps?: Nullable<ButtonProps>;
    buttonProps?: Nullable<ButtonProps>;
    selectedOptionDisplayCallback?: Nullable<SelectedOptionRenderType>;
    isFullWidth?: Nullable<boolean>;
    styleOverrides?: Nullable<React.CSSProperties>;
}
declare const SplitButton: React.FC<SplitButtonProps>;
export default SplitButton;

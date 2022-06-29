import styled from "styled-components";
import React from 'react';

interface IButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    tabIndex?: number;
}

const ButtonStyled = styled.button`
    border: 0;
    background: none;
    padding: 8px;
    width: 100%;
    appearence: none;
    &:hover {
        cursor: pointer;
    }
`
export function Button(props: IButtonProps) {
    const {onClick, children, tabIndex} = props;
    return  (
        <ButtonStyled
            onClick={onClick}
            tabIndex={tabIndex}
        >
            {children}
        </ButtonStyled>
    )
}

const BigButtonStyled = styled(ButtonStyled)`
    padding: 12px;
    font-size: 22px;
    border-radius: 6px;
`;

export function BigButton(props: IButtonProps) {
    return  (
        <BigButtonStyled {...props} />
    )
}
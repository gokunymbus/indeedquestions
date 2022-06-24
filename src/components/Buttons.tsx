import styled from "styled-components";
import React from 'react';

interface IButtonProps {
    onClick: () => void;
    children: React.ReactNode;
}

const ButtonStyled = styled.button`
    border: 0;
    background: none;
    padding: 8px;
    width: 100%;
`
export function Button(props: IButtonProps) {
    const {onClick, children} = props;
    return  (
        <ButtonStyled
            onClick={onClick}
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
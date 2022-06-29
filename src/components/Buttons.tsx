import styled from 'styled-components';
import React, { ReactNode } from 'react';
import {Link} from 'react-router-dom'

interface IButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    tabIndex?: number;
}

const ButtonStyled = styled.button`
    border: 0;
    background: none;
    padding: 8px;
    appearence: none;
    font-weight: 700;
    font-family: ${props => props.theme.mainFont};
    word-break: break-all;
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

const PrimaryButtonStyled = styled(ButtonStyled)`
    color: ${props => props.theme.whiteColor };
    padding: 10px 40px;
    border-radius: 6px;
    background: linear-gradient(-45deg, ${
        p => p.theme.quaternaryColor 
    }, ${
        p => p.theme.tertiaryColor
    });
`;

export function PrimaryButton (props: IButtonProps) {
    return  (
        <PrimaryButtonStyled {...props} />
    )
}

const SecondaryButtonStyled = styled(PrimaryButtonStyled)`
    background: none;
    background-color: ${
        p => p.theme.grayColor
    };
`;

export function SecondaryButton (props: IButtonProps) {
    return  (
        <SecondaryButtonStyled {...props} />
    )
}

const LinkStyled = styled(Link)`
    display: block;
    color: ${props => props.theme.whiteColor };
    padding: 10px 40px;
    background-color: ${
        p => p.theme.grayColor
    };
    text-decoration: none;
    padding: 12px;
    font-size: 12px;
    border-radius: 6px;
    font-family: ${props => props.theme.mainFont};
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
`;

export function PrimaryLink(props: {to: string; children: ReactNode}) {
    return  (
        <LinkStyled {...props}>
            {props.children}
        </LinkStyled>
    )
}

const LinkStyledSecondary = styled(PrimaryLink)`
  background: linear-gradient(-45deg, ${
      p => p.theme.quaternaryColor 
  }, ${
      p => p.theme.tertiaryColor
  });
`;

export function SecondaryLink (props: {to: string; children: ReactNode}) {
    return  (
        <LinkStyledSecondary {...props}>
            {props.children}
        </LinkStyledSecondary>
    )
}

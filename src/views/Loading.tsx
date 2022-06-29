import { ReactNode } from 'react';
import React from 'react';
import styled from 'styled-components';

const LoadingContainerStyled = styled.div`
    width: 100vw;
    height: 100vh;
    background-color: ${props => props.theme.quinaryColor};
    display: flex;
    align-items: center;
    justify-content: center;
`;

const LoadingTitleStyled = styled.h1`
    font-family: ${props => props.theme.titleFont };
    font-size: 60px;
    line-height: 60px;
    color: ${props => props.theme.tertiaryColor };
    text-align: center;
`;

export default class Loading extends React.Component<{}, {}> {
    constructor(props: any) {
        super(props);
    }

    render(): ReactNode {
        return  (
            <LoadingContainerStyled>
                <LoadingTitleStyled>Loading...</LoadingTitleStyled>
            </LoadingContainerStyled>
        )
    }
}
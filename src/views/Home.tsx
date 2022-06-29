import { ReactNode } from 'react';
import { SecondaryLink } from '../components/Buttons';
import React from 'react';
import styled from 'styled-components';
import { Pepper } from './Pepper';
import { devices } from './Breakpoints';
import  {fadeAndSlideDown,  fallIn} from './Animations';
import ZIndexLayers from './ZIndexLayers';
import PepperRain from './PepperRain';

interface IHomeProps {
    language: any;
    linkTo: string;
    peppers: number;
}

const HomeContainerStyled = styled.div`
    width: 100vw;
    height: 100vh;
    background-color: ${props => props.theme.quinaryColor};
`;

const HomeInnerContainerStyled = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 18px;
    width: 100%;
    height: 100%;
    z-index: ${ZIndexLayers.middle};
    position: relative;
    box-sizing: border-box;
`;

const HomeMainTitleStyled = styled.h1`
    font-size: 34px;
    line-height: 34px;
    font-family: ${props => props.theme.titleFont };
    color: ${props => props.theme.secondaryColor };
    animation: ${fadeAndSlideDown} 0.4s ease-out;
    text-align: center;

    @media ${devices.tablet} {
        font-size: 60px;
        line-height: 60px;
    }

    @media ${devices.laptopL} {
        font-size: 70px;
        line-height: 70px;
    }

    @media ${devices.desktop} {
        font-size: 80px;
        line-height: 80px;
    }
`;

const BigPepperContainer = styled.div`
    animation: ${fallIn} 4s ease-in-out;
`;

const HomeLinkStyled = styled(SecondaryLink)`
    font-size: 18px;
    width: auto;
    padding: 16px 30px;
`;

const numberOFPeppers = 50;

export default class Home extends React.Component<IHomeProps, {}> {
    constructor(props: IHomeProps) {
        super(props);
    }

    render(): ReactNode {
        const { language, linkTo } = this.props;
        const { startButton, welcome } = language;
        return  (
            <HomeContainerStyled>
                <HomeInnerContainerStyled>
                    <BigPepperContainer>
                        <Pepper pixelWidth={200} />
                    </BigPepperContainer>
                    <HomeMainTitleStyled>{welcome}</HomeMainTitleStyled>
                    <HomeLinkStyled to={linkTo}>
                        {startButton}
                    </HomeLinkStyled>
                </HomeInnerContainerStyled>
               <PepperRain peppers={numberOFPeppers} />
            </HomeContainerStyled>
        )
    }
}
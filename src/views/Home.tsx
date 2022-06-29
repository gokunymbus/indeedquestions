import { ReactNode } from 'react';
import { BigButton } from '../components/Buttons';
import React from 'react';
import { Link } from "react-router-dom";
import styled from 'styled-components';
import { Pepper } from './Pepper';
import { devices } from './Breakpoints';
import  {fadeInLong, lightFalling, fallIn} from './Animations';
import randomMinMax, {randomMinMaxFloat} from '../library/randomMinMax';
import ZIndexLayers from './ZIndexLayers';

interface IHomeProps {
    language: any;
    linkTo: string;
    peppers: number;
}

const HomeStyled = styled.div`
    width: 100%;
    height: 100%;
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
`;

const HomeMainTitleStyled = styled.h1`
    font-size: 34px;
    line-height: 34px;
    font-family: ${props => props.theme.titleFont };
    color: ${props => props.theme.secondaryColor };
    animation: ${fadeInLong} 0.4s ease-out;

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

const HomeButtonStyled = styled(BigButton)`
    color: ${props => props.theme.whiteColor };
    padding: 10px 40px;
    background: linear-gradient(-45deg, ${
        p => p.theme.quaternaryColor 
    }, ${
        p => p.theme.tertiaryColor
    });
`;

const BigPepperContainer = styled.div`
    animation: ${fallIn} 4s ease-in-out;
`;

const PeppersRainContainer = styled.div`
    width: 100vw;
    height: 100vh;
    position: absolute;
    left: 0;
    top: 0;
    z-index: ${ZIndexLayers.bottom};
    pointer-events: none;
`;

const PepperRainContainer = styled.div<{
    left: number;
    delay: string;
}>`
    left: ${props => props.left}%;
    transform: translateY(-100%);
    position: absolute;
    animation: ${lightFalling} 6s ease-in-out -2s infinite;
    animation-delay: ${props => props.delay}
`;

export default class Home extends React.Component<IHomeProps, {}> {
    private peppers: Array<any>;
    constructor(props: IHomeProps) {
        super(props);
        this.peppers = Array.from(Array(props.peppers).keys());
    }

    render(): ReactNode {
        const { language, linkTo } = this.props;
        const { startButton, welcome } = language;
        return  (
            <HomeStyled>
                <HomeInnerContainerStyled>
                    <BigPepperContainer>
                        <Pepper pixelWidth={200} />
                    </BigPepperContainer>
                    <HomeMainTitleStyled>{welcome}</HomeMainTitleStyled>
                    <Link to={linkTo}>
                        <HomeButtonStyled onClick={() => {}} tabIndex={-1}>{startButton}</HomeButtonStyled>
                    </Link>
                </HomeInnerContainerStyled>
                <PeppersRainContainer>
                    {this.peppers.map(() => {
                        return (
                            <PepperRainContainer
                                left={randomMinMax(1, 100)}
                                delay={`${randomMinMaxFloat(1, 10)}s`}
                            >
                                <Pepper pixelWidth={40} />
                            </PepperRainContainer>
                        )
                    })} 
                </PeppersRainContainer>
            </HomeStyled>
        )
    }
}
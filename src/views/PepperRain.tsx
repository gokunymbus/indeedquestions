import randomMinMax, {randomMinMaxFloat} from '../library/randomMinMax';
import { lightFalling } from './Animations';
import styled from 'styled-components';
import { Pepper } from './Pepper';
import ZIndexLayers from './ZIndexLayers';

const PeppersRainContainer = styled.div`
    width: 100vw;
    height: 100vh;
    position: absolute;
    left: 0;
    top: 0;
    z-index: ${ZIndexLayers.bottom};
    pointer-events: none;
    overflow: hidden;
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

export default function PepperRain(props: {peppers: number}) {
    const peppers = Array.from(Array(props.peppers).keys());
    return (
        <PeppersRainContainer>
            {peppers.map((value, index) => {
                return (
                    <PepperRainContainer
                        left={randomMinMax(1, 100)}
                        delay={`${randomMinMaxFloat(1, 10)}s`}
                        key={index}
                        aria-hidden={true}
                    >
                        <Pepper pixelWidth={40} />
                    </PepperRainContainer>
                )
            })} 
        </PeppersRainContainer>
    )
};
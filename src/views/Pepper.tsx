import styled from 'styled-components';

const SVG = styled.svg.attrs({ 
    version: '1.0', 
    xmlns: 'http://www.w3.org/2000/svg',
})``

const PepperSVGSyled = styled(SVG)`
    width: ${props => props.width};
`;

const PepperPathStyled = styled.path`
`;

const PepperF = styled(PepperPathStyled)`
    fill: #e35b5d;
`;

const PepperE = styled(PepperPathStyled)`
    opacity:.14;
`;

export const Pepper = (props: {pixelWidth: number;}) => (
    <PepperSVGSyled viewBox='0 0 488.81 115.12' width={props.pixelWidth}>
        <g id='b'>
            <g id='c'>
                <PepperF className='f' d='M60.73,40.52s63.6,20.37,108.2,14.21,98.29-10.67,114.91-18.42S342.62,8.23,361.92,3.85s30.7,9.65,30.7,9.65c0,0,15.79,26.32,21.05,33.33s18.89,28.09-10.53,42.98-160.05,24.35-190.35,21.93-99.42-20.1-145.61-34.21S6.65,38.94,3.15,31.92s57.59,8.6,57.59,8.6Z'/>
                <PepperPathStyled className='d' d='M400.44,33.25c2.88-4.88,17.54-4.39,38.6-17.54S464.77,.8,472.37,.8s20.91,12.28,14.04,16.23-51.75,11.84-56.14,16.23-19.3,7.89-24.56,7.89-8.14-3.02-5.26-7.89Z'/>
                <PepperE className='e' d='M202.09,83.32s125.57,21.06,158.15,3.71c32.58-17.35,39.05-35.58,39.05-35.58,0,0-102.86,30.91-197.21,31.87Z'/>
            </g>
        </g>
    </PepperSVGSyled>
);
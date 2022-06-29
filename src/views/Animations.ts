import {keyframes} from 'styled-components';
export const fadeInLong = keyframes`
    0% {
        opacity: 0.1;
        transform: translateY(-200%);
    },
    80% {
        opacity: 0.1;
    },
    100% {
        opacity: 1;
        transform: translateY(0);
    }
`;

export const fallIn = keyframes`
    0% {
        transform: rotateZ(-15deg) rotateY(-12deg) translate(0, -70vh);
    }
    10% {
        transform: rotateZ(10deg) rotateY(20deg) translate(-40vw, -60vh);
    }
    50% {
        transform: rotateZ(-15deg) rotateY(-20deg) translate(50vw, -35vh);
    }
    75% {
        transform: rotateZ(10deg) rotateY(10deg) translate(-20vw, -25vh);
    }
    100% {
        transform: rotateZ(0) rotateY(0) translate(0, 0);
    }
`;

export const lightFalling = keyframes`
    0% {
        transform: rotateZ(0) rotateY(0deg) translate(0, 0);
    }
    10% {
        transform: rotateZ(10deg) rotateY(20deg) translate(-5vw, 20vh);
    }
    50% {
        transform: rotateZ(-15deg) rotateY(-20deg) translate(5vw, 60vh);
    }
    75% {
        transform: rotateZ(10deg) rotateY(10deg) translate(-10vw, 80vh);
    }
    100% {
        transform: rotateZ(-15deg) rotateY(-12deg) translate(10vw, 110vh);
    }
`;
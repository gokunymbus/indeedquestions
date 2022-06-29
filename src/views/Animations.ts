import {keyframes} from 'styled-components';
export const fadeAndSlideDown = keyframes`
    0% {
        opacity: 0;
        transform: translateY(-200%);
    },
    80% {
        opacity: 0.2;
    },
    100% {
        opacity: 1;
        transform: translateY(0);
    }
`;

export const slideUp = keyframes`
    0% {
        transform: translateY(100%);
    },
    100% {
        transform: translateY(0);
    }
`;


export const fadeIn = keyframes`
    0% {
        transform: opacity(0);
    },
    100% {
        transform: translateY(1);
    }
`;

export const fallIn = keyframes`
    0% {
        transform: rotateZ(-15deg) rotateY(-12deg) translate(0, -50vh);
    }
    10% {
        transform: rotateZ(10deg) rotateY(20deg) translate(-10vw, -40vh);
    }
    50% {
        transform: rotateZ(-15deg) rotateY(-20deg) translate(18vw, -25vh);
    }
    75% {
        transform: rotateZ(10deg) rotateY(10deg) translate(-18vw, -15vh);
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

export const expandIn = keyframes`
    0% {
       transform: scale(0.1);
    },
    100% {
        transform: scale(1);
    }
`;
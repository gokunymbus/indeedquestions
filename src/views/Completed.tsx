import { ReactNode } from 'react';
import React from 'react';
import {getQuizResults, sortResultsByScore} from '../library/QuizStorage';
import { IQuizResult } from '../library/QuizModel';
import replaceStringTokens from '../library/replaceStringTokens';
import styled from 'styled-components';
import ZIndexLayers from './ZIndexLayers';
import PepperRain from './PepperRain';
import  { fadeAndSlideDown } from './Animations';

interface ICompletedProps {
    language: any;
    languageCode: string;
    renderPlayAgain: ReactNode;
}

const CompletedTitleStyled = styled.h1`
    font-family: ${props => props.theme.titleFont };
    font-size: 60px;
    line-height: 60px;
    color: ${props => props.theme.tertiaryColor };
    margin-bottom: 12px;
    text-align: center;
`;

const CompletedContainerStyled = styled.div`
    width: 100vw;
    min-height: 100vh;
    background-color: ${props => props.theme.secondaryColor};
    display: flex;
    align-items: center;
    justify-content: center;
`;

const CompletedInnerContainerStyled = styled.div`
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
    animation: ${fadeAndSlideDown} .8s ease-out;
    max-width: 1000px;
`;

const CompletedFinalScoreStyled = styled.h2`
    font-size: 22px;
    font-family: ${props => props.theme.mainFont};
    margin-bottom: 10px;
    color: ${props => props.theme.quaternaryColor };
    text-align: center;
`;

const CompletedPreviousScoreStyled = styled.p`
    font-size: 18px;
    font-family: ${props => props.theme.mainFont};
    margin-bottom: 20px;
    margin-top: 0;
    color: ${props => props.theme.quinaryColor };
    text-align: center;
`;


export default class Completed extends React.Component<ICompletedProps, {}> {
    private quizResults: IQuizResult[] | null;
    constructor(props: any) {
        super(props);
        this.quizResults = getQuizResults();
    }

    getQuizTitle(result: IQuizResult) {
        const {
            correctQuestions,
            totalQuestions
        } = result;

        const {
            didntGetAny,
            gotatleastOne,
            someIsbetterThanNone,
            someAnswers,
            gotSomeRight,
            youKnowSomeStuff,
            youAreAnExpert
        } = this.props.language;
 
        const percentage = (100 * correctQuestions) / totalQuestions;
         
        let title;
        switch (true) {
            case percentage == 0: 
                title = didntGetAny;
                break;
            case percentage <= 10 && percentage > 0:
                title = gotatleastOne;
                break;
            case  percentage <= 20 && percentage > 10:
                title = someIsbetterThanNone;
                break;
            case  percentage <= 40 && percentage > 20:
                title = someAnswers;
                break;
            case  percentage <= 70 && percentage > 40:
                title = gotSomeRight;
                break;
            case  percentage <= 90 && percentage > 70:
                title = youKnowSomeStuff;
                break;
            default:
                title = youAreAnExpert;
                break;
        }

        return (
            <CompletedTitleStyled>
                {title}
            </CompletedTitleStyled>
        )
    }

    renderNoQuiz() {
        const { language } = this.props;
        const { noQuizCompleted } = language;
        return (
            <CompletedTitleStyled>{noQuizCompleted}</CompletedTitleStyled>
        )
    }

    renderResults() {
        const latestQuiz = this.quizResults![0];
        const {correctQuestions, totalQuestions} = latestQuiz;
        const {
            language,
            renderPlayAgain
        } = this.props;
        const {
            questionsRight,
            bestScore
        } = language;
        const questionsRightText = replaceStringTokens(
            questionsRight,
            [
                correctQuestions,
                totalQuestions
            ]
        )
        const sortedResults = sortResultsByScore(this.quizResults!);
        const bestPreviousScore = sortedResults[0];
        const bestScoreDate = new Date(bestPreviousScore.dateCompleted);
        const bestScoreDateFormatted = bestScoreDate.toLocaleDateString();
        const bestScoreTime = bestScoreDate.toLocaleTimeString()

        const highestResult = replaceStringTokens(
            bestScore,
            [
                bestPreviousScore.correctQuestions,
                bestPreviousScore.totalQuestions,
                bestScoreDateFormatted,
                bestScoreTime
            ]
        );

        return(
            <CompletedContainerStyled>
                <CompletedInnerContainerStyled>
                    {this.getQuizTitle(latestQuiz)}
                    <CompletedFinalScoreStyled>
                        {questionsRightText}
                    </CompletedFinalScoreStyled>
                    <CompletedPreviousScoreStyled>
                        {highestResult}
                    </CompletedPreviousScoreStyled>
                    <div>
                        {renderPlayAgain}
                    </div>
                </CompletedInnerContainerStyled>
                <PepperRain peppers={20} />
            </CompletedContainerStyled>
        )
    }

    render(): ReactNode {
        return  (
            (this.quizResults)
                ? this.renderResults()
                : this.renderNoQuiz()
        )
    }
}
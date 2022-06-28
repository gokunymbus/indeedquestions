import { ReactNode } from 'react';
import React from 'react';
import {getQuizResults, sortResultsByScore} from '../library/QuizStorage';
import { IQuizResult } from '../library/QuizModel';
import replaceStringTokens from '../library/replaceStringTokens';

interface ICompletedProps {
    language: any;
    languageCode: string;
    renderPlayAgain: ReactNode;
}

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
            <div>
                {title}
            </div>
        )
    }

    renderNoQuiz() {
        const { language } = this.props;
        const { noQuizCompleted } = language;
        return (
            <div>{noQuizCompleted}</div>
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
        const bestScoreDateFormatted = `${
            bestScoreDate.getMonth()
        }/${
            bestScoreDate.getDate()
        }/${
            bestScoreDate.getFullYear()
        }`;

        const bestScoreTime = `${
            bestScoreDate.getHours()
        }:${
            bestScoreDate.getMinutes()
        }`

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
            <div>
                {this.getQuizTitle(latestQuiz)}
                <div>
                    {questionsRightText}
                </div>
                <div>
                    {highestResult}
                </div>
                <div>
                    {renderPlayAgain}
                </div>
            </div>
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
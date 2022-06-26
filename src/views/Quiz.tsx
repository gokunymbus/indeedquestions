import { ReactNode } from 'react';
import { BigButton } from '../components/Buttons';
import React from 'react';
import styled from 'styled-components';
import IQuestion, { IQuestionOption, QuestionType } from '../library/IQuestion';
import useWithParams from '../library/useWithParams';
import IQuiz, { IQuizPosition, GradeResponses } from '../library/QuizModel';
import replaceStringTokens from '../library/replaceStringTokens';
import { Link } from 'react-router-dom';
import AppRoutes from '../library/AppRoutes';
import Question from './Question';
import { ISelectedAnswer } from '../library/QuizModel';

interface IQuestionProps {
    onNext: () => void;
    language: any;
    quiz: IQuiz;
    questionID: number;
    languageCode: string;
}

const QuestionStyled = styled.div`
    width: 100%;
    height: auto;
`;

const HeaderContainerStyled = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const HeaderTitleStyled = styled.h2`
    font-size: 18px;
`;

class Quiz extends React.Component<IQuestionProps, {}> {
    private activeAnswers: ISelectedAnswer[] = [];
    constructor(props: IQuestionProps) {
        super(props);
        const { quiz, questionID} = this.props;
        this.state = {
            message: undefined,
            question: quiz.getQuestionByID(questionID)!
        }
    }

    onSubmitAnswer = () => {
        const { quiz, questionID, language } = this.props;
        const {
            errorNoOptionSelected,
            errorWrongAnswers,
            answerCorrect
        } = language;
        const gradeResponse = quiz.gradeQuestion(questionID);
        this.forceUpdate();
    }

    onComplete = () => {

    }

    renderBackToStartButton() {
        const {
            backToStart
        } = this.props.language;
        return (
            <Link to={AppRoutes.home}>
                <BigButton onClick={this.onComplete}>
                    {backToStart}
                </BigButton>
            </Link>
        )
    }

    renderCompleteQuizButton() {
        const {
            completeQuizButton
        } = this.props.language;
        return (
            <BigButton onClick={this.onComplete}>
                {completeQuizButton}
            </BigButton>
        )
    }

    renderSubmitAnswerButton() {
        const {
            submitAnswerButton
        } = this.props.language;
        return (
            <BigButton onClick={this.onSubmitAnswer}>
                {submitAnswerButton}
            </BigButton>
        )
    }

    renderNextButton() {
        const {
            language,
            questionID,
            quiz
        } = this.props;
        const {
            submitAnswerButton
        } = this.props.language;
        const nextQuestion = quiz.getNextQuestion(questionID);

        return (
            <Link to={`${AppRoutes.question}/${nextQuestion?.id}`}>
                <BigButton onClick={() =>{}}>
                    {submitAnswerButton}
                </BigButton>
            </Link>
        )
    }

    
    renderButton() {
        const { quiz, questionID } = this.props;
        const previousQuestion = quiz.getPreviousQuestion(questionID);
        const nextQuestion = quiz.getNextQuestion(questionID);
        const alreadyAnswered = quiz.getCompletedQuestionByID(questionID);

        console.log(alreadyAnswered, "already answered");

        return (
            <div>
                {previousQuestion
                    ? this.renderBackButton()
                    : this.renderBackToStartButton()
                }
                {nextQuestion
                    ? (alreadyAnswered)
                        ? this.renderNextButton()
                        : this.renderSubmitAnswerButton()
                    : (alreadyAnswered)
                        ? this.renderCompleteQuizButton()
                        : this.renderSubmitAnswerButton()
                }
            </div>
        )
    }

    renderBackButton() {
        const {
            backButton
        } = this.props.language;
        const { questionID, quiz } = this.props;
        const previousQuestion = quiz.getPreviousQuestion(questionID);
        return (
            <Link to={`${AppRoutes.question}/${previousQuestion?.id}`}>
                <BigButton onClick={this.onComplete}>
                    {backButton}
                </BigButton>
            </Link>
        )
    }

    renderNotFound() {
        return(
            <QuestionStyled>
               Question Not Found!
            </QuestionStyled>        
        )
    }

    renderMessage() {
        const { errorMessage, successMessage } = this.props;
        return (
            <div>
                {errorMessage && (<div>{errorMessage}</div>)}
                {successMessage && (<div>{successMessage}</div>)}
            </div>
        )
    }

    renderQuestion() {
        const {
            onNext,
            language,
            quiz,
            questionID,
            languageCode
        } = this.props;

        const {
            nextQuestionButton,
            questionPosition,
            currentScore
        } = language;

        const question: IQuestion = quiz.getQuestionByID(questionID!)!;
        const positions: IQuizPosition = quiz.getQuestionPosititon(questionID!)
        const position:string = replaceStringTokens(
            questionPosition,
            [positions.current, positions.total]
        );
    
        const score = quiz.getScore();
        const description = question?.description[languageCode];
        const nextQuestion = quiz.getNextQuestion(questionID!);

        return(
            <QuestionStyled>
                <HeaderContainerStyled>
                    <HeaderTitleStyled>{position}</HeaderTitleStyled>
                    <HeaderTitleStyled>{`${currentScore} ${score}`}</HeaderTitleStyled>
                </HeaderContainerStyled>
                <Question
                    question={question}
                    languageCode={languageCode}
                    language={language}
                    onAnswersUpdated={(answers) => {
                        this.activeAnswers = [...answers];
                    }}
                />
                { this.renderMessage() }
                { this.renderButton() }
            </QuestionStyled>        
        )
    }

    render(): ReactNode {
        const {quiz, questionID} = this.props;
        return (
            (quiz.getQuestionByID(questionID!))
                ? this.renderQuestion()
                : this.renderNotFound()
        )
    }
}

export default useWithParams(Quiz);
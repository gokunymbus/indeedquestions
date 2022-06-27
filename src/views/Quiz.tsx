import { ReactNode } from 'react';
import { BigButton } from '../components/Buttons';
import React from 'react';
import styled from 'styled-components';
import IQuestion from '../library/IQuestion';
import useWithParams from '../library/useWithParams';
import { IQuizPosition, IQuizData, getScore } from '../library/QuizModel';
import replaceStringTokens from '../library/replaceStringTokens';
import { Link } from 'react-router-dom';
import AppRoutes from '../library/AppRoutes';
import Question from './Question';

interface IQuizProps {
    language: any;
    data: IQuizData;
    questionID: number;
    languageCode: string;
    onComplete: (questions: IQuestion[]) => void
}

interface IQuizState {
    questions: IQuestion[];
    currentQuestionID: number;
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

class Quiz extends React.Component<IQuizProps, IQuizState> {
    constructor(props: IQuizProps) {
        super(props);
        const { data } = props;
        this.state = {
            questions: data.questions,
            currentQuestionID: data.questions[0].id
        }
    }

    updateQuestion(question: IQuestion) {
        const {questions} = this.state;
        const newQuestions = questions.map((q) => {
            if (q.id == question.id) {
                return {...question }
            }
            return q;
        });

        this.setState({questions: newQuestions});
    }

    getScore(): number {
        const { questions } = this.state;
        return getScore(questions);
    }

    getQuestionPosititon(questionID: number): IQuizPosition {
        const { questions } = this.state;
        const questionIndex = this.getQuestionIndexByID(questionID);
        return {
            current: questionIndex + 1,
            total: questions.length
        }
    }

    getQuestionIndexByID(questionID: number): number {
        const { questions } = this.state;
        return questions.reduce((previousValue, question, index) => {
            if (question.id == questionID) {
                return previousValue + index;
            }
            return previousValue;        
        }, 0);
    }

    getQuestionByID(questionID: number): IQuestion | undefined {
        const { questions } = this.state;
        return  questions.find((question) => question.id == questionID);
    }

    getFirstQuestionID() {
        const { questions } = this.state;
        return questions[0].id;
    }

    getNextQuestion(questionID: number): IQuestion | undefined {
        const { questions } = this.state;
        const nextQuestionIndex = this.getQuestionIndexByID(questionID) + 1;
        if (nextQuestionIndex in questions) {
            return questions[nextQuestionIndex];
        }
        return undefined;
    }

    getPreviousQuestion(questionID: number): IQuestion | undefined {
        const { questions } = this.state;
        const prevQuestionIndex = this.getQuestionIndexByID(questionID) - 1;
        if (prevQuestionIndex in questions) {
            return questions[prevQuestionIndex];
        }
        return undefined;
    }

    getUnansweredQuestion() {
        const { questions } = this.state;
        return  questions.find((question) => !question.answers);
    }

    onQuestionComplete = (question: IQuestion) => {
        this.updateQuestion(question);
    }

    renderBackToStartButton() {
        const {
            backToStart
        } = this.props.language;
        return (
            <Link to={AppRoutes.home}>
                <BigButton onClick={() => {}}>
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
            <BigButton onClick={() => {
                const { onComplete } = this.props;
                onComplete(this.state.questions);
            }}>
                {completeQuizButton}
            </BigButton>
        )
    }

    renderNotFound() {
        return(
            <QuestionStyled>
               Question Not Found!
            </QuestionStyled>
        )
    }

    renderNextButton() {
        const {
            language,
        } = this.props;
        const {
            currentQuestionID
        } = this.state;
        const {
            nextQuestionButton
        } = language;
        const nextQuestion = this.getNextQuestion(currentQuestionID)!;
        return (
            <BigButton onClick={() =>{
                this.setState({
                    currentQuestionID: nextQuestion.id
                })
            }}>
                {nextQuestionButton}
            </BigButton>
        )
    }

    renderBackButton() {
        const {
            language
        } = this.props;
        const {
            currentQuestionID
        } = this.state;
        const {
            previousQuestionButton
        } = language;
        const previousQuestion = this.getPreviousQuestion(currentQuestionID)!;
        return (
            <BigButton onClick={() =>{
                this.setState({
                    currentQuestionID: previousQuestion.id
                })
            }}>
                {previousQuestionButton}
            </BigButton>
        )
    }

    renderQuestion() {
        const {
            language,
            languageCode
        } = this.props;

        const {
            questionPosition,
            currentScore
        } = language;

        const {
            currentQuestionID
        } = this.state;

        const question: IQuestion = this.getQuestionByID(currentQuestionID)!;
        const positions: IQuizPosition = this.getQuestionPosititon(currentQuestionID)
        const position:string = replaceStringTokens(
            questionPosition,
            [positions.current, positions.total]
        );
        
        const nextQuestion = this.getNextQuestion(currentQuestionID);
        const previousQuestion = this.getPreviousQuestion(currentQuestionID);
    
        const score = this.getScore();
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
                    renderNextButton={
                        (nextQuestion)
                            ? this.renderNextButton()
                            : this.renderCompleteQuizButton()
                    }
                    renderBackButton={
                        (previousQuestion)
                            ? this.renderBackButton()
                            : this.renderBackToStartButton()
                    }
                    onQuestionCompleted={this.onQuestionComplete}
                />
            </QuestionStyled>        
        )
    }

    render(): ReactNode {
        const {currentQuestionID} = this.state;
        return (
            (this.getQuestionByID(currentQuestionID))
                ? this.renderQuestion() 
                : this.renderNotFound()
        )
    }
}

export default useWithParams(Quiz);
import { ReactNode } from 'react';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import React from 'react';
import styled from 'styled-components';
import useWithParams from '../library/useWithParams';
import {
    IQuizPosition,
    IQuizData,
    IQuestion,
    IQuestionOption,
    IAnsweredQuestion,
    getCorrectQuestions
} from '../library/QuizModel';
import replaceStringTokens from '../library/replaceStringTokens';
import Question from './Question';
import { devices } from './Breakpoints';
import { languageObject } from '../language/language';

interface IQuizProps {
    language: languageObject;
    data: IQuizData;
    languageCode: string;
    onComplete: (questions: IAnsweredQuestion[]) => void
    renderCompleteButton: ReactNode;
    renderBackToStartButton: ReactNode;
}

interface IQuizState {
    answeredQuestions: IAnsweredQuestion[]
    currentQuestionID: number;
}

const QuizContainerStyled = styled.div`
    width: 100%;
    min-height: 100vh;
    background-color: ${props => props.theme.quinaryColor};
    display: flex;
    align-items: center;
    justify-content: center;
`;

const QuizInnerContainer = styled.div`
    width: 100%;
    padding: 18px;
    box-sizing: border-box;

    @media ${devices.tablet} {
        width: 760px;
    }

    @media ${devices.laptop} {
        width: 900px;
    }

    @media ${devices.desktop} {
        width: 1200px;
    }
`;

const HeaderContainerStyled = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 8px;
    padding: 20px 0;
    box-sizing: border-box;
`;

const HeaderTitleStyled = styled.h2`
    font-size: 18px;
    font-family: ${props => props.theme.mainFont};
    
    color: ${props => props.theme.secondaryColor};
`;

class Quiz extends React.Component<IQuizProps, IQuizState> {
    constructor(props: IQuizProps) {
        super(props);
        const { data } = props;
        this.state = {
            answeredQuestions: [],
            currentQuestionID: data.questions[0].id
        }
    }

    updateQuestion(answers: IQuestionOption[], question: IQuestion) {
        this.setState((state) => {
            const { answeredQuestions } = state;
            const exists = answeredQuestions.find(
                aq => aq.id === question.id
            );
            if (exists) {
                const newAQuestions = answeredQuestions.map((aq) => {
                    return aq.id === question.id
                        ? { ...question, answers }
                        : aq;
                });
                return { answeredQuestions: newAQuestions }
            }
        
            return {
                answeredQuestions: [
                    ...answeredQuestions,
                    { ...question, answers }
                ]
            }
        }, () => {
            if (!this.getNextQuestion(this.state.currentQuestionID)) {
                const {onComplete} = this.props;
                const {answeredQuestions} = this.state;
                onComplete(answeredQuestions);
            }
        });
    }

    getScore(): number {
        const { answeredQuestions } = this.state;
        return getCorrectQuestions(answeredQuestions);
    }

    getQuestionPosititon(questionID: number): IQuizPosition {
        const { data } = this.props;
        const questionIndex = this.getQuestionIndexByID(questionID);
        return {
            current: questionIndex + 1,
            total: data.questions.length
        }
    }

    getQuestionIndexByID(questionID: number): number {
        const { data } = this.props;
        return data.questions.reduce((previousValue, question, index) => {
            if (question.id == questionID) {
                return previousValue + index;
            }
            return previousValue;        
        }, 0);
    }

    getQuestionByID(questionID: number): IQuestion | undefined {
        const { data } = this.props;
        return  data.questions.find((question) => question.id == questionID);
    }

    getFirstQuestionID() {
        const { data } = this.props;
        return data.questions[0].id;
    }

    getNextQuestion(questionID: number): IQuestion | undefined {
        const { data } = this.props;
        const nextQuestionIndex = this.getQuestionIndexByID(questionID) + 1;
        if (nextQuestionIndex in data.questions) {
            return data.questions[nextQuestionIndex];
        }
        return undefined;
    }

    getPreviousQuestion(questionID: number): IQuestion | undefined {
        const { data } = this.props;
        const prevQuestionIndex = this.getQuestionIndexByID(questionID) - 1;
        if (prevQuestionIndex in data.questions) {
            return data.questions[prevQuestionIndex];
        }
        return undefined;
    }

    onQuestionComplete = (answers: IQuestionOption[], question: IQuestion) => {
        this.updateQuestion(answers, question);
    }

    renderNotFound() {
        const {questionNotFound} = this.props.language;
        return(
            <QuizContainerStyled>
                <QuizInnerContainer>{questionNotFound}</QuizInnerContainer>
            </QuizContainerStyled>
        )
    }

    renderNextButton() {
        const {
            language,
        } = this.props;
        const {
            nextQuestionButton
        } = language;
       
        return (
            <PrimaryButton onClick={() =>{
                this.setState((state) => {
                    const {
                        currentQuestionID
                    } = state;
                    const nextQuestion = this.getNextQuestion(currentQuestionID)!;
                    return {
                        currentQuestionID: nextQuestion.id
                    }
                })
            }}>
                {nextQuestionButton}
            </PrimaryButton>
        )
    }

    renderBackButton() {
        const {
            language
        } = this.props;
        const {
            previousQuestionButton
        } = language;
        return (
            <SecondaryButton onClick={() => {
                this.setState((state) => {
                    const {
                        currentQuestionID
                    } = state;
                    const previousQuestion = this.getPreviousQuestion(currentQuestionID)!;
                    return {
                        currentQuestionID: previousQuestion.id
                    }
                })
            }}>
                {previousQuestionButton}
            </SecondaryButton>
        )
    }

    renderQuestion() {
        const {
            language,
            languageCode,
            renderBackToStartButton,
            renderCompleteButton
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
            <QuizContainerStyled>
                <QuizInnerContainer>
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
                                : renderCompleteButton
                        }
                        renderBackButton={
                            (previousQuestion)
                                ? this.renderBackButton()
                                : renderBackToStartButton
                        }
                        onQuestionCompleted={this.onQuestionComplete}
                    />
                </QuizInnerContainer>
            </QuizContainerStyled>        
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
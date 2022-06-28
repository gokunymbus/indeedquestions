import { ReactNode } from 'react';
import { BigButton } from '../components/Buttons';
import React from 'react';
import styled from 'styled-components';
import IQuestion, { IQuestionOption } from '../library/IQuestion';
import useWithParams from '../library/useWithParams';
import { IQuizPosition, IQuizData, getScore, getCorrectQuestions } from '../library/QuizModel';
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
    renderCompleteButton: ReactNode;
    renderBackToStartButton: ReactNode;
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
        const newQ = data.questions.map((q) => {
            return {
                ...q,
                options: [...q.options]
            }
        });

        this.state = {
            questions: newQ,
            currentQuestionID: data.questions[0].id
        }

        console.log("CONSTRUCTOR", data.questions);
    }

    componentDidUpdate(prevProps: IQuizProps, prevState: IQuizState) {
        console.log("TIME", new Date().getTime());
        console.log(prevProps);
        console.log(prevState);
        console.log(this.props);
        console.log(this.state);
    }

    updateQuestion(answers: IQuestionOption[]) {
        this.setState((state) => {
            const {questions, currentQuestionID} = state;
            const newQuestions = questions.map((q) => {
                if (q.id == currentQuestionID) {
                    return {
                        ...q,
                        answers
                    }
                }
                return q;
            });

            return {questions: newQuestions}
        });
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

    onQuestionComplete = (answers: IQuestionOption[]) => {
        this.updateQuestion(answers);

        if(!this.getNextQuestion(this.state.currentQuestionID)) {
            const {onComplete} = this.props;
            const {questions} = this.state;
            onComplete(questions);
        }
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
            nextQuestionButton
        } = language;
       
        return (
            <BigButton onClick={() =>{
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
            </BigButton>
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
            <BigButton onClick={() =>{
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
            </BigButton>
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
                            : renderCompleteButton
                    }
                    renderBackButton={
                        (previousQuestion)
                            ? this.renderBackButton()
                            : renderBackToStartButton
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
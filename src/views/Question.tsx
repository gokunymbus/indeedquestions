import { ReactNode } from 'react';
import { BigButton } from '../components/Buttons';
import React from 'react';
import styled from 'styled-components';
import IQuestion, { IQuestionOption, QuestionType } from '../library/IQuestion';
import useWithParams from '../library/useWithParams';
import IQuiz, { IQuizPosition } from '../library/Quiz';
import replaceStringTokens from '../library/replaceStringTokens';
import { Link } from 'react-router-dom';
import AppRoutes from '../library/AppRoutes';
import {RadioGroup, IRadioGroupItem} from '../components/RadioGroup';

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

const QuestionTitleStyled = styled.h3`
    font-size: 16px;
`;

class Question extends React.Component<IQuestionProps, {}> {
    constructor(props: IQuestionProps) {
        super(props);
    }

    onSubmitAnswer = () => {
        
    }

    onComplete = () => {

    }

    onItemSelected = (id: number, data: IQuestion) => {
        console.log(data, "select");
    }

    onItemDeselected = (id: number, data: IQuestion) => {
        console.log(data, "deselect");
    }

    renderNotFound() {
        return(
            <QuestionStyled>
               Question Not Found!
            </QuestionStyled>        
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

    renderCheckboxes() {
        return (
            <div></div>
        );
    }

    renderRadioGroup() {
        const {
            quiz,
            questionID,
            languageCode
        } = this.props;

        const question: IQuestion = quiz.getQuestionByID(questionID!)!;
        const selectionItemMap = question.options.map((option) => {
            const newMap: IRadioGroupItem = {
                label: option.description[languageCode],
                id: option.id,
                data: option
            };
            return newMap
        });

        return(
            <RadioGroup
                items={selectionItemMap}
                onChange={() => {
                    console.log("ayy111")
                }}
                groupName={question.name.split(' ').join('')}
            />
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
                <div>
                    <QuestionTitleStyled>
                        {description}
                    </QuestionTitleStyled>
                </div>
                <div>
                    {
                        (question.type == QuestionType.MULTI.toString())
                            ? this.renderCheckboxes()
                            : this.renderRadioGroup()
                    }
                </div>
                <div>

                </div>
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

export default useWithParams(Question);
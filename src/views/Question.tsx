import { ReactNode } from 'react';
import { BigButton } from '../components/Buttons';
import React from 'react';
import styled from 'styled-components';
import IQuestion from '../library/IQuestion';
import useWithParams from '../library/useWithParams';
import IQuiz from '../library/Quiz';

interface IQuestionProps {
    onNext: () => void;
    language: any;
    quiz: IQuiz;
    questionID?: number;
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

    renderNotFound() {
        return(
            <QuestionStyled>
               Question Not Found!
            </QuestionStyled>        
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
            nextQuestionButton
        } = language;

        const question: IQuestion | undefined = quiz.getQuestionByID(questionID!);

        return(
            <QuestionStyled>
                <HeaderContainerStyled>
                    <HeaderTitleStyled>{}</HeaderTitleStyled>
                    <HeaderTitleStyled>Score 0</HeaderTitleStyled>
                </HeaderContainerStyled>
                <div>
                    <QuestionTitleStyled>
                        {question?.description[languageCode]}
                    </QuestionTitleStyled>
                </div>
                <div>
                    <BigButton onClick={onNext}>{nextQuestionButton}</BigButton>
                </div>
            </QuestionStyled>        
        )
    }

    render(): ReactNode {
        const {quiz, questionID} = this.props;
        return  ((quiz.getQuestionByID(questionID!)) ? this.renderQuestion() : this.renderNotFound())
    }
}

export default useWithParams(Question);
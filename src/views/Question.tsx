import { ReactNode } from 'react';
import { PrimaryButton } from '../components/Buttons';
import React from 'react';
import  {
    getCorrectOptions,
    IQuestion,
    IQuestionOption,
    QuestionType
} from '../library/QuizModel';
import styled from 'styled-components';
import {
    RadioGroup,
    IRadioGroupItem,
    RadioContainerStyled,
} from '../components/RadioGroup';
import Checkbox, {
    CheckboxContainerStyled
} from '../components/Checkbox';
import { devices } from './Breakpoints';
import { fadeIn } from './Animations';

export enum QuestionStatus {
    NO_ANSWER,
    ERROR_NO_ANSWERS,
    FAILED,
    PASSED
}

interface IQuestionProps {
   question: IQuestion;
   languageCode: string;
   language: any;
   onQuestionCompleted: (
        answers: IQuestionOption[],
        question: IQuestion
   ) => void;
   renderNextButton: ReactNode;
   renderBackButton: ReactNode;
}

interface IQuestionState {
    status?: QuestionStatus;
    activeAnswers: IQuestionOption[]
}

const messageMinHeight = '50px';

const QuestionContainerStyled = styled.section`
    margin-bottom: ${messageMinHeight};
`;

const QuestionTitleStyled = styled.h3`
    font-size: 40px;
    font-family: ${props => props.theme.titleFont};
    color: ${props => props.theme.secondaryColor};
`;

const QuestionOptionsStyled = styled.div`
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    margin-bottom: 48px;

    ${RadioContainerStyled},
    ${CheckboxContainerStyled} {
        flex-basis: 100%;

        @media ${devices.tablet} {
            flex-basis: 50%;
        }
    }
`;

const QuestionButtonsStyled = styled.div`
    width: 100%;
    display: flex;
    min-height: 50px;
    flex-wrap: wrap;
    justify-content: space-between;
    flex-direction: column-reverse;

    @media ${devices.tablet} {
        flex-direction: revert;
    }

    & > * {
        flex-basis: 100%;
        margin-bottom: 8px;

        @media ${devices.tablet} {
            flex-basis: 48%;
        }
    }
`;

const QuestionMessageContainerStyled = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    animation: ${fadeIn} 0.1s ease-out;
    justify-content: center;
    margin-bottom: 20px;
`;

const QuestionMessageBGSuccess = styled(QuestionMessageContainerStyled)`
    background-color: ${props => props.theme.successColor}
`;

const QuestionMessageBGError = styled(QuestionMessageContainerStyled)`
    background-color: ${props => props.theme.errorColor}
`;

const QuestionMessageBG = styled(QuestionMessageContainerStyled)`
    background-color: ${props => props.theme.secondaryColor}
`;

const QuestionMessageStyled = styled.div`
    font-family: ${props => props.theme.mainFont};
    font-size: 20px;
    color: ${props => props.theme.whiteColor};
`;

const QuestionMessagePlaceHolder = styled.div`
    height: ${messageMinHeight};
`;

export default class Question extends React.Component<
    IQuestionProps, IQuestionState
> {
    constructor(props: IQuestionProps) {
        super(props);
        this.state = this.defaultState();
    }

    defaultState() {
        return {
            activeAnswers: [],
            status: QuestionStatus.NO_ANSWER
        }
    }

    componentDidUpdate(prevProps: IQuestionProps) {
        const {question} = this.props;
        if (prevProps.question.id !== question.id) {
            this.setState(this.defaultState())
        }
    }

    onSubmitAnswer = () => {
        this.setState((state, props) => {
            const { onQuestionCompleted, question } = props;
            const { activeAnswers } = state;

            if (activeAnswers.length === 0) {
                return {
                    status: QuestionStatus.ERROR_NO_ANSWERS
                }
            }

            const correctOptions = getCorrectOptions(question);
            const correctlySelectedAnswers = activeAnswers.reduce<number>((accumulator, current) => {
                const found = correctOptions.find(
                    (a) => a.id == current.id
                );
                return found
                    ? accumulator + 1
                    : accumulator - 1
            }, 0);

            // Send the data upwards to be commited
            onQuestionCompleted([...activeAnswers], question);

            let newStatus = QuestionStatus.PASSED;
            if (correctlySelectedAnswers !== correctOptions.length) {
               newStatus = QuestionStatus.FAILED;
            }
    
            return {
                status: newStatus
            };
        });    
    }

    onRadioGroupChange(option: IQuestionOption) {
        this.setState({
            activeAnswers: [option]
        });
    }

    onCheckboxChange(option: IQuestionOption, isChecked: boolean) {
        if (isChecked) {
            this.setState((state) => {
                const { activeAnswers } = state;
                return {
                    activeAnswers: activeAnswers.concat(option)
                }
            });
            return;
        }

        this.setState((state) => {
            const { activeAnswers }  = state;
            const filtered = activeAnswers.filter(
                (o) => o.id !== option.id
            );
            return  {
                activeAnswers: filtered
            }
        });
    }

    renderSubmitAnswerButton() {
        const {
            submitAnswerButton
        } = this.props.language;
        return (
            <PrimaryButton onClick={this.onSubmitAnswer}>
                {submitAnswerButton}
            </PrimaryButton>
        )
    }

    renderButton() {
        const { renderNextButton, renderBackButton } = this.props;
        const { status } = this.state;
        const questionCompleted = status !== QuestionStatus.NO_ANSWER
            && status !== QuestionStatus.ERROR_NO_ANSWERS;
        return (
            <QuestionButtonsStyled>
                { renderBackButton }
                { questionCompleted && renderNextButton
                    ? renderNextButton
                    : this.renderSubmitAnswerButton()
                }
            </QuestionButtonsStyled>
        )
    }

    renderCheckboxes() {
        const {
            question,
            languageCode
        } = this.props;
        const {options} = question;
        return (
            options.map((option) => {
                const {
                    id,
                    description
                } = option;
                const uniqueName = `${question.id}-${id}`
                return(
                    <Checkbox
                        id={id}
                        name={uniqueName}
                        label={description[languageCode]}
                        onChange={(id, isChecked) => {
                            this.onCheckboxChange(option, isChecked)
                        }}
                        defaultChecked={false}
                        key={uniqueName}
                    />
                )
            })
        );
    }

    renderMessage() {
        const { language } = this.props;
        const { status } = this.state;
        const {
            errorWrongAnswers,
            answerCorrect,
            errorNoOptionSelected
        } = language;

        let message;
        switch (status) {
            case QuestionStatus.PASSED:
                message = (
                    <QuestionMessageBGSuccess>
                        <QuestionMessageStyled aria-label={answerCorrect}>
                            {answerCorrect}
                        </QuestionMessageStyled>
                    </QuestionMessageBGSuccess>
                );
                break;
            case QuestionStatus.FAILED:
                message = (
                    <QuestionMessageBGError>
                        <QuestionMessageStyled aria-label={errorWrongAnswers}>
                            {errorWrongAnswers}
                        </QuestionMessageStyled>
                    </QuestionMessageBGError>
                );
                break;
            default:
                message = (
                    <QuestionMessageBG>
                        <QuestionMessageStyled aria-label={errorNoOptionSelected}>
                            {errorNoOptionSelected}
                        </QuestionMessageStyled>
                    </QuestionMessageBG>
                );
                break;
        }

        return (message)
    }

    renderRadioGroup() {
        const {
            question,
            languageCode
        } = this.props;
        const { options } = question;

        const items: IRadioGroupItem[] = options.map((option) => {
            return {
                label: option.description[languageCode],
                id: option.id,
                data: option
            };
        });

        return(
            <RadioGroup
                items={items}
                onChange={(index) => {
                    this.onRadioGroupChange(question.options[index])
                }}
                groupName={question.name.split(' ').join('')}
            />
        )
    }

    render(): ReactNode {
        const { question, languageCode } = this.props;
        const { status } = this.state;
        const { description } = question;

        return  (
            <QuestionContainerStyled>
                <QuestionTitleStyled>
                    {description[languageCode]}
                </QuestionTitleStyled>
                <QuestionOptionsStyled>
                    {
                        (question.type == QuestionType.MULTI.toString())
                            ? this.renderCheckboxes()
                            : this.renderRadioGroup()
                    }
                </QuestionOptionsStyled>
                { this.renderButton() }
                <QuestionMessagePlaceHolder aria-live='assertive'>
                    { status !== QuestionStatus.NO_ANSWER && this.renderMessage() }
                </QuestionMessagePlaceHolder>
            </QuestionContainerStyled>
        )
    }
       
}
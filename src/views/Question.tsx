import { ReactNode } from 'react';
import { BigButton } from '../components/Buttons';
import React from 'react';
import  { getCorrectOptions, IQuestion, IQuestionOption, QuestionType } from '../library/QuizModel';
import styled from 'styled-components';
import {
    RadioGroup,
    IRadioGroupItem,
    RadioLabelStyled,
    RadioContainerStyled,
    RadioButtonStyled
} from '../components/RadioGroup';
import Checkbox from '../components/Checkbox';

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

const QuestionTitleStyled = styled.h3`
    font-size: 30px;
    font-family: ${props => props.theme.titleFont};
    color: ${props => props.theme.secondaryColor};
`;

const QuestionOptionsStyled = styled.div`
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    margin-bottom: 20px;

    ${RadioContainerStyled} {
        flex-basis: 50%;
        box-sizing: border-box;
        padding: 16px;
        display: flex;
        align-items: center;
    }

    ${RadioLabelStyled} {
        font-family: ${props => props.theme.mainFont};
        font-size: 20px;
        color: ${props => props.theme.secondaryColor};
    }

    ${RadioButtonStyled} {
        appearance: none;
        width: 30px;
        height: 30px;
        background-color: ${props => props.theme.primaryColor};
        border-radius: 50%;
        position: relative;

        &:checked {
            &::before {
                content: '';
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                background-color: ${props => props.theme.quinaryColor};
                z-index: 20;
                width: 20px;
                height: 20px;
                border-radius: 50%;
            }
        }
    }
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

    componentDidUpdate(prevProps: IQuestionProps, prevState: IQuestionState) {
        const {question} = this.props;
        if (prevProps.question.id !== question.id) {
            console.log(question);
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
            <BigButton onClick={this.onSubmitAnswer}>
                {submitAnswerButton}
            </BigButton>
        )
    }

    renderButton() {
        const { renderNextButton, renderBackButton } = this.props;
        const { status } = this.state;
        const questionCompleted = status !== QuestionStatus.NO_ANSWER
            && status !== QuestionStatus.ERROR_NO_ANSWERS;
        return (
            <div>
                { renderBackButton }
                { questionCompleted && renderNextButton
                    ? renderNextButton
                    : this.renderSubmitAnswerButton()
                }
            </div>
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
                message = answerCorrect;
                break;
            case QuestionStatus.FAILED:
                message = errorWrongAnswers;
                break;
            default:
                message = errorNoOptionSelected;
                break;
        }

        return (
            <div>
                {message}
            </div>
        )
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
            <div>
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
                { status !== QuestionStatus.NO_ANSWER && this.renderMessage() }
                { this.renderButton() }
            </div>
        )
    }
       
}
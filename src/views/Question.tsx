import { ReactNode } from 'react';
import { BigButton } from '../components/Buttons';
import React from 'react';
import IQuestion, { IQuestionOption, QuestionType } from '../library/IQuestion';
import styled from 'styled-components';
import {RadioGroup, IRadioGroupItem} from '../components/RadioGroup';
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
   onQuestionCompleted: (question: IQuestion) => void;
   renderNextButton: ReactNode;
   renderBackButton: ReactNode;
}

interface IQuestionState {
    question: IQuestion;
    status?: QuestionStatus;
    activeAnswers: IQuestionOption[]
}

const QuestionTitleStyled = styled.h3`
    font-size: 16px;
`;

export default class Question extends React.Component<IQuestionProps, IQuestionState> {
    constructor(props: IQuestionProps) {
        super(props);
        this.state = this.defaultState(props);
    }

    defaultState(props: IQuestionProps) {
        return {
            question: props.question,
            activeAnswers: [],
            status: QuestionStatus.NO_ANSWER
        }
    }

    componentDidUpdate(prevProps: IQuestionProps, prevState: IQuestionState) {
        const {question} = this.props;
        if (prevProps.question.id !== question.id) {
            this.setState(this.defaultState(this.props))
        }
    }

    onSubmitAnswer = () => {
        const { onQuestionCompleted } = this.props;
        const { question, activeAnswers } = this.state;

        if (!activeAnswers || activeAnswers.length === 0) {
            this.setState({
                status: QuestionStatus.ERROR_NO_ANSWERS
            });
            return;
        }

        const allCorrectAnswers = question.options.filter(
            (answer: IQuestionOption) => answer.isCorrect
        );

        const correctlySelectedAnswers = allCorrectAnswers.reduce<number>((accumulator, current) => {
            const matchingSelectedAnswer = activeAnswers.find(
                (a: IQuestionOption) => a.id == current.id
            );
            if (matchingSelectedAnswer) {
                return accumulator + 1;
            }
            return accumulator;
        }, 0);

        const newQuestion = {
            ...question,
            answers: [...activeAnswers]
        };

        let newStatus = QuestionStatus.PASSED;
        if (correctlySelectedAnswers !== allCorrectAnswers.length) {
           newStatus = QuestionStatus.FAILED;
        }

        onQuestionCompleted(newQuestion);
        this.setState({
            status: newStatus,
            question: newQuestion
        });
        return;
    }

    onRadioGroupChange(option: IQuestionOption) {
        this.setState({
            activeAnswers: [option]
        });
    }

    onCheckboxChange(option: IQuestionOption, isChecked: boolean) {
        const { activeAnswers } = this.state;

        if (isChecked) {
            const newAnswers = activeAnswers.concat(option);
            this.setState({
                activeAnswers: newAnswers
            });
            return;
        }

        // Remove option from state
        const filteredAnswers = activeAnswers.filter((o) => o.id !== option.id);
        this.setState({
            activeAnswers: filteredAnswers
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
                console.log
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
                <div>
                    <QuestionTitleStyled>
                        {description[languageCode]}
                    </QuestionTitleStyled>
                </div>
                <div>
                    {
                        (question.type == QuestionType.MULTI.toString())
                            ? this.renderCheckboxes()
                            : this.renderRadioGroup()
                    }
                </div>
                { status !== QuestionStatus.NO_ANSWER && this.renderMessage() }
                { this.renderButton() }
            </div>
        )
    }
       
}
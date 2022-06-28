import { ReactNode } from 'react';
import { BigButton } from '../components/Buttons';
import React from 'react';
import IQuestion, { IQuestionOption, QuestionType } from '../library/IQuestion';
import styled from 'styled-components';
import {RadioGroup, IRadioGroupItem} from '../components/RadioGroup';
import Checkbox from '../components/Checkbox';
import { getCorrectQuestions } from '../library/QuizModel';

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
   onQuestionCompleted: (answers: IQuestionOption[]) => void;
   renderNextButton: ReactNode;
   renderBackButton: ReactNode;
}

interface IQuestionState {
    status?: QuestionStatus;
    activeAnswers: IQuestionOption[]
}

const QuestionTitleStyled = styled.h3`
    font-size: 16px;
`;

export default class Question extends React.Component<IQuestionProps, IQuestionState> {
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

            if (!activeAnswers || activeAnswers.length === 0) {
                return {
                    status: QuestionStatus.ERROR_NO_ANSWERS
                }
            }

            const allCorrectAnswers = question.options.filter(
                (answer: IQuestionOption) => answer.isCorrect
            );

            const correctlySelectedAnswers = activeAnswers.reduce<number>((accumulator, current) => {
                const matchingSelectedAnswer = allCorrectAnswers.find(
                    (a: IQuestionOption) => a.id == current.id
                );
    
                if (matchingSelectedAnswer) {
                    return accumulator + 1;
                }
                return accumulator - 1;
            }, 0);
    
    
            let newStatus = QuestionStatus.PASSED;
            if (correctlySelectedAnswers !== allCorrectAnswers.length) {
               newStatus = QuestionStatus.FAILED;
            }
    
            // Send the data upwards to be commited
            onQuestionCompleted([...activeAnswers]);
    
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
                const newAnswers = activeAnswers.concat(option);
                return {
                    activeAnswers: newAnswers
                }
            });
            return;
        }

        this.setState((state) => {
            const { activeAnswers }  = state;
            const filteredAnswers = activeAnswers.filter((o) => o.id !== option.id);
            return  {
                activeAnswers: filteredAnswers
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
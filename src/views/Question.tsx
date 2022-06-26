import { ReactNode } from 'react';
import { BigButton } from '../components/Buttons';
import React from 'react';
import { Link } from "react-router-dom";
import IQuestion, { IQuestionOption, QuestionType } from '../library/IQuestion';
import styled from 'styled-components';
import {RadioGroup, IRadioGroupItem} from '../components/RadioGroup';
import Checkbox from '../components/Checkbox';
import { ISelectedAnswer } from '../library/QuizModel';

interface IQuestionProps {
   question: IQuestion;
   languageCode: string;
   language: any;
   onAnswersUpdated: (answers: ISelectedAnswer[]) => void;
   errorMessage?: string;
   successMessage?: string;
}

interface IQuestionState {
    answers: ISelectedAnswer[]
}

const QuestionTitleStyled = styled.h3`
    font-size: 16px;
`;

export default class Question extends React.Component<IQuestionProps, IQuestionState> {
    constructor(props: IQuestionProps) {
        super(props);
    }

    onRadioGroupChange(option: IQuestionOption) {
        const { question, onAnswersUpdated } = this.props;
        const answers = [{
            option,
            questionID: question.id
        }];

        onAnswersUpdated(answers)
        this.setState({
            answers
        });
    }

    onCheckboxChange(option: IQuestionOption, isChecked: boolean) {
        const { question, onAnswersUpdated } = this.props;
        const { answers } = this.state;
        if (isChecked) {
            const newAnswers = answers.concat({
                option,
                questionID: question.id
            });
            onAnswersUpdated(newAnswers);
            this.setState({
                answers: newAnswers
            });
            return;
        }

        // Remove option from state
        const filteredAnswers = answers.filter((a) => a.option.id !== option.id);
        onAnswersUpdated(filteredAnswers);
        this.setState({
            answers: filteredAnswers
        })
    }

    renderCheckboxes() {
        const {
            question,
            languageCode
        } = this.props;
        const {options} = question;
        return (
            <div>
                {
                    options.map((option, index) => {
                        const {
                            id,
                            description
                        } = option;

                        return(
                            <Checkbox
                                id={id}
                                label={description[languageCode]}
                                onChange={(index, isChecked) => {
                                    this.onCheckboxChange(option, isChecked)
                                }}
                                defaultChecked={false}
                                index={index}
                            />
                        )
                    })
                }
            </div>
        );
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
        const {description} = question;

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
            </div>
        )
    }
       
}
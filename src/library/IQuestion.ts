import { languageObject } from '../language/language';

export enum QuestionType {
    MULTI = <any>"multi",
    SINGLE = <any>"single"
}

export interface IQuestionOption {
    id: number;
    description: languageObject;
    isCorrect: boolean;
    points: number;
}

export default interface IQuestion {
    id: number;
    name: string;
    type: string;
    description: languageObject;
    options: IQuestionOption[];
}

export interface ISelectedAnswer {
    answerID: number;
    questionID: number;
}
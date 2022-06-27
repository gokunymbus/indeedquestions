import { languageObject } from '../language/language';

export enum GradeResponses {
    ERROR_NO_ANSWERS,
    FAILED,
    PASSED
}

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
    answers?: IQuestionOption[];
}
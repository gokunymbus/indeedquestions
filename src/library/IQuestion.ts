import { languageObject } from '../language/language';

export interface IQuestionOption {
    id: number;
    description: languageObject;
    isCorrect: boolean;
    points: number;
}

export default interface IQuestion {
    id: number;
    name: string;
    description: languageObject;
    options: IQuestionOption[];
}

export interface IQuestionAnswered extends IQuestion {
    selectedOptionIDs: number[]
}
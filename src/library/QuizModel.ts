import { languageObject } from '../language/language';

export enum QuestionType {
    MULTI = 'multi',
    SINGLE = 'single'
}

export interface IQuestionOption {
    id: number;
    description: languageObject;
    isCorrect: boolean;
}

export interface IQuestion {
    id: number;
    name: string;
    type: string;
    description: languageObject;
    options: IQuestionOption[];
}

export interface IAnsweredQuestion extends IQuestion {
    answers: IQuestionOption[]
}

export interface IQuizPosition {
    current: number;
    total: number
}

export interface IQuizData {
    id: number;
    name: string;
    questions: IQuestion[]
}

export interface IQuizComplete extends IQuizData {
    answeredQuestions: IAnsweredQuestion[]
}

export interface IQuizResult {
    dateCompleted: string;
    points: number;
    totalQuestions: number;
    correctQuestions: number;
}

export function getQuizResult(quiz: IQuizComplete): IQuizResult {
    const { answeredQuestions, questions } = quiz;
    return {
        dateCompleted: new Date().toString(),
        points:  getCorrectQuestions(answeredQuestions),
        totalQuestions: questions.length,
        correctQuestions: getCorrectQuestions(answeredQuestions)
    }
}

export function getCorrectOptions(question: IQuestion) {
    return question.options.filter(
        (answer: IQuestionOption) => answer.isCorrect
    );
}

export function getCorrectQuestions(answeredQuestions: IAnsweredQuestion[]): number {
    return answeredQuestions.reduce<number>((accumulator, question) => {
        if (!question.answers) {
            return accumulator;
        }

        const correctOptions = getCorrectOptions(question);
        const correctAnswers = question.answers.reduce<number>((aa, answer) => {
            const foundOption = correctOptions.find((qo) => qo.id == answer.id);
            if (foundOption) {
                return aa + 1;
            }
            return aa;
        }, 0);

        if (correctAnswers == correctOptions.length) {
            return accumulator + 1;
        }
        return accumulator
    }, 0);
}
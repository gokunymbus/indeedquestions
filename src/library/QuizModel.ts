import IQuestion, { IQuestionOption, QuestionType, GradeResponses } from "./IQuestion";

export interface ISelectedAnswer {
    option: IQuestionOption;
    questionID: number;
    final?: boolean;
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

export interface IQuizResult {
    dateCompleted: string;
    points: number;
    totalQuestions: number;
    correctQuestions: number;
}

export function getCorrectQuestions(questions: IQuestion[]): number {
    return questions.reduce<number>((accumulator, question) => {
        if (!question.answers) {
            return accumulator;
        }
        const correctOptions = question.options.filter((option) => {
            return option.isCorrect;
        }); 

        if (question.answers.length === question.options.length) {

        }
        // const correctlySelectedAnswers = correctOptions.reduce<number>((accumulator, current) => {
        //     const matchingSelectedAnswer = question.answers?.find(
        //         (a: IQuestionOption) => a.id == current.id
        //     );

        //     if (matchingSelectedAnswer) {
        //         return accumulator + 1;
        //     }

        //     return accumulator;
        // }, 0);

        return accumulator + correctlySelectedAnswers;
    }, 0);
}

export function getScore(questions: IQuestion[]): number {
    const answeredQuestions = questions.find(question => !question.answers);
    if (!answeredQuestions) {
        return 0;
    }

    return questions.reduce<number>((accumulator, question) => {
        if (!question.answers) {
            return accumulator;
        }

        const questionPoints = question.answers.reduce<number>((aa, answer) => {
            return aa + answer.points;
        }, 0);
        return accumulator + questionPoints;
    }, 0);
}
import IQuestion, { IQuestionAnswered } from "./IQuestion";

interface IQuizPosition {
    current: number;
    total: number
}

export interface IQuizData {
    id: number;
    name: string;
    questions: IQuestion[]
}

export interface IQuiz {
    gradeAnswer(answerID: number): boolean;
    getScore(): number;
    getQuestionPosititon(questionID: number): IQuizPosition;
    getQuestionByID(questionID: number): IQuestion | undefined;
    /** Returns first or next question in the list */
    getNextQuestion(): IQuestion | undefined;
    getFirstQuestionID(): number;
}

export default class Quiz implements IQuiz {
    private name: string;
    private questions: IQuestion[];
    private id: number;
    private currentQuestionIndex: number = 0;
    private answeredQuestions: IQuestionAnswered[] | undefined;

    constructor(params: IQuizData) {
        this.name = params.name;
        this.questions = params.questions
        this.id = params.id;
    }

    gradeAnswer(answerID: number): boolean {
        return false
    }

    getScore(): number {
        return 1;
    }

    getQuestionPosititon(): IQuizPosition {
        return {
            current: 1,
            total: 10
        }
    }

    getQuestionByID(questionID: number): IQuestion | undefined {
        return this.questions.find((question) => question.id == questionID);
    }

    getFirstQuestionID() {
        return this.questions[0].id;
    }

    getNextQuestion(): IQuestion | undefined {
        if (!this.answeredQuestions) {
            return this.questions[0];
        }

        this.currentQuestionIndex += 1;
        if (this.currentQuestionIndex in this.questions) {
            return  this.questions[this.currentQuestionIndex];
        }

        return undefined;
    }
}
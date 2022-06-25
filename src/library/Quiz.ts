import IQuestion, { IQuestionAnswered } from "./IQuestion";

export interface IQuizPosition {
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
    getNextQuestion(currentQuestionID: number): IQuestion | undefined;
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

    getQuestionPosititon(questionID: number): IQuizPosition {
        const questionIndex = this.getQuestionIndexByID(questionID);
        return {
            current: questionIndex + 1,
            total: this.questions.length
        }
    }

    getQuestionIndexByID(questionID: number): number {
        return this.questions.reduce((previosValue, question, index) => {
            if (question.id == questionID) {
                return previosValue + index;
            }
            return previosValue;        
        }, 0);
    }

    getQuestionByID(questionID: number): IQuestion | undefined {
        return this.questions.find((question) => question.id == questionID);
    }

    getFirstQuestionID() {
        return this.questions[0].id;
    }

    getNextQuestion(currentQuestionID: number): IQuestion | undefined {
        const currentQuestionIndex = this.getQuestionIndexByID(currentQuestionID);
        const nextQuestionIndex = currentQuestionIndex + 1;
        if (nextQuestionIndex in this.questions) {
            return this.questions[nextQuestionIndex];
        }
    
        return undefined;
    }
}
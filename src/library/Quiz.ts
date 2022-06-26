import IQuestion, { ISelectedAnswer, IQuestionOption } from "./IQuestion";

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
    getScore(): number;
    getQuestionPosititon(questionID: number): IQuizPosition;
    getQuestionByID(questionID: number): IQuestion | undefined;
    /** Returns first or next question in the list */
    getNextQuestion(currentQuestionID: number): IQuestion | undefined;
    getFirstQuestionID(): number;
    addAnswer(questionID: number, answer: IQuestionOption): void;
    removeAnswer(questionID: number, answer: IQuestionOption): void;
    addGroupAnswer(questionID: number, answer: IQuestionOption): void;
    gradeQuestion(questionID: number): boolean;
}

export default class Quiz implements IQuiz {
    private name: string;
    private questions: IQuestion[];
    private id: number;
    private answeredQuestions: ISelectedAnswer[] = [];

    constructor(params: IQuizData) {
        this.name = params.name;
        this.questions = params.questions
        this.id = params.id;
    }

    addAnswer(questionID: number, answer: IQuestionOption) {
        const foundAnswer = this.answeredQuestions.find(
            (sa) => sa.questionID == questionID && sa.answerID == answer.id
        );

        if (foundAnswer) {
            return;
        }

        this.answeredQuestions.push({
            answerID: answer.id,
            questionID
        });

        console.log(this.answeredQuestions, "answers");
        return;
    }

    removeAnswer(questionID: number, answer: IQuestionOption) {
        this.answeredQuestions = this.answeredQuestions.filter((sa) => {
            return sa.questionID !== questionID && sa.answerID !== answer.id;
        });
        return;
    }

    addGroupAnswer(questionID: number, answer: IQuestionOption) {
        // Only one answer per group
        // @TODO shoudl propably
        // have the add answer be smart enough to know
        // wether or not the answer/question belongs to a
        // group.
        this.removeAnswer(questionID, answer);
        this.addAnswer(questionID, answer);
        return;
    }

    gradeQuestion(questionID: number): boolean {
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
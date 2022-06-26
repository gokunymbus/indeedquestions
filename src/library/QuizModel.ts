import IQuestion, { IQuestionOption, QuestionType } from "./IQuestion";

export enum GradeResponses {
    ERROR_NO_ANSWERS,
    FAILED,
    PASSED
}

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

export interface IQuizModel {
    getScore(): number;
    getQuestionPosititon(questionID: number): IQuizPosition;
    getQuestionByID(questionID: number): IQuestion | undefined;
    /** Returns first or next question in the list */
    getNextQuestion(currentQuestionID: number): IQuestion | undefined;
    getFirstQuestionID(): number;
    addAnswer(questionID: number, answer: IQuestionOption): void;
    removeAnswer(questionID: number, answer: IQuestionOption): void;
    addGroupAnswer(questionID: number, answer: IQuestionOption): void;
    gradeQuestion(questionID: number): GradeResponses;
}

export default class QuizModel implements IQuizModel {
    private name: string;
    private questions: IQuestion[];
    private id: number;
    private selectedQuestions: ISelectedAnswer[] = [];
    private completedQuestions: number[] = [];

    constructor(params: IQuizData) {
        this.name = params.name;
        this.questions = params.questions
        this.id = params.id;
    }

    private _insertAnswer(questionID: number, answer: IQuestionOption) {
        this.selectedQuestions.push({
            option: answer,
            questionID
        });
    }

    private _insertCompletedQuestion(questionID: number) {
        this.completedQuestions.push(questionID);
    }
    
    addAnswer(questionID: number, answer: IQuestionOption) {
        const question = this.getQuestionByID(questionID);
        if (question?.type === QuestionType.SINGLE.toString()) {
            this.addGroupAnswer(questionID, answer);
            return;
        }

        const foundAnswer = this.selectedQuestions.find(
            (sa) => sa.questionID == questionID
                && sa.option.id == answer.id
        );

        if (foundAnswer) {
            return;
        }

        this._insertAnswer(questionID, answer);

        console.log(this.selectedQuestions, "answers");
        return;
    }

    removeAnswer(questionID: number, answer: IQuestionOption) {
        this.selectedQuestions = this.selectedQuestions.filter((sa) => {
            return sa.questionID !== questionID
                && sa.option.id !== answer.id;
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
        this._insertAnswer(questionID, answer);
        console.log(this.selectedQuestions, "radio");
        return;
    }

    getAnswersByQuestionID(questionID: number): ISelectedAnswer[] {
        return this.selectedQuestions.filter((aq) => {
            return aq.questionID == questionID
        });
    }

    getCompletedQuestionByID(questionID: number): IQuestion | undefined {
        if (questionID in this.completedQuestions) {
            return this.getQuestionByID(questionID);
        }
        return;
    }

    gradeQuestion(questionID: number): GradeResponses {
        const answers = this.getAnswersByQuestionID(questionID);

        if (answers.length === 0) {
            return GradeResponses.ERROR_NO_ANSWERS;
        }

        const correctAnswers = answers.filter((answer) =>
            answer.option.isCorrect
        );

       this._insertCompletedQuestion(questionID);

        if (correctAnswers.length == 0) {
            return GradeResponses.FAILED;
        }

        return GradeResponses.PASSED;
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
        const nextQuestionIndex = this.getQuestionIndexByID(currentQuestionID) + 1;
        if (nextQuestionIndex in this.questions) {
            return this.questions[nextQuestionIndex];
        }
        return undefined;
    }

    getPreviousQuestion(currentQuestionID: number): IQuestion | undefined {
        const nextQuestionIndex = this.getQuestionIndexByID(currentQuestionID) - 1;
        if (nextQuestionIndex in this.questions) {
            return this.questions[nextQuestionIndex];
        }
    
        return undefined;
    }
}
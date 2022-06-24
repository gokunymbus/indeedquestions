import IQuestion from "./IQuestion";

export default interface IQuizResult {
    questions: IQuestion[],
    finalScore: number,
    finalTime: number,
    dateCompleted: Date
}
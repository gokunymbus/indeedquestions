import { IQuizData, IQuizResult, getScore } from "./QuizModel";

const storageKey = "quiz-storage";

export function setQuizResults(quiz: IQuizData) {
    const { questions } = quiz;
    const quizResult: IQuizResult[] = [];
    const existingQuizResults: string | null = localStorage.getItem(storageKey);
    if (!existingQuizResults) {
        quizResult.push({
            dateCompleted: new Date().toString(),
            points: getScore(questions),
            totalQuestions: questions.length,
            correctQuestions:0
        });
        localStorage.setItem(storageKey, JSON.stringify(quiz));
    }

    const formatedResults = JSON.parse(existingQuizResults!);


 
}

export function getQuizResults() {

}
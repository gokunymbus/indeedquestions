import jsondata from '../data/quizes.json';
import { IQuizData } from "./QuizModel";

export function fetchQuizes(): Promise<IQuizData> {
    return Promise.resolve(jsondata);
}



# Data
First i want to outline as much data as we need for the application to run starting
with some rough outlines of interfaces.

```
IQuestion {
    id: number;
    name: string;
    description: string;
    answers: [IAnswer]
}

IAnswer {
    id: number;
    name: string;
    isCorrect: boolean;
}

IQuizResult {
    questions: [IQuestion];
    finalScore: number;
    finalTime: number;
    dateCompleted: Date
}

```

# Classes

```
IQuiz {
    gradeAnswers(IAnswer[]): boolean;
    getScore();
    getQuestionPosition();
    getNextQuestion() IQuestion | false;
    getResults();
}

IQuizHistory {
    storeResults() : IQuizResults[]
    getResults();
}

```
# Components

<Game>
    <Question>
        <Answer>
    <Results>







export type PuzzleFunction = (input: string) => number;

export type PuzzlePart = {
    expectedResult: ExpectedResult;
    solve: PuzzleFunction;
};

export type ExpectedResult = {
    example: number;
    full: number;
};

export type PuzzleSolver = {
    part1: PuzzlePart;
    part2: PuzzlePart;
};

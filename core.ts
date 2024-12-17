export type PuzzleOutput = number | bigint | string;

export type PuzzleFunction = (input: string) => PuzzleOutput;

export type PuzzlePart = {
    expectedResult: ExpectedResult;
    solve: PuzzleFunction;
};

export type ExpectedResult = {
    example: PuzzleOutput;
    full: PuzzleOutput;
};

export type PuzzleSolver = {
    part1: PuzzlePart;
    part2: PuzzlePart;
};

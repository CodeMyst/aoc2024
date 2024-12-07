import type { PuzzleSolver } from '../../core';

const calculateCalibrationResult = (input: string, allowConcatenation: boolean): number => {
    const lines = input.split('\n').filter(l => l.length > 0);

    const solve = (expected: number, numbers: number[], currentResult: number, currentOperator: string, currentIndex: number): boolean => {
        let result = 0;
        if (currentOperator === '+') {
            result = currentResult + numbers[currentIndex];
        } else if (currentOperator === '*') {
            result = currentResult * numbers[currentIndex];
        } else {
            result = currentResult * Math.pow(10, Math.floor(Math.log10(numbers[currentIndex])) + 1) + numbers[currentIndex];
        }

        if (currentIndex === numbers.length - 1) {
            return result === expected;
        }

        if (result > expected) return false;

        if (solve(expected, numbers, result, '+', currentIndex + 1)) return true;
        if (solve(expected, numbers, result, '*', currentIndex + 1)) return true;
        if (allowConcatenation && solve(expected, numbers, result, '||', currentIndex + 1)) return true;

        return false;
    };

    let calibrationResult = 0;

    for (const line of lines) {
        const separatorIndex = line.indexOf(':');
        const expected = Number(line.slice(0, separatorIndex));
        const numbers = line.slice(separatorIndex + 2, line.length).split(' ').map(Number);

        if (solve(expected, numbers, numbers[0], '+', 1)) { calibrationResult += expected; continue; }
        if (solve(expected, numbers, numbers[0], '*', 1)) { calibrationResult += expected; continue; }
        if (allowConcatenation && solve(expected, numbers, numbers[0], '||', 1)) { calibrationResult += expected; continue; }
    }

    return calibrationResult;
};

export const solve: PuzzleSolver = {
    part1: {
        expectedResult: { example: 3749, full: 28_730_327_770_375 },

        solve: (input: string): number => {
            return calculateCalibrationResult(input, false);
        }
    },

    part2: {
        expectedResult: { example: 11_387, full: 424_977_609_625_985 },

        solve: (input: string): number => {
            return calculateCalibrationResult(input, true);
        }
    }
};

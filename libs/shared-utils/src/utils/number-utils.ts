/**
 * Generates a sequence of numbers from a starting point to an ending point.
 *
 * The function supports both ascending and descending sequences:
 * - If start is less than or equal to end, the sequence will be in ascending order.
 * - If start is greater than end, the sequence will be in descending order.
 *
 * @param {number} start - The starting number of the sequence.
 * @param {number} end - The ending number of the sequence.
 * @returns {number[]} An array containing the sequence of numbers from start to end.
 */
function numberSequence(start: number, end: number) {
  const sequence = [];
  const step = start <= end ? 1 : -1; // determine how much the function adds or subtracts each time

  for (let i = start; step > 0 ? i <= end : i >= end; i += step) {
    sequence.push(i);
  }

  return sequence;
}

export { numberSequence };

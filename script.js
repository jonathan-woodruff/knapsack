/* 
*This is the knapsack problem where you are trying to maximize the value of items taken while staying
*under the weight limit.
*When thinking about the solution, it seemed like I needed a dynamic number of for loops to compare each
*possible combination of weights, which is not strictly possible. My workaround is to essentially absorb
*two elements together and then sum it with another element recursively.
*/

let globalMax = 0;

//move up one level back to the previous saved weights, values, and indices
function levelUp(weightCap, nestingRecords, level) {
  if (level === 1) return;
  level--;
  let prevIndex1 = nestingRecords[level].index1;
  let prevIndex2 = nestingRecords[level].index2;
  let prevWeights = nestingRecords[level].weights;
  let prevValues = nestingRecords[level].values;
  if (prevIndex2 < prevWeights.length - 1) {
    prevIndex2++;
    nestingRecords[level] = {
      weights: prevWeights,
      values: prevValues,
      index1: prevIndex1,
      index2: prevIndex2
    };
    checkPair(weightCap, nestingRecords, level);
  } else if (prevIndex1 < prevWeights.length - 2) {
    prevIndex1++;
    prevIndex2 = prevIndex1 + 1;
    nestingRecords[level] = {
      weights: prevWeights,
      values: prevValues,
      index1: prevIndex1,
      index2: prevIndex2
    };
    checkPair(weightCap, nestingRecords, level);
  } else {
    level--;
    levelUp(weightCap, nestingRecords, level);
  }
}

//recursively check each combination of weights and values
function checkPair(weightCap, nestingRecords, level) {
    let { weights, values, index1, index2 } = nestingRecords[level];
    const weightsCopy = [...weights];
    const valuesCopy = [...values];
    if (weightsCopy[index1] !== 0 && weightsCopy[index2] !== 0 && weightsCopy[index1] + weightsCopy[index2] <= weightCap) {
        weightsCopy[index1] = weightsCopy[index1] + weightsCopy[index2];
        let localMax = valuesCopy[index1] + valuesCopy[index2];
        valuesCopy[index1] = localMax;
        if (localMax > globalMax) globalMax = localMax;
        weightsCopy[index2] = 0;
        valuesCopy[index2] = 0;
        if (index2 < weightsCopy.length - 1) {
          level++;
          index2++;
          nestingRecords[level] = {
            weights: weightsCopy,
            values: valuesCopy,
            index1: index1,
            index2: index2
          };
          checkPair(weightCap, nestingRecords, level)
        } else if (index1 < weightsCopy.length - 2) {
          level++;
          index1++;
          index2 = index1 + 1;
          nestingRecords[level] = {
            weights: weightsCopy,
            values: valuesCopy,
            index1: index1,
            index2: index2
          }
          checkPair(weightCap, nestingRecords, level)
        } else {
          levelUp(weightCap, nestingRecords, level)
        }
    } else if (index2 < weightsCopy.length - 1) {
        index2++;
        nestingRecords[level] = {
          weights: weightsCopy,
          values: valuesCopy,
          index1: index1,
          index2: index2
        }
        checkPair(weightCap, nestingRecords, level);
    } else if (index1 < weightsCopy.length - 2) {
        index1++;
        index2 = index1 + 1;
        nestingRecords[level] = {
          weights: weightsCopy,
          values: valuesCopy,
          index1: index1,
          index2: index2
        };
        checkPair(weightCap, nestingRecords, level);
    } else {
      levelUp(weightCap, nestingRecords, level)
    }
  }
  
  function knapsack(weightCap, weights, values) {
    //check for valid input
    if (weights.length !== values.length) {
      throw Error('invalid input');
    }
    //clean up weights/values if any input weight is invalid
    for (let i = 0; i < weights.length; i++) {
      if (weights[i] < 1 || weights[i] > weightCap) {
        weights.splice(i,1);
        values.splice(i,1);
      }
    }
    //run through the values array once to grab the biggest value as the initial globalMax
    values.forEach(value => globalMax = value > globalMax ? value : globalMax);
    //nestingRecords stores the data necessary to go backtrack up levels of recursion
    let nestingRecords = {
      1: { //level 1
        weights: weights,
        values: values,
        index1: 0,
        index2: 1
      }
    }
    //initiate the recursive checking of pairs of weights/values
    checkPair(weightCap, nestingRecords, 1);
    return globalMax;
  }
  
  // Use this to test your function:
  const weightCap = 10;
  const weights = [1, 5, 8];
  const val = [3, 5, 20];
  console.log(knapsack(weightCap, weights, val));
  
  // Leave this so we can test your code:
  module.exports = knapsack;
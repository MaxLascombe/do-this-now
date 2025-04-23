/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_HISTORY_ARN
	STORAGE_HISTORY_NAME
	STORAGE_HISTORY_STREAMARN
	STORAGE_TASKS_ARN
	STORAGE_TASKS_NAME
	STORAGE_TASKS_STREAMARN
Amplify Params - DO NOT EDIT */

// eslint-disable-next-line
const { dateString, nextDueDate } = require('/opt/nodejs/helpers')
// eslint-disable-next-line
const ENV = require('process').env
// eslint-disable-next-line
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()

/**
 * Calculate todo for a given number of days
 * @param {Date} today - The reference date
 * @param {number} days - Number of days to look ahead
 * @param {Array} allTasks - All tasks from the database
 * @param {number} done - Minutes already done today
 * @returns {Object} - Object containing todo and theoreticalMinimum
 */
function calculateTodoForDays(today, days, allTasks, done) {
  const endDate = new Date(today)
  endDate.setDate(endDate.getDate() + days)

  let totalTimeInPeriod = 0
  let theoreticalMinimum = 0
  let repeatingTasks = []

  for (const task of allTasks) {
    const time = parseInt(task.timeFrame)
    let due = new Date(task.due)
    
    // Calculate theoretical minimum for repeating tasks
    if (task.repeat !== 'No Repeat') {
      // Determine repeat frequency in days
      let repeatFrequency = 1; // Default to daily
      
      if (task.repeat === 'Daily') {
        repeatFrequency = 1;
      }
      else if (task.repeat === 'Weekdays') {
        // Weekdays (Mon-Fri) means 5 out of 7 days
        repeatFrequency = 7/5;
      }
      else if (task.repeat === 'Weekly') {
        repeatFrequency = 7;
      }
      else if (task.repeat === 'Monthly') {
        repeatFrequency = 30;
      }
      else if (task.repeat === 'Yearly') {
        repeatFrequency = 365;
      }
      else if (task.repeat === 'Custom') {
        if (task.repeatUnit === 'day') {
          repeatFrequency = task.repeatInterval;
        }
        else if (task.repeatUnit === 'week') {
          // Check if specific weekdays are selected
          if (task.repeatWeekdays && Array.isArray(task.repeatWeekdays) && task.repeatWeekdays.some(x => x)) {
            // Count the number of selected weekdays
            const selectedWeekdaysCount = task.repeatWeekdays.filter(x => x).length;
            // Calculate frequency as (7 * interval) / number of selected weekdays
            repeatFrequency = (7 * task.repeatInterval) / selectedWeekdaysCount;
          } else {
            // If no weekdays specified, assume weekly (7 * interval days)
            repeatFrequency = 7 * task.repeatInterval;
          }
        }
        else if (task.repeatUnit === 'month') {
          repeatFrequency = 30 * task.repeatInterval;
        }
        else if (task.repeatUnit === 'year') {
          repeatFrequency = 365 * task.repeatInterval;
        }
      }
      
      // Add the daily contribution to theoretical minimum
      const dailyContribution = time / repeatFrequency;
      theoreticalMinimum += dailyContribution;
      
      // Add to repeating tasks array
      repeatingTasks.push([task.title, dailyContribution]);
    }
    
    while (due !== undefined && due <= endDate) {
      totalTimeInPeriod += time
      if (task.repeat === 'No Repeat') break
      due = nextDueDate({
        ...task,
        due: dateString(due),
      })
    }
  }
  
  const todo = Math.ceil((totalTimeInPeriod + done) / days)
  theoreticalMinimum = Math.ceil(theoreticalMinimum);
  
  return {
    todo,
    theoreticalMinimum,
    repeatingTasks
  }
}

/**
 * Find the minimum number of days needed to complete all tasks within the capped todo goal
 * @param {Date} today - The reference date
 * @param {Array} allTasks - All tasks from the database
 * @param {number} done - Minutes already done today
 * @param {number} cappedTodo - The capped todo goal
 * @returns {number} - Minimum number of days needed
 */
function findMinimumDaysNeeded(today, allTasks, done, cappedTodo) {
  // Start with 14 days
  let days = 14;
  let result = calculateTodoForDays(today, days, allTasks, done);
  let todo = result.todo
  
  // If todo is already less than cappedTodo, return 14
  if (todo <= cappedTodo) {
    return 14;
  }
  
  // Double the days until we find a todo less than cappedTodo
  while (todo > cappedTodo) {
    days *= 2;
    result = calculateTodoForDays(today, days, allTasks, done);
    todo = result.todo
  }
  
  // Now we have an upper bound (days) and a lower bound (days/2)
  let lowerBound = days / 2;
  let upperBound = days;
  
  // Binary search to find the minimum days needed
  while (upperBound - lowerBound > 1) {
    const mid = Math.floor((lowerBound + upperBound) / 2);
    result = calculateTodoForDays(today, mid, allTasks, done);
    todo = result.todo
    
    if (todo <= cappedTodo) {
      upperBound = mid;
    } else {
      lowerBound = mid;
    }
  }
  
  return upperBound;
}

/**
 * Find the minutes that will be added on the day that occurs in daysUntilAllDone + 1
 * @param {Date} today - The reference date
 * @param {Array} allTasks - All tasks from the database
 * @param {number} daysUntilAllDone - Today's daysUntilAllDone value
 * @returns {number} - Minutes that will be added on the target day
 */
function findMinutesOnTargetDay(today, allTasks, daysUntilAllDone) {
  // Calculate the target date (the day that occurs in daysUntilAllDone + 1)
  const targetDate = new Date(today);
  targetDate.setDate(targetDate.getDate() + daysUntilAllDone + 1);
  
  let totalMinutesOnTargetDay = 0;
  
  // Check each task to see if it's due on the target day
  for (const task of allTasks) {
    const time = parseInt(task.timeFrame);
    let due = new Date(task.due);
    
    // If the task is due on the target day, add its minutes
    if (due.getTime() === targetDate.getTime()) {
      totalMinutesOnTargetDay += time;
    }
    
    // For repeating tasks, check if they repeat on the target day
    if (task.repeat !== 'No Repeat') {
      // Check if the task repeats on the target day
      let isDueOnTargetDay = false;
      
      if (task.repeat === 'Daily') {
        isDueOnTargetDay = true;
      }
      else if (task.repeat === 'Weekdays') {
        // Check if target day is a weekday (1-5, where 0 is Sunday)
        const dayOfWeek = targetDate.getDay();
        isDueOnTargetDay = dayOfWeek >= 1 && dayOfWeek <= 5;
      }
      else if (task.repeat === 'Weekly') {
        // Check if the target day is the same day of the week as the original due date
        isDueOnTargetDay = due.getDay() === targetDate.getDay();
      }
      else if (task.repeat === 'Monthly') {
        // Check if the target day is the same day of the month as the original due date
        isDueOnTargetDay = due.getDate() === targetDate.getDate();
      }
      else if (task.repeat === 'Yearly') {
        // Check if the target day is the same day and month as the original due date
        isDueOnTargetDay = due.getDate() === targetDate.getDate() && 
                           due.getMonth() === targetDate.getMonth();
      }
      else if (task.repeat === 'Custom') {
        // For custom repeats, we need to check if the target day matches the pattern
        if (task.repeatUnit === 'day') {
          // Calculate days between original due date and target date
          const daysDiff = Math.floor((targetDate - due) / (1000 * 60 * 60 * 24));
          isDueOnTargetDay = daysDiff % task.repeatInterval === 0;
        }
        else if (task.repeatUnit === 'week') {
          // For weekly repeats, check if specific weekdays are selected
          if (task.repeatWeekdays && Array.isArray(task.repeatWeekdays)) {
            const dayOfWeek = targetDate.getDay();
            isDueOnTargetDay = task.repeatWeekdays[dayOfWeek] === true;
          } else {
            // If no weekdays specified, check if it's the same day of the week
            isDueOnTargetDay = due.getDay() === targetDate.getDay();
          }
        }
        else if (task.repeatUnit === 'month') {
          // For monthly repeats, check if it's the same day of the month
          isDueOnTargetDay = due.getDate() === targetDate.getDate();
        }
        else if (task.repeatUnit === 'year') {
          // For yearly repeats, check if it's the same day and month
          isDueOnTargetDay = due.getDate() === targetDate.getDate() && 
                             due.getMonth() === targetDate.getMonth();
        }
      }
      
      // If the task is due on the target day, add its minutes
      if (isDueOnTargetDay) {
        totalMinutesOnTargetDay += time;
      }
    }
  }
  
  return totalMinutesOnTargetDay;
}

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async event => {
  console.log(`EVENT: ${JSON.stringify(event)}`)

  const today =
    'queryStringParameters' in event && 'date' in event.queryStringParameters
      ? new Date(event.queryStringParameters.date)
      : new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate(),
          0,
          0,
          0
        )

  console.log(`TODAY: ${today}`)

  console.log(`DATESTRING TODAY: ${dateString(today)}`)

  const historyGetParams = {
    TableName: ENV.STORAGE_HISTORY_NAME,
    Key: {
      date: dateString(today),
    },
  }

  let data = await docClient.get(historyGetParams).promise()

  console.log(data.Item?.tasks)

  let done = 0
  for (const t of data?.Item?.tasks ?? [])
    done +=
      'timeFrame' in t
        ? typeof t.timeFrame === 'string'
          ? parseInt(t.timeFrame)
          : t.timeFrame
        : 0

  console.log(done)

  const params = {
    TableName: ENV.STORAGE_TASKS_NAME,
  }
  const allTasks = (await docClient.scan(params).promise()).Items

  // Calculate todo for 14 days (original logic)
  const result14Days = calculateTodoForDays(today, 14, allTasks, done);
  const todo = result14Days.todo;
  const theoreticalMinimum = result14Days.theoreticalMinimum;
  const repeatingTasks = result14Days.repeatingTasks;
  
  // Calculate the capped todo
  const cappedTodo = Math.min(todo, Math.max(theoreticalMinimum + 60, 15.5 * 60))
  
  // Find the minimum number of days needed to complete all tasks within the capped todo goal
  const daysUntilAllDone = findMinimumDaysNeeded(today, allTasks, done, cappedTodo);
  
  // Calculate the minutes that will be added on the day that occurs in daysUntilAllDone + 1
  const minutesOnTargetDay = findMinutesOnTargetDay(today, allTasks, daysUntilAllDone);

  console.log(`DONE: ${done}`)
  console.log(`TODO: ${todo}`)
  console.log(`THEORETICAL MINIMUM: ${theoreticalMinimum}`)
  console.log(`DAYS UNTIL ALL DONE: ${daysUntilAllDone}`)
  console.log(`MINUTES ON TARGET DAY: ${minutesOnTargetDay}`)
  console.log(`REPEATING TASKS: ${JSON.stringify(repeatingTasks)}`)

  const streakBeforeToday = data?.Item?.streakBeforeToday ?? 0
  const lives = data?.Item?.lives ?? 0
  let streak = streakBeforeToday
  let streakIsActive = false

  if (done + lives >= todo) {
    // done with today's tasks
    streak++
    streakIsActive = true

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const tomorrowHistoryUpdateParams = {
      TableName: ENV.STORAGE_HISTORY_NAME,
      Key: {
        date: dateString(tomorrow),
      },
      UpdateExpression: 'set #x = :y, #x2 = :y2',
      ExpressionAttributeNames: { '#x': 'streakBeforeToday', '#x2': 'lives' },
      ExpressionAttributeValues: {
        ':y': streak,
        ':y2': done + lives - todo,
      },
    }

    console.log(await docClient.update(tomorrowHistoryUpdateParams).promise())
  }

  const res = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    },
    body: JSON.stringify({
      done,
      lives,
      todo: cappedTodo,
      streak,
      streakIsActive,
      theoreticalMinimum,
      daysUntilAllDone,
      minutesToReduceTomorrowDays: minutesOnTargetDay,
    }),
  }

  console.log(`RETURN: ${JSON.stringify(res)}`)

  return res
}

/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_TASKS_ARN
	STORAGE_TASKS_NAME
	STORAGE_TASKS_STREAMARN
Amplify Params - DO NOT EDIT */

const ENV = require('process').env

const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`)

    if (
        !event.hasOwnProperty('queryStringParameters') ||
        !event.queryStringParameters.hasOwnProperty('title')
    )
        return error('Missing title!')

    const title = event.queryStringParameters.title

    const params = {
        TableName: ENV.STORAGE_TASKS_NAME,
        Key: {
            title,
        },
    }

    const data = await docClient.get(params).promise()

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
        },
        body: JSON.stringify(data),
    }
}

const error = (m) => ({
    statusCode: 502,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
    },
    body: JSON.stringify(m),
})
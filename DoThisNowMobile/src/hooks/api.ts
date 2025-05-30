import { get, post } from 'aws-amplify/api'

export const handleGet = async ({
  path,
  headers,
  queryParams = {},
}: {
  path: string
  headers?: { [key: string]: string }
  queryParams?: { [key: string]: string }
}) => {
  const response = await get({
    apiName: 'tasks',
    path,
    options: {
      headers,
      queryParams,
    },
  }).response
  return await response.body.json()
}

export const handlePost = async ({
  path,
  headers,
  body = {},
}: {
  path: string
  headers?: { [key: string]: string }
  body?: object
}) => {
  const response = await post({
    apiName: 'tasks',
    path,
    options: {
      body,
      headers,
    },
  }).response
  return await response.body.json()
}

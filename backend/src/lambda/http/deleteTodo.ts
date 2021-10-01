import 'source-map-support/register'
import {APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { deleteItem } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'
const logger = createLogger('deleteTodo')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  
  logger.info('delete event', { event })
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  await deleteItem(todoId, jwtToken)
  return {
    statusCode: 204,
    body: ''
  }
})  
handler.use(
  cors({
    credentials: true
  })
)


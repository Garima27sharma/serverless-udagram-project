import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { updateTodo } from '../../businessLogic/todos'
import * as middy from 'middy'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
const logger = createLogger('updateTodo')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('update event', {event})
  const todoId = event.pathParameters.todoId
  console.log(todoId)
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  console.log(updatedTodo)
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  await updateTodo(todoId, updatedTodo, jwtToken)
  return {
    statusCode: 200,
    body: JSON.stringify({})
  }
})
handler.use(
  cors({
    credentials: true
  })
)


 



import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { create } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('createTodo')
export const handler= middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('create event', { event })  

  const createNew: CreateTodoRequest = JSON.parse(event.body)
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  const items = await create(createNew, jwtToken)
  return {
    statusCode: 201,
    body: JSON.stringify({
      item: items
    })
  }
})
handler.use(
  cors({
    credentials: true
  })
)


 
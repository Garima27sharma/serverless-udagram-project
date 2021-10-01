import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getData } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('auth')
export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Get current user', event)
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  const item = await getData(jwtToken)

  return {
    statusCode: 200,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true 
      },
    body: JSON.stringify({
      items: item
    })
  }
})

handler.use(
  cors({
    credentials: true
  })
)


    
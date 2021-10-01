import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import * as middy from 'middy'
import {updateUrl } from '../../businessLogic/todos'
import * as AWS from 'aws-sdk'
import { cors } from 'middy/middlewares'
import * as uuid from 'uuid'
import * as AWSXRay from 'aws-xray-sdk'
const XAWS = AWSXRay.captureAWS(AWS)
const siv = new XAWS.S3({
  signatureVersion: 'v4'
})
const toStore = process.env.ATTACHMENTS_S3_BUCKET
const expire = process.env.SIGNED_URL_EXPIRATION
const logger = createLogger('generateUploadUrl')
export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('generateUrl event creation', { event })

  const todoId = event.pathParameters.todoId
  console.log(todoId)
  
  const imaId = uuid.v4()
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const imUrl = `https://${toStore}.s3.amazonaws.com/${imaId}`
  updateUrl(
	    todoId, imUrl,
    	jwtToken
  )
  const uploadUrl = getUploadUrl(imaId)
  return {
    statusCode: 200,
    body: JSON.stringify({
      uploadUrl
    })
   }
})
handler.use(
  cors({
    credentials: true
  })
)
function getUploadUrl(imaId: string) {
  return siv.getSignedUrl('putObject', {
    Bucket: toStore,
    Key: imaId,
    Expires:parseInt(expire) 
  })
}


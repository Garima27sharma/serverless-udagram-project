import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

export class TodoStorage {

  constructor(
    private readonly expire = process.env.SIGNED_URL_EXPIRATION,
    private readonly toStore = process.env.ATTACHMENTS_S3_BUCKET,
    private readonly siv = new XAWS.S3({ signatureVersion: 'v4' }),
  ) {}

  async getUploadUrl(addId: string): Promise<string> {
    const uploadUrl = this.siv.getSignedUrl('putObject', {
      Bucket: this.toStore,
      Key: addId,
      Expires: parseInt(this.expire)
    })
    return uploadUrl
  }
  async urlGet(addId: string): Promise<string> {
    const attachmentUrl = `https://${this.toStore}.s3.amazonaws.com/${addId}`
    return attachmentUrl
  }

 

}



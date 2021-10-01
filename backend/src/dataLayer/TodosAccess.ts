import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { createLogger } from '../utils/logger'

const logger = createLogger('todosAccess')

export class TodosAccess {
  constructor(
    private readonly dbDoc: DocumentClient = newCreateDynamoDBClient(),
    private readonly todosInfoTable = process.env.TODOS_TABLE,
  ) { }

  async todoNewDb(todoItem: TodoItem): Promise<TodoItem> {
    logger.info(`item put into table ${this.todosInfoTable}`)

    await this.dbDoc.put({
      TableName: this.todosInfoTable,
      Item: todoItem,
    }).promise()

    return todoItem
  }

  async modifyTodo(todoId: string, userId: string, todoUpdate: TodoUpdate): Promise<TodoUpdate> {

    logger.info(`item update by ${todoId}`)
    await this.dbDoc.update({
      TableName: this.todosInfoTable,
      Key: {
        todoId,
        userId
      },
      UpdateExpression: 'set #name = :name, dueDate = :td, done = :f',
      ExpressionAttributeNames: {
        "#name": "name"
      },
      ExpressionAttributeValues: {
        ":name": todoUpdate.name,
        ":td": todoUpdate.dueDate,
        ":f": todoUpdate.done
      },
      ReturnValues: 'UPDATED_NEW'
      
    }).promise()
    return todoUpdate
  }
  
  async updateTodoUrl(todoId: string, userId: string, attachmentUrl: string): Promise<void> {
    logger.info(`URL change by ${todoId}`)

    await this.dbDoc.update({
      TableName: this.todosInfoTable,
      Key: {
        todoId,
        userId
      },
      UpdateExpression: 'set attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': attachmentUrl
      },
      ReturnValues: 'UPDATED_NEW'
    }).promise()
  }
 
  async addsToDb(userId: string): Promise<TodoItem[]> {
    logger.info(`retrieve items for ${userId}`)

    const con = await this.dbDoc.query({
      TableName: this.todosInfoTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise()
    const items = con.Items
    return items as TodoItem[]
  }

  async removeToDb(todoId: string, userId: string): Promise<void> {
    logger.info(`items removed by ${todoId}`)

    await this.dbDoc.delete({
      TableName: this.todosInfoTable,
      Key: {
        todoId,
        userId
      }
    }).promise()
  }
}

function newCreateDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Create local DB instance')
    return new AWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:3000'
    })
  }
  return new AWS.DynamoDB.DocumentClient()
}

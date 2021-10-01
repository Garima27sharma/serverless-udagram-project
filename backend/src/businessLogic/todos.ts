import 'source-map-support/register'
import * as uuid from 'uuid'
import { TodosAccess } from '../dataLayer/TodosAccess'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { createLogger } from '../utils/logger'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { parseUserId } from '../auth/utils'


const todoAcc = new TodosAccess()
const logger = createLogger('todos')

export async function updateTodo(todoId: string, updateTodoRequest: UpdateTodoRequest, jwtToken: string): Promise<TodoUpdate> {
  
  const userId = parseUserId(jwtToken)
  logger.info(`modify data for user`, { userId })
  return await todoAcc.modifyTodo(todoId, userId, updateTodoRequest)
}

export async function updateUrl(todoId: string, attachmentUrl: string, jwtToken: string): Promise<void> {

  const userId = parseUserId(jwtToken)
  return await todoAcc.updateTodoUrl(todoId, userId, attachmentUrl)
}

export async function create(createTodoRequest: CreateTodoRequest, jwtToken: string): Promise<TodoItem> {

  const userId = parseUserId(jwtToken)
  logger.info(`create data for user`, { userId })
  const todoId = uuid.v4()

  return await todoAcc.todoNewDb({
    todoId: todoId,
    userId: userId,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    createdAt: new Date().toISOString(),
    done: false
  })
}
 
export async function getData(jwtToken: string): Promise<TodoItem[]> {
  const userId = parseUserId(jwtToken)
  logger.info(`get all data for user`, {userId})

  return todoAcc.addsToDb(userId)
}

export async function deleteItem(todoId: string, jwtToken: string ): Promise<void> {
 
  const userId = parseUserId(jwtToken)
  logger.info(`remove data for user`, { userId })
  return await todoAcc.removeToDb(todoId,userId)
}

import { type Locator, type Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class TodoPage extends BasePage {
  goto() {
      throw new Error('Method not implemented.')
  }
  readonly inputBox: Locator
  readonly todoItem: Locator
  readonly todoModal: Locator
  readonly modalHeading: Locator
  readonly addButton: Locator
  readonly taskSearch: Locator
  readonly emptyList: Locator
  readonly taskChecked: Locator
  readonly todoTask: Locator
  readonly clearButton: Locator
  readonly warningMessage: Locator

  constructor(page: Page) {
    super(page)
    this.inputBox = page.locator('#input-add')
    this.todoItem = page.locator('.todo-item:not(.has-text-danger)')
    this.todoModal = page.locator('.panel')
    this.modalHeading = page.locator('.panel-heading')
    this.addButton = page.locator('#add-btn')
    this.taskSearch = page.locator('#search')
    this.emptyList = page.locator('.panel > .has-text-danger')
    this.taskChecked = page.locator('.toggle')
    this.todoTask = page.locator('#panel .mr-auto')
    this.clearButton = page.locator('#clear')
    this.warningMessage = page.locator('.is-danger')
  }

  // async goto() {
  //   await this.page.goto('https://techglobal-training.com/frontend/project-6')
  // }
  async addTodo(text: string) {
    await this.inputBox.fill(text)
    await this.inputBox.press('Enter')
  }

  async addMultiple(number: number) {
    for(let i = 1; i <= number; i++){
      await this.addTodo(`Task ${i}`)
    } 
  }

  async checkTask(text: string){
    const todo = this.todoItem.filter({hasText: text})
    await todo.hover()
    await todo.locator('.toggle').click()
  }

  async checkMultiple(number: number) {
    for(let i = 1; i <= number; i++){
      await this.checkTask(`Task ${i}`)
  }
  }

  async remove(text: string) {
    const todo = this.todoItem.filter({ hasText: text })
    await todo.hover()

    await todo.locator('.destroy').click()
  }

  async removeAll() {
    while ((await this.todoItem.count()) > 0) {
      await this.todoItem.first().hover()
      await this.todoItem.locator('.destroy').first().click()
    }
  }
}
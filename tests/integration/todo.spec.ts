import { test, expect } from '../../fixtures/page-object-fixtures.'
import { TodoPage } from '../../pages/TodoPage'

test.describe('Todo Tests', async () => {
    let todoPage: TodoPage
    test.beforeEach(async({page}) => {
        await page.goto('/frontend/project-6')
        todoPage = new TodoPage(page)
    })

    test('Test Case 01 - Todo-App Modal Verification', async () => {
        // Confirm that the todo-app modal is visible with the title “My Tasks.”
        await expect(todoPage.todoModal).toBeVisible()
        await expect(todoPage.modalHeading).toHaveText('My Tasks')
        
        // Validate hat the New Todo input field is enabled for text entry.
        await expect(todoPage.inputBox).toBeEnabled()
        
        // Validate ADD button is enabled.
        await expect(todoPage.addButton).toBeEnabled()
        
        // Validate Search field is enabled.
        await expect(todoPage.taskSearch).toBeEnabled()
        
        // Validate that the task list is empty, displaying the message “No task found!”
        let listLength = await todoPage.todoItem.count()
        expect(listLength).toBe(0)
        await expect(todoPage.emptyList).toHaveText('No task found!')
    })

    test('Test Case 02: Single Task Addition and Removal', async () => {
        // Enter a new task in the todo input field and add it to the list.
        await todoPage.addMultiple(1)
        
        // Validate that the new task appears in the task list.
        const newTask = await todoPage.todoItem.innerText()
        await expect(todoPage.todoItem).toContainText(newTask)
        
        // Validate that the number of tasks in the list is exactly 1.
        let listLength = await todoPage.todoItem.count()
        expect(listLength).toBe(1)
        
        // Mark the added task as complete by selecting its checkbox.
        await todoPage.checkTask(newTask)
        
        // Validate item is marked as completed.
        await expect(todoPage.taskChecked).toHaveAttribute('style', 'text-decoration: line-through;')
        
        // Click on the button to remove the item you have added.
        await todoPage.remove(newTask)
        
        // Validate that the task list is empty, displaying the message “No task found!”.
        let listLength2 = await todoPage.todoItem.count()
        expect(listLength2).toBe(0)
        await expect(todoPage.emptyList).toHaveText('No task found!')

    })
    
    test('Test Case 03 - Multiple Task Operations', async () => {
        // Enter and add 5 todo items individually.
        await todoPage.addMultiple(5)

        // Validate that all added items match the items displayed on the list.
        let listLength = await todoPage.todoItem.count()
        for(let i = 1; i <= listLength; i++){
            await expect(todoPage.todoItem.filter({hasText: `Task ${i}`})).toBeVisible()
        }

        // Select all the items you added on the todo list.
        await todoPage.checkMultiple(listLength)

        // Click on the “Remove Selected Items” button to clear the selected tasks.
        await todoPage.clearButton.click()

        // Validate that all tasks are removed, the list is empty and displays “No task found!”.
        let listLength2 = await todoPage.todoItem.count()
        expect(listLength2).toBe(0)
        await expect(todoPage.emptyList).toHaveText('No task found!')
    })

    test('Test Case 04 - Search and Filter Functionality in todo App', async () => {
        // Enter and add 5 todo items individually.
        await todoPage.addMultiple(5)

        //Validate that all added items match the items displayed on the list.
        let listLength = await todoPage.todoItem.count()
        for(let i = 1; i <= listLength; i++){
            await expect(todoPage.todoItem.filter({hasText: `Task ${i}`})).toBeVisible()
        }

        // Enter the complete name of a previously added todo item into the search bar.
        const newTask = await todoPage.todoItem.first().innerText()
        await todoPage.taskSearch.fill(newTask)

        // Validate that the list is now filtered to show only the item you searched for.
        await expect(todoPage.todoItem).toHaveText(newTask)

        // Validate that the number of tasks visible in the list is exactly 1.
        let listLength2 = await todoPage.todoItem.count()
        expect(listLength2).toBe(1)
    })

    test('Test Case 05 - Task Validation and Error Handling', async () => {
        // Attempt to add an empty task to the todo list.
        await todoPage.addTodo('')
        
        // Validate that the task list is empty, displaying the message “No task found!”.
        let listLength = await todoPage.todoItem.count()
        expect(listLength).toBe(0)
        await expect(todoPage.emptyList).toHaveText('No task found!')
        

        // Enter an item name exceeding 30 characters into the list.
        const reallyLongTask = 'This task is really long, probably more than like thirty characters or something'
        await todoPage.addTodo(reallyLongTask)

        // Validate error message appears and says “Error: Todo cannot be more than 30 characters!”.
        await expect(todoPage.warningMessage).toBeVisible()
        await expect(todoPage.warningMessage).toHaveText('Error: Todo cannot be more than 30 characters!')

        
        // Add a valid item name to the list.
        await todoPage.addMultiple(1)
        const repeatTask = await todoPage.todoItem.innerText()

        // Validate that the active task count is exactly one.
        let listLength2 = await todoPage.todoItem.count()
        expect(listLength2).toBe(1)

        // Try to enter an item with the same name already present on the list.
        await todoPage.addMultiple(1)

        // Validate that an error message is displayed, indicating “Error: You already have {item} in your todo list.”.
        await expect(todoPage.warningMessage).toBeVisible()
        await expect(todoPage.warningMessage).toHaveText(`Error: You already have ${repeatTask} in your todo list.`)

    })
})
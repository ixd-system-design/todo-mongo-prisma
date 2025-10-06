// given a string, add it to the database
const createData = async (textInput) => {
  return fetch('/todo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: textInput
    })
  })
    .then(response => {
      if (!response.ok) throw new Error('Failed to create todo')
      return response.json()
    })
    .catch(err => console.log(err))
};

// retrieve a list of all items from the database
const readData = async () => {
  return fetch('/todos', { method: "GET" })
    .then(async response => {
      if (!response.ok) {
        // turn on an error notice in case of any server error
        document.querySelector('#notices').style.display = 'block'
        return []
      }
      return response.json()
    })
    .catch(err => {
      console.log(err)
      document.querySelector('#notices').style.display = 'block'
      return []
    })
};

// given an existing item, 
// update the content for it in the database
const updateData = async (todo) => {
  return fetch('/todo/' + todo.dataset.id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: todo.querySelector('form input').value
    })
  })
    .then(response => {
      if (!response.ok) throw new Error('Failed to update todo')
      return response.json()
    })
    .catch(err => console.log(err))
};

// given an existing item
// remove from database
const deleteData = async (todo) => {
  return fetch('/todo/' + todo.dataset.id, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  })
    .then(response => {
      if (!response.ok) throw new Error('Failed to delete todo')
      return response.json()
    })
    .catch(err => console.log(err))
};

export { createData, readData, updateData, deleteData };

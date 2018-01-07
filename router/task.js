var router = require('koa-router')();
var taskController = require('../controller/taskInfo.js')

var routes = router
.get('/list', taskController.getTasks)
.post('/new', taskController.addTask)
.put('/:taskId', taskController.updateTask)
.delete('/completed', taskController.deleteCompletedTask)
.delete('/:taskId', taskController.deleteTask)

module.exports = routes;
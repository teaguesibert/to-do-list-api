$(document).ready(function(){
  var getAndDisplayAllTasks = function (filter) {
    if (!filter) {
      filter = 'all';
    }

    $.ajax({
      type: 'GET',
      url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=357',
      dataType: 'json',
      success: function (response, textStatus) {
        $('.todo-list').empty();
        var activeTasks = 0;
        
        response.tasks.filter(function (task) {
          if (filter === 'all') {
            return true;
          }
          if (filter === 'active') {
            return !task.completed;
          }
          if (filter === 'completed') {
            return task.completed;
          }
        })
        .forEach(function (task) {
          if (!task.completed) {
            activeTasks++;
          }

          $('.todo-list').append('<div class="todo-item col-12 ' + (task.completed ? 'complete' : '') + '"><input type="checkbox" class="markComplete m-3" data-id="' + task.id + '"' + (task.completed ? 'checked' : '') + '><p class="mt-2">' + task.content + '</p><button class="btn delete btn-danger" data-id="' + task.id + '">&#10005;</button></div>');
        });
        $('.to-do-amount').text(activeTasks.length);
        console.log(activeTasks)
      },
     
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  }
  
  var createTask = function () {
    $.ajax({
      type: 'POST',
      url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=357',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({
        task: {
          content: $('#taskContent').val()
        }
      }),
      success: function (response, textStatus) {
        $('#taskContent').val('');
        getAndDisplayAllTasks();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });  
  }
  
  $('#addTask').on('submit', function (e) {
    e.preventDefault();
    createTask();
  });

  var deleteTask = function (id) {
    $.ajax({
      type: 'DELETE',
      url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + id + '?api_key=357',
      success: function (response, textStatus) {
        getAndDisplayAllTasks();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  }

  $(document).on('click', '.delete', function () {
    deleteTask($(this).data('id'));
  });

  var markTaskComplete = function (id) {
    $.ajax({
      type: 'PUT',
      url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + id + '/mark_complete?api_key=357',
      dataType: 'json',
      success: function (response, textStatus) {
        getAndDisplayAllTasks();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  }

  var markTaskActive = function (id) {
    $.ajax({
      type: 'PUT',
      url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + id + '/mark_active?api_key=357',
      dataType: 'json',
      success: function (response, textStatus) {
        getAndDisplayAllTasks();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  }

  $(document).on('change', '.markComplete', function () {
    if (this.checked) {
      markTaskComplete($(this).data('id'));
    } else {
      markTaskActive($(this).data('id'));
    }
  });

  $('.all-task').on('click', function () {
    getAndDisplayAllTasks('all');
  });
  $('.active-task').on('click', function () {
    getAndDisplayAllTasks('active');
  });
  $('.completed-task').on('click', function () {
    getAndDisplayAllTasks('completed');
  });

function filteredItems() {
  $(this).addClass('active');
  $(this).siblings().removeClass('active');
}
$('.filtered-div button').on('click', filteredItems);
  getAndDisplayAllTasks();
});
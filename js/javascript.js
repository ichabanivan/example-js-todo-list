jQuery.noConflict();
jQuery(function() {});

(function($) {

'use strict';

var listStatus = {
	1: '#undone',
	2: '#inprogress',
	3: '#done'
};


/**
* Get HTML code of item list
*/
function makeItem(data) {
	var html = '';
			html += '<div class="list-group-item-wrapper">';
			html += '<a href="#" class="list-group-item" data-id="' + data.id + '">' + data.title;
			html += '<div class="pull-right">';
			html += '<span>' + data.date + '</span>';
			html += data.isNew ? '<span class="label label-success m-l-r10">new</span>' : '';
			html += '<i class="edit fa fa-pencil"></i>';
			html += '<i class="delete fa fa-times"></i>';
			html += '</div>';
			html += '</a>';
			html += '<div class="well description">' + data.description + '</div>';
			html += '</div>';
	return html;
}
function counter(){
	$('#count-undone').html($('#undone .list-group').children().length);
	$('#count-inprogress').html($('#inprogress .list-group').children().length);
	$('#count-done').html($('#done .list-group').children().length);
}
/**
* Select tasks according to the status
*/
function filterByStatus(tasks, statusId) {
	var result = tasks.filter(function(item) {
		return +item.status === +statusId;
	});
	return result;
}

/**
* Adding element to the DOM list
*/
function printItem(item) {
	$('.list-group', $(listStatus[item.status])).append(makeItem(item));
}

/**
* Print the tasks into specific tabs
*/
function printItems() {
	var dbItems = getDbItems();

	for (var statusId in listStatus) {
		var tasks = filterByStatus(dbItems, statusId);

		tasks.forEach(function(item) {
			printItem(item);
		});
	}
}
/**
* Getting all items from the local storage
*/
function getDbItems() {
	var tasks = [], task, obj;
	for (var id in localStorage) {
		if (localStorage.hasOwnProperty(id)) {
			task = JSON.parse(localStorage[id]);
			obj = $.extend( task, {id: id} );
			tasks.push( obj );
		}
	}

	return tasks;
}

window.alert = function(message) {
	var $alertSuccess = $('#alert-success');

	$alertSuccess.text(message).fadeIn(function() {
		setTimeout(function() {
			$alertSuccess.fadeOut();
		}, 3000);
	});
};

$(function() {
	var $saveTaskBtn 	= $('#save-task-btn'),
			$formNewTask 	= $('#form-new-task'),
			$modalNewTask = $('#myModal'),
			$modalDel 		= $('#delListItem');


printItems();
counter();
/**
* save task event handler
*/

	$('#datetimepicker2').datepicker({
		locale: 'ru',
		format: "dd/mm/yyyy",
		todayBtn: "linked",
		autoclose: true
	});



$saveTaskBtn.on('click', function() {
	var data = {
		title: $('[name=title]', $formNewTask).val(),
		date: $('[name=datepiker]', $formNewTask).val(),
		description: $('[name=description]', $formNewTask).val(),
		status: $('[name=status]',$formNewTask).val()
	};

	var id = Math.random().toString(36).substr(2, 8);
	localStorage.setItem( id, JSON.stringify(data) );

	printItem($.extend(data, {isNew: true, id: id}));
	$('[href="' + listStatus[data.status] + '"]').tab('show');
	$('[name]', $formNewTask).val('');
	$modalNewTask.modal('hide');
    counter();
	alert('New task was successfully added!');
});

	$('.list-group').on('click','.list-group-item', function(event) {
		event.preventDefault();

		if ( $(this).next().is(':not(:empty)') )
			$(this).next().slideToggle();
	});

	$('.list-group').on('click', '.delete', function(event) {
		event.preventDefault();
		event.stopPropagation();
		var id = $(this).parents('.list-group-item').data('id');
		var item = $(this).parents('.list-group-item-wrapper');
		$modalDel.modal('show');
		$modalDel.on('click','#delete-task-btn',function () {
		$modalDel.modal('hide');
		localStorage.removeItem(id);
		item.remove();
		counter()
		alert('New task was successfull deleted!');
		});
	});

    $('.list-group').on('click', '.edit', function(event) {
      event.preventDefault();
      event.stopPropagation();
      console.log($('#modalEditTask'));
      var id = $(this).parents('.list-group-item').data('id');
      var item = JSON.parse(localStorage.getItem(id));
      var $modalEditTask = $('#modalEditTask');
      $modalEditTask
          .find('[name="title"]')
            .val(item.title)
          .end()
          .find('[name="description"]')
            .val(item.description)
          .end()
          .find('[name="status"]')
            .val(item.status)
          .end()
          .find('[name="datepiker"]')
            .val(item.date)
          .end()
          .modal()
          .one('click', '#edit-task-btn',function (event){
            var data = {
              title: $('[name=title]', $modalEditTask).val(),
              description: $('[name=description]', $modalEditTask).val(),
              status: $('[name=status]',$modalEditTask).val(),
              date: $('[name=datepiker]', $modalEditTask).val()
            };
            localStorage.setItem(id,JSON.stringify(data));
            $('[data-id="' + id + '"]').remove();
            printItem(data);
            var tab;
            switch (+data.status){
              case 1: tab = $('[href="#undone"]').tab('show'); break;
              case 2: tab = $('[href="#inprogress"]').tab('show'); break;
              case 3: tab = $('[href="#done"]').tab('show'); break;
            }

            $modalEditTask.modal('hide');
            alert('Task #' + id + ' was sucefully editted!');
          });
    });


  var $removeAll = $('#removeAll');
  $removeAll.on('click', function () {
      $modalDel.modal('show');
      $modalDel.on('click','#delete-task-btn',function () {
          $modalDel.modal('hide');
          localStorage.clear();
          $('.list-group').empty();
          alert('All tasks was successfull deleted!');
      });
  })
});

})(jQuery);

(function($) {

	'use strict';
	$(function() {

		var $saveTaskBtn 	= $('#save-task-btn');
		var $formNewTask 	= $('#form-new-task');
		var $modalNewTask = $('#myModal'),
				$deleteAll 		= $('#deleteAll');
		var $delete 			= $('.delete.fa');
		var radio = document.getElementsByName('options');

		// console.log(Math.random().toString(36).substr(2));  
		$deleteAll.on('click', function() {
			localStorage.clear();
			location.reload();
		})
		$delete.on('click', function() {
			alert('1');
		})
		var tasks = [];
		for (var i in localStorage) {
			if (localStorage.hasOwnProperty(i)) {
				console.log(JSON.parse(localStorage[i]), i);
				tasks.push($.extend(JSON.parse(localStorage[i]), { id: i }));
			}
		}
		console.log(tasks)
		var undone = tasks.filter(function(item) {
			return item.status == 0;
		})
		console.log(undone)
		var inprogress = tasks.filter(function(item) {
			return item.status == 1;
		})
		console.log(inprogress)
		var done = tasks.filter(function(item) {
			return item.status == 2;
		})
		console.log(done)

		// undone.forEach(function(item){
		//   console.log(item);
		//   $('#undone .list-group').append('<a href="#" class="list-group-item">' + item.name + ' <i class="delete fa fa-times"> </i> ')
		// })

		undone.forEach(function(item) {
			$('#undone .list-group').append('<a href="#" class="list-group-item">' + item.name + ' <i class="delete fa fa-times"> ')
		})
		inprogress.forEach(function(item) {
			$('#inprogress .list-group').append('<a href="#" class="list-group-item">' + item.name + ' <i class="delete fa fa-times"> </i>')
		})
		done.forEach(function(item) {
			$('#done .list-group').append('<a href="#" class="list-group-item">' + item.name + ' <i class="delete fa fa-times"> </i>')
		})

		$saveTaskBtn.on('click', function() {
			for (var i = 0; i < radio.length; i++) {
				if (radio[i].type === 'radio' && radio[i].checked) {
					var rezultatRadio = i;
				}
			};
			var data = {
				name: $('[name]', $formNewTask).val(),
				description: $('[name=description]', $formNewTask).val(),
				status: rezultatRadio
			};
			console.log(rezultatRadio, data)
			localStorage.setItem(Math.random().toString(36).substr(2), JSON.stringify(data));
			if (rezultatRadio == 0) {
				$('#undone .list-group').append('<a href="#" class="list-group-item">' + data.name + '<span class="label label-info">new</span>' + ' <i class="delete fa fa-times"> </i>')
			} else if (rezultatRadio == 1) {
				$('#inprogress .list-group').append('<a href="#" class="list-group-item">' + data.name + '<span class="label label-info">new</span>' + ' <i class="delete fa fa-times"> </i>')
			} else {
				$('#done .list-group').append('<a href="#" class="list-group-item">' + data.name + '<span class="label label-info">new</span>' + ' <i class="delete fa fa-times"> </i>')
			}
			

			$('.page-header').append('<div class="alert alert-success">  "Новая задача успешно добавлена!" / "New task was successfully added!" </div>')
			setTimeout("$('.alert').hide();", 3000);


			$modalNewTask.modal('hide');
			$('[name]', $formNewTask).val('')
		});

	});



})(jQuery);

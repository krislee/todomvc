/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React, Router*/
var app = app || {};

(function () {
	'use strict';

	app.ALL_TODOS = 'all';
	app.ACTIVE_TODOS = 'active';
	app.COMPLETED_TODOS = 'completed';
	app.SEARCH_TODOS = 'searching';
	var TodoFooter = app.TodoFooter;
	var TodoItem = app.TodoItem;

	var ENTER_KEY = 13;

	var TodoApp = React.createClass({
		getInitialState: function () {
			return {
				nowShowing: app.ALL_TODOS,
				editing: null,
				newTodo: '',
				// searchTodo: ''
				searching: false
			};
		},

		componentDidMount: function () {
			var setState = this.setState;
			var router = Router({
				'/': setState.bind(this, {nowShowing: app.ALL_TODOS}),
				'/active': setState.bind(this, {nowShowing: app.ACTIVE_TODOS}),
				'/completed': setState.bind(this, {nowShowing: app.COMPLETED_TODOS}),
				// '/search': setState.bind(this, {nowShowing: app.SEARCH_TODOS})
			});
			router.init('/');
		},

		handleChange: function (event) {
			this.setState({newTodo: event.target.value});
		},
		handleSearchChange: function(event) {
			this.setState({
				searchTodo: event.target.value
			})
			console.log(40, event.target.value)
		},
		handleNewTodoKeyDown: function (event) {
			if (event.keyCode !== ENTER_KEY) {
				return;
			}

			event.preventDefault();

			var val = this.state.newTodo.trim();

			if (val) {
				this.props.model.addTodo(val);
				this.setState({newTodo: ''});
			}
		},

		// search: function(event) {
		// 	this.props.model.search(this.searchTodo)
		// },
		toggleAll: function (event) {
			var checked = event.target.checked;
			this.props.model.toggleAll(checked);
		},

		toggle: function (todoToToggle) {
			this.props.model.toggle(todoToToggle);
		},

		destroy: function (todo) {
			this.props.model.destroy(todo);
		},

		edit: function (todo) {
			this.setState({editing: todo.id});
		},

		save: function (todoToSave, text) {
			this.props.model.save(todoToSave, text);
			this.setState({editing: null});
		},

		cancel: function () {
			this.setState({editing: null});
		},

		clearCompleted: function () {
			this.props.model.clearCompleted();
		},

		handleSubmit: function () {
			// this.setState({searching: true})
			this.setState({nowShowing: 'searching'})
			console.log("submitting")
		},

		render: function () {
			var footer;
			var main;
			var todos = this.props.model.todos;

			var shownTodos = todos.filter(function (todo) {
				switch (this.state.nowShowing) {
				case app.ACTIVE_TODOS:
					return !todo.completed;
				case app.COMPLETED_TODOS:
					return todo.completed;
				case app.SEARCH_TODOS:
					return todo.title == this.state.searchTodo;
				default:
					return true;
				}
			}, this);

			var todoItems = shownTodos.map(function (todo) {
				return (
					<TodoItem
						key={todo.id}
						todo={todo}
						onToggle={this.toggle.bind(this, todo)}
						onDestroy={this.destroy.bind(this, todo)}
						onEdit={this.edit.bind(this, todo)}
						editing={this.state.editing === todo.id}
						onSave={this.save.bind(this, todo)}
						onCancel={this.cancel}
					/>
				);
			}, this);

			// var searchedToDos = todos.filter((todo) => {
			// 	console.log(138, todo.title)
			// 	console.log(139, this.state.searchTodo)
			// 	return todo.title == this.state.searchTodo
			// })

			// var queriedToDos = searchedToDos.map(function (todo) {
			// 	return (
			// 		<TodoItem
			// 			key={todo.id}
			// 			todo={todo}
			// 			onToggle={this.toggle.bind(this, todo)}
			// 			onDestroy={this.destroy.bind(this, todo)}
			// 			onEdit={this.edit.bind(this, todo)}
			// 			editing={this.state.editing === todo.id}
			// 			onSave={this.save.bind(this, todo)}
			// 			onCancel={this.cancel}
			// 		/>
			// 	);
			// }, this);


			var activeTodoCount = todos.reduce(function (accum, todo) {
				return todo.completed ? accum : accum + 1;
			}, 0);

			var completedCount = todos.length - activeTodoCount;

			if (activeTodoCount || completedCount) {
				footer =
					<TodoFooter
						count={activeTodoCount}
						completedCount={completedCount}
						nowShowing={this.state.nowShowing}
						onClearCompleted={this.clearCompleted}
					/>;
			}

			// if (queriedToDos.length && this.state.searching) {
			// 	main = (
			// 		<section className="main">
			// 			<input
			// 				id="toggle-all"
			// 				className="toggle-all"
			// 				type="checkbox"
			// 				onChange={this.toggleAll}
			// 				checked={activeTodoCount === 0}
			// 			/>
			// 			<label
			// 				htmlFor="toggle-all"
			// 			/>
			// 			<ul className="todo-list">
			// 				{searchedToDos}
			// 			</ul>
			// 		</section>
			// 	);
			// }
			if (todos.length) {
				main = (
					<section className="main">
						<input
							id="toggle-all"
							className="toggle-all"
							type="checkbox"
							onChange={this.toggleAll}
							checked={activeTodoCount === 0}
						/>
						<label
							htmlFor="toggle-all"
						/>
						<ul className="todo-list">
							{todoItems}
						</ul>
					</section>
				);
			}

			return (

				<div>
					<input className="searchbar" placeholder="search" type="text" onChange={this.handleSearchChange} 
					value={this.state.searchTodo} 
					// onSearch={this.search}
					/>
					<button onClick={this.handleSubmit} style={{backgroundColor: 'orange', height: '50px', width: '75px'}}> Submit </button>
					<header className="header">
						<h1>todos</h1>
						<input
							className="new-todo"
							placeholder="What needs to be done?"
							value={this.state.newTodo}
							onKeyDown={this.handleNewTodoKeyDown}
							onChange={this.handleChange}
							autoFocus={true}
						/>
					</header>
					{main}
					{footer}
				</div>
		
			);
		}
	});

	var model = new app.TodoModel('react-todos');

	function render() {
		React.render(
			<TodoApp model={model}/>,
			document.getElementsByClassName('todoapp')[0]
		);
	}

	model.subscribe(render);
	render();
})();

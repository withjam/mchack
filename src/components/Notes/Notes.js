import Header from '../Header/Header';

export const Notes = () => {
	let db;

	function getDbFromLs() {
		if (!localStorage.getItem('database')) {
			db = [];
			localStorage.setItem('database', db);
		} else {
			db = JSON.parse(localStorage.getItem('database'));
		}
	}
	getDbFromLs();

	function initNote() {
		document.querySelector('#initNote').classList.add('hidden');
		document.querySelector('#save').classList.remove('hidden');
		document.querySelector('.input').classList.remove('hidden');
	}

	function saveNote(noteName) {
		let value = document.querySelector('#' + noteName).value;
		getDbFromLs();
		if (!db.filter(el => el.title === noteName).length) {
			db.push({
				title: noteName,
				value: value
			});
		} else {
			db.filter(el => el.title === noteName).map(el => el.value = value);
		}
		localStorage.setItem('database', JSON.stringify(db));
		document.querySelector('#save').classList.add('hidden');
		document.querySelector('.input').classList.add('hidden');
		document.querySelector('#initNote').classList.remove('hidden');
	}

	function growLabel(input) {
		let label = document.querySelector(`label[for=${input.id}]`);
		if (!label.classList.contains('non-placeholder')) {
			label.classList.add('non-placeholder');
		}
	}

	function shrinkLabel(input) {
		if (!input.value) {
			let label = document.querySelector(`label[for=${input.id}]`);
			label.classList.remove('non-placeholder');
		}
	}

	return (
		<section className="card notes">
			<Header/>
			<h1>Notes</h1>
			<div className="input hidden">
				<label htmlFor="newNote">New Note</label>
				<input
					id="newNote"
					type="textarea"
					onChange={e => growLabel(e.target)}
					onFocus={e => growLabel(e.target)}
					onBlur={e => shrinkLabel(e.target)}
				/>
			</div>
			<button id="initNote" type="button" onClick={initNote}>Create note</button>
			<button id="save" className="hidden" type="submit" onClick={() => {saveNote('newNote')}}>Save</button>
		</section>
	);
};

export default Notes;

'use strict';

const form = document.querySelector('.login-form');
form.addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const mode = document.querySelector('input[name="mode"]:checked').value;
    const difficulty = document.querySelector('input[name="difficulty"]:checked').value;

    localStorage.setItem('username', username);
    localStorage.setItem('mode', mode);
    localStorage.setItem('difficulty', difficulty);
    localStorage.setItem('isSubmitted', 'true');
    window.location.href = 'PlayArea.html';
});

'use strict';

const form = document.querySelector('.login-form');
form.addEventListener('submit', function (e) {
    e.preventDefault();

    try {
        const username = document.getElementById('username').value;
        const mode = document.querySelector('input[name="mode"]:checked').value;
        const timer = true;

        localStorage.setItem('username', username);
        localStorage.setItem('mode', mode);
        localStorage.setItem('difficulty', 'Medium');
        localStorage.setItem('isSubmitted', 'true');
        localStorage.setItem('timer', timer);
        console.log('All values set in localStorage. Redirecting...');
        window.location.href = 'PlayArea.html';
    } catch (error) {
        console.error('An error occurred:', error);
    }
});

// Update de deta teko me latest

/* 
1. done with the link issue
2. done with grid issue -> 3*3??
3. NOT DONE: responsiveness of image on larger screen
4. additional fix: making other blur on showing correct and worng answer -> lets do this
 */ 
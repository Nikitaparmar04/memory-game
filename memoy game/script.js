`use strict`

var username = document.getElementById('username');

document.getElementById('checkbox').addEventListener('change', function() {
        // Get the user's name, selected difficulty level, and selected icon
        var inputValue = document.getElementById('username').value;
        console.log(inputValue);
        username.textContent = inputValue;
        console.log(username.textContent);
        var difficultyLevel = document.querySelector('input[name="ageGroup"]:checked').value;
        var icon = document.querySelector('input[name="ageGroup"]:checked').nextElementSibling.src;

        window.location.href = 'PlayArea.html';
});





document.getElementById('checkbox').addEventListener('change', function() {
    if (this.checked) {
        // Get the user's name, selected difficulty level, and selected icon
        var username = document.getElementById('username').value;
        var difficultyLevel = document.querySelector('input[name="ageGroup"]:checked').value;
        var icon = document.querySelector('input[name="ageGroup"]:checked').nextElementSibling.src;

        // Store the user's information in localStorage
        localStorage.setItem('username', username);
        localStorage.setItem('difficultyLevel', difficultyLevel);
        localStorage.setItem('icon', icon);

        // Redirect to the PlayArea.html page
        window.location.href = 'PlayArea.html';
    }
});

window.onload = function() {
    // Check if the user's information is stored in localStorage
    if (localStorage.getItem('username') && localStorage.getItem('difficultyLevel') && localStorage.getItem('icon')) {
        // Get the user's information from localStorage
        var username = localStorage.getItem('username');
        var difficultyLevel = localStorage.getItem('difficultyLevel');
        var icon = localStorage.getItem('icon');

        // Use the DOM to change the player's name, difficulty level, and icon on the PlayArea.html page
        document.querySelector('.card-userinfo h1').textContent = username;
        document.querySelector('.game-level button').textContent = difficultyLevel;
        document.querySelector('.card-userinfo img.doggy').src = icon;
    }
};
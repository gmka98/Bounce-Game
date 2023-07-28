var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var x = 300;
var y = 550; // Starting position adjusted to new canvas height
var count = 0;
var speed = 0;
var isGameOver = false;

// Winning condition and message
const WINNING_COUNT = 100;

function drawCircle() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.arc(x, y, 50, 0, 2 * Math.PI);
    context.fillStyle = "orangered";
    context.fill();

    // Drawing the count value
    context.font = '25px Arial';
    context.fillStyle = 'white';
    context.fillText("Count: " + count, 20, 30);
}

function animate() {
    if (isGameOver) {
        return;
    }

    // Implement gravity effect
    if (y <= canvas.height - 50) {
        speed += 50 * 0.016; // Assuming the frame rate is 60 FPS (1 second divided by 60)
        y += speed * 0.016;
    } else {
        // Check if the ball touches the top before game over
        if (y < 0) {
            isGameOver = true;
            alert("Game Over! Your score: " + count);
        } else {
            count = 0; // Reset the score when the ball hits the ground
            speed = 0; // Reset the speed when the ball hits the ground
        }
    }

    // Check game-over conditions
    if (y > canvas.height || (y < 120 && x > 250 && x < 350) || y > 599) { // Updated condition for new canvas height
        isGameOver = true;
        alert("Game Over! Your score: " + count);
    }

    drawCircle();

    window.requestAnimationFrame(animate);
}

animate();

document.onkeydown = function() {
    if (!isGameOver) {
        count += 1;
        y -= 25;
        speed += 1; // Increase the speed when the ball jumps
    }
};

document.ontouchstart = function() {
    if (!isGameOver) {
        count += 1;
        y -= 25;
        speed += 1; // Increase the speed when the ball jumps
    }
};

// Display the winning message when the player wins
function checkWin() {
    if (count >= WINNING_COUNT) {
      isGameOver = true;
      document.getElementById('message').style.display = 'block';
  
      // Send a POST request to the server to notify about the winner
      fetch('/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Player Name', // Replace with the actual player's name
          email: 'player@example.com', // Replace with the actual player's email
          score: count,
        }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error('Error:', error));
    }
  }
  

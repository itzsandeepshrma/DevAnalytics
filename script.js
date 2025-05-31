async function getGitHubData() {
  const username = document.getElementById('username').value.trim();
  const resultDiv = document.getElementById('result');

  if (!username) {
    resultDiv.innerHTML = '<p>Please enter a username.</p>';
    return;
  }

  try {
    const res = await fetch(`https://api.github.com/users/${username}`);
    if (!res.ok) throw new Error("User not found");

    const data = await res.json();

    resultDiv.innerHTML = `
      <h2>${data.name || data.login}</h2>
      <p><strong>Followers:</strong> ${data.followers}</p>
      <p><strong>Following:</strong> ${data.following}</p>
      <p><strong>Repos:</strong> ${data.public_repos}</p>
      <p><strong>Location:</strong> ${data.location || 'N/A'}</p>
    `;

    showChart(data);

  } catch (err) {
    resultDiv.innerHTML = `<p>Error: ${err.message}</p>`;
  }
}

let chart;
function showChart(data) {
  const ctx = document.getElementById('chart').getContext('2d');
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Followers', 'Following', 'Repos'],
      datasets: [{
        label: 'GitHub Metrics',
        data: [data.followers, data.following, data.public_repos],
        backgroundColor: ['#d946ef', '#a855f7', '#7e22ce']
      }]
    },
    options: {
      responsive: true,
      animation: {
        duration: 1500,
        easing: 'easeOutBounce'
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

function toggleTheme() {
  const body = document.body;
  body.classList.toggle('light');
  if (body.classList.contains('light')) {
    body.style.background = '#f5f5f5';
    body.style.color = '#111';
    document.querySelector('.container').style.background = 'rgba(255,255,255,0.9)';
  } else {
    body.style.background = 'linear-gradient(145deg, #0f001a, #1a002f)';
    body.style.color = '#f0eaff';
    document.querySelector('.container').style.background = 'rgba(255,255,255,0.05)';
  }
}

// Background particles
const canvas = document.querySelector('.particles');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function initParticles() {
  particles = [];
  for (let i = 0; i < 70; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 1,
      dy: (Math.random() - 0.5) * 1
    });
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = '#c084fc';
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = 8;
    ctx.fill();

    p.x += p.dx;
    p.y += p.dy;

    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  }
  requestAnimationFrame(drawParticles);
}

initParticles();
drawParticles();

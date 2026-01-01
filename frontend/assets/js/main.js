console.log("✅ main.js loaded");

const balanceEl = document.getElementById("balance");
const btn = document.getElementById("investBtn");
const input = document.getElementById("amount");

async function loadStatus() {
  const res = await fetch("http://localhost:3000/api/status");
  const data = await res.json();
  balanceEl.textContent = data.balance;
}

btn.addEventListener("click", async () => {
  const amount = Number(input.value);
  if (!amount) {
    alert("סכום לא תקין");
    return;
  }

  const res = await fetch("http://localhost:3000/api/invest", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount })
  });

  const data = await res.json();

  if (data.error) {
    alert(data.error);
    return;
  }

  alert("הושקע: " + data.invested);
  loadStatus();
});

loadStatus();

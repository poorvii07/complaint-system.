const form = document.getElementById("form");
const list = document.getElementById("list");
const search = document.getElementById("search");

async function loadComplaints() {
    const res = await fetch("/complaints");
    const complaints = await res.json();

    const text = search.value.toLowerCase();

    list.innerHTML = complaints
        .filter(c => c.category.toLowerCase().includes(text))
        .map(c => `
            <div class="complaint">
                <h3>Complaint #${c.id}</h3>
                <p><b>Name:</b> ${c.name}</p>
                <p><b>Room:</b> ${c.room}</p>
                <p><b>Category:</b> ${c.category}</p>
                <p><b>Description:</b> ${c.description}</p>
                <p><b>Status:</b> ${c.status}</p>

                <button onclick="deleteComplaint(${c.id})">
                    Delete
                </button>
                <button onclick="updateStatus(${c.id})">
    Resolve
</button>
            </div>
        `)
        .join("");
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
        name: document.getElementById("name").value,
        room: document.getElementById("room").value,
        category: document.getElementById("category").value,
        description: document.getElementById("description").value
    };

    const res = await fetch("/complaints", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const result = await res.json();

    if (!res.ok) {
        alert(result.message);
        return;
    }

    alert("Complaint submitted successfully!");
    form.reset();
    loadComplaints();
});

async function deleteComplaint(id) {
    await fetch("/complaints/" + id, {
        method: "DELETE"
    });

    loadComplaints();
}

search.addEventListener("input", loadComplaints);

loadComplaints();
async function updateStatus(id) {
    await fetch(`/complaints/${id}/status`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            status: "Resolved"
        })
    });

    loadComplaints();
}
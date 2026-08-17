const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

let complaints = [];
let id = 1;

// POST - Create complaint
app.post("/complaints", (req, res) => {
    const { name, room, category, description } = req.body;

    if (!name || !room || !category || !description) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const complaint = {
        id: id++,
        name,
        room,
        category,
        description,
        status: "Pending"
    };

    complaints.push(complaint);

    res.status(201).json(complaint);
});

// GET - All complaints
app.get("/complaints", (req, res) => {
    res.json(complaints);
});

// GET - One complaint
app.get("/complaints/:id", (req, res) => {
    const complaint = complaints.find(c => c.id == req.params.id);

    if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
    }

    res.json(complaint);
});

// PUT - Update complaint
app.put("/complaints/:id", (req, res) => {
    const complaint = complaints.find(c => c.id == req.params.id);

    if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
    }

    Object.assign(complaint, req.body);

    res.json(complaint);
});

// DELETE - Delete complaint
app.delete("/complaints/:id", (req, res) => {
    const index = complaints.findIndex(c => c.id == req.params.id);

    if (index === -1) {
        return res.status(404).json({ message: "Complaint not found" });
    }

    complaints.splice(index, 1);

    res.json({ message: "Complaint deleted" });
});
// PATCH - Update complaint status
app.patch("/complaints/:id/status", (req, res) => {
    const complaint = complaints.find(c => c.id == req.params.id);

    if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.status = req.body.status;

    res.json(complaint);
});
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
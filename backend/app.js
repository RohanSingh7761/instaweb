require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const allowedStatuses = new Set([
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "CONVERTED",
  "LOST",
]);

const normalizeStatus = (status) =>
  typeof status === "string" ? status.trim().toUpperCase() : status;

const handleDbError = (res, error) => {
  if (error && error.code === "23505") {
    return res.status(409).json({ error: "Duplicate value" });
  }

  console.error("Database error:", error);
  return res.status(500).json({ error: "Internal server error" });
};

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/leads", async (req, res) => {
  const { name, email, phone_no, company_name, status, notes, created_date } =
    req.body;
  const normalizedStatus = normalizeStatus(status);

  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "Name is required" });
  }

  if (normalizedStatus && !allowedStatuses.has(normalizedStatus)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const result = await sql`
      INSERT INTO leads
        (name, email, phone_no, company_name, status, notes, created_date)
      VALUES
        (
          ${name},
          ${email || null},
          ${phone_no || null},
          ${company_name || null},
          ${normalizedStatus || "NEW"},
          ${notes || null},
          COALESCE(${created_date || null}, NOW())
        )
      RETURNING id, name, email, phone_no, company_name, status, notes, created_date
    `;

    return res.status(201).json(result[0]);
  } catch (error) {
    return handleDbError(res, error);
  }
});

app.get("/api/leads", async (req, res) => {
  try {
    const result = await sql`
      SELECT id, name, email, phone_no, company_name, status, notes, created_date
      FROM leads
      ORDER BY created_date DESC NULLS LAST, id DESC
    `;

    return res.json(result);
  } catch (error) {
    return handleDbError(res, error);
  }
});

app.get("/api/leads/search", async (req, res) => {
  const searchTerm = typeof req.query.q === "string" ? req.query.q.trim() : "";

  if (!searchTerm) {
    return res.json([]);
  }

  const pattern = `%${searchTerm}%`;

  try {
    const result = await sql`
      SELECT id, name, email, phone_no, company_name, status, notes, created_date
      FROM leads
      WHERE name ILIKE ${pattern}
        OR email ILIKE ${pattern}
        OR company_name ILIKE ${pattern}
      ORDER BY created_date DESC NULLS LAST, id DESC
    `;

    return res.json(result);
  } catch (error) {
    return handleDbError(res, error);
  }
});

app.put("/api/leads/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, phone_no, company_name, status, notes } = req.body;
  const normalizedStatus = normalizeStatus(status);

  if (normalizedStatus && !allowedStatuses.has(normalizedStatus)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const result = await sql`
      UPDATE leads
      SET
        name = COALESCE(${name || null}, name),
        email = COALESCE(${email || null}, email),
        phone_no = COALESCE(${phone_no || null}, phone_no),
        company_name = COALESCE(${company_name || null}, company_name),
        status = COALESCE(${normalizedStatus || null}, status),
        notes = COALESCE(${notes || null}, notes)
      WHERE id = ${id}
      RETURNING id, name, email, phone_no, company_name, status, notes, created_date
    `;

    if (!result.length) {
      return res.status(404).json({ error: "Lead not found" });
    }

    return res.json(result[0]);
  } catch (error) {
    return handleDbError(res, error);
  }
});

app.delete("/api/leads/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await sql`
      DELETE FROM leads
      WHERE id = ${id}
      RETURNING id
    `;

    if (!result.length) {
      return res.status(404).json({ error: "Lead not found" });
    }

    return res.status(204).send();
  } catch (error) {
    return handleDbError(res, error);
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
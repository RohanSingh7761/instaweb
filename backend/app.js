require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { neon } = require("@neondatabase/serverless");

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is missing");
  process.exit(1);
}

console.log("DATABASE_URL found");

const sql = neon(process.env.DATABASE_URL);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(
  cors({
    origin: [
      "https://instaweb-vert.vercel.app",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

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

const getUniqueViolationMessage = (error) => {
  const detail = typeof error.detail === "string" ? error.detail : "";
  const message = typeof error.message === "string" ? error.message : "";
  const combined = `${detail} ${message}`.toLowerCase();

  if (combined.includes("phone_no")) {
    return "Phone number already exists";
  }

  if (combined.includes("email")) {
    return "Email already exists";
  }

  if (combined.includes("company_name")) {
    return "Company name already exists";
  }

  return "Duplicate value";
};

const handleDbError = (res, error) => {
  console.error("Database Error:", error);

  if (error && error.code === "23505") {
    return res.status(409).json({
      error: getUniqueViolationMessage(error),
    });
  }

  return res.status(500).json({
    error: error.message || "Internal server error",
  });
};

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend is running",
  });
});

app.get("/health", async (req, res) => {
  try {
    await sql`SELECT 1`;

    res.json({
      status: "ok",
      database: "connected",
    });
  } catch (err) {
    console.error("Health Check Error:", err);

    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

app.post("/api/leads", async (req, res) => {
  const {
    name,
    email,
    phone_no,
    company_name,
    status,
    notes,
    created_date,
  } = req.body;

  const normalizedStatus = normalizeStatus(status);

  if (!name || typeof name !== "string") {
    return res.status(400).json({
      error: "Name is required",
    });
  }

  if (normalizedStatus && !allowedStatuses.has(normalizedStatus)) {
    return res.status(400).json({
      error: "Invalid status",
    });
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
      RETURNING *
    `;

    res.status(201).json(result[0]);
  } catch (error) {
    handleDbError(res, error);
  }
});

app.get("/api/leads", async (req, res) => {
  try {
    const result = await sql`
      SELECT *
      FROM leads
      ORDER BY created_date DESC NULLS LAST, id DESC
    `;

    res.json(result);
  } catch (error) {
    handleDbError(res, error);
  }
});

app.get("/api/leads/search", async (req, res) => {
  const searchTerm =
    typeof req.query.q === "string" ? req.query.q.trim() : "";

  if (!searchTerm) {
    return res.json([]);
  }

  const pattern = `%${searchTerm}%`;

  try {
    const result = await sql`
      SELECT *
      FROM leads
      WHERE name ILIKE ${pattern}
        OR email ILIKE ${pattern}
        OR company_name ILIKE ${pattern}
      ORDER BY created_date DESC NULLS LAST, id DESC
    `;

    res.json(result);
  } catch (error) {
    handleDbError(res, error);
  }
});

app.put("/api/leads/:id", async (req, res) => {
  const { id } = req.params;

  const {
    name,
    email,
    phone_no,
    company_name,
    status,
    notes,
  } = req.body;

  const normalizedStatus = normalizeStatus(status);

  if (normalizedStatus && !allowedStatuses.has(normalizedStatus)) {
    return res.status(400).json({
      error: "Invalid status",
    });
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
      RETURNING *
    `;

    if (!result.length) {
      return res.status(404).json({
        error: "Lead not found",
      });
    }

    res.json(result[0]);
  } catch (error) {
    handleDbError(res, error);
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
      return res.status(404).json({
        error: "Lead not found",
      });
    }

    res.status(204).send();
  } catch (error) {
    handleDbError(res, error);
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
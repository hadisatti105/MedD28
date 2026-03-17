// Load environment variables
require("dotenv").config()

const express = require("express")
const axios = require("axios")
const cors = require("cors")
const path = require("path")
const qs = require("qs")

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve static frontend
app.use(express.static(path.join(__dirname, "public")))

// ENV variables
const API_KEY = process.env.API_KEY
const PUBLISHER_ID = process.env.PUBLISHER_ID

// Health check route (useful for Render)
app.get("/health", (req, res) => {
  res.status(200).send("OK")
})

// Root route (fixes "Not Found")
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

// Main form submission route
app.post("/submit", async (req, res) => {
  try {
    const { phone, state, zip } = req.body

    if (!phone || !state || !zip) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // 👉 DEFAULT: form-encoded (most RTB buyers expect this)
    const payload = qs.stringify({
      key: API_KEY,
      publisher_id: PUBLISHER_ID,
      caller_number: phone,
      caller_state: state,
      caller_zip: zip
    })

    const response = await axios.post(
      "https://rtb.retreaver.com/rtbs.json",
      payload,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        timeout: 10000 // 10 sec safety timeout
      }
    )

    res.json({
      success: true,
      data: response.data
    })

  } catch (error) {
    console.error("API ERROR:", error.response?.data || error.message)

    res.status(500).json({
      success: false,
      error: "Request failed",
      details: error.response?.data || error.message
    })
  }
})

// 404 fallback (clean handling)
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" })
})

// Start server (Render-compatible)
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
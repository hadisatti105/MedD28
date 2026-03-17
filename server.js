const express = require("express")
const axios = require("axios")
const bodyParser = require("body-parser")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(express.static("public"))

const API_KEY = "f27c5332-7754-40bb-993c-92a6c510c456"
const PUBLISHER_ID = "266b9574"

app.post("/submit", async (req, res) => {
  try {
    const { phone, state, zip } = req.body

    const response = await axios.post(
      "https://rtb.retreaver.com/rtbs.json",
      {
        key: API_KEY,
        publisher_id: PUBLISHER_ID,
        caller_number: phone,
        caller_state: state,
        caller_zip: zip
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    )

    res.json(response.data)

  } catch (error) {
    console.error(error.response?.data || error.message)
    res.status(500).json({ error: "POST request failed" })
  }
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
import express from 'express'

const app = express(),
    port = 3000
app.get('/health', (req, res) => {
    res.json({ message: 'Healthy!' })
})

app.listen(3000, () => {
    console.log(`App is listening at port: `, port)
})
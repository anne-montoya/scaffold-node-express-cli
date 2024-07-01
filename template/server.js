import express from 'express'

const app = express(),
    port = "#{port}"
app.get('/health', (req, res) => {
    res.json({ message: 'Healthy!' })
})

app.listen(port, () => {
    console.log(`App is listening at port: `, port)
})
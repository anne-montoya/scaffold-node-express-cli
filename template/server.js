import express from 'express'

const app = express(),
    port = "#{port}"

app.get('/', (req, res) => {
    res.json({ message: 'Server running!' })
})

app.get('/health', (req, res) => {
    res.json({ message: 'Healthy!' })
})

app.listen(port, () => {
    console.log(`App is listening at port: `, port)
})
// Module dependencies
const express = require('express');
const fs = require('fs');
const path = require('path');
const uuidV1 = require('uuid/v1');

const uploadDir = path.join(__dirname, 'uploads');

// Create upload directory
try { fs.mkdirSync(uploadDir, 0777) } catch(e) {}

const app = express();

app.get('/', (req, res) => {
    res.status(200).send('Ok');
})

app.post('/stream', (req, res, next) => {
    const filename = path.join(uploadDir,uuidV1());
    const stream = fs.createWriteStream(filename);

    req.pipe(stream);
    
    req.on('end', () => {
        // so the current stream can be closed
        setTimeout(() => {
            fs.stat(filename, (err, stats) => {
                if (err) {
                    return res.status(500).send('Internal Server Error');
                }
                return res.send({size: stats.size})
            })
        })
    })

});

module.exports = app.listen(4000, () => {
    console.log('Server Started');
});
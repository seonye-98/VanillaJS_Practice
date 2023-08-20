const express = require('express');
const path = require('path');

const app = express();

app.use('/static', express.static(path.resolve(__dirname, 'frontend', 'static')));

//웹 서버에서 어떤 경로로 보내든 상관없이 index.html로 돌아간다.
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'frontend', 'index.html'));
});

app.listen(process.env.PORT || 3001, () => console.log('Server running ...'));

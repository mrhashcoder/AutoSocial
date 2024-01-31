const app = require("./server");
const config = require("./config");

const PORT = config.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log("SERVER is listening on port : " + PORT);
});

module.exports = server;

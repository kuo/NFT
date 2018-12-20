var cheerio = require('cheerio');

module.exports = {

    deployContract: () => {
        var view = `<body>
        <hr>
        <p>部署智能合約</p>
        <form id="form_check_token" method="post" action="/public/formSubmitAction/deploy">
            Token名稱：<input type="text" name="tokenName">
            <br>
            Token代號：<input type="text" name="tokenSymbol">
            <br>
            Token數量：<input type="number" name="tokenAmount">
            <br>
            <br>
            <input type="submit" value="deploy">
        </form>
        <hr>
        <p>創建DEXON帳號</p>
        <form id="form_new_account" method="post" action="/public/formSubmitAction/newAccount">
            <input type="submit" value="create">
        </form>
        </body>
        </html>`;

        var $ = cheerio.load(view);
        return $.html();
    },

    createAccount: () => {
        var view = `<body>
        <hr>
        <p>創建DEXON帳號</p>
        <form id="form_check_token" method="post" action="/public/formSubmitAction/newAccount">
            <input type="submit" value="create">
        </form>
        </body>
        </html>`;

        var $ = cheerio.load(view);
        return $.html();
    }
}
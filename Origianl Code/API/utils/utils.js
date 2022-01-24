const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const _ = require('lodash');
const {isUUID} = require('validator');

// some other utility methods
module.exports = {
    // read the HTML template and return its html as string
    readTemplate: templateName => {
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(__dirname, `../templates/${templateName}.html`), 'utf8', (err, html) => {
                if(err)
                    resolve(``);

                resolve(html);
            });
        });
    },
    // method to validate UUID, its needed in password reset
    isValidUUID4: id => isUUID(id, 4),
};
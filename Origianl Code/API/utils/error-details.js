
// just a better way to display errors
module.exports = err => {
    if(!err || !err.details)
        return ``;

    let errors = ``;
    let details = err.details;
    details.forEach(detail => errors += `${detail.message}\n`);
    return errors;
}
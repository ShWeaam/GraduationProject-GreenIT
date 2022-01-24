const session = {
    set: (key, value) => localStorage.setItem(key, value),
    setStringified: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
    get: key => localStorage.getItem(key),
    getParsed: key => JSON.parse(localStorage.getItem(key)) || null,
    remove: key => localStorage.removeItem(key),
    clear: () => localStorage.clear()
};

export default session;
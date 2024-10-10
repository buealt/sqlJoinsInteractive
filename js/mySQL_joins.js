let db;
let initPromise = initSqlJs({ locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${file}` });

initPromise.then(function(SQL){
    db = new SQL.Database();
    db.run(`
        CREATE TABLE Kunden (
            KundenID INTEGER PRIMARY KEY,
            Name TEXT,
            Stadt TEXT
        );
        INSERT INTO Kunden (KundenID, Name, Stadt) VALUES 
            (1, 'Max Mustermann', 'Berlin'),
            (2, 'Erika Musterfrau', 'Hamburg'),
            (3, 'Hans Meier', 'München'),
            (4, 'Anna Schmidt', 'Köln'),
            (5, 'Peter Müller', 'Frankfurt'),
            (6, 'Julia Fischer', 'Stuttgart');
    `);
    db.run(`
        CREATE TABLE Bestellungen (
            BestellID INTEGER PRIMARY KEY,
            KundenID INTEGER,
            Produkt TEXT,
            Menge INTEGER
        );
        INSERT INTO Bestellungen (BestellID, KundenID, Produkt, Menge) VALUES 
            (1, 1, 'Laptop', 2),
            (2, 2, 'Smartphone', 1),
            (3, 3, 'Tablet', 3),
            (4, 1, 'Monitor', 1),
            (5, 4, 'Drucker', 2),
            (6, 5, 'Kopfhörer', 4),
            (7, 6, 'Maus', 5);
    `);
});

function executeQuery(inputId, resultId) {
    initPromise.then(() => {
        const sqlQuery = document.getElementById(inputId).value;
        try {
            const result = db.exec(sqlQuery);
            displayResult(result, resultId);
        } catch (err) {
            document.getElementById(resultId).innerHTML = 'Fehler: ' + err.message;
        }
    });
}

function displayResult(result, resultId) {
    if (result.length === 0) {
        document.getElementById(resultId).innerHTML = 'Keine Ergebnisse.';
        return;
    }
    
    let tableHtml = '<table><tr>';
    result[0].columns.forEach(column => {
        tableHtml += `<th>${column}</th>`;
    });
    tableHtml += '</tr>';
    
    result[0].values.forEach(row => {
        tableHtml += '<tr>';
        row.forEach(cell => {
            tableHtml += `<td>${cell}</td>`;
        });
        tableHtml += '</tr>';
    });
    tableHtml += '</table>';
    
    document.getElementById(resultId).innerHTML = tableHtml;
}

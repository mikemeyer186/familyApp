const defaultUserSettings = {
    list: [
        { category: 'Lebensmittel', color: '#3bc490' },
        { category: 'Haushalt', color: '#d05858' },
        { category: 'Schule', color: '#d47bdb' },
        { color: '#d58753', category: 'Arbeit' },
        { color: '#9c775e', category: 'Haustier' },
        { category: 'Familie', color: '#5c4bfc' },
    ],
    calendar: { schoolHolidayColor: '#96d35f', publicHolidayColor: '#d89393', country: 'NI' },
    journal: [
        { values: ['Einkommen'], name: 'Einnahmen' },
        { name: 'Einkäufe', values: ['Lebensmittel', 'Kleidung', 'Haushalt'] },
        { name: 'Familie', values: ['Gast', 'User 2'] },
        { name: 'Mobilität', values: ['ÖPNV', 'Kraftstoff', 'Parkgebühren'] },
        { name: 'Kommunikation', values: ['Handy', 'Festnetz'] },
        { values: ['Lieferdienst', 'Entertainment', 'Ausflüge', 'Sport', 'Urlaub'], name: 'Leben' },
        { values: ['Wohnen', 'Energie', 'Internet', 'Versicherungen', 'Abonnements', 'Steuern'], name: 'Fixkosten' },
    ],
};

export default defaultUserSettings;

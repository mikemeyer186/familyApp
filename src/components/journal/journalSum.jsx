import { Accordion, AccordionTab } from 'primereact/accordion';
import { useJournal } from '../../contexts/journalContext';

export default function JournalSum() {
    const { sumOfPayments } = useJournal();
    const income = sumOfPayments.filter((payment) => payment.aggregate === 'Einnahmen');
    const fixedCosts = sumOfPayments.filter((payment) => payment.aggregate === 'Fixkosten');
    const varCosts = sumOfPayments.filter((payment) => payment.aggregate !== 'Einnahmen' && payment.aggregate !== 'Fixkosten');
    const sumOfVarCosts = varCosts.reduce((acc, curr) => acc + curr.sum, 0);
    const convertedIncome = income.length > 0 ? income[0].sum : 0.0;
    const convertedFixedCosts = fixedCosts.length > 0 ? fixedCosts[0].sum : 0.0;
    const convertedVarCosts = varCosts.length > 0 ? sumOfVarCosts : 0.0;
    let varCostsArray = [];

    const incomeArray =
        income.length > 0 &&
        Object.keys(income[0].categories).map((key) => {
            return { category: key, amount: income[0].categories[key] };
        });

    const fixedCostsArray =
        fixedCosts.length > 0 &&
        Object.keys(fixedCosts[0].categories).map((key) => {
            return { category: key, amount: fixedCosts[0].categories[key] };
        });

    varCosts.length > 0 &&
        varCosts.map((aggregate) => {
            const aggregateSum = Object.keys(aggregate.categories).map((key) => {
                varCostsArray = [...varCostsArray, { aggregate: aggregate.aggregate, category: key, amount: aggregate.categories[key] }];
            });
            return aggregateSum;
        });

    const sortedIncomeArray = incomeArray.length > 0 && incomeArray.sort((a, b) => a.category.localeCompare(b.category));
    const sortedFixedCostsArray = fixedCostsArray.length > 0 && fixedCostsArray.sort((a, b) => a.category.localeCompare(b.category));
    const sortedVarCostsArray = varCostsArray.length > 0 && varCostsArray.sort((a, b) => a.aggregate.localeCompare(b.aggregate));

    function incomeTemplate() {
        return (
            <div className="accordion-header-sum">
                <span className="accordion-header-text">Einnahmen:</span>
                <span className={convertedIncome > 0 ? 'income sum-text' : ''}>
                    {`${convertedIncome.toLocaleString('de-DE', {
                        style: 'currency',
                        currency: 'EUR',
                    })}`}
                </span>
            </div>
        );
    }

    function fixedCostsTemplate() {
        return (
            <div className="accordion-header-sum">
                <span className="accordion-header-text">Fixkosten:</span>
                <span className={convertedFixedCosts < 0 ? 'spend sum-text' : ''}>
                    {`${convertedFixedCosts
                        .toLocaleString('de-DE', {
                            style: 'currency',
                            currency: 'EUR',
                        })
                        .replace('-', ' ')}`}
                </span>
            </div>
        );
    }

    function varCostsTemplate() {
        return (
            <div className="accordion-header-sum">
                <span className="accordion-header-text">Variable Kosten:</span>
                <span className={convertedVarCosts < 0 ? 'spend sum-text' : ''}>
                    {`${convertedVarCosts
                        .toLocaleString('de-DE', {
                            style: 'currency',
                            currency: 'EUR',
                        })
                        .replace('-', ' ')}`}
                </span>
            </div>
        );
    }

    return (
        <>
            <Accordion multiple>
                <AccordionTab headerTemplate={incomeTemplate}>
                    {income.length > 0 &&
                        sortedIncomeArray.map((payment) => {
                            return (
                                <ul key={payment.category} className="list-group list-group-flush">
                                    <li className="list-group-item journal-detail-list">
                                        <span>{payment.category}</span>
                                        <span>
                                            {payment.amount.toLocaleString('de-DE', {
                                                style: 'currency',
                                                currency: 'EUR',
                                            })}
                                        </span>
                                    </li>
                                </ul>
                            );
                        })}
                </AccordionTab>
                <AccordionTab headerTemplate={fixedCostsTemplate}>
                    {fixedCosts.length > 0 &&
                        sortedFixedCostsArray.map((payment) => {
                            return (
                                <ul key={payment.category} className="list-group list-group-flush">
                                    <li className="list-group-item journal-detail-list">
                                        <span>{payment.category}</span>
                                        <span>
                                            {payment.amount
                                                .toLocaleString('de-DE', {
                                                    style: 'currency',
                                                    currency: 'EUR',
                                                })
                                                .replace('-', ' ')}
                                        </span>
                                    </li>
                                </ul>
                            );
                        })}
                </AccordionTab>
                <AccordionTab headerTemplate={varCostsTemplate}>
                    {varCosts.length > 0 &&
                        sortedVarCostsArray.map((payment) => {
                            return (
                                <ul key={payment.category} className="list-group list-group-flush">
                                    <li className="list-group-item journal-detail-list">
                                        <span>{payment.category}</span>
                                        <span>
                                            {payment.amount
                                                .toLocaleString('de-DE', {
                                                    style: 'currency',
                                                    currency: 'EUR',
                                                })
                                                .replace('-', ' ')}
                                        </span>
                                    </li>
                                </ul>
                            );
                        })}
                </AccordionTab>
            </Accordion>
        </>
    );
}

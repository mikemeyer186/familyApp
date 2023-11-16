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
                    {`${convertedFixedCosts.toLocaleString('de-DE', {
                        style: 'currency',
                        currency: 'EUR',
                    })}`}
                </span>
            </div>
        );
    }

    function varCostsTemplate() {
        return (
            <div className="accordion-header-sum">
                <span className="accordion-header-text">Variable Kosten:</span>
                <span className={convertedVarCosts < 0 ? 'spend sum-text' : ''}>
                    {`${convertedVarCosts.toLocaleString('de-DE', {
                        style: 'currency',
                        currency: 'EUR',
                    })}`}
                </span>
            </div>
        );
    }

    return (
        <>
            <Accordion multiple>
                <AccordionTab headerTemplate={incomeTemplate}>
                    <p className="m-0">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                        enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                        in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                </AccordionTab>
                <AccordionTab headerTemplate={fixedCostsTemplate}>
                    <p className="m-0">
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque
                        ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia
                        voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                        Consectetur, adipisci velit, sed quia non numquam eius modi.
                    </p>
                </AccordionTab>
                <AccordionTab headerTemplate={varCostsTemplate}>
                    <p className="m-0">
                        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos
                        dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt
                        mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore,
                        cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
                    </p>
                </AccordionTab>
            </Accordion>
        </>
    );
}

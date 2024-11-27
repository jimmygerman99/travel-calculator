export function validateCreditCardSelection(creditCard: string): string | null {
    if (creditCard === "") {
        return "Please fill out this section of the form";
    }
    return null;
}
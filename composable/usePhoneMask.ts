export const usePhoneMask = (value: string): string => {
    let sanitizedValue = value.replace(/[=?/|!""''<>,.}{&*()%$#@~^_-]+|\+7|^8|\(|\)|\s|[А-яЁё A-Za-z]/g, '');
    let formattedValues = sanitizedValue
        .slice(0, 10)
        .split('')
        .map((number, index) => {
            if (index === 2) {
                return number + ') ';
            } else if (index === 5 || index === 7) {
                return number + ' ';
            }

            return number;
        });

    return '+7 (' + formattedValues.join('');
}
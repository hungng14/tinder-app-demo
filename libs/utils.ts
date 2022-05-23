export const upperCaseFirtLetter = (str: string) => {
    if(!str || typeof str !== 'string') return ''
    return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase()
}
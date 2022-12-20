export const newSafeDate = (str) => {
    const [year, month, day] = str.split('-')
    return new Date(year, month - 1, day)
}

export const dateString = (date) =>
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

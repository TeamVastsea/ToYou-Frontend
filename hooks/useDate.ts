export const useDate = () => {
    const toString = (
        splitor: string = '-',
        year: string,
        month: string,
        day: string
    ) => {
        return [year, month.padStart(2,'0'), day.padStart(2,'0')].join(splitor);
    }
    const getDateObject = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth()+1;
        const day = date.getDate();
        return {
            year,
            month,
            day
        }
    }
    return {
        getDateObject,
        toString,
    }
}
export const camelCase = (val: string, pascalCase:boolean=false) => {
    if (!val.includes('-')){
        if (!pascalCase){
            return val.toLowerCase();
        }
        return `${val[0].toUpperCase()}${val.toLowerCase().slice(1)}`
    }
    const arr = val.split('-');
    for (let i=0;i<arr.length;i++){
        let val = arr[i];
        // eslint-disable-next-line react-hooks/rules-of-hooks
        arr[i] = pascalCase ? camelCase(arr[i], true) : camelCase(val, i > 0)
    }
    return arr.join('');
}
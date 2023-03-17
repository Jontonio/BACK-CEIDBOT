
export const handleErrorHttp = (msg:string, errorRaw?:any) => {
    console.log(errorRaw);
    return {msg};
}
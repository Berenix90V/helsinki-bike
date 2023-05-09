import {Pagination} from "react-bootstrap";
import {Form} from "react-bootstrap";

type paginationParameters = {
    page: number,
    pageSize: number,
    totalElements: number,
    setPage:any
}
function TablePagination({page, pageSize, totalElements, setPage}: paginationParameters){
    const totalPages = Math.ceil(totalElements/pageSize)
    let items: (number|string)[] = []
    if(page-2>1)
        items.push(page-2)
    if(page-1>1)
        items.push(page-1)
    items.push(page)
    if(page+1<totalPages)
        items.push(page+1)
    if(page+2<totalPages)
        items.push(page+2)
    if(!items.includes(1))
        items = [1,"...",...items]
    if(!items.includes(totalPages)){
        items.push("...")
        items.push(totalPages)
    }


    function renderItem(item:number|string, index:number){
        if(Number.isNaN(+item))
            return <Pagination.Item key={index}>...</Pagination.Item>
        else
            return(
                <Pagination.Item active={item===page} key={index} onClick={()=>setPage(item)}>{item}</Pagination.Item>
            )
    }
    return(
        <>
            <Pagination>
                {items.map(renderItem)}
            </Pagination>
        </>



    )
}

export {TablePagination}
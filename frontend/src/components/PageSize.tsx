import Form from "react-bootstrap/Form"
import {Row, Col} from "react-bootstrap";

type pageSizeParameters ={
    pageSize: number,
    setPageSize: any
}

/**
 * Returns the component to set up the page size for the table pagination
 * @param {number} pageSize: currently selected page size
 * @param setPageSize: setter for the page size
 *
 */
export function PageSize({pageSize, setPageSize}: pageSizeParameters){
    return(
        <Form.Group>
            <Row>
                <Col>
                    <Form.Label>Page size</Form.Label>
                </Col>
                <Col >
                    <Form.Select aria-label="Page size" value={pageSize} onChange={(e)=>setPageSize(e.target.value)}>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </Form.Select>
                </Col>
            </Row>
        </Form.Group>
    )
}
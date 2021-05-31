import { useEffect } from 'react';
import { DataGrid } from '@material-ui/data-grid';


export default function TableComp(props) {

    useEffect(() => {}, [props.rows]);
    return (
        <div style={{ height: 420, width: '100%' }}>
            <DataGrid
                columns={props.columns}
                rows={props.rows}
                getRowId={(row) =>
                    row.saleId
                        ? row.saleId
                        : row.wareHouseId
                        ? row.wareHouseId
                        : row.productId
                }
                pageSize={5}
                rowsPerPageOptions={[5, 6, 10]}
                disableColumnFilter
                disableColumnReorder
                disableColumnMenu
                checkboxSelection
                onSelectionModelChange={(row) => {
            
                    props.setSelectedValues(row.selectionModel)
                }}
            />
        </div>
    );
}

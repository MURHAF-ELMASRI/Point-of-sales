import { useState, useEffect, useContext } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyle from '@material-ui/core/styles/createStyles';
import { Card, CardContent, Typography, Grid } from '@material-ui/core';
import { LanguageContext } from '../../GlobalStates/Langauges/LanguageState';
import AddData from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Table from '../util/Table';
import AddProduct from '../util/addProduct';
import { useTheme } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import initColumns from './productsColumns';
const useStyles = makeStyles((theme) =>
    createStyle({
        root: {
            padding: theme.spacing(4),
        },
        card: {
            width: '100%',
            overflow: 'visible',
        },
        gridItem: {
            width: '100%',
        },
        cardContent: {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
        },
        cardItem: {
            display: 'flex',
            flexDirection: 'row-reverse',
        },
        addData: {
            position: 'absolute',
            bottom: '1rem',
            left: '-2rem',
            zIndex: 2,
        },
    })
);

const changeColumnsLang = (language) => {
    if (language)
        return initColumns.map((e) => {
            return { ...e, headerName: language[e.field] };
        });
};

export default function WareHouse() {
    const [rows, setRows] = useState([]);
    const theme = useTheme();
    const { language } = useContext(LanguageContext);
    const [selectedValues, setSelectedValues] = useState([]);
    const [columns, setColumns] = useState(changeColumnsLang(language));

    const [displayData, setDispalyData] = useState({
        productCount: 0,
    });
    const [dataFormIsOpen, setDataFormIsOpen] = useState(false);
    const classes = useStyles();

    useEffect(() => {
        var productCount = 0;
        rows.forEach((e) => {
            productCount++;
        });
        setDispalyData({ productCount });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rows]);

    useEffect(() => {
        window.api.send('read-data', 'products');

        window.api.listen('send-products', (e, data) => {
            if (!data.ok) {
                console.log(data.msg);
                return;
            }

            setRows(data.data);
        });

        window.api.listen('create-product', (e, data) => {
            if (!data.ok) {
                console.error(data.msg);
                return;
            }

            setRows((prev) => [...prev, data.data]);
        });

        return () => {
            window.api.remove('send-products');
            window.api.remove('create-product');
            window.api.remove('delete-data');
        };
    }, []);

    useEffect(() => {
        setColumns(changeColumnsLang(language));
    }, [language]);

    const handleDelete = () => {
        const productsId = selectedValues.map((e) => {
            return rows.find((r) => r.productId === Number(e)).productId;
        });
        console.log(productsId);
        setSelectedValues([])
        window.api.send('delete-data', {
            table: 'products',
            ids: productsId,
            key: 'productId',
        });
        window.api.listen('delete-data', (e, data) => {
            if (!data.ok) {
                console.log('error deleting data');
            } else {
                window.api.send('read-data', 'products');
            }
        });
    };
    return (
        <Grid
            container
            spacing={3}
            className={classes.root}
            direction="row-reverse"
        >
            <Grid item xs={12}>
                <Card className={classes.card}>
                    <CardContent className={classes.cardContent}>
                        <div className={classes.cardItem}>
                            <Typography>{language['productCount']}</Typography>
                            <Typography>
                                {displayData.productCount}
                                {' : '}
                            </Typography>
                        </div>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12}>
                <Card className={classes.card}>
                    <CardContent className={classes.cardContent}>
                        <AddData
                            aria-label="addRows"
                            className={classes.addData}
                            onClick={() => {
                                selectedValues.length
                                    ? handleDelete()
                                    : setDataFormIsOpen(true);
                            }}
                            style={{
                                backgroundColor: selectedValues.length
                                    ? theme.palette.error.main
                                    : theme.palette.primary.main,
                            }}
                        >
                            {selectedValues.length ? (
                                <DeleteIcon />
                            ) : (
                                <AddIcon />
                            )}
                        </AddData>
                        <AddProduct
                            key={dataFormIsOpen}
                            open={dataFormIsOpen}
                            ariaLabel="add-products"
                            data={rows}
                            setOpen={setDataFormIsOpen}
                        />
                        <Table
                            rows={rows}
                            setSelectedValues={setSelectedValues}
                            columns={columns}
                        />
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}

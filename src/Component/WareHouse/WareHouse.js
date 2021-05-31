import { useState, useEffect, useContext } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyle from '@material-ui/core/styles/createStyles';
import { Card, CardContent, Typography, Grid } from '@material-ui/core';
import LiraIcon from '../../icons/Lira';
import { LanguageContext } from '../../GlobalStates/Langauges/LanguageState';
import AddData from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import Table from '../util/Table';
import { useTheme } from '@material-ui/core';
import AddDataForm from './AddDataForm';

import initColumns from './data';
import Chart from './Chart';
const useStyles = makeStyles((theme) =>
    createStyle({
        root: {
            padding: theme.spacing(4),
        },
        card: {
            width: '100%',
            height: '100%',
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
        chart: {
            height: '240px',
        },
    })
);
const changeColumnsLang = (language) => {
    return initColumns.map((e) => {
        return { ...e, headerName: language[e.field] };
    });
};

export default function WareHouse() {
    const [rows, setRows] = useState([]);
    const [selectedValues, setSelectedValues] = useState([]);
    const { language } = useContext(LanguageContext);
    const [columns, setColumns] = useState(changeColumnsLang(language));
    const theme = useTheme();
    const [displayData, setDispalyData] = useState({
        productCount: 0,
        totalInitialProfit: 0,
        totalProductPrice: 0,
    });
    const [DataFormIsOpen, setDataFormIsOpen] = useState(false);
    const classes = useStyles();

    useEffect(() => {
        var productCount = 0,
            totalInitialProfit = 0,
            totalProductPrice = 0;
        rows.forEach((e) => {
            productCount++;
            totalInitialProfit += e.sellingPrice - e.buyingPrice;
            totalProductPrice += e.sellingPrice;
        });
        setDispalyData({ productCount, totalInitialProfit, totalProductPrice });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rows]);

    const handleFormClose = (data) => {
        if (data) {
            //pick subset of object see stack over flow https://stackoverflow.com/questions/17781472/how-to-get-a-subset-of-a-javascript-objects-properties

            window.api.send('create-wareHouse', data);
        }
        setDataFormIsOpen(false);
    };

    useEffect(() => {
        setColumns(changeColumnsLang(language));
    }, [language]);
    //-------------------electron listeners------------------
    useEffect(() => {
        window.api.send('read-data', 'wareHouse');
        window.api.listen('send-wareHouse', (e, data) => {
            if (!data.ok) {
                console.log(data.msg);
                return;
            }

            setRows(data.data);
        });

        window.api.listen('create-wareHouse', (e, data) => {
            if (!data.ok) {
                console.error(data.msg);
                return;
            }
            setRows((prev) => [...prev, data.data]);
        });

        return () => {
            window.api.remove('send-wareHouse');
            window.api.remove('create-wareHouse');
            window.api.remove('delete-data');
        };
    }, []);
    //---------------------------------------------------------
    const handleDelete = () => {
        const wareHouseId = selectedValues.map((e) => {
            return rows.find((r) => r.wareHouseId === Number(e)).wareHouseId;
        });
        console.log(wareHouseId);
        setSelectedValues([]);

        window.api.send('delete-data', {
            table: 'wareHouse',
            ids: wareHouseId,
            key: 'wareHouseId',
        });
        window.api.listen('delete-data', (e, data) => {
            if (!data.ok) {
                console.log('error deleting data');
            } else {
                window.api.send('read-data', 'wareHouse');
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
            <Grid item xs={6}>
                <Card className={classes.card}>
                    <CardContent className={classes.cardContent}>
                        <div className={classes.cardItem}>
                            <Typography>
                                {' : '} {language['totalProductPrice']}
                            </Typography>
                            <Typography>
                                {displayData.totalProductPrice}
                            </Typography>
                            <LiraIcon color="primary" style={{ width: 20 }} />
                        </div>
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
            <Grid item xs={6}>
                <Card>
                    <CardContent className={classes.chart}>
                        <Typography>{language['type']}</Typography>
                        <Chart products={rows} />
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
                        <AddDataForm
                            isOpen={DataFormIsOpen}
                            ariaLabel="add-products"
                            handleFormClose={handleFormClose}
                            data={rows}
                        />

                        <Table
                            setSelectedValues={setSelectedValues}
                            rows={rows}
                            columns={columns}
                        />
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}

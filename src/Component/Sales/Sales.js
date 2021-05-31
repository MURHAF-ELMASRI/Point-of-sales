import { useState, useEffect, useContext } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyle from '@material-ui/core/styles/createStyles';
import { Paper, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import LiraIcon from '../../icons/Lira';
import { LanguageContext } from '../../GlobalStates/Langauges/LanguageState';
import AddData from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { useTheme } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import Table from './../util/Table';
import clsx from 'clsx';
import AddDataForm from './AddDataForm';
import { initColumns } from './data';
import Chart from './Chart';

const useStyles = makeStyles((theme) =>
    createStyle({
        root: {
            padding: theme.spacing(4),
        },

        gridItem: {
            width: '100%',
        },
        paper: {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            padding: theme.spacing(3),
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
            height: 240,
            padding: theme.spacing(3),
        },
    })
);
const changeColumnsLang = (language) => {
    return initColumns.map((e) => {
        return { ...e, headerName: language[e.field] };
    });
};

export default function Sales() {
    const [rows, setRows] = useState([]);
    const { language } = useContext(LanguageContext);
    const [columns, setColumns] = useState(changeColumnsLang(language));
    const [selectedValues, setSelectedValues] = useState([]);
    const theme = useTheme();
    const [displayData, setDispalyData] = useState({
        soldProduct: 0,
        totalProfit: 0,
        totalSold: 0,
    });
    const [DataFormIsOpen, setDataFormIsOpen] = useState(false);
    const classes = useStyles();

    useEffect(() => {
        var soldProduct = 0,
            totalProfit = 0,
            totalSold = 0;
        rows.forEach((e) => {
            soldProduct++;
            totalProfit += e.sellingPrice - e.buyingPrice;
            totalSold += e.sellingPrice;
        });
        setDispalyData({ soldProduct, totalProfit, totalSold });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rows]);

    useEffect(() => {
        //-------------------request data from electron------------------//
        window.api.send('read-data', 'sales');
        //-------------------listeners--------------------//
        window.api.listen('send-sales', (e, data) => {
            if (!data.ok) {
                console.log(data.err);
                return;
            }

            setRows(data.data);
        });
        window.api.listen('create-sale', (e, data) => {
            if (!data.ok) {
                console.log(data.msg);
                return;
            }
            setRows(prev=>[...prev, data.data]);
        });

        return () => {
            window.api.remove('send-sales');
            window.api.remove('create-sale');
            window.api.remove('delete-data');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setColumns(changeColumnsLang(language));
    }, [language]);

    const handleFormClose = (data) => {
        if (data) {
            window.api.send('create-sale', data);
        }

        setDataFormIsOpen(false);
    };
    const handleDelete = () => {
        const salesId = selectedValues.map((e) => {
            return rows.find((r) => r.saleId === Number(e)).saleId;
        });
        console.log(salesId);
        setSelectedValues([]);

        window.api.send('delete-data', {
            table: 'sales',
            ids: salesId,
            key: 'saleId',
        });
        window.api.listen('delete-data', (e, data) => {
            if (!data.ok) {
                console.log('error deleting data');
            } else {
                window.api.send('read-data', 'sales');
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
                <Paper className={classes.paper}>
                    <div className={classes.cardItem}>
                        <Typography>{language['totalSales']}</Typography>
                        <Typography>{displayData.totalSold}</Typography>
                        <LiraIcon color="primary" style={{ width: 20 }} />
                    </div>
                    <div className={classes.cardItem}>
                        <Typography>
                            {language['soldProductsNumbers']}
                        </Typography>
                        <Typography>{displayData.soldProduct}</Typography>
                        <LiraIcon color="primary" style={{ width: 20 }} />
                    </div>
                </Paper>
            </Grid>
            <Grid item xs={6}>
                <Paper className={classes.paper}>
                    <div className={classes.cardItem}>
                        <Typography>{language['totalProfit']}</Typography>
                        <Typography>{displayData.totalProfit}</Typography>
                        <LiraIcon color="primary" style={{ width: 20 }} />
                    </div>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper className={clsx(classes.chart, classes.paper)}>
                    <Typography>الارباح</Typography>
                    <Chart products={rows} />
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    <AddData
                        aria-label="add data"
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
                        {selectedValues.length ? <DeleteIcon /> : <AddIcon />}
                    </AddData>
                    <AddDataForm
                        key={DataFormIsOpen}
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
                </Paper>
            </Grid>
        </Grid>
    );
}

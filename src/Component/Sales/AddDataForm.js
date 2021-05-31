import { useState, useContext, useEffect } from 'react';
import { LanguageContext } from '../../GlobalStates/Langauges/LanguageState';
import Dialog from '@material-ui/core/Dialog';
import DialogTile from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

import Select from '@material-ui/core/Select';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import {
    TextField,
    InputLabel,
    FormHelperText,
    FormControl,
    Button,
    DialogActions,
} from '@material-ui/core';

// import List from '@material-ui/core/List';
// import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import DataCard from '../util/DataCard';
//ToDo: these data have to be provided from warehouse table to and prevent use from selling product is not here

import moment from 'moment';
const useStyles = makeStyles((theme) =>
    createStyles({
        formField: {
            padding: theme.spacing(5),
        },
    })
);

export default function AddDataForm({ isOpen, handleFormClose }) {
    const [rows, setRows] = useState([]);
    const [inputError, setInputError] = useState('');
    const [selectedVal, setSelectedVal] = useState('');
    const { language } = useContext(LanguageContext);
    const [data, setData] = useState({
        wareHouseId: '',
        productName: '',
        type: '',
        company: '',
        buyingPrice: '',
        sellingPrice: '',
        date: new Date().toISOString().split('T')[0],
        profit: '',
        customer: '',
        quantity: '',
    });

    const classes = useStyles();

    const handelClick = () => {
        if (data.productName === '') {
            setInputError('pleaseInsertProductName');
            return;
        }
        if (data.quantity <= 0) {
            setInputError('notEnoughProductToSell');
            return;
        }

        handleFormClose(data);
    };

    const handleChange = (event) => {
        const value = event.target.value;
        setSelectedVal(value);
        const { date, ...newData } = value;
        setData((prev) => ({
            ...prev,
            ...newData,
            wareHouseId: value.wareHouseId,
            profit: value.sellingPrice - value.buyingPrice,
        }));
        setInputError('');
    };

    useEffect(() => {
        if (isOpen) {
            //-------------------request data from electron------------------//
            window.api.send('read-data', 'wareHouse');
            //-------------------recieve data from electron--------------------//

            window.api.listen('send-wareHouse', (e, data) => {
                if (!data.ok) {
                    console.log('error');
                    return;
                }
                setRows(data.data);
            });
        }
    }, [isOpen]);
    //-------------------------------------------------------
    return (
        <Dialog onClose={() => handleFormClose()} open={isOpen}>
            <DialogTile>{language['addToSoldProductList']}</DialogTile>
            <DialogContent className={classes.formField}>
                <Grid container spacing={4}>
                    <Grid item md={3} sm={6} xs={12}>
                        <FormControl
                            error={inputError !== ''}
                            style={{ width: '100%' }}
                        >
                            <InputLabel shrink htmlFor="product label">
                                {language['productName']}
                            </InputLabel>
                            <Select
                                id="product label"
                                onChange={handleChange}
                                renderValue={(val) => val.productName}
                                value={selectedVal}
                            >
                                {rows.map((e, i) => (
                                    <MenuItem value={e} key={i}>
                                        <ListItemText
                                            primary={e.productName}
                                            secondary={`${e.sellingPrice} ${e.company}`}
                                        />
                                    </MenuItem>
                                ))}
                            </Select>
                            {inputError !== '' && (
                                <FormHelperText>
                                    {language[inputError]}
                                </FormHelperText>
                            )}
                        </FormControl>
                    </Grid>

                    <Grid item md={3} sm={6} xs={12}>
                        <TextField
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    customer: e.target.value,
                                })
                            }
                            id="filled-required"
                            label={language['customerName']}
                            value={data.customer}
                        />
                    </Grid>
                    <Grid item md={4} sm={6} xs={12}>
                        <TextField
                            id="date"
                            label={language['date']}
                            type="date"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            defaultValue={data.date}
                            onChange={(e) => {
                                setData({
                                    ...data,
                                    date: moment(e.target.value).format(
                                        'DD/MM/YYYY'
                                    ),
                                });
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <DataCard data={data} />
                    </Grid>
                </Grid>
                <DialogActions>
                    <Button
                        onClick={handelClick}
                        color="primary"
                        variant="contained"
                    >
                        {language['sell']}
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
}

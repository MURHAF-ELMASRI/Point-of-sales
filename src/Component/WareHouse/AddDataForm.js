import { useState, useEffect, useContext, useMemo } from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogTile from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import AddNewProdct from './../util/addProduct';
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
    Divider,
} from '@material-ui/core';

// import List from '@material-ui/core/List';
// import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import DataCard from '../util/DataCard';
//ToDo: these data have to be provided from warehouse table to and prevent use from selling product is not here

import { LanguageContext } from '../../GlobalStates/Langauges/LanguageState';

const useStyles = makeStyles((theme) =>
    createStyles({
        formField: {
            padding: theme.spacing(5),
        },
        addProduct: {
            padding: theme.spacing(3),
        },
    })
);

export default function AddDataForm({ isOpen, handleFormClose }) {
    //contorl messing user input
    const { language } = useContext(LanguageContext);
    const [products, setProducts] = useState([]);
    const [inputError, setInputError] = useState({
        productName: false,
        quantity: false,
        buyingPrice: false,
        sellingPrice: false,
    });
    //open newProductDialog
    const [newProductDialog, setNewProductDialog] = useState(false);
    const [selectedVal, setSelectedVal] = useState([]);
    //main data which what we will send to database
    //ToDo: adjust the to be set after submiting it to database
    const [data, setData] = useState({
        productId: '',
        productName: '',
        company: '',
        buyingPrice: '',
        sellingPrice: '',
        quantity: '',
        date: new Date().toISOString().split('T')[0],
        totalSellingPrice: '',
        totalBuyingPrice: '',
        profit: '',
    });
    const classes = useStyles();

    //display the final resulat of the data in datacard
    const changePrices = ({ quantity, buyingPrice, sellingPrice }) => {
        if (quantity === '' || !isNaN(quantity)) {
            setData({
                ...data,
                quantity,
                totalBuyingPrice: quantity * Number(data.buyingPrice),
                totalSellingPrice: quantity * Number(data.sellingPrice),
                profit: quantity * Number(data.sellingPrice - data.buyingPrice),
            });
        }
        if (buyingPrice === '' || !isNaN(buyingPrice))
            setData({
                ...data,
                buyingPrice,
                totalBuyingPrice: data.quantity * Number(buyingPrice),
                profit: data.quantity * Number(data.sellingPrice - buyingPrice),
            });
        if (sellingPrice === '' || !isNaN(sellingPrice))
            setData({
                ...data,
                sellingPrice,
                totalSellingPrice: data.quantity * Number(sellingPrice),
                profit: data.quantity * Number(sellingPrice - data.buyingPrice),
            });
    };
    //handle change the select input
    const handleChange = (value) => {
        if (!value) {
            return;
        }
        setData({
            ...data,
            ...value,
            productId: value.productId,
        });
        setInputError({
            productName: false,
            quantity: false,
            buyingPrice: false,
            sellingPrice: false,
        });
    };
    useEffect(() => {
        handleChange(selectedVal[0]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedVal]);
    //---------------------end select function----------//
    //check required input to be set
    const checkInput = () => {
        let q = false,
            s = false,
            b = false,
            n = false;
        if (data.quantity === '') q = true;
        if (data.sellingPrice === '') s = true;
        if (data.buyingPrice === '') b = true;
        if (data.productName === '') n = true;
        setInputError({
            quantity: q,
            sellingPrice: s,
            buyingPrice: b,
            productName: n,
        });
        if (q || s || b || n) return false;
        return true;
    };
    //handle submit click
    //TODO: add the data to database and get the id setted by the database
    const handelClick = () => {
        if (!checkInput()) {
            return;
        }
        handleFormClose(data);
    };

    useEffect(() => {
        if (isOpen) {
           
            window.api.send('read-data', 'products');
            window.api.listen('send-products', (event, data) => {
                console.log(data);
                setProducts(data.data);
            });
            window.api.listen('create-product', (event, data) => {
                if (!data.ok) console.log(data.msg);
                else {
                    console.log(data.data);
                    setSelectedVal([data.data, selectedVal]);
                    setProducts([...products, data.data]);
                }
            });
        }
        return () => {
            window.api.remove('send-products');
            window.api.remove('create-product');
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);
    const SelectMenu = useMemo(() => {
        return products.map((e) => (
            <MenuItem value={e} key={e.productId}>
                <ListItemText
                    primary={e.productName}
                    secondary={`${e.type} , ${e.company}`}
                />
            </MenuItem>
        ));
    }, [products]);

    return (
        <Dialog onClose={() => handleFormClose()} open={isOpen}>
            <DialogTile>{language['addProductToWareHouse']}</DialogTile>
            <AddNewProdct
                key={newProductDialog}
                open={newProductDialog}
                setOpen={setNewProductDialog}
                data={products}
            />
            <DialogContent className={classes.formField}>
                <Grid container spacing={4}>
                    <Grid item md={3} sm={6} xs={12}>
                        <FormControl
                            error={inputError.productName}
                            style={{ width: '100%' }}
                        >
                            <InputLabel shrink htmlFor="productName">
                                {language['productName']}
                            </InputLabel>
                            {/* //TODO: solve warning happend by react
                            //TODO:we should run map function this select the value we add and this value does not appear in the select list so it cause error
                            to solve it we should put select in saperate component and run it when the length of the produts arr change 
                            I think the select comp in mat ui use memo and that cause to not rerender after parent render.
                            */}
                            <Select
                                id="productName"
                                value={selectedVal.length ? selectedVal[0] : ''}
                                onChange={(e) => {
                                    setSelectedVal([e.target.value]);
                                    handleChange(e.target.value);
                                }}
                                renderValue={(val) => {
                                    return val.productName;
                                }}
                            >
                                <MenuItem
                                    value={''}
                                    onClick={() => {
                                        setNewProductDialog(true);
                                    }}
                                    className={classes.addProduct}
                                >
                                    {language['addProduct']} +
                                </MenuItem>
                                <Divider />
                                {SelectMenu}
                            </Select>
                            {inputError.productName && (
                                <FormHelperText>
                                    {language['pleaseInsertProduct']}
                                </FormHelperText>
                            )}
                        </FormControl>
                    </Grid>

                    <Grid item md={3} sm={6} xs={12}>
                        <FormControl error={inputError.quantity}>
                            <TextField
                                id="quantity-number"
                                label={language['quantity']}
                                type="number"
                                onChange={(e) => {
                                    changePrices({ quantity: e.target.value });
                                }}
                                error={inputError.quantity}
                            />
                            {inputError.quantity && (
                                <FormHelperText>
                                    {language['pleaseAddQuentity']}
                                </FormHelperText>
                            )}
                        </FormControl>
                    </Grid>
                    <Grid item md={5} sm={6} xs={12}>
                        <FormControl error={inputError.buyingPrice}>
                            <TextField
                                id="buyingPrice-number"
                                label={language['buyingPrice']}
                                type="number"
                                onChange={(e) => {
                                    changePrices({
                                        buyingPrice: e.target.value,
                                    });
                                }}
                                error={inputError.buyingPrice}
                            />
                            {inputError.buyingPrice && (
                                <FormHelperText>
                                    {language['pleaseAddBuyingPrice']}
                                </FormHelperText>
                            )}
                        </FormControl>
                    </Grid>
                    <Grid item md={4} sm={6} xs={12}>
                        <FormControl error={inputError.buyingPrice}>
                            <TextField
                                id="sellingPrice-number"
                                label={language['sellingPrice']}
                                type="number"
                                onChange={(e) => {
                                    changePrices({
                                        sellingPrice: e.target.value,
                                    });
                                }}
                                error={inputError.sellingPrice}
                            />
                            {inputError.sellingPrice && (
                                <FormHelperText>
                                    {language['pleaseAddSellingPrice']}
                                </FormHelperText>
                            )}
                        </FormControl>
                    </Grid>

                    <Grid item md={3} sm={6} xs={12}>
                        <TextField
                            id="date"
                            label={language['buyingDate']}
                            type="date"
                            defaultValue={data.date}
                            onChange={(e) => {
                                setData({
                                    ...data,
                                    date: new Date(e.target.value)
                                        .toISOString()
                                        .split('T')[0],
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
                        {language['add']}
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
}

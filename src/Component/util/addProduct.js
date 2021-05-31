//ToDo : change the localData in the localDatabase instead of the file in localData.js
import { LanguageContext } from '../../GlobalStates/Langauges/LanguageState';
import { useState, useContext } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    FormControl,
    FormHelperText,
} from '@material-ui/core';

//to change the langue
//props acceptes setData that will be add to inform the paraent about it
// and is open to control openning and closing and setOpen
export default function AddProduct({ data, open, setOpen }) {
    const { language } = useContext(LanguageContext);
    const [productNameInputError, setNameInputError] = useState(false);
    const [localData, setLocalData] = useState({
        productName: '',
        company: '',
        type: '',
    });
    const handleClick = () => {
        if (!localData.productName) {
            //prevnet use entering productName as zero or empty string
            setNameInputError(true);
            return;
        }
        let typeId, productId, companyId;
        data.forEach((e) => {
            if (e.company === localData.company) {
                companyId = e.companyId;
            }
            if (e.type === localData.type) {
                typeId = e.typeId;
            }
            if (
                e.productName === localData.productName &&
                e.type === localData.type &&
                e.company === localData.company
            ) {
                productId = e.productId;
            }
        });

        //TODO:check if the product is in the database
        //TODO:this data have to come from database after submit it and get the id
        //send data - get data-check error
        
        window.api.send('create-product', {
            ...localData,
            companyId,
            typeId,
            productId,
            company: localData.company.trim(),
            type: localData.type.trim(),
            productName: localData.productName.trim(),
        });
        setOpen(!open);
    };

    return (
        <Dialog
            open={open}
            onClose={() => {
                setOpen(false);
            }}
        >
            <DialogContent>
                <DialogTitle>{language['addProduct']}</DialogTitle>
                <DialogContent>
                    <FormControl error={productNameInputError}>
                        <TextField
                            error={productNameInputError}
                            value={localData.productName}
                            label={language['productName']}
                            onChange={(e) => {
                                if (productNameInputError)
                                    setNameInputError(false);
                                setLocalData({
                                    ...localData,
                                    productName: e.target.value,
                                });
                            }}
                        />
                        {productNameInputError && (
                            <FormHelperText>
                                {language['pleaseInsertProductNames']}
                            </FormHelperText>
                        )}
                    </FormControl>
                    <FormControl>
                        <TextField
                            value={localData.company}
                            label={language['company']}
                            onChange={(e) =>
                                setLocalData({
                                    ...localData,
                                    company: e.target.value,
                                })
                            }
                        />
                    </FormControl>
                    <FormControl>
                        <TextField
                            label={language['type']}
                            value={localData.type}
                            onChange={(e) =>
                                setLocalData({
                                    ...localData,
                                    type: e.target.value,
                                })
                            }
                        />
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleClick}
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
